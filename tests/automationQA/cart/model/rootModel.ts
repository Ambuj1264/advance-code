import { DataModelType, getDataModel } from "./dataModel";

export default class RootModel {
  data: DataModelType;

  constructor() {
    this.data = getDataModel();
  }
}
