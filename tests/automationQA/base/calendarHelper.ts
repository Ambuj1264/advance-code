import { t, Selector } from "testcafe";

export async function SelectDates() {
  const nextMonthButton = Selector("#nextMonth").with({
    visibilityCheck: true,
  });
  const availableDates = Selector(".DayPicker-Day[aria-disabled='false']").with({
    visibilityCheck: true,
  });

  await t.click(nextMonthButton).click(availableDates.nth(0)).click(availableDates.nth(14));
}
