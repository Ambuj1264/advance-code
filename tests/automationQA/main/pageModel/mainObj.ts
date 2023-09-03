import { Selector, t } from "testcafe";

import { baseUrl } from "../../../../utils/testcafe/testcafeConstants";
import Waiters from "../../base/waiters";
import VacationPackagesObj from "../../tours/pageModel/vacationPackagesObj";

const vacationPageObj = new VacationPackagesObj();

export default class MainPageObj {
  public Url: string;

  constructor() {
    this.Url = `${baseUrl}`;
  }

  // #region selectors
  private staysTab: Selector = Selector('[data-id="1"]');

  private staysLocationToggle: Selector = Selector('[data-testid="stays-location-idAutocomplete"]');

  private staysOption = this.staysLocationToggle.find("a[data-id]");

  private tripTab: Selector = Selector('[data-id="0"]');

  private tripLocationToggle: Selector = Selector(
    '[data-testid="toggleTrips-location-idAutocomplete"]'
  );

  private tripOption: Selector = Selector(
    '[data-testid="trips-location-idAutocompleteWrapper"] a[data-id]'
  );

  private startDate: Selector = Selector("[data-testid='calendar-dd-dateFrom']");

  private dateIconInDataPicker: Selector = Selector('.DayPicker-Day[aria-selected="false"]');

  private searchIframe = '[id*="playerWrapper"]';

  private cartIcon: Selector = Selector('[id*="navBardesktopCart"]');

  private rootEmptyCartPopUp: Selector = Selector('[data-testid="popoverInner"]');

  private cartPopUpMessage = this.rootEmptyCartPopUp.find('[data-testid="cartEmptyText"]');

  private getVacationIcon: Selector = Selector("#GetavacationNavItem");
  // #endregion

  // #region methods
  async clickStaysTab() {
    await t.click(this.staysTab);
  }

  async clickToursTab() {
    await t.click(this.tripTab);
  }

  async selectStayLocation(staysLocation: string) {
    await t
      .typeText(this.staysLocationToggle, staysLocation)
      .click(this.staysOption.withText(staysLocation));
  }

  async selectTourLocation(tripLocation: string) {
    await t
      .typeText(this.tripLocationToggle, tripLocation)
      .click(this.tripOption.withText(tripLocation));
  }

  async fillPickupDates(startDate: number, endDate: number) {
    await t
      .click(this.startDate)
      .click(this.dateIconInDataPicker.withText(startDate.toString()))
      .click(this.dateIconInDataPicker.withText(endDate.toString()));
  }

  async waitPageOpened(): Promise<boolean> {
    const state = await Waiters.waitElementVisible(this.searchIframe);
    return state;
  }

  async clickCartIcon() {
    await t.click(this.cartIcon);
  }

  async waitCartPopOpened(): Promise<boolean> {
    const state = await Waiters.waitSelectorVisible(this.rootEmptyCartPopUp);
    return state;
  }

  async readCartPopUpMessage(): Promise<string> {
    const text = await this.cartPopUpMessage.innerText;
    return text;
  }

  async openPage() {
    await t.navigateTo(this.Url);
  }

  async clickGetVacation(): Promise<VacationPackagesObj> {
    await t.click(this.getVacationIcon);

    await vacationPageObj.waitPageDisplayed();

    return vacationPageObj;
  }

  // #endregion
}
