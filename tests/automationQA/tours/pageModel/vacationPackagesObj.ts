import { Selector } from "testcafe";

import { baseUrl } from "../../../../utils/testcafe/testcafeConstants";
import { Envs } from "../../../funcTests/const/envs";

import TripsPageObj from "./tripsObj";

export default class VacationPackagesObj extends TripsPageObj {
  public Url: string;

  constructor() {
    super();
    this.Url = `${baseUrl}/book-trips-holiday/holidays-vacation-packages`;
  }

  // #region selectors
  public pageTitle: Selector = Selector("h1")
    .withText("Vacation Packages")
    .with({
      visibilityCheck: true,
      ...(baseUrl.includes(Envs.ProdGTI) ? {} : { timeout: 30000 }),
    });
  // #endregion

  // #region methods
  async waitPageDisplayed(): Promise<any> {
    return this.pageTitle.innerText;
  }
  // #endregion
}
