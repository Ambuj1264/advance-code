import CommandBase from "../../base/commandBase";
import { PaymentType } from "../Enum/PaymentType";
import CartPageObj from "../pageModel/cartPageObj";

const cartPageObj = new CartPageObj();

export default class ReadCartCommand extends CommandBase {
  protected isGetBookedItems = false;

  protected isGetBookedItemsSum = false;

  private isGetTotalSum = false;

  private currency: string;

  private isGetPageCurrencies = false;

  private isGetBookedItemsCountInIcon = false;

  private paymentType: PaymentType = PaymentType.None;

  private bookedItemName: string;

  public BookedItems: Selector;

  public BookedItemsSum: number;

  public TotalItemsSum: number;

  public MainMenuCurrency: string;

  public BookedItemsCountInIcon: number;

  public PageCurrencies: string[] = [];

  public IsPaymentSelected = false;

  public IsBookedItemDisplayed = false;

  // #region Methods
  withGetBookedItems(): ReadCartCommand {
    this.isGetBookedItems = true;
    return this;
  }

  withGetItemsSum(): ReadCartCommand {
    this.isGetBookedItemsSum = true;
    return this;
  }

  withGetTotalSum(): ReadCartCommand {
    this.isGetTotalSum = true;
    return this;
  }

  withGetMainMenuCurrency(currency: string): ReadCartCommand {
    this.currency = currency;
    return this;
  }

  withGetPageCurrencies(): ReadCartCommand {
    this.isGetPageCurrencies = true;
    return this;
  }

  withGetBookedCountInMainMenu(): ReadCartCommand {
    this.isGetBookedItemsCountInIcon = true;
    return this;
  }

  withCheckPaymentSelected(paymentType: PaymentType): ReadCartCommand {
    this.paymentType = paymentType;
    return this;
  }

  withCheckItemBookedDisplayed(bookedItemName: string): ReadCartCommand {
    this.bookedItemName = bookedItemName;
    return this;
  }
  // #endregion

  // #region Actions
  protected async executeUsingUI() {
    await cartPageObj.waitPageDisplayed();

    if (this.isGetBookedItems) {
      this.BookedItems = cartPageObj.getBookedItems();
    }

    if (this.isGetBookedItemsSum) {
      this.BookedItemsSum = await cartPageObj.countBookedItemsSum();
    }

    if (this.isGetTotalSum) {
      this.TotalItemsSum = await cartPageObj.getTotalSum();
    }

    if (this.currency) {
      this.MainMenuCurrency = await cartPageObj.getMainMenuCurrency(this.currency);
    }

    if (this.isGetPageCurrencies) {
      this.PageCurrencies = await cartPageObj.getPageCurrencies();
    }

    if (this.isGetBookedItemsCountInIcon) {
      this.BookedItemsCountInIcon = await cartPageObj.getBookedItemsCountInIcon();
    }

    if (this.paymentType !== PaymentType.None) {
      this.IsPaymentSelected = await cartPageObj.checkPaymentTypeSelected(this.paymentType);
    }

    if (this.bookedItemName) {
      this.IsBookedItemDisplayed = await cartPageObj.waitBookedItemDisplayed(this.bookedItemName);
    }
  }
  // #endregion
}
