import { t, Selector, ClientFunction } from "testcafe";

import { baseUrl } from "../../../../utils/testcafe/testcafeConstants";
import { FormatString } from "../../base/stringHelper";

const getLocation = ClientFunction(() => document.location.href);

export default class TripsPageObj {
  public Url: string;

  constructor() {
    this.Url = `${baseUrl}/book-trips-holiday`;
  }

  // #region selectors
  private toursThumbnail: Selector = Selector('[data-testid="imageWrapper"]');

  private continueBookButton: Selector = Selector(
    'button:enabled[data-testid="continueBookButton"]'
  );

  private nextMonthButton = Selector("#nextMonth");

  private durationFilter = "[for='filterButton{0}']";
  // #endregion

  // #region methods
  // eslint-disable-next-line class-methods-use-this
  async waitWhilePageDisplays(tourLink: string) {
    await t.expect(getLocation()).contains(tourLink, { timeout: 45000 });
  }

  async selectTours() {
    await t
      .expect(this.toursThumbnail.exists)
      .ok({ timeout: 45000 })
      .click(this.toursThumbnail)
      .resizeWindow(1280, 720);
  }

  async continueBook() {
    await t.expect(this.continueBookButton.exists).ok({ timeout: 45000 });
    await t.click(this.continueBookButton);
  }

  async selectDates() {
    await t.click(this.nextMonthButton).click(".DayPicker-Day[aria-disabled='false']");
  }

  async selectDuration(duration: number) {
    const selector = FormatString(this.durationFilter, duration.toString());
    await t.click(selector);
  }
  // #endregion
}
