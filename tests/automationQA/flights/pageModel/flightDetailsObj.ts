import { t, Selector } from "testcafe";

import { baseUrl } from "../../../../utils/testcafe/testcafeConstants";
import Waiters from "../../base/waiters";
import { Gender } from "../Enum/Gender";

export default class FlightDetailsPageObject {
  public Url: string;

  constructor() {
    this.Url = `${baseUrl}/details`;
  }

  // #region selectors

  private baseModalElement = Selector("#passenger1Modal", {
    visibilityCheck: true,
  });

  private emailField: Selector = this.baseModalElement.find("#email");

  private phoneNumberField: Selector = this.baseModalElement.find("#phoneInput");

  private givenNameField: Selector = this.baseModalElement.find('[id="givenName1"]');

  private familyNameField: Selector = this.baseModalElement.find('[id="surname1"]');

  private nationalityDropdown: Selector = this.baseModalElement.find("#nationalityDropdown");

  private nationalityOption = this.nationalityDropdown.find('div[id*="react-select"]').with({
    visibilityCheck: true,
  });

  private genderDropdown: Selector = this.baseModalElement.find('[id="genderDropdown1"]').with({
    visibilityCheck: true,
  });

  private genderOption = this.genderDropdown.find('div[id*="react-select"]').with({
    visibilityCheck: true,
  });

  private dateOfBirthSection: Selector = this.baseModalElement.find('[for="dateOfBirth"]').parent();

  private dayBD = this.dateOfBirthSection.find("#dayDropdown");

  private monthBD = this.dateOfBirthSection.find("#monthDropdown");

  private yearBD = this.dateOfBirthSection.find("#yearDropdown");

  private passportIdSection = this.baseModalElement.find('[for="passportWrapper1"]').parent();

  private noExpiryCheckbox: Selector = this.baseModalElement.find('[for="noExpiryCheckbox1"]');

  private addInformation: Selector = Selector('#booking-widget-form button[type="button"]').with({
    visibilityCheck: true,
  });

  private applyButton: Selector = this.baseModalElement
    .find('[role="dialog"] button[type="button"]')
    .with({
      visibilityCheck: true,
    });

  private continueButton: Selector = Selector('[data-testid="continueBookButton"]').with({
    visibilityCheck: true,
  });

  // #endregion

  // #region methods

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

  async typeGivenName(name: string) {
    await t.typeText(this.givenNameField, name, {
      replace: true,
      speed: 0.4,
    });
  }

  async typeFamilyName(name: string) {
    await t.typeText(this.familyNameField, name, {
      replace: true,
      speed: 0.4,
    });
  }

  async SelectNationality(nationality: string) {
    await t
      .typeText(this.nationalityDropdown, nationality, {
        replace: true,
        speed: 0.4,
      })
      .click(this.nationalityOption.withText(nationality));
  }

  async SelectGender(gender: Gender) {
    await t.click(this.genderDropdown).click(this.genderOption.withText(gender));
  }

  async SelectDateOfBirth(day: string, month: string, year: string) {
    await t
      .typeText(this.dayBD, day, {
        replace: true,
        speed: 0.4,
      })
      .pressKey("Enter")
      .typeText(this.monthBD, month, {
        replace: true,
        speed: 0.4,
      })
      .pressKey("Enter")
      .typeText(this.yearBD, year, {
        replace: true,
        speed: 0.4,
      })
      .pressKey("Enter");
  }

  async typePassportId(id: string) {
    if (await Waiters.waitSelectorVisible(this.passportIdSection, 1000)) {
      await t.typeText(this.passportIdSection, id, {
        replace: true,
        speed: 0.4,
      });
    }
  }

  async checkNoExpiry(): Promise<void> {
    if (await Waiters.waitSelectorVisible(this.noExpiryCheckbox, 1000)) {
      await t.click(this.noExpiryCheckbox);
    }
  }

  async clickAddInformation() {
    await t.click(this.addInformation);
  }

  async clickApply() {
    await t.click(this.applyButton);
  }

  async clickContinue() {
    await t.click(this.continueButton);
  }

  // #endregion
}
