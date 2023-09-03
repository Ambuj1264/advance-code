import { Selector } from "testcafe";

import { baseUrl } from "../../utils/testcafe/testcafeConstants";
import {
  fixtureMobile,
  getLocation,
  scrollDown300px,
  disabledInputFix,
  fixtureDesktop,
} from "../../utils/testcafe/utils";

import { getTripsDesktopElements, getTripsMobileElements } from "./searchWidgetUtils";

const url = `${baseUrl}/book-trips-holiday`;

const SEARCH_WIDGET_CONTENT_TIMEOUT = 40000;

// DESKTOP WIDGET
fixtureDesktop("Tour search desktop widget", url);

const desktopElements = getTripsDesktopElements();
const h2 = Selector("[data-testid=searchPageTitle]").with({
  visibilityCheck: true,
});

test("Desktop search widget — location", async t => {
  await t
    .click(desktopElements.locationInput, { speed: 0.3 })
    .typeText(desktopElements.locationInput, "Reykjanes", {
      replace: true,
      speed: 0.2,
    })
    .click(desktopElements.locationDropdown.nth(0))
    .click(desktopElements.submitButton)
    .expect(h2.exists)
    .ok("", { timeout: SEARCH_WIDGET_CONTENT_TIMEOUT });

  await t.expect(getLocation()).contains("startingLocationName=Reykjanes");
});

test("Desktop search widget — dates", async t => {
  await t
    .click(desktopElements.dateFromInput, { offsetX: 100 })
    .click(desktopElements.nextMonth)
    .click(desktopElements.dateFromButton)
    .click(desktopElements.dateToButton)
    .click(desktopElements.submitButton)
    .expect(h2.exists)
    .ok("", { timeout: SEARCH_WIDGET_CONTENT_TIMEOUT });

  const currentLocation = getLocation();

  await t.expect(currentLocation).contains("dateFrom=");
  await t.expect(currentLocation).contains("dateTo=");
});

test("Desktop search widget — date to", async t => {
  await t
    .click(desktopElements.dateToInput, { offsetX: -50 })
    .click(desktopElements.nextMonth)
    .click(desktopElements.dateFromButton)
    .click(Selector("h1").with({ visibilityCheck: true }))
    .click(desktopElements.submitButton)
    .expect(h2.exists)
    .ok("", { timeout: SEARCH_WIDGET_CONTENT_TIMEOUT });

  const currentLocation = getLocation();

  await t.expect(currentLocation).notContains("dateFrom=");
  await t.expect(currentLocation).contains("dateTo=");
});

test("Desktop search widget — travellers", async t => {
  await t
    .click(desktopElements.travellersInput)
    .click(desktopElements.adultsIncrementButton)
    .click(desktopElements.childrenIncrementButton)
    .click(desktopElements.travellersInput)
    .click(desktopElements.submitButton)
    .expect(h2.exists)
    .ok("", { timeout: SEARCH_WIDGET_CONTENT_TIMEOUT });

  const currentLocation = getLocation();

  await t.expect(currentLocation).contains("adults=3");
  await t.expect(currentLocation).contains("children=1");
});

test("Desktop filters — duration", async t => {
  await t
    .click(desktopElements.durationFilter0)
    .click(desktopElements.durationFilter1)
    .expect(h2.exists)
    .ok("", { timeout: SEARCH_WIDGET_CONTENT_TIMEOUT });

  const durationFilter0Value = await desktopElements.durationFilter0.prevSibling().value;
  const durationFilter1Value = await desktopElements.durationFilter1.prevSibling().value;

  const currentLocation = getLocation();

  await t.expect(currentLocation).contains(`durationIds=${durationFilter0Value}`);
  await t.expect(currentLocation).contains(`durationIds=${durationFilter1Value}`);
});

test("Desktop filters — activities", async t => {
  await t
    .click(desktopElements.activities0)
    .click(desktopElements.activities1)
    .expect(h2.exists)
    .ok("", { timeout: SEARCH_WIDGET_CONTENT_TIMEOUT });

  const activitiesFilter0Value = await desktopElements.activities0.prevSibling().value;
  const activitiesFilter1Value = await desktopElements.activities1.prevSibling().value;

  const currentLocation = getLocation();

  await t.expect(currentLocation).contains(`activityIds=${activitiesFilter0Value}`);
  await t.expect(currentLocation).contains(`activityIds=${activitiesFilter1Value}`);
});

test("Desktop filters — attractions", async t => {
  await t
    .click(desktopElements.attractions0)
    .click(desktopElements.attractions1)
    .expect(h2.exists)
    .ok("", { timeout: SEARCH_WIDGET_CONTENT_TIMEOUT });

  const attractionsFilter0Value = await desktopElements.attractions0.prevSibling().value;
  const attractionsFilter1Value = await desktopElements.attractions1.prevSibling().value;

  const currentLocation = getLocation();

  await t.expect(currentLocation).contains(`attractionIds=${attractionsFilter0Value}`);
  await t.expect(currentLocation).contains(`attractionIds=${attractionsFilter1Value}`);
});

// MOBILE WIDGET
fixtureMobile("Tour search mobile widget", url);

const mobileElements = getTripsMobileElements();

