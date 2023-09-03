import CommandBase from "../../base/commandBase";
import CartPageObj from "../pageModel/cartPageObj";

const cartPageObj = new CartPageObj();

export default class RemoveCommand extends CommandBase {
  protected name: string;

  protected isConfirmRemove = false;

  protected isCancelRemove = false;

  protected isCheckDialogClosed: boolean;

  protected isGetBookedItems = false;

  public IsDialogClosed: boolean;

  public BookedItems: Selector;

  // #region Methods
  withName(name: string): RemoveCommand {
    this.name = name;
    return this;
  }

  withCancellRemove(): RemoveCommand {
    this.isCancelRemove = true;
    return this;
  }

  withConfirmRemove(): RemoveCommand {
    this.isConfirmRemove = true;
    return this;
  }
  // #endregion

  // #region Actions
  protected async executeUsingUI() {
    await cartPageObj.waitPageDisplayed();
    const removeDialog = await cartPageObj.clickRemoveIcon(this.name);

    if (this.isConfirmRemove === true) {
      this.IsDialogClosed = await removeDialog.confirmRemoving();
    }

    if (this.isCancelRemove) {
      this.IsDialogClosed = await removeDialog.cancelRemoving();
    }

    this.IsDialogClosed = await removeDialog.waitDialogClosed();
  }
  // #endregion
}
