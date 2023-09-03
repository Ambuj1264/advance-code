import { t, Selector } from "testcafe";

import { baseUrl } from "../../../../utils/testcafe/testcafeConstants";
import { SelectDates } from "../../base/calendarHelper";

export default class CarRentalPageObj {
  public Url: string;

  constructor() {
    this.Url = `${baseUrl}/iceland-car-rentals`;
  }

  // #region selectors
  // cant find
  private startDate: Selector = Selector("[data-testid=calendar-dd-dateFrom]");

  private endDate: Selector = Selector("[data-testid=calendar-dd-dateTo]");

  private todayIcon: Selector = Selector(".DayPicker-Day.DayPicker-Day--today");

  private dateIconInDataPicker: Selector = Selector('.DayPicker-Day[aria-selected="false"]');

  private searchButton: Selector = Selector('[data-testid="searchButton"]');

  private carThumbnail: Selector = Selector('[data-testid="imageWrapper"]', {
    visibilityCheck: true,
    timeout: 45000,
  });

  private continueBook: Selector = Selector('[data-testid="continueBookButton"]');

  // #endregion

  // #region methods
  async FillPickupDates(startDate: number, endDate: number) {
    await t
      .click(this.startDate)
      .click(this.dateIconInDataPicker.withText(startDate.toString()))
      .click(this.dateIconInDataPicker.withText(endDate.toString()));
  }

  async FillDefaultPickupDates() {
    await t.click(this.startDate);
    await SelectDates();
  }

  async Search() {
    await t.click(this.searchButton);
  }

  async SelectCar() {
    await t.click(this.carThumbnail);
  }

  async ContinueBook() {
    await t.expect(this.continueBook.visible).ok({ timeout: 45000 }).click(this.continueBook);
  }

  // #endregion
}
