import { Selector } from "testcafe";

import { baseUrl } from "../utils/testcafe/testcafeConstants";
import { fixtureDesktop } from "../utils/testcafe/utils";

fixtureDesktop("Tours Happy Path", baseUrl).skip("Tours Happy Path");

test("Navigate to a tour and book it", async t => {
  await t
    .maximizeWindow()
    .click("#GetavacationNavItem")
    .expect(Selector("h1").innerText)
    .eql("Vacation Packages");

  const firstTourHeader = await Selector("h3:first-of-type");
  const tourHeaderText = await firstTourHeader.innerText;

  await t.click(firstTourHeader).expect(Selector("h1").innerText).eql(tourHeaderText);

  await t
    .click("#nextMonth")
    .click(".DayPicker-Day[aria-disabled='false']")
    .click("#booking-widget-form button[type='submit']")
    .expect(Selector("h3.heading-cart_new-funnel").innerText)
    .eql("Complete your reservation")
    .expect(Selector(".info-base-title").innerText)
    .eql(tourHeaderText);
});
