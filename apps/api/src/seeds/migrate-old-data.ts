import * as fs from 'fs';
import * as path from 'path';

// Define the structure of the old data
interface OldRrRoot {
  _id: { $oid: string };
  title: string;
  treeRootNodeId: { $oid: string };
  status: string;
  createdAt: { $date: string };
  updatedAt: { $date: string };
}

interface OldRrContent {
  _id: { $oid: string };
  type: string;
  content: any;
  createdAt: { $date: string };
  updatedAt: { $date: string };
}

interface OldRrNode {
  _id: { $oid: string };
  title: string;
  description?: string;
  parentId: { $oid: string } | null;
  content: { $oid: string };
  children: any[];
  createdAt: { $date: string };
  updatedAt: { $date: string };
}

// Define the structure for new data
interface NewRrRoot {
  _id: string;
  title: string;
  rootRrNode: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

interface NewRrContent {
  _id: string;
  type: string;
  content: any[];
  createdAt: Date;
  updatedAt: Date;
}

interface NewRrNode {
  _id: string;
  title: string;
  description?: string;
  parent: string | null;
  content: string | null;
  children: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Helper function to convert date
function convertDate(dateObj: { $date: string }): Date {
  return new Date(dateObj.$date);
}

// Helper function to convert ObjectId
function convertObjectId(objId: { $oid: string }): string {
  return objId.$oid;
}

// Main migration function
async function migrateData() {
  console.log('Starting data migration...');

  // Read old data files
  const oldRootsPath = path.join(
    __dirname,
    '../old-data/reverse-roadmap.rr_roots.json',
  );
  const oldNodesPath = path.join(
    __dirname,
    '../old-data/reverse-roadmap.rr_nodes.json',
  );
  const oldContentsPath = path.join(
    __dirname,
    '../old-data/reverse-roadmap.rr_node_contents.json',
  );

  const oldRoots: OldRrRoot[] = JSON.parse(
    fs.readFileSync(oldRootsPath, 'utf8'),
  );
  const oldNodes: OldRrNode[] = JSON.parse(
    fs.readFileSync(oldNodesPath, 'utf8'),
  );
  const oldContents: OldRrContent[] = JSON.parse(
    fs.readFileSync(oldContentsPath, 'utf8'),
  );

  console.log(
    `Found ${oldRoots.length} old roots, ${oldNodes.length} old nodes, ${oldContents.length} old contents`,
  );

  // Prepare new structures
  const newRoots: NewRrRoot[] = [];
  const newNodes: NewRrNode[] = [];
  const newContents: NewRrContent[] = [];

  // Process contents
  for (const oldContent of oldContents) {
    let contentValue = oldContent.content;

    // If content is an object with type/doc structure, convert it to array format
    if (
      typeof contentValue === 'object' &&
      contentValue !== null &&
      !Array.isArray(contentValue)
    ) {
      // Convert the old format to the new format (array of content items)
      // The old format had structured content, we need to transform it to an array
      contentValue = [contentValue];
    }

    newContents.push({
      _id: convertObjectId(oldContent._id),
      type: oldContent.type,
      content: contentValue,
      createdAt: convertDate(oldContent.createdAt),
      updatedAt: convertDate(oldContent.updatedAt),
    });
  }

  // Create a map of old node IDs to new node objects for reference resolution
  const nodeMap = new Map<string, OldRrNode>();
  oldNodes.forEach((node) => {
    nodeMap.set(convertObjectId(node._id), node);
  });

  // Process nodes
  for (const oldNode of oldNodes) {
    const oldNodeId = convertObjectId(oldNode._id);

    // Collect direct children IDs (not recursive)
    const childrenIds: string[] = [];
    oldNodes.forEach((childNode) => {
      if (
        childNode.parentId &&
        convertObjectId(childNode.parentId) === oldNodeId
      ) {
        childrenIds.push(convertObjectId(childNode._id));
      }
    });

    // Convert parent ID
    let parentId: string | null = null;
    if (oldNode.parentId) {
      parentId = convertObjectId(oldNode.parentId);
    }

    // Convert content ID
    let contentId: string | null = null;
    if (oldNode.content) {
      contentId = convertObjectId(oldNode.content);
    }

    newNodes.push({
      _id: oldNodeId,
      title: oldNode.title,
      description: oldNode.description,
      parent: parentId,
      content: contentId,
      children: childrenIds,
      createdAt: convertDate(oldNode.createdAt),
      updatedAt: convertDate(oldNode.updatedAt),
    });
  }

  // Process roots
  for (const oldRoot of oldRoots) {
    newRoots.push({
      _id: convertObjectId(oldRoot._id),
      title: oldRoot.title,
      rootRrNode: convertObjectId(oldRoot.treeRootNodeId),
      status: oldRoot.status,
      createdAt: convertDate(oldRoot.createdAt),
      updatedAt: convertDate(oldRoot.updatedAt),
    });
  }

  console.log(
    `Converted ${newRoots.length} roots, ${newNodes.length} nodes, ${newContents.length} contents`,
  );

  // Write new data files
  const outputDir = path.join(__dirname, '../migrated-data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(outputDir, 'rr_roots.json'),
    JSON.stringify(newRoots, null, 2),
  );
  fs.writeFileSync(
    path.join(outputDir, 'rr_nodes.json'),
    JSON.stringify(newNodes, null, 2),
  );
  fs.writeFileSync(
    path.join(outputDir, 'rr_contents.json'),
    JSON.stringify(newContents, null, 2),
  );

  console.log('Data migration completed successfully!');
  console.log(`New files saved to: ${outputDir}`);
}

// Run the migration
migrateData().catch((error) => {
  console.error('Migration failed:', error);
});
