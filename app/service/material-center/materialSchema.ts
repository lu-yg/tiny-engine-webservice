/**
* Copyright (c) 2023 - present TinyEngine Authors.
* Copyright (c) 2023 - present Huawei Cloud Computing Technologies Co., Ltd.
*
* Use of this source code is governed by an MIT-style license.
*
* THE OPEN SOURCE SOFTWARE IN THIS PRODUCT IS DISTRIBUTED IN THE HOPE THAT IT WILL BE USEFUL,
* BUT WITHOUT ANY WARRANTY, WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR FITNESS FOR
* A PARTICULAR PURPOSE. SEE THE APPLICABLE LICENSES FOR MORE DETAILS.
*
*/
import { I_Response } from "../../lib/interface";
import schemaService from "./schema";

export default class MaterialSchema extends schemaService{
  materialInfo: any;
  async getSchema(material: any): Promise<I_Response> {
    if(typeof material === 'number' || typeof material === 'string') {
      const res = await this.service.materialCenter.material.findOne({ id: material });
      if(res.error){
        return res;
      }
      this.materialInfo = res.data;
    } else {
      this.materialInfo =  material;
    }
    const { framework, user_component, user_blocks: blocks } = this.materialInfo;
    const schema: any = {
      framework,
      material: {
        blocks,
        snippets: [{}]
      }
    };
    // 获取组件schema
    schema.material.components = this.getComponentsSchema(user_component);
    return this.ctx.helper.getResponseData(schema);
  }
  private getComponentsSchema(components = []){
    const schema: Array<any> = [];
    components.forEach((component) => {
      schema.push(this.format(component));
    }) 
    return schema;
  }

  private format(component) {
    const componentInfo: I_Response = this.ctx.helper.getResponseData(component);
    const schemaInfo: I_Response = this.assembleFields(componentInfo, 'component');
    return schemaInfo.data;
  }
}