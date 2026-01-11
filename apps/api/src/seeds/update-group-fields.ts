import { connect, model, Schema, Types } from 'mongoose';
import { config } from 'dotenv';

// Load environment variables
config();

// Define the schema to update the data
const groupSchema = new Schema({
  title: String,
  rootRrNode: Schema.Types.ObjectId,
  createdAt: Date,
  updatedAt: Date,
});

const newRrRootSchema = new Schema(
  {
    name: String,
    groups: [groupSchema],
    status: String,
  },
  { collection: 'rr_roots', strict: false },
);

const NewRrRoot = model('NewRrRoot', newRrRootSchema);

async function updateGroups() {
  // Use local MongoDB connection string when running outside Docker
  const dbUrl =
    process.env.MONGODB_URI_LOCAL ||
    process.env.MONGODB_URI ||
    'mongodb://admin:password@localhost:27017/reverse-roadmap?authSource=admin';
  await connect(dbUrl);

  console.log('Connected to the database.');

  // Find the existing document
  const rrRoots = await NewRrRoot.find();
  console.log(`Found ${rrRoots.length} documents to update.`);

  for (const root of rrRoots) {
    console.log(`Updating document ${root._id}`);

    // Update each group to add createdAt and updatedAt fields
    const now = new Date();
    const updatedGroups = root.groups.map((group) => {
      // Only update if the fields don't exist
      if (!group.createdAt || !group.updatedAt) {
        return {
          ...group.toObject(),
          createdAt: group.createdAt || now,
          updatedAt: group.updatedAt || now,
        };
      }
      return group;
    });

    // Update the document with the new groups
    await NewRrRoot.updateOne(
      { _id: root._id },
      {
        $set: {
          groups: updatedGroups,
        },
      },
    );

    console.log(`Updated document ${root._id} with new group fields.`);
  }

  console.log('Update completed.');
  process.exit(0);
}

updateGroups().catch((err) => {
  console.error('Update failed:', err);
  process.exit(1);
});
