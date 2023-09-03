import CommandBase from "../../base/commandBase";
import AccommodationPageObj from "../pageModel/accommodationObj";

export default class SelectStaysCommand extends CommandBase {
  private accommodationPageObj = new AccommodationPageObj();

  private isSelectRoom = false;

  // #region Methods

  withSelectRoom(): SelectStaysCommand {
    this.isSelectRoom = true;
    return this;
  }
  // #endregion

  // #region Actions
  protected async executeUsingUI() {
    await this.accommodationPageObj.selectStays();

    if (this.isSelectRoom === true) {
      await this.accommodationPageObj.selectRoom();
    }

    await this.accommodationPageObj.continueBook();
  }
  // #endregion
}
