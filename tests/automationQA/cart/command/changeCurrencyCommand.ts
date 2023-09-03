import CommandBase from "../../base/commandBase";
import CartPageObj from "../pageModel/cartPageObj";

export default class ChangeCurrencyCommand extends CommandBase {
  protected currency: string;

  protected cartPageObj = new CartPageObj();

  // #region Methods
  withChangeCurrency(currency: string): ChangeCurrencyCommand {
    this.currency = currency;
    return this;
  }
  // #endregion

  // #region Actions
  protected async executeUsingUI() {
    await this.cartPageObj.waitPageDisplayed();

    if (this.currency) {
      await this.cartPageObj.changeCurrency(this.currency);
    }
  }
  // #endregion
}
