/* eslint-disable functional/immutable-data */
import { t, Selector } from "testcafe";

import { baseUrl } from "../../../../utils/testcafe/testcafeConstants";
import Waiters from "../../base/waiters";
import RemoveDialog from "../dialog/removeDialog";
import { FormatString } from "../../base/stringHelper";
import InfoDialog from "../dialog/infoDialog";
import { PaymentType } from "../Enum/PaymentType";

export default class CartPageObj {
  public Url: string;

  constructor() {
    this.Url = `${baseUrl}/cart`;
  }

  // #region selectors
  private nameField: Selector = Selector("#name").with({
    visibilityCheck: true,
  });

  private errorMessageSelector = '[data-testid="errorMessage"]';

  private nameValidationMessage = this.nameField.parent().find(this.errorMessageSelector);

  private emailField: Selector = Selector("#email");

  private emailValidationMessage = this.emailField.parent().find(this.errorMessageSelector);

  private phoneNumberField: Selector = Selector("#phoneInput");

  private cardNumberField: Selector = Selector("#cardNumber");

  private expiryDateField: Selector = Selector("#expiryDate");

  private cvcField: Selector = Selector("#cvvNumber");

  private termsAgreedLabel: Selector = Selector('[for="termsAgreed"]');

  private termsAgreedCheckBox: Selector = Selector("#termsAgreed");

  private termsAgreementValidationMessage = this.termsAgreedCheckBox
    .parent()
    .find(this.errorMessageSelector);

  private cartNumberValidationMessage = this.cardNumberField
    .parent("section")
    .find(this.errorMessageSelector);

  private expireDateValidationMessage = this.expiryDateField
    .parent("section")
    .find(this.errorMessageSelector);

  private reserveButton: Selector = Selector("#paymentFormButton");

  private itemContainer: Selector = Selector('[data-testid*="itemContainer"]').with({
    visibilityCheck: true,
  });

  private itemPrice = Selector('[data-testid*="itemContainer"] [data-testid="productPrice"]').with({
    visibilityCheck: true,
  });

  private totalSum: Selector = Selector(
    '[data-testid="paymentFormFooter"] [data-testid="productPrice"]'
  ).with({ visibilityCheck: true });

  private removeIconSelecor = '[data-testid="removeIcon"]';

  private editIconSelector = '[data-testid="editIcon"]';

  private infoIconSelector = '[data-testid="informationIcon"]';

  private currencyPicker: Selector = Selector("#navBarCurrencyPicker");

  private currencySelector = "#{0}currencyPickerOption";

  private pageCurrency: Selector = Selector('[data-testid="productCurrency"]').with({
    visibilityCheck: true,
  });

  private crossButton: Selector = Selector('[data-testid="popoverCloseBtn"]').with({
    visibilityCheck: true,
  });

  private navBardesktopCart: Selector = Selector("[data-testid='cart-item-count']");

  private paymentTypeSelector = ".adyen-checkout__payment-method--{0}";

  private selectedPayment = `${this.paymentTypeSelector}.adyen-checkout__payment-method--selected`;

  // #endregion

  // #region methods
  async typeName(name: string) {
    await t.typeText(this.nameField, name, {
      replace: true,
      speed: 0.4,
    });
  }

  async typeEmail(email: string) {
    await t.typeText(this.emailField, email, {
      replace: true,
      speed: 0.4,
    });
  }

  async typePhoneNumber(phoneNumber: string) {
    await t.typeText(this.phoneNumberField, phoneNumber, {
      replace: true,
      speed: 0.4,
    });
  }

  async typeCardNumber(cardNumber: string) {
    await t.typeText(this.cardNumberField, cardNumber, {
      replace: true,
      speed: 0.4,
    });
  }

  async typeExpiryDate(expiryDate: string) {
    await t.typeText(this.expiryDateField, expiryDate, {
      replace: true,
      speed: 0.4,
    });
  }

  async typeCVC(cvc: string) {
    await t.typeText(this.cvcField, cvc, {
      replace: true,
      speed: 0.4,
    });
  }

  async checkAgreeCheckBox() {
    await t.click(this.termsAgreedLabel);
  }

  async clickReserve() {
    await t.click(this.reserveButton);
  }

