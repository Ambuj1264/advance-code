import CommandBase from "../../base/commandBase";
import MainPageObj from "../pageModel/mainObj";

export default class GoToMainPageCommand extends CommandBase {
  private mainPageObj = new MainPageObj();

  // #region Actions
  protected async executeUsingUI() {
    await this.mainPageObj.openPage();
    await this.mainPageObj.waitPageOpened();
  }
  // #endregion
}
