import CommandBase from "../../base/commandBase";
import CartPageObj from "../pageModel/cartPageObj";

export default class ValidationCommand extends CommandBase {
  private cartPageObj = new CartPageObj();

  private isValidateName = false;

  private isValidateEmail = false;

  private isValidateAgreement = false;

  private isValidateCartNumber = false;

  private isValidateExpireDate = false;

  public NameValidateMessage = "";

  public EmailValidateMessage = "";

  public AgreementValidateMessage = "";

  public CartNumberValidateMessage = "";

  public ExpireDateValidateMessage = "";

  // #region Methods
  withValidateName(): ValidationCommand {
    this.isValidateName = true;
    return this;
  }

  withValidateEmail(): ValidationCommand {
    this.isValidateEmail = true;
    return this;
  }

  withValidateAgreement(): ValidationCommand {
    this.isValidateAgreement = true;
    return this;
  }

  withValidateCartNumber(): ValidationCommand {
    this.isValidateCartNumber = true;
    return this;
  }

  withValidateExpireDate(): ValidationCommand {
    this.isValidateExpireDate = true;
    return this;
  }
  // #endregion

  // #region Actions
  protected async executeUsingUI() {
    if (this.isValidateName) {
      this.NameValidateMessage = await this.cartPageObj.validateName();
    }

    if (this.isValidateEmail) {
      this.EmailValidateMessage = await this.cartPageObj.validateEmail();
    }

    if (this.isValidateAgreement) {
      this.AgreementValidateMessage = await this.cartPageObj.validateAgreement();
    }

    if (this.isValidateCartNumber) {
      this.CartNumberValidateMessage = await this.cartPageObj.validateCartNumbert();
    }

    if (this.isValidateExpireDate) {
      this.ExpireDateValidateMessage = await this.cartPageObj.validateExpireDate();
    }
  }
  // #endregion
}
