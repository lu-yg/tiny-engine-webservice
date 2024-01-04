import { I_SourceCode } from "../../lib/interface";
import BuildService from "./Buildservice";


export default class MaterialBuildService extends BuildService{
    private baseNpm = '@opentiny/tinybuilder-webcomp-';
    public buildGround = '';
    public bundleFileName = 'bundle.json';
    public packagePath = '';
  async init({framework}): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    injectCodeFile(sourceCode: I_SourceCode[], path: string): void {
        throw new Error("Method not implemented.");
    }
    build(param: any) {
        throw new Error("Method not implemented.");
    }
    

}