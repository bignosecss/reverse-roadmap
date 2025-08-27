import { NestFactory } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { RrRoot, RrRootSchema } from '../schemas/rr-root.schema';
import { RrNode, RrNodeSchema } from '../schemas/rr-node.schema';
import { SEED_DATA, SeedRootData, SeedNodeData } from './seed-data';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';

// 加载环境变量
dotenv.config({ path: '../../../.env' });

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI ||
        'mongodb+srv://pterosaurscannotfly:CrhLYfRwJMScZqCh@cluster0.c48gslh.mongodb.net/reverse-roadmap?retryWrites=true&w=majority&appName=Cluster0',
    ),
    MongooseModule.forFeature([
      { name: RrRoot.name, schema: RrRootSchema },
      { name: RrNode.name, schema: RrNodeSchema },
    ]),
  ],
})
class SeedModule {}

/**
 * 种子数据生成器
 * 用于生成测试数据到数据库
 */
class SeedGenerator {
  private rrRootModel: Model<RrRoot>;
  private rrNodeModel: Model<RrNode>;

  constructor(rrRootModel: Model<RrRoot>, rrNodeModel: Model<RrNode>) {
    this.rrRootModel = rrRootModel;
    this.rrNodeModel = rrNodeModel;
  }

  /**
   * 清空数据库
   */
  async clearDatabase(): Promise<void> {
    console.log('🧹 清空现有数据...');
    await this.rrRootModel.deleteMany({});
    await this.rrNodeModel.deleteMany({});
    console.log('✅ 数据库已清空');
  }

  /**
   * 生成种子数据
   */
  async generateSeeds(): Promise<void> {
    console.log('🌱 开始生成种子数据...');
    console.log(`📦 准备生成 ${SEED_DATA.length} 个根节点的数据`);

    for (const rootData of SEED_DATA) {
      await this.createRootWithTree(rootData);
    }

    console.log('🎉 种子数据生成完成!');
  }

  /**
   * 创建根节点和对应的思维导图树
   */
  private async createRootWithTree(data: SeedRootData): Promise<void> {
    // 1. 创建根节点的第一个子节点（实际的树根）
    const treeRoot = await this.rrNodeModel.create({
      title: data.title,
      description: data.description,
      parentId: null,
      children: [],
    });

    // 2. 创建RrRoot记录
    const rrRoot = await this.rrRootModel.create({
      title: data.title,
      treeRootNodeId: treeRoot._id,
      status: 'active',
    });

    // 3. 递归创建子节点
    if (data.children && data.children.length > 0) {
      const childIds = await this.createChildNodes(data.children, treeRoot._id);
      
      // 4. 更新根节点的children数组
      await this.rrNodeModel.findByIdAndUpdate(treeRoot._id, {
        children: childIds,
      });
    }

    console.log(`✅ 创建根节点: ${data.title}`);
  }

  /**
   * 递归创建子节点
   */
  private async createChildNodes(
    children: SeedNodeData[],
    parentId: mongoose.Types.ObjectId,
  ): Promise<mongoose.Types.ObjectId[]> {
    const childIds: mongoose.Types.ObjectId[] = [];

    for (const childData of children) {
      // 创建子节点
      const childNode = await this.rrNodeModel.create({
        title: childData.title,
        description: childData.description,
        parentId: parentId,
        children: [],
      });

      childIds.push(childNode._id);

      // 递归创建孙子节点
      if (childData.children && childData.children.length > 0) {
        const grandChildIds = await this.createChildNodes(
          childData.children,
          childNode._id,
        );
        
        // 更新子节点的children数组
        await this.rrNodeModel.findByIdAndUpdate(childNode._id, {
          children: grandChildIds,
        });
      }
    }

    return childIds;
  }

  /**
   * 显示数据库统计信息
   */
  async showStats(): Promise<void> {
    const rootCount = await this.rrRootModel.countDocuments();
    const nodeCount = await this.rrNodeModel.countDocuments();
    
    console.log('\n📊 数据库统计:');
    console.log(`   根节点数量: ${rootCount}`);
    console.log(`   思维导图节点数量: ${nodeCount}`);
    
    // 显示每个根节点的详细信息
    const roots = await this.rrRootModel.find().lean();
    for (const root of roots) {
      const treeNodeCount = await this.countTreeNodes(root.treeRootNodeId);
      console.log(`   "${root.title}": ${treeNodeCount} 个节点`);
    }
  }

  /**
   * 递归计算树的节点数量
   */
  private async countTreeNodes(nodeId: mongoose.Types.ObjectId): Promise<number> {
    const node = await this.rrNodeModel.findById(nodeId).lean();
    if (!node) return 0;
    
    let count = 1; // 当前节点
    
    // 递归计算子节点
    for (const childId of node.children) {
      count += await this.countTreeNodes(childId);
    }
    
    return count;
  }
}

/**
 * 主函数
 */
async function main() {
  const args = process.argv.slice(2);
  const noClear = args.includes('--no-clear');
  const statsOnly = args.includes('--stats');

  try {
    console.log('🚀 启动种子数据生成器...');
    
    const app = await NestFactory.createApplicationContext(SeedModule);
    
    const rrRootModel = app.get<Model<RrRoot>>(getModelToken(RrRoot.name));
    const rrNodeModel = app.get<Model<RrNode>>(getModelToken(RrNode.name));
    
    const generator = new SeedGenerator(rrRootModel, rrNodeModel);
    
    if (statsOnly) {
      await generator.showStats();
    } else {
      if (!noClear) {
        await generator.clearDatabase();
      }
      
      await generator.generateSeeds();
      await generator.showStats();
    }
    
    await app.close();
    console.log('\n🎯 任务完成!');
    process.exit(0);
  } catch (error) {
    console.error('❌ 种子数据生成失败:', error);
    process.exit(1);
  }
}

// 运行主函数
main();