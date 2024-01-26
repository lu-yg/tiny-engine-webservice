import { Service } from 'egg';
import { glob } from 'glob';
import * as path from 'path';
import { E_Task_Progress, E_TASK_STATUS, E_TASK_TYPE } from '../../lib/enum';
import { I_Response, I_UpdateTaskParam } from '../../lib/interface';
import MaterialBuildService from './MaterialBuild';

interface I_MaterialBuildParam {
  version: string;
  blockVersions: Array<any>;
  description?: string;
}
export default class BuildMaterial extends Service {
  private materialInfo: any;
  private taskId: string | number;
  private components: Array<any>;
  private blocks: Array<any>;
  private blockVersions: Array<any>;
  private framework: string;
  private buildService: MaterialBuildService;
  version: string;
  deployPath: string;
  packageVersion: string;
  packageDescription: string;
  async prepare(id: string | number, materialRes: I_Response, buildParam: I_MaterialBuildParam): Promise<I_Response> {
    // 转换组件字段
    if (materialRes?.data?.user_components) {
      materialRes.data.user_components = materialRes?.data?.user_components.map(({ schema_fragment, ...others }) => ({
        ...others,
        schema: schema_fragment
      }));
    }
    // 创建task
    const { task } = this.ctx.service;
    const taskRes: I_Response = await task.create({
      taskTypeId: E_TASK_TYPE.ASSETS_BUILD,
      taskName: `build material ${materialRes.data.name}`,
      taskStatus: E_TASK_STATUS.INIT,
      uniqueId: id,
      process: E_Task_Progress.Init,
      progress_percent: 0
    });
    await this.start(materialRes.data, taskRes.data.id, buildParam);
    this.app.logger.info('publish material');
    return taskRes;
  }

  async start(materialInfo: any, taskId: string | number, buildParam: I_MaterialBuildParam) {
    const { version, blockVersions, description } = buildParam;
    this.materialInfo = materialInfo;
    if (!materialInfo.npm_name) {
      const materialName = this.ctx.helper.formatNameStr(materialInfo.name) || 'default';
      this.materialInfo.npm_name = `@opentiny/lowcode-${process.env.RUN_MODE || 'dev'}-material-${materialName}-${
        materialInfo.id
      }`;
    }

    this.taskId = taskId;
    this.buildService = new MaterialBuildService(this.app);
    const { user_component, blocks, framework } = materialInfo;
    this.components = user_component;
    this.blocks = blocks;
    this.blockVersions = blockVersions;
    this.framework = framework;
    this.version = this.generateVersion();
    this.packageVersion = version;
    this.packageDescription = description ?? '';

    const hooks = new Map([
      ['initialize', this.initialize], // 初始化
      ['installDep', this.installDep], // 生成构建目录并安装依赖
      ['buildRes', this.buildRes], // 在构建目录执行构建任务
      ['uploadNpm', this.publishNpm],
      ['updateTale', this.updateTable] // 更新物料表，物料历史版本记录表新增一条版本记录
    ]);
    for (const [key, hook] of hooks) {
      const res: boolean = await hook.bind(this)();
      if (!res) {
        this.app.logger.error(`[buildMaterial.${key}] failed to execute`);
        this.buildService.clear();
        return;
      }
    }
    await this.updateTask({
      msg: { result: 'success' },
      progress_percent: 100,
      progress: E_Task_Progress.Complete,
      taskStatus: E_TASK_STATUS.FINISHED
    });
    this.app.logger.info(`build ${this.materialInfo.name} success`);
    this.buildService.clear();
  }
  private async initialize() {
    // 初始化构建任务状态
    const res: I_Response = await this.updateTask({
      progress_percent: 5,
      progress: E_Task_Progress.Init,
      taskStatus: E_TASK_STATUS.RUNNING
    });
    if (res.error) {
      this.app.logger.error('[BuildMaterial.initialze] error', res);
    }
    return !!res.data;
  }

  private async installDep(): Promise<boolean> {
    // 初始化构建环境，生成构建文件夹及安装依赖
    await this.updateTask({
      progress_percent: 10,
      progress: E_Task_Progress.Install
    });
    const res: boolean = await this.buildService.init({ framework: this.framework });
    const { name } = this.materialInfo;
    this.deployPath = path.resolve(this.buildService.buildGround, `./${name}/${this.version}`);
    if (!res) {
      await this.updateTask({
        msg: { result: 'Failed to install dependencies' },
        progress_percent: 100,
        taskStatus: E_TASK_STATUS.STOPPED
      });
    }
    return res;
  }
  // 构建并生成待上传资源
  private async buildRes(): Promise<boolean> {
    // 安装依赖完毕开始构建
    await this.updateTask({
      progress_percent: 45,
      progress: E_Task_Progress.Build
    });
    const cMap = this.formatComponents();
    // 执行构建
    const res = await this.buildService.build({
      components: cMap,
      framework: this.framework,
      blocks: this.blocks,
      version: this.version,
      material: this.materialInfo,
      packageVersion: this.packageVersion
    });
    if (!res) {
      await this.updateTask({
        msg: { result: 'Build material failed' },
        progress_percent: 100,
        taskStatus: E_TASK_STATUS.STOPPED
      });
    }
    return res;
  }

