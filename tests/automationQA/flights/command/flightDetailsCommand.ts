import CommandBase from "../../base/commandBase";
import { Gender } from "../Enum/Gender";
import FlightDetailsObj from "../pageModel/flightDetailsObj";

const flightDetailsObj = new FlightDetailsObj();

export default class FlightDetailsCommand extends CommandBase {
  private email: string;

  private phoneNumber: string;

  private givenName: string;

  private familyName: string;

  private nationality: string;

  private gender: Gender = Gender.Female;

  private dayBD: string;

  private monthBD: string;

  private yearBD: string;

  private noExpiry = true;

  private passportId: string;

  // #region Methods
  withEmail(email: string): FlightDetailsCommand {
    this.email = email;
    return this;
  }

  withPhoneNumber(phoneNumber: string): FlightDetailsCommand {
    this.phoneNumber = phoneNumber;
    return this;
  }

  withGivenName(givenName: string): FlightDetailsCommand {
    this.givenName = givenName;
    return this;
  }

  withFamilyName(familyName: string): FlightDetailsCommand {
    this.familyName = familyName;
    return this;
  }

  withNationality(nationality: string): FlightDetailsCommand {
    this.nationality = nationality;
    return this;
  }

  withGender(gender: Gender) {
    this.gender = gender;
    return this;
  }

  withDateOfBirth(day: string, month: string, year: string) {
    this.dayBD = day;
    this.monthBD = month;
    this.yearBD = year;
    return this;
  }

  withCheckNoExpiry() {
    this.noExpiry = false;
    return this;
  }

  withPassportId(passportId: string) {
    this.passportId = passportId;
    return this;
  }

  // #endregion

  // #region Actions
  protected async executeUsingUI() {
    if (this.email) {
      await flightDetailsObj.typeEmail(this.email);
    }

    if (this.phoneNumber) {
      await flightDetailsObj.typePhoneNumber(this.phoneNumber);
    }

    if (this.givenName) {
      await flightDetailsObj.typeGivenName(this.givenName);
    }

    if (this.familyName) {
      await flightDetailsObj.typeFamilyName(this.familyName);
    }

    if (this.nationality) {
      await flightDetailsObj.SelectNationality(this.nationality);
    }

    await flightDetailsObj.SelectGender(this.gender);

    if (this.dayBD && this.monthBD && this.yearBD) {
      await flightDetailsObj.SelectDateOfBirth(this.dayBD, this.monthBD, this.yearBD);
    }

    if (this.passportId) {
      await flightDetailsObj.typePassportId(this.passportId);
    }

    if (this.noExpiry) {
      await flightDetailsObj.checkNoExpiry();
    }

    await flightDetailsObj.clickApply();

    await flightDetailsObj.clickContinue();
  }
  // #endregion
}
