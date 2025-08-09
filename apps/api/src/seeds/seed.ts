import { NestFactory } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { RrRoot, RrRootSchema } from '../schemas/rr-root.schema';
import { RrTree, RrTreeSchema } from '../schemas/rr-tree.schema';
import { rootSeeds, generateTreeSeeds } from './seed-data';
import { Types } from 'mongoose';

/**
 * 数据库种子模块
 * 用于注册所需的 Mongoose 模型
 */
@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://pterosaurscannotfly:CrhLYfRwJMScZqCh@cluster0.c48gslh.mongodb.net/reverse-roadmap?retryWrites=true&w=majority&appName=Cluster0',
    ),
    MongooseModule.forFeature([
      { name: RrRoot.name, schema: RrRootSchema },
      { name: RrTree.name, schema: RrTreeSchema },
    ]),
  ],
})
export class SeedModule {}

/**
 * 数据库种子服务类
 * 负责执行数据库种子操作
 */
class DatabaseSeeder {
  constructor(
    private readonly rrRootModel: Model<RrRoot>,
    private readonly rrTreeModel: Model<RrTree>,
  ) {}

  /**
   * 清空所有集合的数据
   */
  async clearDatabase(): Promise<void> {
    console.log('🗑️  清空数据库中...');

    try {
      await this.rrTreeModel.deleteMany({});
      await this.rrRootModel.deleteMany({});
      console.log('✅ 数据库清空完成');
    } catch (error) {
      console.error('❌ 清空数据库失败:', error);
      throw error;
    }
  }

  /**
   * 种植根节点数据
   * @returns 创建的根节点ID数组
   */
  async seedRoots(): Promise<Types.ObjectId[]> {
    console.log('🌱 种植根节点数据中...');

    try {
      const createdRoots = await this.rrRootModel.insertMany(rootSeeds);
      const rootIds = createdRoots.map((root) => root._id);

      console.log(`✅ 成功创建 ${createdRoots.length} 个根节点:`);
      createdRoots.forEach((root, index) => {
        console.log(`   ${index + 1}. ${root.title} (${root.status})`);
      });

      return rootIds;
    } catch (error) {
      console.error('❌ 种植根节点失败:', error);
      throw error;
    }
  }

  /**
   * 种植树结构数据
   * @param rootIds 根节点ID数组
   */
  async seedTrees(rootIds: Types.ObjectId[]): Promise<void> {
    console.log('🌳 种植树结构数据中...');

    try {
      const treesData = generateTreeSeeds(rootIds);
      const createdTrees = await this.rrTreeModel.insertMany(treesData);

      console.log(`✅ 成功创建 ${createdTrees.length} 个树结构:`);
      createdTrees.forEach((tree, index) => {
        if (tree.rootNode) {
          const childrenCount = tree.rootNode.children?.length || 0;
          console.log(
            `   ${index + 1}. ${tree.rootNode.title} (${childrenCount} 个子节点)`,
          );
        }
      });
    } catch (error) {
      console.error('❌ 种植树结构失败:', error);
      throw error;
    }
  }

  /**
   * 执行完整的数据库种子操作
   * @param clearFirst 是否先清空数据库，默认为 true
   */
  async runSeeds(clearFirst: boolean = true): Promise<void> {
    console.log('🚀 开始执行数据库种子操作...');
    const startTime = Date.now();

    try {
      if (clearFirst) {
        await this.clearDatabase();
      }

      const rootIds = await this.seedRoots();
      await this.seedTrees(rootIds);

      const duration = Date.now() - startTime;
      console.log(`🎉 数据库种子操作完成! 耗时: ${duration}ms`);
    } catch (error) {
      console.error('💥 数据库种子操作失败:', error);
      throw error;
    }
  }

  /**
   * 显示数据库统计信息
   */
  async showStats(): Promise<void> {
    console.log('📊 数据库统计信息:');

    try {
      const rootsCount = await this.rrRootModel.countDocuments();
      const treesCount = await this.rrTreeModel.countDocuments();

      console.log(`   根节点数量: ${rootsCount}`);
      console.log(`   树结构数量: ${treesCount}`);

      // 显示每个根节点的详细信息
      const roots = await this.rrRootModel.find();
      console.log('\n📋 根节点详情:');
      roots.forEach((root, index) => {
        console.log(
          `   ${index + 1}. ${root.title} (${root.status}) - ID: ${root._id.toString()}`,
        );
      });
    } catch (error) {
      console.error('❌ 获取统计信息失败:', error);
    }
  }
}

/**
 * 主执行函数
 * 创建 NestJS 应用并执行种子操作
 */
async function runSeed() {
  console.log('🌟 启动数据库种子程序...');

  try {
    // 创建 NestJS 应用
    const app = await NestFactory.create(SeedModule, {
      logger: false, // 禁用默认日志以保持输出清洁
    });

    // 获取模型实例
    const rrRootModel = app.get<Model<RrRoot>>(getModelToken(RrRoot.name));
    const rrTreeModel = app.get<Model<RrTree>>(getModelToken(RrTree.name));

    // 创建种子服务实例
    const seeder = new DatabaseSeeder(rrRootModel, rrTreeModel);

    // 解析命令行参数
    const args = process.argv.slice(2);
    const shouldClear = !args.includes('--no-clear');
    const showStatsOnly = args.includes('--stats');

    if (showStatsOnly) {
      // 仅显示统计信息
      await seeder.showStats();
    } else {
      // 执行种子操作
      await seeder.runSeeds(shouldClear);
      await seeder.showStats();
    }

    // 关闭应用
    await app.close();
    console.log('👋 种子程序执行完毕');
  } catch (error) {
    console.error('💀 种子程序执行失败:', error);
    process.exit(1);
  }
}

// 如果直接运行此文件，则执行种子操作
if (require.main === module) {
  void runSeed();
}

export { runSeed };
