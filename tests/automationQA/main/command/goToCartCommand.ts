import CommandBase from "../../base/commandBase";
import CartPageObj from "../../cart/pageModel/cartPageObj";
import MainPageObj from "../pageModel/mainObj";

const mainPageObj = new MainPageObj();
const cartPageObj = new CartPageObj();

export default class GoToCartCommand extends CommandBase {
  private isClickIcon = false;

  private isCartUrl = false;

  private isCheckMainPageDisplayed = false;

  private isCartPopCheck = false;

  public IsCartPopUpOpened = false;

  public Message = "";

  public IsMainPageDisplayed = false;

  // #region Methods
  withClickIcon(): GoToCartCommand {
    this.isClickIcon = true;
    return this;
  }

  withOpenUrl(): GoToCartCommand {
    this.isCartUrl = true;
    return this;
  }

  withCheckCartPopUp() {
    this.isCartPopCheck = true;
    return this;
  }

  withCheckMainPageDisplayed() {
    this.isCheckMainPageDisplayed = true;
    return this;
  }
  // #endregion

  // #region Actions
  protected async executeUsingUI() {
    await mainPageObj.waitPageOpened();

    if (this.isClickIcon) {
      mainPageObj.clickCartIcon();
    }

    if (this.isCartUrl) {
      await cartPageObj.openPage();
    }

    if (this.isCartPopCheck) {
      this.IsCartPopUpOpened = await mainPageObj.waitCartPopOpened();
      this.Message = await mainPageObj.readCartPopUpMessage();
    }

    if (this.isCheckMainPageDisplayed) {
      this.IsMainPageDisplayed = await mainPageObj.waitPageOpened();
    }
  }
  // #endregion
}
