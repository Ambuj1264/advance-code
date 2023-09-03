import CommandBase from "../../base/commandBase";
import SearchComponent from "../../tours/pageModel/SearchComponent";
import MainPageObj from "../pageModel/mainObj";

const mainPageObj = new MainPageObj();
const searchComponent = new SearchComponent();

export default class SearchStaysCommand extends CommandBase {
  private startDate: number;

  private endDate: number;

  private stayLocation: string;

  // #region Methods
  withPickupDates(startDate: number, endDate: number): SearchStaysCommand {
    this.startDate = startDate;
    this.endDate = endDate;
    return this;
  }

  withStayLocation(stayLocation: string) {
    this.stayLocation = stayLocation;
    return this;
  }
  // #endregion

  // #region Actions
  protected async executeUsingUI() {
    await mainPageObj.waitPageOpened();
    mainPageObj.clickStaysTab();

    if (this.stayLocation) {
      mainPageObj.selectStayLocation(this.stayLocation);
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
