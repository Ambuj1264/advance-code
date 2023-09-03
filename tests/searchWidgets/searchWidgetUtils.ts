import { Selector } from "testcafe";

export const getTripsDesktopElements = () => {
  const searchWidgetDesktopRoot = Selector("input[name='roundedTabsRadio']").parent();

  // location selectors
  const locationInput = searchWidgetDesktopRoot.find(
    "div[data-testid='toggleTrips-location-idAutocomplete'] input[type='search']"
  );
  const locationDropdown = searchWidgetDesktopRoot.find(
    "[data-testid='trips-location-idAutocompleteWrapper'] a"
  );

  // date picker selectors
  const dateFromInput = searchWidgetDesktopRoot.find("span").withText("Starting date");
  const dateToInput = searchWidgetDesktopRoot.find("span").withText("Final date");
  const nextMonth = searchWidgetDesktopRoot.find("#nextMonth").with({ visibilityCheck: true });
  const dateFromButton = searchWidgetDesktopRoot
    .find(".DayPicker-Day")
    .withText("10")
    .with({ visibilityCheck: true });
  const dateToButton = searchWidgetDesktopRoot
    .find(".DayPicker-Day")
    .withText("17")
    .with({ visibilityCheck: true });

  // travellers selectors
  const travellersInput = searchWidgetDesktopRoot.find(
    "[data-testid='toggleTravelersTravellerPicker']"
  );
  const adultsIncrementButton = searchWidgetDesktopRoot
    .find("#adultsIncrement")
    .with({ visibilityCheck: true });
  const childrenIncrementButton = searchWidgetDesktopRoot
    .find("#childrenIncrement")
    .with({ visibilityCheck: true });

  // filter selectors
  const searchFiltersDesktopRoot = Selector("[data-testid='searchFiltersDesktopContainer']");
  const durationFilter0 = searchFiltersDesktopRoot.find("label[for='filterButton1']");
  const durationFilter1 = searchFiltersDesktopRoot.find("label[for='filterButton2']");

  const activities0 = searchFiltersDesktopRoot.find("input[name='activityIds'] ~ label").nth(1);
  const activities1 = searchFiltersDesktopRoot.find("input[name='activityIds'] ~ label").nth(2);
  const attractions0 = searchFiltersDesktopRoot.find("input[name='attractionIds'] ~ label").nth(1);
  const attractions1 = searchFiltersDesktopRoot.find("input[name='attractionIds'] ~ label").nth(2);

  // other
  const submitButton = searchWidgetDesktopRoot.find("button[type='submit']");

  return {
    locationInput,
    locationDropdown,
    dateFromInput,
    dateToInput,
    nextMonth,
    dateFromButton,
    dateToButton,
    travellersInput,
    adultsIncrementButton,
    childrenIncrementButton,
    durationFilter0,
    durationFilter1,
    activities0,
    activities1,
    attractions0,
    attractions1,
    submitButton,
  };
};

