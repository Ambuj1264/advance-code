import { fixtureDesktop } from "../../../utils/testcafe/utils";
import MainPageObj from "../../automationQA/main/pageModel/mainObj";
import MainPage from "../../automationQA/main/mainPage";
import CartPage from "../../automationQA/cart/cartPage";
import ToursPage from "../../automationQA/tours/toursPage";
import { TestCategory } from "../const/testCategory";
import { baseUrl } from "../../../utils/testcafe/testcafeConstants";
import { Envs } from "../const/envs";

const mainPageObj = new MainPageObj();

fixtureDesktop("Vacation Booking", mainPageObj.Url);

test.meta({
  CATEGORY: TestCategory.Smoke,
  ID: "SomeID",
})("Vacation For 3 Days With Car Can Be Booked By Valid Card E2E Test", async () => {
  // Act
  await MainPage.mainMenu().withGetVacation().execute();

  const searchToursCommand = ToursPage.searchTours().withToursLocation("Reykjavik");
  await searchToursCommand.execute();

  const selectToursCommand = ToursPage.selectTours().withDuration(3);
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

test.meta({
  CATEGORY: TestCategory.Smoke,
  ID: "SomeID",
})("Vacation For 5 Days With Flight Can Be Booked By Valid Card E2E Test", async () => {
  // Act
  await MainPage.mainMenu().withGetVacation().execute();

  const searchToursCommand = ToursPage.searchTours().withToursLocation("Reykjavik");
  await searchToursCommand.execute();

  const selectToursCommand = ToursPage.selectTours().withDuration(5);
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

test.meta({
  CATEGORY: TestCategory.Smoke,
  ID: "SomeID",
})("Vacation For 7 Days With Stays Can Be Booked By Valid Card E2E Test", async () => {
  // Act
  await MainPage.mainMenu().withGetVacation().execute();

  const searchToursCommand = ToursPage.searchTours().withToursLocation("Reykjavik");
  await searchToursCommand.execute();

  const selectToursCommand = ToursPage.selectTours().withDuration(7);
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

test.meta({
  CATEGORY: TestCategory.Smoke,
  ID: "SomeID",
})("Vacation For 9 Days With Buses Can Be Booked By Valid Card E2E Test", async () => {
  // Act
  await MainPage.mainMenu().withGetVacation().execute();

  const searchToursCommand = ToursPage.searchTours().withToursLocation("Reykjavik");
  await searchToursCommand.execute();

  const selectToursCommand = ToursPage.selectTours().withDuration(9);
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

test.meta({
  CATEGORY: TestCategory.Smoke,
  ID: "SomeID",
})("Vacation For 11 Days Can Be Booked By Valid Card E2E Test", async () => {
  // Act
  await MainPage.mainMenu().withGetVacation().execute();

  const searchToursCommand = ToursPage.searchTours().withToursLocation("Reykjavik");
  await searchToursCommand.execute();

  const selectToursCommand = ToursPage.selectTours().withDuration(11);
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
