import mongoose from 'mongoose';
import {
  RrContent,
  RrContentSchema,
} from '../rr-content/schemas/rr-content.schema';
import { RrNode, RrNodeSchema } from '../rr-node/schemas/rr-node.schema';
import { RrRoot, RrRootSchema } from '../rr-root/schemas/rr-root.schema';
import { rrContents, rrNodes, rrRoots } from './seed-data';

const RrContentModel = mongoose.model(RrContent.name, RrContentSchema);
const RrNodeModel = mongoose.model(RrNode.name, RrNodeSchema);
const RrRootModel = mongoose.model(RrRoot.name, RrRootSchema);

async function seed() {
  await mongoose.connect(
    'mongodb+srv://pterosaurscannotfly:CrhLYfRwJMScZqCh@cluster0.c48gslh.mongodb.net/reverse-roadmap?retryWrites=true&w=majority&appName=Cluster0',
  );

  // Drop collections
  await RrContentModel.deleteMany({});
  await RrNodeModel.deleteMany({});
  await RrRootModel.deleteMany({});

  // Insert seed data
  await RrContentModel.insertMany(rrContents);
  await RrNodeModel.insertMany(rrNodes);
  await RrRootModel.insertMany(rrRoots);

  await mongoose.disconnect();
}

seed()
  .then(() => {
    console.log('Seeding complete!');
  })
  .catch((error) => {
    console.error('Seeding failed!', error);
  });
