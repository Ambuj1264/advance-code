import CommandBase from "../../base/commandBase";
import { PaymentType } from "../Enum/PaymentType";
import CartPageObj from "../pageModel/cartPageObj";

const cartPageObj = new CartPageObj();

export default class ReserveCommand extends CommandBase {
  protected name: string;

  protected email: string;

  protected phoneNumber: string;

  protected cardNumber: string;

  protected expiryDate: string;

  protected cvc: string;

  protected paymentType: PaymentType = PaymentType.None;

  protected isSetAgreed = false;

  protected isReserve = true;

  // #region Methods
  withName(name: string): ReserveCommand {
    this.name = name;
    return this;
  }

  withEamil(email: string): ReserveCommand {
    this.email = email;
    return this;
  }

  withPhoneNumber(phoneNumber: string): ReserveCommand {
    this.phoneNumber = phoneNumber;
    return this;
  }

  withCardNumber(cardNumber: string): ReserveCommand {
    this.cardNumber = cardNumber;
    return this;
  }

  withExpiryDate(expiryDate: string): ReserveCommand {
    this.expiryDate = expiryDate;
    return this;
  }

  withCVC(cvc: string): ReserveCommand {
    this.cvc = cvc;
    return this;
  }

  withSetAgreed(): ReserveCommand {
    this.isSetAgreed = true;
    return this;
  }

  withSelectPayment(paymentType: PaymentType): ReserveCommand {
    this.paymentType = paymentType;
    return this;
  }

  withNotReserve(): ReserveCommand {
    this.isReserve = false;
    return this;
  }

  // #endregion

  // #region Actions
  protected async executeUsingUI() {
    await cartPageObj.waitPageDisplayed();
    if (this.name) {
      await cartPageObj.typeName(this.name);
    }

    if (this.email) {
      await cartPageObj.typeEmail(this.email);
    }

    if (this.phoneNumber) {
      await cartPageObj.typePhoneNumber(this.phoneNumber);
    }

    if (this.cardNumber) {
      await cartPageObj.typeCardNumber(this.cardNumber);
    }

    if (this.expiryDate) {
      await cartPageObj.typeExpiryDate(this.expiryDate);
    }

    if (this.cvc) {
      await cartPageObj.typeCVC(this.cvc);
    }

    if (this.paymentType !== PaymentType.None) {
      await cartPageObj.selectPaymentType(this.paymentType);
    }

    if (this.isSetAgreed === true) {
      await cartPageObj.checkAgreeCheckBox();
    }

    if (this.isReserve === true) {
      await cartPageObj.clickReserve();
    }
  }
  // #endregion
}