export const getTripsMobileElements = () => {
  const searchWidgetMobileRoot = Selector("[data-testid='tripsTab']");

  const searchModalRoot = Selector("#searchWidgetModal", {
    visibilityCheck: true,
  });
  const filterModalRoot = Selector("#filter-modal", {
    visibilityCheck: true,
  });
  const addFiltersButton = Selector("#stickyFooter button", {
    visibilityCheck: true,
  }).nth(1);
  const addTravelDetailsButton = Selector("#stickyFooter button", {
    visibilityCheck: true,
  }).nth(0);

  const searchToursButton = Selector("#stickyFooter button", {
    visibilityCheck: true,
  }).nth(0);

  const searchStepsButton = searchModalRoot.find("button").withText("Search");

  // location selectors
  const locationInputTrigger = searchWidgetMobileRoot.find(
    "[data-testid='toggleTrips-location-idAutocomplete']"
  );
  const locationInput = searchModalRoot.find(
    "[data-testid='toggleAutocompleteAutocomplete'] input[type='search']"
  );
  const locationDropdown = searchModalRoot.find(
    "[data-testid='autocompleteAutocompleteWrapper'] a"
  );

  // date picker selectors
  const dateFromInput = searchWidgetMobileRoot.find("span").withText("Starting date");
  const dateToInput = searchWidgetMobileRoot.find("span").withText("Final date");
  const datePickerSecondMonth = searchModalRoot.find(".DayPicker-Month:nth-child(2)");

  const dateFromButton = datePickerSecondMonth.find(".DayPicker-Day").withText("10");
  const dateToButton = datePickerSecondMonth.find(".DayPicker-Day").withText("17");

  // travellers selectors
  const travellersInput = searchWidgetMobileRoot.find(
    "[data-testid='toggleTravelersTravellerPicker']"
  );
  const adultsIncrementButton = searchModalRoot.find("#adultsIncrement");
  const childrenIncrementButton = searchModalRoot.find("#childrenIncrement");

  // filter selectors
  const durationFilter0 = filterModalRoot.find("label[for='filterButton1']");
  const durationFilter1 = filterModalRoot.find("label[for='filterButton2']");

  const durationFilterInputCssSelector0 = "#filter-modal #filterButton1";
  const durationFilterInputCssSelector1 = "#filter-modal #filterButton2";

  const activities0 = filterModalRoot.find(
    "[data-testid='activityIds-options'] > div > div:nth-of-type(1) label"
  );
  const activities1 = filterModalRoot.find(
    "[data-testid='activityIds-options'] > div > div:nth-of-type(2) label"
  );

  const activityFilterInputCssSelector0 =
    "#filter-modal [data-testid='activityIds-options'] > div > div:nth-of-type(1) input[name='activityIds']";
  const activityFilterInputCssSelector1 =
    "#filter-modal [data-testid='activityIds-options'] > div > div:nth-of-type(2) input[name='activityIds']";

  const attractions0 = filterModalRoot.find(
    "[data-testid='attractionIds-options'] > div > div:nth-of-type(1) label"
  );
  const attractions1 = filterModalRoot.find(
    "[data-testid='attractionIds-options'] > div > div:nth-of-type(2) label"
  );
  const attractionFilterInputCssSelector0 =
    "#filter-modal [data-testid='attractionIds-options'] > div > div:nth-of-type(1) input[name='attractionIds']";
  const attractionFilterInputCssSelector1 =
    "#filter-modal [data-testid='attractionIds-options'] > div > div:nth-of-type(2) input[name='attractionIds']";

  // other
  const submitButton = searchWidgetMobileRoot.find("button[type='submit']");
  const continueButton = searchModalRoot.find("button").withText("Continue");
  const applyButton = searchModalRoot.find("button").withText("Apply");
  const filterSearchButton = filterModalRoot.find("#filterModalButton");

  return {
    searchStepsButton,
    locationInputTrigger,
    locationInput,
    locationDropdown,
    dateFromInput,
    dateToInput,
    datePickerSecondMonth,
    dateFromButton,
    dateToButton,
    travellersInput,
    adultsIncrementButton,
    childrenIncrementButton,
    durationFilter0,
    durationFilter1,
    activities0,
    activities1,
    attractions0,
    attractions1,
    submitButton,
    continueButton,
    applyButton,
    addFiltersButton,
    addTravelDetailsButton,
    searchToursButton,
    filterSearchButton,
    durationFilterInputCssSelector0,
    durationFilterInputCssSelector1,
    activityFilterInputCssSelector0,
    activityFilterInputCssSelector1,
    attractionFilterInputCssSelector0,
    attractionFilterInputCssSelector1,
  };
};

