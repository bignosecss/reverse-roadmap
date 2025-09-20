import { NestFactory } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { RrRoot, RrRootSchema } from '../schemas/rr-root.schema';
import { RrNode, RrNodeSchema } from '../schemas/rr-node.schema';
import {
  RrNodeContent,
  RrNodeContentSchema,
} from '../schemas/rr-node-content.schema';
import {
  SEED_DATA,
  SeedRootData,
  SeedNodeData,
  generateRandomContent,
} from './seed-data';
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
      { name: RrNodeContent.name, schema: RrNodeContentSchema },
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
  private rrNodeContentModel: Model<RrNodeContent>;

  constructor(
    rrRootModel: Model<RrRoot>,
    rrNodeModel: Model<RrNode>,
    rrNodeContentModel: Model<RrNodeContent>,
  ) {
    this.rrRootModel = rrRootModel;
    this.rrNodeModel = rrNodeModel;
    this.rrNodeContentModel = rrNodeContentModel;
  }

  /**
   * 清空数据库
   */
  async clearDatabase(): Promise<void> {
    console.log('🧹 清空现有数据...');
    await this.rrRootModel.deleteMany({});
    await this.rrNodeModel.deleteMany({});
    await this.rrNodeContentModel.deleteMany({});
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
    // 1. 为根节点创建内容文档
    const rootNodeContentDoc = new this.rrNodeContentModel({
      type: 'doc',
      content: generateRandomContent(data.title, data.description, true), // 标记为根节点
    });
    await rootNodeContentDoc.save();

    // 2. 先创建根节点（不包含子节点）
    const treeRoot = new this.rrNodeModel({
      title: data.title,
      description: data.description,
      content: rootNodeContentDoc._id,
      parentId: null,
      children: [],
    });
    await treeRoot.save();

    // 3. 递归构建嵌套的子节点结构，传入根节点ID作为父ID
    if (data.children) {
      const children = await this.buildNestedChildren(
        data.children,
        treeRoot._id,
      );
      treeRoot.children = children;
      await treeRoot.save();
    }

    // 4. 创建RrRoot记录
    const rrRoot = new this.rrRootModel({
      title: data.title,
      treeRootNodeId: treeRoot._id,
      status: 'active',
    });
    await rrRoot.save();

    console.log(`✅ 创建根节点: ${data.title}`);
  }

  /**
   * 递归构建嵌套的子节点结构（纯数据，不保存到数据库）
   * @param children 子节点数据数组
   * @param parentId 父节点ID
   */
  private async buildNestedChildren(
    children: SeedNodeData[],
    parentId: mongoose.Types.ObjectId,
  ): Promise<any[]> {
    const result: any[] = [];

    for (const childData of children) {
      // 为每个子节点创建内容文档
      const contentData = generateRandomContent(
        childData.title,
        childData.description,
      );
      const nodeContentDoc = new this.rrNodeContentModel({
        type: 'doc',
        content: contentData.content, // 只取 content 数组，而不是整个对象
      });
      await nodeContentDoc.save();

      // 为每个子节点生成一个新的ObjectId
      const childId = new mongoose.Types.ObjectId();

      // 创建符合 RrNode schema 的子节点对象
      const childNode: any = {
        _id: childId,
        title: childData.title,
        description: childData.description,
        content: nodeContentDoc._id,
        parentId,
        children: childData.children
          ? await this.buildNestedChildren(childData.children, childId)
          : [],
      };

      result.push(childNode);
    }

    return result;
  }

  /**
   * 显示数据库统计信息
   */
  async showStats(): Promise<void> {
    const rootCount = await this.rrRootModel.countDocuments();
    const nodeCount = await this.rrNodeModel.countDocuments();
    const nodeContentCount = await this.rrNodeContentModel.countDocuments();

    console.log('\n📊 数据库统计:');
    console.log(`   根节点数量: ${rootCount}`);
    console.log(`   思维导图节点数量: ${nodeCount}`);
    console.log(`   节点内容文档数量: ${nodeContentCount}`);

    // 显示每个根节点的详细信息
    const roots = await this.rrRootModel.find().lean();
    for (const root of roots) {
      const treeNodeCount = await this.countTreeNodes(
        root.treeRootNodeId as unknown as mongoose.Types.ObjectId,
      );
      console.log(`   "${root.title}": ${treeNodeCount} 个节点`);
    }
  }

  /**
   * 递归计算树的节点数量（嵌套文档版本）
   */
  private async countTreeNodes(
    nodeId: mongoose.Types.ObjectId,
  ): Promise<number> {
    const node = await this.rrNodeModel.findById(nodeId).lean();
    if (!node) return 0;

    let count = 1; // 当前节点

    // 递归计算嵌套的子节点
    if (node.children && Array.isArray(node.children)) {
      for (const child of node.children) {
        count += this.countNestedNodes(child);
      }
    }

    return count;
  }

  /**
   * 递归计算嵌套文档中的节点数量
   */
  private countNestedNodes(node: any): number {
    let count = 1; // 当前节点

    if (node.children && Array.isArray(node.children)) {
      for (const child of node.children) {
        count += this.countNestedNodes(child);
      }
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
    const rrNodeContentModel = app.get<Model<RrNodeContent>>(
      getModelToken(RrNodeContent.name),
    );

    const generator = new SeedGenerator(
      rrRootModel,
      rrNodeModel,
      rrNodeContentModel,
    );

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
