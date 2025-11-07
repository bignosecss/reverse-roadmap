import mongoose from 'mongoose';

const RR_ROOT_ID = new mongoose.Types.ObjectId('615cdd3b3e9f4a2e9a7332a1');
const RR_NODE_ID_1 = new mongoose.Types.ObjectId('615cdd3b3e9f4a2e9a7332a2');
const RR_NODE_ID_2 = new mongoose.Types.ObjectId('615cdd3b3e9f4a2e9a7332a3');
const RR_NODE_ID_3 = new mongoose.Types.ObjectId('615cdd3b3e9f4a2e9a7332a4');
const RR_CONTENT_ID_1 = new mongoose.Types.ObjectId('615cdd3b3e9f4a2e9a7332a5');
const RR_CONTENT_ID_2 = new mongoose.Types.ObjectId('615cdd3b3e9f4a2e9a7332a6');
const RR_CONTENT_ID_3 = new mongoose.Types.ObjectId('615cdd3b3e9f4a2e9a7332a7');

export const rrContents = [
  {
    _id: RR_CONTENT_ID_1,
    type: 'doc',
    content: [
      {
        type: 'heading',
        attrs: {
          level: 1,
        },
        content: [
          {
            type: 'text',
            text: 'Welcome to Reverse Roadmap',
          },
        ],
      },
    ],
  },
  {
    _id: RR_CONTENT_ID_2,
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'This is the content for the second node.',
          },
        ],
      },
    ],
  },
  {
    _id: RR_CONTENT_ID_3,
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'This is the content for the third node.',
          },
        ],
      },
    ],
  },
];

export const rrNodes = [
  {
    _id: RR_NODE_ID_1,
    title: 'Root Node',
    description: 'This is the root node of the roadmap.',
    parent: null,
    content: RR_CONTENT_ID_1,
    children: [RR_NODE_ID_2, RR_NODE_ID_3],
  },
  {
    _id: RR_NODE_ID_2,
    title: 'Child Node 1',
    description: 'This is the first child node.',
    parent: RR_NODE_ID_1,
    content: RR_CONTENT_ID_2,
    children: [],
  },
  {
    _id: RR_NODE_ID_3,
    title: 'Child Node 2',
    description: 'This is the second child node.',
    parent: RR_NODE_ID_1,
    content: RR_CONTENT_ID_3,
    children: [],
  },
];

export const rrRoots = [
  {
    _id: RR_ROOT_ID,
    title: 'My First Roadmap',
    rootRrNode: RR_NODE_ID_1,
    status: 'active',
  },
];