export const getCarLandingDesktopElements = () => {
  const carSearchWidgetDesktopRoot = Selector("[data-testid='carsTab']").nth(0);

  // location selectors
  const pickupLocationInput = carSearchWidgetDesktopRoot.find(
    "div[data-testid='toggleCars-pickup-location-idAutocomplete'] input[type='search']"
  );
  const dropoffLocationInput = carSearchWidgetDesktopRoot.find(
    "div[data-testid='toggleCars-dropoff-location-idAutocomplete'] input[type='search']"
  );
  const pickupLocationDropdown = carSearchWidgetDesktopRoot
    .find("[data-testid='cars-pickup-location-idAutocompleteWrapper'] a")
    .nth(0)
    .with({ visibilityCheck: true });
  const dropoffLocationDropdown = carSearchWidgetDesktopRoot
    .find("[data-testid='cars-dropoff-location-idAutocompleteWrapper'] a")
    .nth(0)
    .with({ visibilityCheck: true });
  // date picker selectors
  const dateFromInput = carSearchWidgetDesktopRoot.find("span").withText("Pick up");
  const dateToInput = carSearchWidgetDesktopRoot.find("span").withText("Drop off");
  const nextMonth = carSearchWidgetDesktopRoot.find("#nextMonth").with({ visibilityCheck: true });
  const dateFromButton = carSearchWidgetDesktopRoot
    .find(".DayPicker-Day")
    .withText("10")
    .with({ visibilityCheck: true });
  const dateToButton = carSearchWidgetDesktopRoot
    .find(".DayPicker-Day")
    .withText("17")
    .with({ visibilityCheck: true });

  // driver's age and country
  const driverAge = Selector("#countryDriverAgeDropdown", {
    visibilityCheck: true,
  });
  const driverAgeValue = Selector("[id^=react-select-][tabindex='-1']", {
    visibilityCheck: true,
  }).withText("19");
  const driverCountryFakeDropdown = Selector("#countryDriverCountryDropdown-initial");
  const driverCountryDropdown = Selector("#countryDriverCountryDropdown", {
    visibilityCheck: true,
  });
  const driverCountryValue = Selector("[id^=react-select-][tabindex='-1']", {
    visibilityCheck: true,
  }).withText("the United States");

  // other
  const submitButton = carSearchWidgetDesktopRoot.find("button[type='submit']");

  return {
    pickupLocationInput,
    dropoffLocationInput,
    pickupLocationDropdown,
    dropoffLocationDropdown,
    dateFromInput,
    dateToInput,
    nextMonth,
    dateFromButton,
    dateToButton,
    driverAge,
    driverAgeValue,
    driverCountryFakeDropdown,
    driverCountryDropdown,
    driverCountryValue,
    submitButton,
  };
};

export const getCarSearchDesktopElements = () => {
  const carSearchWidgetDesktopRoot = Selector(
    "form[autocomplete='off'][action='?'][target='_top']"
  ).nth(0);

  // location selectors
  const pickupLocationInput = carSearchWidgetDesktopRoot.find(
    "[data-testid='cars-pickup-location-idAutocomplete'] input[type='search']"
  );
  const dropoffLocationInput = carSearchWidgetDesktopRoot.find(
    "[data-testid='cars-dropoff-location-idAutocomplete'] input[type='search']"
  );
  const pickupLocationDropdown = carSearchWidgetDesktopRoot
    .find("[data-testid='cars-pickup-location-idAutocompleteWrapper'] a")
    .nth(0)
    .with({ visibilityCheck: true });
  const dropoffLocationDropdown = carSearchWidgetDesktopRoot
    .find("[data-testid='cars-dropoff-location-idAutocompleteWrapper'] a")
    .nth(0)
    .with({ visibilityCheck: true });

  // date picker selectors
  const dateFromInput = carSearchWidgetDesktopRoot.find("span").withText("Pick-up");
  const dateToInput = carSearchWidgetDesktopRoot.find("span").withText("Drop-off");
  const nextMonth = carSearchWidgetDesktopRoot.find("#nextMonth").with({ visibilityCheck: true });
  const dateFromButton = carSearchWidgetDesktopRoot
    .find(".DayPicker-Day")
    .withText("10")
    .nth(0)
    .with({ visibilityCheck: true });
  const dateToButton = carSearchWidgetDesktopRoot
    .find(".DayPicker-Day")
    .withText("17")
    .nth(0)
    .with({ visibilityCheck: true });

  // driver's age and country
  const driverAge = Selector("#driverAgeDropdown");
  const driverAgeValue = Selector("[id^=react-select-][tabindex='-1']", {
    visibilityCheck: true,
  }).withText("19");
  const driverCountryDummy = Selector("#driverCountryDropdown-initial");
  const driverCountry = Selector("#driverCountryDropdown").with({
    visibilityCheck: true,
  });
  const driverCountryValue = Selector("[id^=react-select-][tabindex='-1']", {
    visibilityCheck: true,
  }).withText("the United States");

  // other
  const submitButton = carSearchWidgetDesktopRoot.find("button[type='submit']");

  return {
    pickupLocationInput,
    dropoffLocationInput,
    pickupLocationDropdown,
    dropoffLocationDropdown,
    dateFromInput,
    dateToInput,
    nextMonth,
    dateFromButton,
    dateToButton,
    driverAge,
    driverAgeValue,
    driverCountry,
    driverCountryDummy,
    driverCountryValue,
    submitButton,
  };
};

