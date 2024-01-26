import qs from "qs";
import { E_Method } from "../../lib/enum";
import { I_Response } from "../../lib/interface";
import DataService from "../dataService";



export default class Material extends DataService{
  private base = 'materials';

  async find(param){
    const query = typeof param === 'string' ? param : qs.stringify(param);
    return this.query({ url: `${this.base}?${query}` });  
  }

  async findOne(param): Promise<I_Response>{
    const query = typeof param === 'string' ? param : qs.stringify(param);
    return this.query({ url: `${this.base}/${query}` });  
  }
  
  async update(param){
    const { id } = param;
    return this.query({
      url: `${this.base}/${id}`,
      method: E_Method.Put,
      data: param
    });
  }

}