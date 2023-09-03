import { fixtureDesktop } from "../../../utils/testcafe/utils";
import BestFlightPageObj from "../../automationQA/flights/pageModel/bestFlightsObj";
import CartPage from "../../automationQA/cart/cartPage";
import FlightPage from "../../automationQA/flights/flightPage";
import { TestCategory } from "../const/testCategory";
import { Gender } from "../../automationQA/flights/Enum/Gender";
import { baseUrl } from "../../../utils/testcafe/testcafeConstants";
import { Envs } from "../const/envs";

const bestFlightPageObj = new BestFlightPageObj();

fixtureDesktop("Flight Booking", bestFlightPageObj.Url);

// TODO: fix unstable
test.meta({
  CATEGORY: TestCategory.Smoke,
  ID: "bookFlightSmoke",
})("Flight Can Be Booked By Valid Card E2E Test", async () => {
  // Act
  const searchFlightCmd = FlightPage.searchFlight()
    .withFlightFrom("Reykjavik")
    .withFlightTo("London");
  await searchFlightCmd.execute();

  const flightDetailsCmd = FlightPage.fillFlightDetails()
    .withEmail("ttt@cudev.org")
    .withPhoneNumber("+1234567890")
    .withGivenName("Magelan")
    .withFamilyName("Nagelan")
    .withNationality("Ukraine")
    .withGender(Gender.Male)
    .withDateOfBirth("1", "12", "1987")
    .withPassportId("123456");
  await flightDetailsCmd.execute();

  // skip payment on dev master branch
  if (baseUrl.includes(Envs.Staging)) {
    const reserveCmd = CartPage.reserve()
      .withCardNumber("4111111111111111")
      .withExpiryDate("0122")
      .withCVC("0122")
      .withSetAgreed()
      .withNotReserve();
    await reserveCmd.execute();

    // Assert
    // await t .expect(cartPage.isReserveButtonVisible).ok();
  }
});

test
  .meta({
    CATEGORY: TestCategory.Regression,
    ID: "bookFlightRegression",
  })
  .skip("Flight Is Not Booked By Invalid Card Test", async () => {
    // Act
    const searchFlightCmd = FlightPage.searchFlight()
      .withFlightFrom("Reykjavik")
      .withFlightTo("London");
    await searchFlightCmd.execute();

    const flightDetailsCmd = FlightPage.fillFlightDetails()
      .withEmail("ttt@cudev.org")
      .withPhoneNumber("+1234567890")
      .withGivenName("Magelan")
      .withFamilyName("Nagelan")
      .withNationality("Ukraine")
      .withGender(Gender.Male)
      .withDateOfBirth("1", "12", "1987")
      .withPassportId("123456");
    await flightDetailsCmd.execute();

    if (baseUrl.includes(Envs.Staging)) {
      const reserveCmd = CartPage.reserve()
        .withCardNumber("4111111111111111")
        .withExpiryDate("0122")
        .withCVC("0122")
        .withSetAgreed()
        .withNotReserve();
      await reserveCmd.execute();

      // Assert
      // await t .expect(cartPage.isReserveButtonVisible).ok();
    }
  });
