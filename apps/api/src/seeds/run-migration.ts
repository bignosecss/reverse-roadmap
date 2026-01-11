import { connect, model, Schema, Types } from 'mongoose';
import { config } from 'dotenv';

// Load environment variables
config();

// Define the old and new structures based on your Mongoose schemas
const oldRrRootSchema = new Schema(
  {
    title: String,
    rootRrNode: Schema.Types.ObjectId,
    status: String,
  },
  { collection: 'rr_roots', strict: false },
);

const OldRrRoot = model('OldRrRoot', oldRrRootSchema);

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

async function migrate() {
  // Use local MongoDB connection string when running outside Docker
  const dbUrl =
    process.env.MONGODB_URI_LOCAL ||
    process.env.MONGODB_URI ||
    'mongodb://admin:password@localhost:27017/reverse-roadmap?authSource=admin';
  await connect(dbUrl);

  console.log('Connected to the database.');

  const rrRoots = await OldRrRoot.find().lean();
  console.log(`Found ${rrRoots.length} documents to migrate.`);

  if (rrRoots.length === 0) {
    console.log('No documents to migrate.');
    console.log('Migration completed.');
    process.exit(0);
    return;
  }

  const now = new Date(); // Use the same timestamp for all groups

  // Create the new rr_root document with all old documents in one group
  // Each entry gets its own ObjectId but shares the same group title
  const newGroups = rrRoots.map((root) => ({
    _id: new Types.ObjectId(), // Each group entry needs its own unique ID
    title: '目标',
    rootRrNode: (root as any).rootRrNode,
    createdAt: now,
    updatedAt: now,
  }));

  // Create a new rr_root document with all the old data combined
  const firstRoot = rrRoots[0];
  const newRrRoot = {
    name: '合并后的根节点', // A meaningful name for the combined root
    groups: newGroups,
    status: firstRoot?.status || 'private', // Use the status from the first document or default
  };

  // Clear all old documents first
  await NewRrRoot.deleteMany({});
  console.log('Cleared all existing documents.');

  // Insert the new combined document
  await NewRrRoot.create(newRrRoot);
  console.log('Created new combined document with updated group fields.');

  console.log('Migration completed.');
  process.exit(0);
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
