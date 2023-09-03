import CommandBase from "../../base/commandBase";
import CartPageObj from "../pageModel/cartPageObj";

const cartPageObj = new CartPageObj();

export default class RemoveCommand extends CommandBase {
  protected name: string;

  protected isRemove = true;

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
    this.isRemove = false;
    return this;
  }
  // #endregion

  // #region Actions
  protected async executeUsingUI() {
    const removeDialog = await cartPageObj.clickRemoveIcon(this.name);

    if (this.isRemove === true) {
      this.IsDialogClosed = await removeDialog.confirmRemoving();
    } else {
      this.IsDialogClosed = await removeDialog.cancelRemoving();
    }
  }
  // #endregion
}
