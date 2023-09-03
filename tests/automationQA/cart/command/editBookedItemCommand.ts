import CommandBase from "../../base/commandBase";
import CartPageObj from "../pageModel/cartPageObj";
import TripsPageObj from "../../tours/pageModel/tripsObj";

const cartPageObj = new CartPageObj();
const tripPageObj = new TripsPageObj();

export default class EditBookedItemCommand extends CommandBase {
  protected name: string;

  protected tourLink: string;

  protected isBook = false;

  // #region Methods
  withName(name: string): EditBookedItemCommand {
    this.name = name;
    return this;
  }

  withLink(tourLink: string): EditBookedItemCommand {
    this.tourLink = tourLink;
    return this;
  }

  withBook(): EditBookedItemCommand {
    this.isBook = true;
    return this;
  }
  // #endregion

  // #region Actions
  protected async executeUsingUI() {
    await cartPageObj.clickEditIcon(this.name);

    if (this.isBook) {
      await tripPageObj.waitWhilePageDisplays(this.tourLink);
      await tripPageObj.selectDates();
      await tripPageObj.continueBook();
    }
  }
  // #endregion
}