test("Mobile search widget — location and travellers", async t => {
  await t
    .click(mobileElements.locationInputTrigger)
    .expect(mobileElements.locationInput.exists)
    .ok("", { timeout: 10000 });

  await t
    .click(mobileElements.locationInput)
    .typeText(mobileElements.locationInput, "Reykjanes", {
      replace: true,
      speed: 0.2,
    })
    .wait(1000)
    .click(mobileElements.locationDropdown.nth(0))
    .click(mobileElements.adultsIncrementButton)
    .click(mobileElements.childrenIncrementButton)
    .click(mobileElements.continueButton)
    .click(mobileElements.searchStepsButton)
    .expect(h2.exists)
    .ok("", { timeout: SEARCH_WIDGET_CONTENT_TIMEOUT });

  const currentLocation = getLocation();

  await t.expect(currentLocation).contains("startingLocationName=Reykjanes");
  await t.expect(currentLocation).contains("adults=3");
  await t.expect(currentLocation).contains("children=1");
});

test("Mobile search widget — dates", async t => {
  await t
    .click(mobileElements.dateFromInput, { offsetX: 100 })
    .click(mobileElements.dateFromButton)
    .click(mobileElements.dateToButton)
    .click(mobileElements.searchStepsButton)
    .expect(h2.exists)
    .ok("", { timeout: SEARCH_WIDGET_CONTENT_TIMEOUT });

  const currentLocation = getLocation();

  await t.expect(currentLocation).contains("dateFrom=");
  await t.expect(currentLocation).contains("dateTo=");
});

test("Mobile filters — steps", async t => {
  await scrollDown300px();
  await t
    .click(mobileElements.searchToursButton)
    .expect(mobileElements.locationInput.exists)
    .ok("", { timeout: 10000 });

  await t
    .click(mobileElements.locationInput)
    .typeText(mobileElements.locationInput, "Reykjanes", {
      replace: true,
      speed: 0.2,
    })
    .click(mobileElements.locationDropdown.nth(0))
    .click(mobileElements.adultsIncrementButton)
    .click(mobileElements.childrenIncrementButton)
    .click(mobileElements.continueButton)
    .scrollIntoView(mobileElements.datePickerSecondMonth)
    .click(mobileElements.dateFromButton)
    .click(mobileElements.dateToButton)
    .click(mobileElements.searchStepsButton)
    .expect(h2.exists)
    .ok("", { timeout: SEARCH_WIDGET_CONTENT_TIMEOUT });

  const currentLocation = getLocation();

  await t
    .expect(currentLocation)
    .contains("startingLocationName=Reykjanes")
    .expect(currentLocation)
    .contains("dateFrom=")
    .expect(currentLocation)
    .contains("dateTo=")
    .expect(currentLocation)
    .contains("adults=3")
    .expect(currentLocation)
    .contains("children=1");
});

test("Mobile filters — duration", async t => {
  await scrollDown300px();
  await t
    .click(mobileElements.addFiltersButton)
    .click(mobileElements.durationFilter0)
    .click(mobileElements.durationFilter1);

  await disabledInputFix()(mobileElements.durationFilterInputCssSelector0);
  await disabledInputFix()(mobileElements.durationFilterInputCssSelector1);

  const durationFilter0Value = await mobileElements.durationFilter0.prevSibling().value;
  const durationFilter1Value = await mobileElements.durationFilter1.prevSibling().value;
  await t
    .click(mobileElements.filterSearchButton)
    .expect(h2.exists)
    .ok("", { timeout: SEARCH_WIDGET_CONTENT_TIMEOUT });

  const currentLocation = getLocation();

  await t
    .click(mobileElements.addFiltersButton)
    .expect(currentLocation)
    .contains(`durationIds=${durationFilter0Value}`);
  await t.expect(currentLocation).contains(`durationIds=${durationFilter1Value}`);
});

test("Mobile filters — activities", async t => {
  await scrollDown300px();
  await t
    .click(mobileElements.addFiltersButton)
    .click(mobileElements.activities0)
    .click(mobileElements.activities1);

  await disabledInputFix()(mobileElements.activityFilterInputCssSelector0);
  await disabledInputFix()(mobileElements.activityFilterInputCssSelector1);

  const activitiesFilter0Value = await mobileElements.activities0.prevSibling().value;
  const activitiesFilter1Value = await mobileElements.activities1.prevSibling().value;

  const currentLocation = getLocation();

  await t
    .click(mobileElements.filterSearchButton)
    .expect(h2.exists)
    .ok("", { timeout: SEARCH_WIDGET_CONTENT_TIMEOUT });

  await t.expect(currentLocation).contains(`activityIds=${activitiesFilter0Value}`);
  await t.expect(currentLocation).contains(`activityIds=${activitiesFilter1Value}`);
});

test("Mobile filters — attractions", async t => {
  await scrollDown300px();
  await t
    .click(mobileElements.addFiltersButton)
    .click(mobileElements.attractions0)
    .click(mobileElements.attractions1);

  await disabledInputFix()(mobileElements.attractionFilterInputCssSelector0);
  await disabledInputFix()(mobileElements.attractionFilterInputCssSelector1);

  const attractionsFilter0Value = await mobileElements.attractions0.prevSibling().value;
  const attractionsFilter1Value = await mobileElements.attractions1.prevSibling().value;

  await t.expect(h2.exists).ok("", { timeout: SEARCH_WIDGET_CONTENT_TIMEOUT });

  const currentLocation = getLocation();

  await t.expect(currentLocation).contains(`attractionIds=${attractionsFilter0Value}`);
  await t.expect(currentLocation).contains(`attractionIds=${attractionsFilter1Value}`);
});
