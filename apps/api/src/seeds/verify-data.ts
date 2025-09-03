import mongoose from 'mongoose';
import { RrNode, RrNodeSchema } from '../schemas/rr-node.schema';
import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config({ path: '../../../.env' });

async function verifyData() {
  try {
    console.log('🔍 连接数据库并验证数据结构...');
    
    await mongoose.connect(
      process.env.MONGODB_URI ||
        'mongodb+srv://pterosaurscannotfly:CrhLYfRwJMScZqCh@cluster0.c48gslh.mongodb.net/reverse-roadmap?retryWrites=true&w=majority&appName=Cluster0',
    );

    const RrNodeModel = mongoose.model('RrNode', RrNodeSchema);
    const tree = await RrNodeModel.findOne({ title: '前端开发技能树' }).lean();

    if (!tree) {
      console.log('❌ 未找到测试数据');
      return;
    }

    console.log('\n📊 数据结构验证结果:');
    console.log(`根节点: ${tree.title}`);
    console.log(`  - _id: ${tree._id}`);
    console.log(`  - parentId: ${tree.parentId} (应该为 null)`);
    console.log(`  - 子节点数量: ${tree.children?.length || 0}`);

    if (tree.children && tree.children.length > 0) {
      console.log('\n第一层子节点:');
      tree.children.forEach((child: any, i: number) => {
        console.log(`  ${i + 1}. ${child.title}`);
        console.log(`     - _id: ${child._id}`);
        console.log(`     - parentId: ${child.parentId} (应该等于根节点ID: ${tree._id})`);
        console.log(`     - parentId正确: ${child.parentId?.toString() === tree._id.toString() ? '✅' : '❌'}`);
        console.log(`     - 子节点数量: ${child.children?.length || 0}`);

        if (child.children && child.children.length > 0) {
          console.log(`     第二层子节点 (前2个):`);
          child.children.slice(0, 2).forEach((grandchild: any, j: number) => {
            console.log(`       ${j + 1}. ${grandchild.title}`);
            console.log(`          - _id: ${grandchild._id}`);
            console.log(`          - parentId: ${grandchild.parentId} (应该等于父节点ID: ${child._id})`);
            console.log(`          - parentId正确: ${grandchild.parentId?.toString() === child._id?.toString() ? '✅' : '❌'}`);
          });
        }
      });
    }

    await mongoose.disconnect();
    console.log('\n🎯 验证完成!');
  } catch (error) {
    console.error('❌ 验证失败:', error);
    process.exit(1);
  }
}

verifyData();