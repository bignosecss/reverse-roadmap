import { connect, model, Schema } from 'mongoose';
import { config } from 'dotenv';

// Load environment variables
config();

// Define the schema to read the migrated data
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

async function verify() {
  // Use local MongoDB connection string when running outside Docker
  const dbUrl =
    process.env.MONGODB_URI_LOCAL ||
    process.env.MONGODB_URI ||
    'mongodb://admin:password@localhost:27017/reverse-roadmap?authSource=admin';
  await connect(dbUrl);

  console.log('Connected to the database for verification.');

  const rrRoots = await NewRrRoot.find();
  console.log(`Found ${rrRoots.length} documents after migration.`);

  for (const root of rrRoots) {
    console.log(`Document ID: ${root._id}`);
    console.log(`Name: ${root.name}`);
    console.log(`Status: ${root.status}`);
    console.log(`Number of groups: ${root.groups.length}`);

    for (let i = 0; i < root.groups.length; i++) {
      const group = root.groups[i];
      if (group) {
        console.log(`  Group ${i + 1}:`);
        console.log(`    Title: ${group.title}`);
        console.log(`    RootRrNode: ${group.rootRrNode}`);
        console.log(`    CreatedAt: ${group.createdAt}`);
        console.log(`    UpdatedAt: ${group.updatedAt}`);
      }
    }
    console.log('---');
  }

  console.log('Verification completed.');
  process.exit(0);
}

verify().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
