import { fixtureDesktop } from "../../../utils/testcafe/utils";
import CarRentalPageObj from "../../automationQA/cars/pageModel/carRentalPageObj";
import CartPage from "../../automationQA/cart/cartPage";
import CarsPage from "../../automationQA/cars/carsPage";
import { TestCategory } from "../const/testCategory";
import { baseUrl } from "../../../utils/testcafe/testcafeConstants";
import { Envs } from "../const/envs";

const carRentalPageObj = new CarRentalPageObj();

fixtureDesktop("Car Booking", carRentalPageObj.Url);

test.meta({
  CATEGORY: TestCategory.Smoke,
  ID: "Some ID",
})("Car Can Be Booked By Valid Card E2E Test", async () => {
  // Act
  const searchCarCmd = CarsPage.searchCar();
  await searchCarCmd.execute();

  if (baseUrl.includes(Envs.Staging)) {
    const reserveCmd = CartPage.reserve()
      .withName("Magelan")
      .withEamil("ttt@cudev.org")
      .withPhoneNumber("+1234567890")
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
    ID: "SomeID",
  })
  .skip("Car Is Not Booked By Invalid Card Test", async () => {
    // #region Arrange

    const searchCarCmd = CarsPage.searchCar();
    await searchCarCmd.execute();
    // #endregion

    if (baseUrl.includes(Envs.Staging)) {
      const reserveCmd = CartPage.reserve()
        .withName("Magelan")
        .withEamil("ttt@cudev.org")
        .withPhoneNumber("+1234567890")
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
