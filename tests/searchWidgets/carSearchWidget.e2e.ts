import { Selector } from "testcafe";

import { baseUrl } from "../../utils/testcafe/testcafeConstants";
import {
  disabledInputFix,
  fixtureDesktop,
  fixtureMobile,
  getLocation,
  scrollDown300px,
} from "../../utils/testcafe/utils";

import {
  getCarLandingDesktopElements,
  getCarLandingMobileElements,
  getCarSearchDesktopElements,
} from "./searchWidgetUtils";

const landingUrl = `${baseUrl}/iceland-car-rentals`;
const searchUrl = `${baseUrl}/iceland-car-rentals?driverAge=45&driverCountryCode=IS&dropoffId=701%2C2&pickupId=701%2C2&dropoffLocationName=Keflavik&pickupLocationName=Keflavik`;

const SEARCH_RESULTS_TIMEOUT = 45000;

// DESKTOP WIDGET
fixtureDesktop("Car search landing desktop widget", landingUrl);

const landingDesktopElements = getCarLandingDesktopElements();
const searchDesktopElements = getCarSearchDesktopElements();
const h2 = Selector("h2")
  .withText("cars match your search")
  .with({ visibilityCheck: true, timeout: SEARCH_RESULTS_TIMEOUT });
const errorTooltip = Selector("[data-testid='searchWidgetTooltip']")
  .with({ visibilityCheck: true })
  .nth(0);
const errorMobileTooltip = Selector("[data-testid='searchWidgetModalTooltip']")
  .with({ visibilityCheck: true })
  .nth(0);

test("Landing Page — Location", async t => {
  await t
    .click(landingDesktopElements.pickupLocationInput, { offsetX: 50 })
    .typeText(landingDesktopElements.pickupLocationInput, "reykjavik", {
      replace: true,
      speed: 0.3,
    })
    .click(landingDesktopElements.pickupLocationDropdown.nth(0))
    .click(landingDesktopElements.dropoffLocationInput, { offsetX: 50 })
    .typeText(landingDesktopElements.dropoffLocationInput, "reykjavik", {
      replace: true,
      speed: 0.3,
    })
    .click(landingDesktopElements.dropoffLocationDropdown.nth(0))
    .click(landingDesktopElements.submitButton)
    .expect(errorTooltip.exists)
    .ok("", { timeout: SEARCH_RESULTS_TIMEOUT });
});

test("Landing page — dates", async t => {
  await t
    .click(landingDesktopElements.dateFromInput, { offsetX: 100 })
    .click(landingDesktopElements.nextMonth)
    .click(landingDesktopElements.dateFromButton)
    .click(landingDesktopElements.dateToButton)
    .click(landingDesktopElements.submitButton)
    .expect(h2.exists)
    .ok("", { timeout: SEARCH_RESULTS_TIMEOUT });

  await t.expect(getLocation()).contains("dateFrom=");
  await t.expect(getLocation()).contains("dateTo=");
});

test("Landing page — driver's age", async t => {
  await t
    .click(landingDesktopElements.driverAge, { speed: 0.5 })
    .wait(1000)
    .expect(landingDesktopElements.driverAgeValue.exists)
    .ok({ timeout: 10000 })
    .click(landingDesktopElements.driverAgeValue)
    .click(landingDesktopElements.submitButton)
    .expect(errorTooltip.exists)
    .ok("", { timeout: SEARCH_RESULTS_TIMEOUT });
});

test("Landing page — driver's country", async t => {
  await t
    .click(landingDesktopElements.driverCountryFakeDropdown, { speed: 0.5 })
    .wait(1000)
    .click(landingDesktopElements.driverCountryValue)
    .click(landingDesktopElements.submitButton)
    .expect(errorTooltip.exists)
    .ok("", { timeout: SEARCH_RESULTS_TIMEOUT });
});

test("Landing page — perform search", async t => {
  await t
    .click(landingDesktopElements.pickupLocationInput, { offsetX: 50 })
    .typeText(landingDesktopElements.pickupLocationInput, "reykjavik", {
      replace: true,
      speed: 0.3,
    })
    .click(landingDesktopElements.pickupLocationDropdown.nth(0))
    .click(landingDesktopElements.dropoffLocationInput, { offsetX: 50 })
    .typeText(landingDesktopElements.dropoffLocationInput, "reykjavik", {
      replace: true,
      speed: 0.3,
    })
    .click(landingDesktopElements.dropoffLocationDropdown.nth(0))
    .click(landingDesktopElements.dateFromInput, { offsetX: 100 })
    .click(landingDesktopElements.nextMonth)
    .click(landingDesktopElements.dateFromButton)
    .click(landingDesktopElements.dateToButton)
    .click(landingDesktopElements.driverAge)
    .click(landingDesktopElements.driverAgeValue)
    .click(landingDesktopElements.driverCountryFakeDropdown)
    .click(landingDesktopElements.driverCountryValue)
    .click(landingDesktopElements.submitButton)
    .expect(h2.exists)
    .ok("", { timeout: SEARCH_RESULTS_TIMEOUT });

  await t.expect(getLocation()).contains("dropoffId=");
  await t.expect(getLocation()).contains("pickupId=");
  await t.expect(getLocation()).contains("dateFrom=");
  await t.expect(getLocation()).contains("dateTo=");
  await t.expect(getLocation()).contains("driverAge=19");
  await t.expect(getLocation()).contains("driverCountryCode=US");
});

