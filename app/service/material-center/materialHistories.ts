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
import DataService from '../dataService';
import * as qs from 'querystring';
import { E_Method } from '../../lib/enum';
import { I_Response } from '../../lib/interface';

export default class MaterialHistories extends DataService{
  private base = 'material-histies'
  find(param) {
    const query = typeof param === 'string' ? param : qs.stringify(param);
    return this.query({ url: `${this.base}?${query}` });
  }

  async create(param: any, material: any) {
    const materianInfo = material || param.material;
    param.content = await this.service.materialCenter.materialSchema.getSchema(materianInfo);
    return this.query({
      url: this.base,
      method: E_Method.Post,
      data: param
    });
  }
  
  async delete(id) {
    return this.query({
      url: `${this.base}/${id}`,
      method: E_Method.Delete
    });
  }

  async findOne(param): Promise<I_Response>{
    const queryList: I_Response = await this.find(param);
    if(queryList.error){
      return queryList;
    }
    const data = queryList.data.length ? queryList.data[0] : {};
    return this.ctx.helper.getResponseDate(data);
  }
}
