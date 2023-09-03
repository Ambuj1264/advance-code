import { fixtureDesktop } from "../../../utils/testcafe/utils";
import MainPageObj from "../../automationQA/main/pageModel/mainObj";
import MainPage from "../../automationQA/main/mainPage";
import CartPage from "../../automationQA/cart/cartPage";
import ToursPage from "../../automationQA/tours/toursPage";
import { TestCategory } from "../const/testCategory";
import { baseUrl } from "../../../utils/testcafe/testcafeConstants";
import { Envs } from "../const/envs";

const mainPageObj = new MainPageObj();

fixtureDesktop("Tours Booking", mainPageObj.Url);

test.meta({
  CATEGORY: TestCategory.Smoke,
  ID: "SomeID",
})("Tours Can Be Booked By Valid Card E2E Test", async () => {
  // Act
  const homeSearchToursCmd = MainPage.searchTours().withToursLocation("Akureyri");
  await homeSearchToursCmd.execute();

  const selectToursCommand = ToursPage.selectTours();
  await selectToursCommand.execute();

  // skip payment on dev master branch
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
    ID: "Some ID",
  })
  .skip("Tours Is Not Booked By Invalid Card Test", async () => {
    // Act
    const homeSearchToursCmd = MainPage.searchTours().withToursLocation("Akureyri");
    await homeSearchToursCmd.execute();

    const selectToursCommand = ToursPage.selectTours();
    await selectToursCommand.execute();

    // skip payment on dev master branch
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
