import * as fs from 'fs-extra';
import * as path from 'path';
import { E_TYPES } from '../../lib/enum';
import { I_SourceCode } from '../../lib/interface';
import BuildService from './Buildservice';

export default class MaterialBuildService extends BuildService {
  private baseNpm = '@opentiny/tinybuilder-webcomp-';
  public buildGround = '';
  public bundleFileName = 'bundle.json';
  public packagePath = '';
  async init({ framework }): Promise<boolean> {
    try {
      // 初始化构建目录
      const buildGround = this.getBuildGround();
      await fs.ensureDirSync(buildGround);
      const registries = this.app.config.npmRegistryOptions;
      // 下载tarball包
      await this.spawnCommand(
        ['npm', 'pack', `${this.baseNpm}${E_TYPES[framework]}`, ...registries, '--strict-ssl=false'],
        { cwd: buildGround }
      );
      const taz = await this.findTgz(buildGround);
      this.app.logger.info('[MaterialBuildService.findTgz] 获取到的taz包: ', taz);
      if (taz) {
        await this.spawnCommand(['tar', '-xzvf', taz], { cwd: buildGround });
        this.app.logger.info('[MaterialBuildService.init] succeed to decompress tar.');
        // 安装依赖
        await this.spawnCommand(
          [
            'npm',
            'install',
            ...registries,
            '--no-audit',
            '--no-fund',
            '--production=false',
            '--progress=false',
            '--strict-ssl=false'
          ],
          { cwd: path.join(buildGround, 'package') }
        );
        return true;
      }
    } catch (err: any) {
      this.app.logger.error(`MaterialBuildService] material init error: ${err.message || err}`);
    }
    return false;
  }

  injectCodeFile(sourceCode: I_SourceCode[], path: string) {
    return [sourceCode, path];
  }
  async build(params: any): Promise<boolean> {
    const { components, framework, blocks, material, version, packageVersion } = params;
    let materials: { components: any[]; snippets: any[] };
    try {
      // 生成lib.js入口文件
      if (components.size > 0) {
        this.writeEntryFile(components);
      }
      // 执行build命令
      await this.spawnCommand(['npm', 'run', 'build:wc'], { cwd: path.join(this.getBuildGround(), 'package') });
      materials = this.group(components);
      // 构建BundleJson并生成待上传资源
      const baseDir = `${material.name}/${version}`;
      this.makeBundleJson(materials, framework, blocks, baseDir);
      this.createPackageJson(material, baseDir, packageVersion);
    } catch (err: any) {
      this.app.logger.error(`[MaterialBuildService] material build error: ${err.message || err}`);
      return false;
    }
    return true;
  }
  /**
   * 构建BundleJson并在生成待上传资源文件及文件夹
   * @param {any} material 序列化分组后的物料信息对象
   * @param {string} framework 物料选择的技术栈
   * @param {any} blocks 物料关联的区块信息
   */
  private async makeBundleJson(materials, framework, blocks, baseDir) {
    const jsonFilename = this.bundleFileName;
    const bundleJson = {
      data: {
        framework,
        materials: {
          ...materials,
          blocks
        }
      }
    };
    this.app.logger.info(`[MaterialBuildService.makeBundleJson] ${jsonFilename}`);
    this.packagePath = path.resolve(this.buildGround, `./${baseDir}/dist`);
    await fs.ensureDir(this.packagePath);
    await fs.outputJson(path.resolve(this.buildGround, jsonFilename), bundleJson);
    const webCompDistDir = path.resolve(this.buildGround, 'package', 'dist');
    // 先删除否则会覆盖掉生成好的
    await fs.remove(path.join(webCompDistDir, jsonFilename));
    // 获取js.css
    await fs.copy(webCompDistDir, this.packagePath);
  }
  private writeEntryFile(components: Map<string, { component }>) {
    const pkgName = '@opentiny/tiny-vue3';
    const entry = path.join(this.getBuildGround(), 'package', 'src', 'lib.js');
    const componentsArray = [...components.values()];
    const imports: Array<string> = [];
    const maps: Array<string> = [];
    const decorators: Array<string> = [];
    const mapperGroup = ['Grid', 'Tabs', 'Collapse'];
    componentsArray.forEach((component: any) => {
      const { package: packageName, exportName, destructuring } = component.npm;
      if (packageName === pkgName && destructuring === true) {
        imports.push(exportName);
        maps.push(`${component.component}:${exportName}`);
        if (mapperGroup.includes(exportName)) {
          decorators.push(`Mapper['${component.component}'].isGroup = true`);
        }
      }
    });
    const content = `import {
   ${imports}
} from '@opentiny/tiny-vue3'

const Mapper = {
  ${maps.join(',')}    
}

${decorators.join('\n')}

export default Mapper`;
    fs.outputFileSync(entry, content);
  }

  /**
   * 生成package.json
   * @param {any} material 物料包相关
   */
  private async createPackageJson(material, baseDir, version) {
    const packageJson = {
      name: material.npm_name,
      version,
      description: '',
      keywords: [],
      license: 'ISC'
    };
    await fs.outputJson(path.resolve(this.buildGround, `${baseDir}/package.json`), packageJson);
  }

  /**
   * 构建BundleJson并在生成待上传资源文件及文件夹
   * @param {Array<any>} components 组件对象数组
   * @return {any} 序列化的分组对象
   */
  private group(components): any {
    const obj: { components: any[]; snippets: any[] } = {
      components: [],
      snippets: []
    };
    const groups = {};
    components.forEach((item) => {
      const { snippets, category, priority, ...other } = item;
      if (!groups[category]) {
        groups[category] = {};
      }
      // 处理用户录入重复优先级的情况
      let adaptivePriority = priority;
      while (groups[category][adaptivePriority]) {
        adaptivePriority++;
      }
      snippets && (groups[category][adaptivePriority] = snippets);
      obj.components.push(other);
    });
    Object.keys(groups).forEach((group) => {
      const snippets2: any[] = [];
      Object.keys(groups[group]).forEach((child) => {
        snippets2.push(...groups[group][child]);
      });
      obj.snippets.push({
        group,
        children: snippets2
      });
    });
    return obj;
  }
}
