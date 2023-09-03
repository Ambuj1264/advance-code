import CommandBase from "../../base/commandBase";
import CarRentalPageObj from "../pageModel/carRentalPageObj";

const carRentalPageObj = new CarRentalPageObj();

export default class SearchCarCommand extends CommandBase {
  protected startDate: number;

  protected endDate: number;

  protected isSetAgreed = false;

  protected isReserve = true;

  // #region Methods
  withPickupDates(startDate: number, endDate: number): SearchCarCommand {
    this.startDate = startDate;
    this.endDate = endDate;
    return this;
  }
  // #endregion

  // #region Actions
  protected async executeUsingUI() {
    if (this.startDate && this.endDate) {
      await carRentalPageObj.FillPickupDates(this.startDate, this.endDate);
    } else {
      await carRentalPageObj.FillDefaultPickupDates();
    }

    await carRentalPageObj.Search();

    await carRentalPageObj.SelectCar();
    await carRentalPageObj.ContinueBook();
  }
  // #endregion
}
