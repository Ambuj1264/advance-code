import CommandBase from "../../base/commandBase";
import MainPageObj from "../pageModel/mainObj";

const mainPageObj = new MainPageObj();

export default class MainMenuCommand extends CommandBase {
  private isVacation = false;

  // #region Methods
  withGetVacation(): MainMenuCommand {
    this.isVacation = true;
    return this;
  }
  // #endregion

  // #region Actions
  protected async executeUsingUI() {
    await mainPageObj.waitPageOpened();

    if (this.isVacation) {
      await mainPageObj.clickGetVacation();
    }
  }
  // #endregion
}
