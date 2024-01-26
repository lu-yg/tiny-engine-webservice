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
import { Controller } from 'egg';
import { E_Public } from '../../lib/enum';
import { updateMaterialRule } from '../../validate/material-center/material';

export default class MaterialController extends Controller {
  async update() {
    const { id } = this.ctx.params;
    const { body }  = this.ctx.request;
    this.ctx.validate(updateMaterialRule, { id, ...body});
    const {
      name_cn,
      description,
      image_url,
      isDefault,
      isOfficial,
      public: publicScope,
      public_scope_tenants,
      user_components,
    } = body;
    const updateMaterialParam = {
      id,
      name_cn,
      description,
      image_url,
      isDefault,
      isOfficial,
      public: publicScope,
      public_scope_tenants: publicScope === E_Public.SemiPublic ? public_scope_tenants: [],
      user_components,
    };
    this.ctx.body = await this.service.materialCenter.material.update(updateMaterialParam);
  }

  async build() {
    const {id} = this.ctx.params;
    const {body} = this.ctx.request;

    // 获取物料信息
    const materialRes = await this.service.materialCenter.material.findOne(id);
    const {version, blockVersions, description} = body;
    const buildParam ={version, blockVersions, description};
    this.ctx.body = await this.service.materialCenter.buildMaterial.prepare(id, materialRes, buildParam);

  }
}
