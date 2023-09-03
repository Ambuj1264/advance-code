import CommandBase from "../../base/commandBase";
import TripPageObj from "../pageModel/tripsObj";

export default class SelectStaysCommand extends CommandBase {
  private tripPageObj = new TripPageObj();

  private duration = -1;

  // #region Methods
  withDuration(duration: number): SelectStaysCommand {
    this.duration = duration;
    return this;
  }
  // #endregion

  // #region Actions
  protected async executeUsingUI() {
    if (this.duration > 0) {
      this.tripPageObj.selectDuration(this.duration);
    }

    await this.tripPageObj.selectTours();
    await this.tripPageObj.continueBook();
  }
  // #endregion
}
