import { Selector, t } from "testcafe";

import { SelectDates } from "../../base/calendarHelper";

export default class SearchComponent {
  private startDate: Selector = Selector("[data-testid='calendar-dd-dateFrom']");

  private searchButton: Selector = Selector('button[type="submit"]');

  private tripLocationToggle: Selector = Selector(
    '[data-testid="toggleTrips-location-idAutocomplete"]'
  );

  private tripOption: Selector = Selector(
    '[data-testid="trips-location-idAutocompleteWrapper"] a[data-id]'
  );

  async fillDefaultPickupDates() {
    await t.click(this.startDate);
    await SelectDates();
  }

  async search() {
    await t.click(this.searchButton);
  }

  async selectTourLocation(tripLocation: string) {
    await t
      .typeText(this.tripLocationToggle, tripLocation)
      .click(this.tripOption.withText(tripLocation));
  }
}