fixtureDesktop("Car search desktop widget", searchUrl);

test("Search page — location", async t => {
  await t
    .typeText(searchDesktopElements.pickupLocationInput, "reykjavik", {
      replace: true,
      speed: 0.4,
    })
    .click(searchDesktopElements.pickupLocationDropdown)
    .typeText(searchDesktopElements.dropoffLocationInput, "reykjavik", {
      replace: true,
      speed: 0.4,
    })
    .click(searchDesktopElements.dropoffLocationDropdown)
    .click(searchDesktopElements.submitButton)
    .expect(errorTooltip.exists)
    .ok("", { timeout: SEARCH_RESULTS_TIMEOUT });
});

test("Search page — dates", async t => {
  // We expect location to be prefilled here so submit should work
  await t
    .click(searchDesktopElements.dateFromInput, { offsetX: 100 })
    .click(searchDesktopElements.nextMonth)
    .click(searchDesktopElements.dateFromButton)
    .click(searchDesktopElements.dateToButton)
    .click(searchDesktopElements.submitButton)
    .expect(h2.textContent)
    .match(/\d+ cars match your search/);

  await t.expect(getLocation()).contains("dateFrom=");
  await t.expect(getLocation()).contains("dateTo=");
});

test("Search page — driver's age", async t => {
  await t
    .click(searchDesktopElements.driverAge)
    .wait(1000)
    .click(searchDesktopElements.driverAgeValue)
    .click(searchDesktopElements.submitButton)
    .expect(errorTooltip.exists)
    .ok("", { timeout: SEARCH_RESULTS_TIMEOUT });
});

test("Search page — driver's country", async t => {
  await t
    .click(searchDesktopElements.driverCountryDummy)
    .click(searchDesktopElements.driverCountryValue)
    .click(searchDesktopElements.submitButton)
    .expect(errorTooltip.exists)
    .ok("", { timeout: SEARCH_RESULTS_TIMEOUT });
});

test("Search page — perform search", async t => {
  await t
    .typeText(searchDesktopElements.pickupLocationInput, "reykjavik", {
      replace: true,
      speed: 0.4,
    })
    .click(searchDesktopElements.pickupLocationDropdown)
    .typeText(searchDesktopElements.dropoffLocationInput, "reykjavik", {
      replace: true,
      speed: 0.4,
    })
    .click(searchDesktopElements.dropoffLocationDropdown)
    .click(searchDesktopElements.dateFromInput, { offsetX: 100 })
    .click(searchDesktopElements.nextMonth)
    .click(searchDesktopElements.dateFromButton)
    .click(searchDesktopElements.dateToButton)
    .click(searchDesktopElements.driverAge)
    .click(searchDesktopElements.driverAgeValue)
    .click(searchDesktopElements.driverCountryDummy)
    .wait(500)
    .click(searchDesktopElements.driverCountryValue)
    .click(searchDesktopElements.submitButton)
    .expect(h2.textContent)
    .match(/\d+ cars match your search/);

  await t.expect(getLocation()).contains("dropoffId=");
  await t.expect(getLocation()).contains("pickupId=");
  await t.expect(getLocation()).contains("dateFrom=");
  await t.expect(getLocation()).contains("dateTo=");
  await t.expect(getLocation()).contains("driverAge=19");
  await t.expect(getLocation()).contains("driverCountryCode=US");
});

// MOBILE WIDGET
fixtureMobile("Car search landing mobile widget", landingUrl);

const landingMobileElements = getCarLandingMobileElements();

