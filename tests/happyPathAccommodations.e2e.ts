import { Selector } from "testcafe";

import { baseUrl } from "../utils/testcafe/testcafeConstants";
import { fixtureDesktop } from "../utils/testcafe/utils";

fixtureDesktop("Accommodation Happy Path", baseUrl).skip("Accommodation Happy Path");

test("Navigate to a accommodation and book it", async t => {
  // Navigate to Accommodation Search Page
  await t
    .maximizeWindow()
    .click("#FindstaysNavItem")
    .expect(Selector("h1").innerText)
    .eql("Accommodation in Iceland");

  // Navigate to Accommodation Category Page
  const firstCategoryHeader = await Selector("h3:first-of-type");
  const accommodationCategoryText = await firstCategoryHeader.innerText;

  await t
    .click(firstCategoryHeader)
    .expect(Selector("h1").innerText)
    .eql(accommodationCategoryText);

  // Navigate to Accommodation Page
  const firstAccommodationHeader = await Selector("h3:first-of-type");
  const accommodationText = await firstCategoryHeader.innerText;

  await t
    .click(firstAccommodationHeader)
    .maximizeWindow()
    .expect(Selector("h1").innerText)
    .eql(accommodationText);

  const nextMonthButton = Selector("#nextMonth");
  await t.expect(nextMonthButton.exists).ok();

  await t
    .click(nextMonthButton)
    .click(".DayPicker-Day[aria-disabled='false']")
    .click(".DayPicker-Body > .DayPicker-Week:nth-child(3) > .DayPicker-Day:last-child");

  const options = await Selector("[data-testid='roomDropdown']");
  await t.click(options.nth(0));

  const roomSelectOption = await Selector("span[aria-live='polite']")
    .parent()
    .child("div")
    .withText("1 room");

  await t.click(roomSelectOption);

  // const button = await Selector("button[type='button']").withText(
  //   "Request to book"
  // );
});
