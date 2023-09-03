import CommandBase from "../../base/commandBase";
import SearchComponent from "../pageModel/SearchComponent";

const searchComponent = new SearchComponent();

export default class SearchToursCommand extends CommandBase {
  private toursLocation: string;

  // #region Methods
  withToursLocation(toursLocation: string) {
    this.toursLocation = toursLocation;
    return this;
  }
  // #endregion

  // #region Actions
  protected async executeUsingUI() {
    if (this.toursLocation) {
      searchComponent.selectTourLocation(this.toursLocation);
    }

    await searchComponent.fillDefaultPickupDates();

    await searchComponent.search();
  }
  // #endregion
}
