import { t, Selector } from "testcafe";

import { baseUrl } from "../../../../utils/testcafe/testcafeConstants";
import { SelectDates } from "../../base/calendarHelper";

export default class BestFlightsPageObj {
  public Url: string;

  constructor() {
    this.Url = `${baseUrl}/best-flights`;
  }

  // #region selectors
  private flightFromInput: Selector = Selector(
    '[data-testid="toggleFlightLocationPickerLargeDestinationAutocomplete"]'
  );

  private flightFromOption = Selector(
    '[data-testid="flightLocationPickerLargeDestinationAutocompleteWrapper"] a'
  );

  private flightToInput: Selector = Selector(
    "[data-testid='flightLocationPickerLargeOriginAutocomplete']"
  );

  private flightToOption: Selector = Selector(
    '[data-testid="flightLocationPickerLargeOriginAutocompleteWrapper"] a'
  );

  private startDate: Selector = Selector(
    '[data-testid="toggleMultiDateRangePickerflight-search-departure-dates-large-large"] .x-itqdrv.e1ws9bk01'
  );

  private dateIconInDataPicker: Selector = Selector('.DayPicker-Day[aria-selected="false"]');

  private searchButton: Selector = Selector('button[type="submit"]')
    .withText("Search")
    .filterVisible();

  private flightSection: Selector = Selector(
    '[data-testid="itemContainerFlight"] button[type="button"]'
  ).with({
    visibilityCheck: true,
  });

  private continueButton: Selector = Selector('[data-testid="continueBookButton"]').with({
    visibilityCheck: true,
  });

  private addInformation: Selector = Selector('#booking-widget-form button[type="button"]').with({
    visibilityCheck: true,
  });

  private flightIframe: Selector = Selector('[id*="playerWrapper"]');

  // #endregion

  // #region methods
  async selectFlightFrom(from: string) {
    await t
      .typeText(this.flightFromInput, from, {
        replace: true,
        speed: 0.4,
      })
      .click(this.flightFromOption.withText(from));
  }

  async selectFlightTo(to: string) {
    await t
      .typeText(this.flightToInput, to, {
        replace: true,
        speed: 0.4,
      })
      .click(this.flightToOption.withText(to));
  }

  async fillPickupDates(startDate: number, endDate: number) {
    await t
      .setTestSpeed(0.4)
      .click(this.startDate)
      .click(this.dateIconInDataPicker.withText(startDate.toString()))
      .click(this.dateIconInDataPicker.withText(endDate.toString()));
  }

  async fillDefaultPickupDates() {
    await t.click(this.startDate);
    await SelectDates();
  }

  async search() {
    await t.click(this.searchButton);
  }

  async selectFlight() {
    await t
      .expect(this.flightSection.visible)
      .ok({ timeout: 45000 })
      .click(this.flightSection)
      .resizeWindow(1280, 720);
  }

  async clickContinue() {
    await t.click(this.continueButton);
  }

  async clickAddInformation() {
    await t.click(this.addInformation);
  }

  async waitPageOpened() {
    await this.flightIframe();
  }

  // #endregion
}
