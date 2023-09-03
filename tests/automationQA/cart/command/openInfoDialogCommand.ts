import CommandBase from "../../base/commandBase";
import CartPageObj from "../pageModel/cartPageObj";

const cartPageObj = new CartPageObj();

export default class OpenInfoDialogCommand extends CommandBase {
  protected name: string;

  protected isReadTitle = false;

  protected isClose = false;

  public DialogTitle: string;

  // #region Methods
  withName(name: string): OpenInfoDialogCommand {
    this.name = name;
    return this;
  }

  withReadTitle(): OpenInfoDialogCommand {
    this.isReadTitle = true;
    return this;
  }

  withClose(): OpenInfoDialogCommand {
    this.isClose = true;
    return this;
  }
  // #endregion

  // #region Actions
  protected async executeUsingUI() {
    await cartPageObj.waitPageDisplayed();
    const infoDialog = await cartPageObj.clickInfoIcon(this.name);

    infoDialog.waitDialogOpened();

    if (this.isReadTitle === true) {
      this.DialogTitle = await infoDialog.getDialogTitle();
    }

    if (this.isClose === true) {
      await infoDialog.closeDialog();
    }
  }
  // #endregion
}
