import { Selector } from "testcafe";

export const selectDates = async (t: TestController) => {
  await t.click(Selector("[data-testid=calendar-dd-dateFrom]"));

  const nextMonthButton = Selector("#nextMonth").with({
    visibilityCheck: true,
  });
  const availableDates = Selector(".DayPicker-Day[aria-disabled='false']").with({
    visibilityCheck: true,
  });

  await t.click(nextMonthButton).click(availableDates.nth(0)).click(availableDates.nth(2));
};

export const startSearch = async (t: TestController) => {
  await selectDates(t);

  await t.click(Selector("[data-testid=searchButton]"));

  const elementOnSearchPage = Selector("[data-testid=searchPageTitle]").with({
    visibilityCheck: true,
  });
  await t.expect(elementOnSearchPage.exists).ok({ timeout: 45000 });
};