  async clickRemoveIcon(itemName: string): Promise<RemoveDialog> {
    const item = this.itemContainer.withText(itemName);
    const removeIcon = item.find(this.removeIconSelecor);
    await t.click(removeIcon);
    return new RemoveDialog();
  }

  async clickInfoIcon(itemName: string): Promise<InfoDialog> {
    const item = this.itemContainer.withText(itemName);
    const infoIcon = item.find(this.infoIconSelector);
    await t.click(infoIcon);
    return new InfoDialog();
  }

  async openPageWithHook(hooks: object[]) {
    return t.addRequestHooks(hooks).navigateTo(this.Url);
  }

  async openPage() {
    return t.navigateTo(this.Url);
  }

  async waitPageDisplayed(): Promise<any> {
    await t.expect(this.itemPrice.visible).ok({ timeout: 45000 });
    return this.itemPrice.innerText;
  }

  async changeCurrency(currency: string) {
    const selector = FormatString(this.currencySelector, currency);

    await t.setTestSpeed(0.4).click(this.currencyPicker);

    const selectedCurrency = Selector(selector).with({
      visibilityCheck: true,
    });

    await t.click(selectedCurrency).click(this.crossButton);
  }

  async selectPaymentType(paymentType: PaymentType) {
    const selector = FormatString(this.paymentTypeSelector, paymentType);
    const paymentSelector = Selector(selector).with({
      visibilityCheck: true,
      timeout: 30000,
    });
    await t.click(paymentSelector);
  }

  async getMainMenuCurrency(cureency: string): Promise<string> {
    const txt = await this.currencyPicker.withText(cureency).with({ visibilityCheck: true })
      .textContent;
    return txt;
  }

  async getPageCurrencies(): Promise<string[]> {
    const count = await this.pageCurrency.count;
    const result: Promise<string>[] = [];
    for (let i = 0; i < count; i++) {
      result.push(this.pageCurrency.nth(i).innerText);
    }

    const items = await Promise.all(result);
    return items;
  }

  async getBookedItemsCountInIcon(): Promise<number> {
    const number = (await this.navBardesktopCart.innerText).trim();
    return +number;
  }

  async clickEditIcon(itemName: string) {
    const item = this.itemContainer.withText(itemName);
    const editIcon = item.find(this.editIconSelector);
    await t.click(editIcon);
  }

  async waitBookedItemDisplayed(itemName: string): Promise<boolean> {
    const state = await Waiters.waitSelectorVisible(this.itemContainer.withText(itemName));
    return state;
  }
  // #endregion

  // #region Checks
  async isReserveButtonVisible() {
    await this.reserveButton.visible;
  }

  getBookedItems(): Selector {
    return this.itemContainer;
  }

  async countBookedItemsSum(): Promise<number> {
    const totalProducts = await this.itemPrice.count;
    const result: Promise<string>[] = [];
    let sum = 0;

    for (let i = 0; i < totalProducts; i++) {
      // eslint-disable-next-line functional/immutable-data
      result.push(this.itemPrice.nth(i).textContent);
    }

    const items = await Promise.all(result);

    items.forEach(item => {
      sum += parseFloat(item);
    });

    return sum;
  }

  async getTotalSum(): Promise<number> {
    const totalPrice = await this.totalSum.textContent;
    return parseFloat(totalPrice);
  }

  async checkPaymentTypeSelected(paymentType: PaymentType): Promise<boolean> {
    const selector = FormatString(this.selectedPayment, paymentType);

    return Waiters.waitElementVisible(selector);
  }

  async validateName(): Promise<string> {
    const text = (await this.nameValidationMessage.innerText).trim();
    return text;
  }

  async validateEmail(): Promise<string> {
    const text = (await this.emailValidationMessage.innerText).trim();
    return text;
  }

  async validateAgreement(): Promise<string> {
    const text = (await this.termsAgreementValidationMessage.innerText).trim();
    return text;
  }

  async validateCartNumbert(): Promise<string> {
    const text = (await this.cartNumberValidationMessage.innerText).trim();
    return text;
  }

  async validateExpireDate(): Promise<string> {
    const text = (await this.expireDateValidationMessage.innerText).trim();
    return text;
  }
  // #endregion
}
