import CommandBase from "../../base/commandBase";
import SearchComponent from "../../tours/pageModel/SearchComponent";
import MainPageObj from "../pageModel/mainObj";

const mainPageObj = new MainPageObj();
const searchComponent = new SearchComponent();

export default class SearchToursCommand extends CommandBase {
  private startDate: number;

  private endDate: number;

  private toursLocation: string;

  // #region Methods
  withPickupDates(startDate: number, endDate: number): SearchToursCommand {
    this.startDate = startDate;
    this.endDate = endDate;
    return this;
  }

  withToursLocation(toursLocation: string) {
    this.toursLocation = toursLocation;
    return this;
  }
  // #endregion

  // #region Actions
  protected async executeUsingUI() {
    await mainPageObj.waitPageOpened();
    await mainPageObj.clickToursTab();

    if (this.toursLocation) {
      await mainPageObj.selectTourLocation(this.toursLocation);
    }

    if (this.startDate && this.endDate) {
      await mainPageObj.fillPickupDates(this.startDate, this.endDate);
    } else {
      await searchComponent.fillDefaultPickupDates();
    }

    await searchComponent.search();
  }
  // #endregion
}
