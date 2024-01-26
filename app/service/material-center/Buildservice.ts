import { Application } from "egg";
import spawn from 'cross-spawn'
import * as path from 'path'
import * as fs from 'fs-extra'
import { I_SourceCode } from "../../lib/interface";


export default abstract class BuildService {
    app:Application;
    base: '';
    framework: '';
    readonly timeStamp: number = Date.now();
    protected buildGround = '';
    constructor(app:Application) {
        this.app = app;
        this.base = app.config.tmpPath.buildground
    }
   // 获取tgz路径
  async findTgz(dir) {
    const fileList = await fs.readdir(dir)
    return fileList.find((file) =>  /^opentiny\/tinybuilder-webcomp-.+\.tgz$/.test(file)) || ''; //TODO 这里匹配的是包tgz文件的名称，择机替换为opentiny的
  } 
   // 执行命令
   async spawnCommand(command, options) {
    const [cmd, ...params] = command
    return new Promise((resolve, reject) => {
      const task = spawn(cmd, params, { ...options })
      let stderr = ''
      task.on('close', (code) => {
        if (code === 0) {
          return resolve({ success: true })
        }
        return reject(new Error(stderr.trim()))
      })
      task.on('error', reject)
      task.stderr?.on('data', (chunk) => {
        stderr += chunk
      })
      task.stdout?.pipe(process.stdout)
      task.stderr?.pipe(process.stderr)
    })
  }
  // 获取构建目录
  getBuildGround() {
    if (!this.buildGround) {
      this.buildGround = path.join(this.base, 'buildground_' + Date.now())
    }
    return this.buildGround
  }
  
  getBuildInfo(pkgNames) {
    try {
      return pkgNames.map((name, index) => {
        let pkgJson: any = {};
        if (!index) {
          pkgJson = require(path.join(this.getBuildGround(), 'package.json'))
        } else {
          pkgJson = require(path.join(this.getBuildGround(), 'node_modules', name, 'package.json'))
        }
        return `${name}@${pkgJson.version}`
      })
    } catch (error) {
      this.app.logger.error('read package version failed', error)
      return []
    }
  }
  // 保存bundle.json
  parseConfig(distPath) {
    const configPath = path.join(distPath, 'config.umd.min.js')
    const bundlePath = path.join(distPath, 'bundle.json')
    if (fs.existsSync(bundlePath) || !fs.existsSync(configPath)) {
      return
    }
    const config = require(configPath)
    const bundleJson = {
      data: {
        framework: this.framework,
        materials: {
          blocks: [config]
        }
      }
    }
    fs.writeJSONSync(path.join(distPath, 'bundle.json'), bundleJson)
  }
  
  async clearUnnecessaryDeps(unnecessaryDeps){
      const packageJsonFile = path.join(this.getBuildGround(), 'package.json');
      const packageJson = require(packageJsonFile);
      for (const dep of unnecessaryDeps) {
          delete packageJson.devDependencies[dep]
      }
      await fs.writeFild(packageJsonFile, JSON.stringify(packageJson, null, 2), 'utf-8');
  }
  abstract init(param: any): Promise<any>;
  abstract injectCodeFile(sourceCode: I_SourceCode[], path: string): void;
  abstract build(param: any): any;
  
  // 获取dist目录
  getDist() {
    return path.join(this.getBuildGround(), 'dist')
  }

  // 清理dist目录
  clearDist() {
    const distPath = this.getDist()
    fs.removeSync(distPath)
    fs.ensureDirSync(distPath)
  }

  // 清理构建目录
  async clear() {
    await fs.remove(this.getBuildGround())
  }

  readPkgJson(){
    const packageJsonFile =  path.join(this.getBuildGround(), 'package.json');
    return require(packageJsonFile);
  }
  getVersion(){
      const { version } = this.readPkgJson();
      return `${version}_${this.timeStamp}`;
  }
}