  private async updateTable(): Promise<boolean> {
    await this.updateTask({
      progress_percent: 90,
      progress: E_Task_Progress.Update
    });
    // 抽取资源链接
    const scripts = this.getNpmFileUrl('dist/**/*.js');
    const styles = this.getNpmFileUrl('dist/**/*.css');
    const bundles = this.getNpmFileUrl('dist/**/bundle.json');
    const { id, name, npm_name, tenant, material_histories } = this.materialInfo;
    let urls = {};
    let res: I_Response;

    try {
      const blockAssets: any = this.getBlockAssets();
      urls = {
        material: [...bundles, ...blockAssets.material],
        scripts: [...scripts, ...blockAssets.scripts],
        styles: [...styles, ...blockAssets.styles]
      };
      res = await this.service.materialCenter.materialHistories.create(
        {
          name,
          npm_name,
          tenant,
          version: this.packageVersion,
          framework: this.framework,
          description: this.packageDescription,
          material: id,
          assets_url: urls,
          components: this.components.map((c) => c.id)
        },
        this.materialInfo
      );
    } catch (error) {
      await this.updateErrrorHandle(error, 'create material_histories');
      return false;
    }
    // 更新物料表
    const historyId = res.data.id;
    try {
      res = await this.service.materialCenter.material.update({
        id,
        npm_name,
        assets_url: urls,
        published: true,
        last_build_info: {
          version: this.packageVersion
        },
        material_histories: [...material_histories.map(({ id }) => id), historyId],
        latest: historyId
      });
    } catch (error) {
      await this.updateErrrorHandle(error, 'update material');
      return false;
    }
    // 更新区块版本控制中间表
    const blockRelations = this.blockVersions.map((item) => {
      return {
        block: item.block_id,
        host: historyId,
        host_type: 'materialHistory',
        version: item.version
      };
    });
    try {
      res = await this.service.materialCenter.blockHistory.updateRelations(blockRelations);
    } catch (error) {
      await this.updateErrrorHandle(error, 'create blocks_carriers_relations');
      return false;
    }
    return true;
  }
  async updateErrrorHandle(error: unknown, tableOperate: string) {
    this.app.logger.error(`[BuildMaterial.updateTable] ${tableOperate} error:`, `${(error as any).message}`);
    await this.updateTask({
      msg: { result: `${tableOperate} error` },
      progress_percent: 100,
      taskStatus: E_TASK_STATUS.STOPPED
    });
  }

  private formatComponents(): Map<string, any> {
    const cMap = new Map();
    this.components.forEach((item) => {
      const { component } = item;
      cMap.set(component, item);
    });
    return cMap;
  }

  private updateTask(param: I_UpdateTaskParam): Promise<I_Response> {
    const { msg, taskStatus, progress, progress_percent } = param;
    const taskResult: string = (typeof msg === 'string' ? msg : JSON.stringify(msg)) || '';
    const { task } = this.ctx.service;
    return task.update({
      id: this.taskId,
      taskStatus,
      taskResult,
      progress,
      progress_percent
    });
  }

  // 生成版本号
  private generateVersion() {
    const now = new Date();
    const ymd = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    const hms = `${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}`;
    return `${ymd}_${hms}_${now.getTime()}`;
  }

  // 获取资源根目录
  private getNpmBaseUrl(): string {
    const { url } = this.app.config.npm;
    const { npm_name } = this.materialInfo;
    return `${url}/${npm_name}@${this.packageVersion}`;
  }

  // 拼接OBS链接
  private getNpmFileUrl(fileRes: string): Array<string> {
    const baseUrl = this.getNpmBaseUrl();
    const cwd = this.deployPath;
    return glob.sync(fileRes, { cwd }).map((file) => `${baseUrl}/${file}`);
  }

  // 提取区块资源
  private getBlockAssets(): Array<any> {
    return this.blocks.reduce(
      (a, b) => {
        const assets = JSON.parse(b?.assets || '');
        return {
          material: [...a.material, ...this.formatUnpkgUrl(b, assets.material || [])],
          scripts: [...a.scripts, ...this.formatUnpkgUrl(b, assets.scripts || [])],
          styles: [...a.styles, ...this.formatUnpkgUrl(b, assets.styles || [])]
        };
      },
      {
        material: [],
        scripts: [],
        styles: []
      }
    );
  }

  private formatUnpkgUrl(block: any, links: Array<string>): Array<string> {
    return links.map((link) => {
      const versionStr = this.blockVersions.find((blockVersions) => blockVersions.block_id === block.id)?.version;
      return versionStr ? link.replace(/@\d{1,3}(\.\d{1,3}){0,2}\//, `@${versionStr}/`) : link;
    });
  }

  private async publishNpm(): Promise<boolean> {
    await this.updateTask({
      progress: E_Task_Progress.Upload,
      progress_percent: 75
    });
    const { cnpm } = this.ctx.service;
    const { isSuccess: isLoginSuccess, message: loginMsssage } = await cnpm.loginInNpm(this.deployPath);
    if (!isLoginSuccess) {
      await this.updateTask({
        taskStatus: E_TASK_STATUS.STOPPED,
        progress_percent: 100,
        msg: { result: loginMsssage }
      });
      this.app.logger.error(loginMsssage);
      return false;
    }
    const { isSuccess: isPublishSuccess, message: publishMsssage } = await cnpm.publishCnpm(this.deployPath);
    if (!isPublishSuccess) {
      await this.updateTask({
        taskStatus: E_TASK_STATUS.STOPPED,
        progress_percent: 100,
        msg: { result: publishMsssage }
      });
      this.app.logger.error(publishMsssage);
      return false;
    }
    return true;
  }
}
