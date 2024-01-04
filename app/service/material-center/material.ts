import DataService from "../dataService"


class Material extends DataService{
  private base = 'materials';

  async findOne(id){
    return this.query({
      url:`${this.base}/${id}`
    });
      
  }

}