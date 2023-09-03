import CommandBase from "../../base/commandBase";
import BestFlightsObj from "../pageModel/bestFlightsObj";

const bestFlightsObj = new BestFlightsObj();

export default class SearchFlightCommand extends CommandBase {
  protected startDate: number;

  protected endDate: number;

  protected flightFrom: string;

  protected flightTo: string;

  protected isSetAgreed = false;

  protected isReserve = true;

  // #region Methods
  withFlightFrom(flightFrom: string): SearchFlightCommand {
    this.flightFrom = flightFrom;
    return this;
  }

  withFlightTo(flightTo: string): SearchFlightCommand {
    this.flightTo = flightTo;
    return this;
  }

  withPickupDates(startDate: number, endDate: number): SearchFlightCommand {
    this.startDate = startDate;
    this.endDate = endDate;
    return this;
  }
  // #endregion

  // #region Actions
  protected async executeUsingUI() {
    await bestFlightsObj.waitPageOpened();

    if (this.flightFrom) {
      await bestFlightsObj.selectFlightFrom(this.flightFrom);
    }

    if (this.flightTo) {
      await bestFlightsObj.selectFlightTo(this.flightTo);
    }

    if (this.startDate && this.endDate) {
      await bestFlightsObj.fillPickupDates(this.startDate, this.endDate);
    } else {
      await bestFlightsObj.fillDefaultPickupDates();
    }

    await bestFlightsObj.search();
    await bestFlightsObj.selectFlight();
    await bestFlightsObj.clickAddInformation();
  }
  // #endregion
}