test("Landing page — location", async t => {
  await disabledInputFix()(landingMobileElements.pickupLocationInputCssSelector);
  await t
    .click(landingMobileElements.pickupLocationInputTrigger, {
      offsetX: 100,
    })
    .click(landingMobileElements.pickupLocationInput)
    .typeText(landingMobileElements.pickupLocationInput, "reykjavik", {
      replace: true,
      speed: 0.4,
    })
    .click(landingMobileElements.pickupLocationInputValue)
    .click(landingMobileElements.continueButton)
    .click(landingMobileElements.dateFromButton)
    .click(landingMobileElements.seeResultsButton)
    .expect(errorMobileTooltip.visible)
    .ok("", { timeout: SEARCH_RESULTS_TIMEOUT });
});

test("Landing page — dates", async t => {
  await t
    .click(landingMobileElements.dateFromInput, { offsetX: 100 })
    .click(landingMobileElements.dateFromButton)
    .click(landingMobileElements.dateToButton)
    .click(landingMobileElements.seeResultsButton)
    .expect(h2.textContent)
    .match(/\d+ cars match your search/);

  const currentLocation = getLocation();

  await t.expect(currentLocation).contains("dateFrom=");
  await t.expect(currentLocation).contains("dateTo=");
});

test("Landing page — driver's age", async t => {
  await t
    .click(landingMobileElements.driverAge)
    .click(landingMobileElements.driverAgeValue)
    .click(landingMobileElements.submitButton)
    .expect(landingMobileElements.dateFromButton.visible)
    .ok("", { timeout: SEARCH_RESULTS_TIMEOUT });
});

test("Landing page — driver's country", async t => {
  await t
    .click(landingMobileElements.driverCountry)
    .click(landingMobileElements.driverCountryValue)
    .click(landingMobileElements.submitButton)
    .expect(landingMobileElements.dateFromButton.visible)
    .ok("", { timeout: SEARCH_RESULTS_TIMEOUT });
});

test("Landing page — perform search", async t => {
  await disabledInputFix()(landingMobileElements.pickupLocationInputCssSelector);
  await t
    .click(landingMobileElements.pickupLocationInputTrigger)
    .click(landingMobileElements.pickupLocationInput)
    .typeText(landingMobileElements.pickupLocationInput, "reykjavik", {
      replace: true,
      speed: 0.4,
    })
    .click(landingMobileElements.pickupLocationInputValue)
    .click(landingMobileElements.dropoffLocationInput)
    .typeText(landingMobileElements.dropoffLocationInput, "reykjavik", {
      replace: true,
      speed: 0.4,
    })
    .click(landingMobileElements.dropoffLocationInputValue)
    .click(landingMobileElements.driverAgeModal)
    .click(landingMobileElements.driverAgeValueModal)
    .click(landingMobileElements.driverCountryModal)
    .click(landingMobileElements.driverCountryValueModal)
    .click(landingMobileElements.continueButton)
    .click(landingMobileElements.dateFromButton)
    .click(landingMobileElements.dateToButton)
    .click(landingMobileElements.seeResultsButton)
    .expect(h2.textContent)
    .match(/\d+ cars match your search/);

  const currentLocation = getLocation();

  await t.expect(currentLocation).contains("dropoffId=");
  await t.expect(currentLocation).contains("pickupId=");
  await t.expect(currentLocation).contains("dateFrom=");
  await t.expect(currentLocation).contains("dateTo=");
  await t.expect(currentLocation).contains("driverAge=19");
  await t.expect(currentLocation).contains("driverCountryCode=US");
});

fixtureMobile("Car search mobile widget steps", searchUrl);

test("Search page — perform search", async t => {
  await scrollDown300px();
  await t
    .click(landingMobileElements.findCarsButton)
    .click(landingMobileElements.pickupLocationInput)
    .click(landingMobileElements.pickupLocationInputValue)
    .click(landingMobileElements.dropoffLocationInput)
    .click(landingMobileElements.dropoffLocationInputValue)
    .click(landingMobileElements.driverAgeModal)
    .click(landingMobileElements.driverAgeValueModal)
    .wait(500)
    .click(landingMobileElements.driverCountryModal)
    .click(landingMobileElements.driverCountryValueModal)
    .click(landingMobileElements.continueButton)
    .scrollIntoView(landingMobileElements.datePickerSecondMonth)
    .click(landingMobileElements.dateFromButton)
    .click(landingMobileElements.dateToButton)
    .click(landingMobileElements.seeResultsButton)
    .expect(h2.textContent)
    .match(/\d+ cars match your search/);

  const currentLocation = getLocation();

  await t.expect(currentLocation).contains("dropoffId=");
  await t.expect(currentLocation).contains("pickupId=");
  await t.expect(currentLocation).contains("dateFrom=");
  await t.expect(currentLocation).contains("dateTo=");
  await t.expect(currentLocation).contains("driverAge=19");
  await t.expect(currentLocation).contains("driverCountryCode=US");
});