export const getCarLandingMobileElements = () => {
  const carSearchWidgetMobileRoot = Selector("[data-testid='carsTab']").nth(0);

  const landingSearchModalRoot = Selector("#searchWidgetModal", {
    visibilityCheck: true,
  });
  const findCarsButton = Selector("#stickyFooter button", {
    visibilityCheck: true,
  }).nth(0);

  const pickupLocationInputCssSelector =
    "div[data-testid='toggleCars-pickup-location-idAutocomplete'] input[type='search']";
  // location selectors
  const pickupLocationInputTrigger = carSearchWidgetMobileRoot.find(pickupLocationInputCssSelector);

  const pickupLocationInput = landingSearchModalRoot
    .find("[data-testid='togglePickupLocationAutocomplete']")
    .with({
      visibilityCheck: true,
    });

  const pickupLocationInputValue = landingSearchModalRoot
    .find("[data-testid='pickupLocationAutocompleteWrapper'] a")
    .nth(0);
  const dropoffLocationInput = landingSearchModalRoot
    .find("[data-testid='toggleDropoffLocationAutocomplete']")
    .with({
      visibilityCheck: true,
    });
  const dropoffLocationInputValue = landingSearchModalRoot
    .find("[data-testid='dropoffLocationAutocompleteWrapper'] a")
    .nth(0);

  // driver's age and country
  const driverAge = carSearchWidgetMobileRoot.find("#countryDriverAgeDropdownMobile");
  const driverAgeValue = carSearchWidgetMobileRoot
    .find("#countryDriverAgeDropdownMobile option")
    .withText("19");
  const driverCountryDummy = carSearchWidgetMobileRoot.find(
    "#countryDriverCountryDropdown-initial"
  );
  const driverCountry = carSearchWidgetMobileRoot.find("#countryDriverCountryDropdownMobile").with({
    visibilityCheck: true,
  });
  const driverCountryValue = carSearchWidgetMobileRoot
    .find("#countryDriverCountryDropdownMobile option")
    .with({
      visibilityCheck: true,
    })
    .withAttribute("value", "US");

  // driver's age and country inside modal
  const driverAgeModal = landingSearchModalRoot.find("#driverAgeDropdownMobileModalMobile");
  const driverAgeValueModal = landingSearchModalRoot
    .find("#driverAgeDropdownMobileModalMobile option")
    .withText("19");
  const driverCountryModalDummy = landingSearchModalRoot.find(
    "#driverCountryDropdownMobileModal-initial"
  );
  const driverCountryModal = landingSearchModalRoot
    .find("#driverCountryDropdownMobileModalMobile")
    .with({
      visibilityCheck: true,
    });
  const driverCountryValueModal = landingSearchModalRoot
    .find("#driverCountryDropdownMobileModalMobile option")
    .withAttribute("value", "US");

  // date picker selectors
  const dateFromInput = carSearchWidgetMobileRoot.find("span").withText("Pick up");
  const dateToInput = carSearchWidgetMobileRoot.find("span").withText("Drop off");
  const datePickerSecondMonth = landingSearchModalRoot.find(".DayPicker-Month:nth-child(2)");
  const dateFromButton = datePickerSecondMonth.find(".DayPicker-Day").withText("10");
  const dateToButton = datePickerSecondMonth.find(".DayPicker-Day").withText("17");

  // other
  const submitButton = carSearchWidgetMobileRoot.find("button[type='submit']");
  const continueButton = landingSearchModalRoot.find("button").withText("Continue");
  const applyButton = landingSearchModalRoot.find("button").withText("Apply");
  const seeResultsButton = landingSearchModalRoot.find("button").withText("Search");

  return {
    pickupLocationInputCssSelector,
    pickupLocationInputTrigger,
    pickupLocationInput,
    pickupLocationInputValue,
    dropoffLocationInput,
    dropoffLocationInputValue,
    datePickerSecondMonth,
    dateFromInput,
    dateToInput,
    dateFromButton,
    dateToButton,
    driverAge,
    driverAgeValue,
    driverCountry,
    driverCountryDummy,
    driverCountryValue,
    driverAgeModal,
    driverAgeValueModal,
    driverCountryModal,
    driverCountryModalDummy,
    driverCountryValueModal,
    findCarsButton,
    submitButton,
    continueButton,
    applyButton,
    seeResultsButton,
  };
};
