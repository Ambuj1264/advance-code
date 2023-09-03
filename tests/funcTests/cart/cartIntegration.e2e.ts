/* eslint-disable functional/immutable-data */
/* eslint-disable no-await-in-loop */
import {
  checkConsoleWarningsForMissingRequestHookFields,
  fixtureDesktop,
} from "../../../utils/testcafe/utils";
import CartPage from "../../automationQA/cart/cartPage";
import { TestCategory } from "../const/testCategory";
import RootModel from "../../automationQA/cart/model/rootModel";
import { getActiveUserDataModel } from "../../automationQA/cart/model/activeUserModel";
import { getCarModel } from "../../automationQA/cart/model/carModel";
import { getStayModel } from "../../automationQA/cart/model/stayModel";
import { getTourModel } from "../../automationQA/cart/model/tourModel";
import { getflightModel } from "../../automationQA/cart/model/flightModel";
import MainPage from "../../automationQA/main/mainPage";
import { isEmpty } from "../../automationQA/base/stringHelper";
import { baseUrl } from "../../../utils/testcafe/testcafeConstants";

fixtureDesktop("Cart Integration Tests", `${baseUrl}/`).afterEach(
  checkConsoleWarningsForMissingRequestHookFields
);

test.meta({
  CATEGORY: TestCategory.Smoke,
  ID: "11101",
})("Cart Can Remove Booking", async t => {
  // #region Arrange
  const cartModel = new RootModel();
  const openCartPageCmd = CartPage.openPage().withCartRequestHook(cartModel);
  await openCartPageCmd.execute();
  // #endregion

  // Act
  const removeCartcmd = CartPage.remove()
    .withName(cartModel.data.cartWithPaymentProviders.cart.tours[0].title)
    .withConfirmRemove();
  await removeCartcmd.execute();

  // Assert
  const isClosed = removeCartcmd.IsDialogClosed;
  await t.expect(isClosed).eql(true);
});

test.meta({
  CATEGORY: TestCategory.Regression,
  ID: "11103",
})("Cart Can Cancel Remove Booking", async t => {
  // #region Arrange
  const cartModel = new RootModel();
  const openCartPageCmd = CartPage.openPage().withCartRequestHook(cartModel);
  await openCartPageCmd.execute();

  // #endregion

  // Act
  const removeCartcmd = CartPage.remove()
    .withName(cartModel.data.cartWithPaymentProviders.cart.tours[0].title)
    .withCancellRemove();
  await removeCartcmd.execute();

  // Assert
  const checkCartcmd = CartPage.readCartPage().withGetBookedItems();
  await checkCartcmd.execute();

  await t.expect(removeCartcmd.IsDialogClosed).eql(true);
  await t
    .expect(checkCartcmd.BookedItems.count)
    .eql(cartModel.data.cartWithPaymentProviders.cart.tours.length);
});

test.meta({
  CATEGORY: TestCategory.Regression,
  ID: "11105",
})("Cart Counting Booked Item Price Correctly", async t => {
  // #region Arrange
  const cartModel = new RootModel();
  const openCartPageCmd = CartPage.openPage().withCartRequestHook(cartModel);
  await openCartPageCmd.execute();
  // #endregion

  // Act
  const checkCartCmd = CartPage.readCartPage().withGetItemsSum().withGetTotalSum();
  await checkCartCmd.execute();

  // Assert
  await t.expect(checkCartCmd.BookedItemsSum).eql(checkCartCmd.TotalItemsSum);
});

test.meta({
  CATEGORY: TestCategory.Regression,
  ID: "11109",
})("Cart Can Change Currency", async t => {
  // #region Arrange
  const cartModel = new RootModel();
  const currency = "EUR";
  const openCartPageCmd = CartPage.openPage().withCartRequestHook(cartModel);
  await openCartPageCmd.execute();
  // #endregion

  // Act
  const checkCartCmd = CartPage.changeCurrencyCommand().withChangeCurrency(currency);
  await checkCartCmd.execute();

  // Assert
  const checkCmd = CartPage.readCartPage()
    .withGetMainMenuCurrency(currency)
    .withGetPageCurrencies();
  await checkCmd.execute();

  const expectedCount = cartModel.data.cartWithPaymentProviders.cart.tours.length + 1;

  await t
    .expect(checkCmd.MainMenuCurrency)
    .contains(currency)
    .expect(checkCmd.PageCurrencies.length)
    .eql(expectedCount);

  const expectedPromises = [];

  for (let i = 0; i < expectedCount; ++i) {
    expectedPromises.push(await t.expect(checkCmd.PageCurrencies[0].includes(currency)).ok());
  }

  await Promise.all(expectedPromises);
});

test.meta({
  CATEGORY: TestCategory.Regression,
  ID: "11104",
})("Cart Icon Displays Booked Amount", async t => {
  // #region Arrange
  const cartModel = new RootModel();
  const activeUserModel = getActiveUserDataModel();
  const openCartPageCmd = CartPage.openPage()
    .withCartRequestHook(cartModel)
    .withActiveUserRequestHook(activeUserModel);
  await openCartPageCmd.execute();
  // #endregion

  // Assert
  const checkCmd = CartPage.readCartPage().withGetBookedCountInMainMenu();
  await checkCmd.execute();

  await t.expect(checkCmd.BookedItemsCountInIcon).eql(activeUserModel.data.cartItemCount);
});

test.meta({
  CATEGORY: TestCategory.Regression,
  ID: "11106",
})("Cart Can Open Info Dialog For Booked Items", async t => {
  // #region Arrange
  const cartModel = new RootModel();
  const carModel = getCarModel();
  const stayModel = getStayModel();
  const tourModel = getTourModel();
  cartModel.data.cartWithPaymentProviders.cart.stays = [stayModel];
  cartModel.data.cartWithPaymentProviders.cart.cars = [carModel];
  cartModel.data.cartWithPaymentProviders.cart.tours = [tourModel];
  await t.maximizeWindow();

  const openCartPageCmd = CartPage.openPage().withCartRequestHook(cartModel);
  await openCartPageCmd.execute();
  // #endregion

  // Act
  const openCarInfoDialogCmd = CartPage.openInfoDialog()
    .withName(carModel.title)
    .withReadTitle()
    .withClose();
  await openCarInfoDialogCmd.execute();

  // Assert
  await t.expect(openCarInfoDialogCmd.DialogTitle.includes(carModel.title)).ok();

  // Act
  const openTourInfoDialogCmd = CartPage.openInfoDialog()
    .withName(tourModel.title)
    .withReadTitle()
    .withClose();
  await openTourInfoDialogCmd.execute();

  // Assert
  await t.expect(openTourInfoDialogCmd.DialogTitle.includes(tourModel.title)).ok();

  // Act
  const openStayInfoDialogCmd = CartPage.openInfoDialog()
    .withName(stayModel.title)
    .withReadTitle()
    .withClose();
  await openStayInfoDialogCmd.execute();

  // Assert
  await t.expect(openStayInfoDialogCmd.DialogTitle.includes(stayModel.title)).ok();
});

// TODO: rewrite this tests for new hybrid cart.
// test.only.meta({
//   CATEGORY: TestCategory.Regression,
//   ID: "11107",
// })("Cart Payment Types Selection", async t => {
//   // #region Arrange
//   const cartModel = new RootModel();
//   const openCartPageCmd = CartPage.openPage().withCartRequestHook(cartModel);
//   await openCartPageCmd.execute();
//   // #endregion
//
//   // Paypal is enabled only on prod.
//   // Act
//   // const reservePayPalCmd = CartPage.reserve().withSelectPayment(
//   //   PaymentType.PayPal
//   // );
//   // await reservePayPalCmd.execute();
//   //
//   // // Assert
//   // const readPayPalCmd = CartPage.readCartPage().withCheckPaymentSelected(
//   //   PaymentType.PayPal
//   // );
//   // await readPayPalCmd.execute();
//   //
//   // await t.expect(readPayPalCmd.IsPaymentSelected).ok();
//
//   // Act
//   const reserveCardCmd = CartPage.reserve().withSelectPayment(
//     PaymentType.CreditCard
//   );
//   await reserveCardCmd.execute();
//
//   // Assert
//   const readCardCmd = CartPage.readCartPage().withCheckPaymentSelected(
//     PaymentType.CreditCard
//   );
//
//   await t.debug();
//
//   await readCardCmd.execute();
//
//   await t.expect(readCardCmd.IsPaymentSelected).ok();
//
//   await t.debug();
//
//   // Act
//   const reserveAliPayCmd = CartPage.reserve().withSelectPayment(
//     PaymentType.AliPay
//   );
//   await reserveAliPayCmd.execute();
//
//   // Assert
//   const readAliPayCmd = CartPage.readCartPage().withCheckPaymentSelected(
//     PaymentType.AliPay
//   );
//   await readAliPayCmd.execute();
//
//   await t.expect(readAliPayCmd.IsPaymentSelected).ok();
// });

test.meta({
  CATEGORY: TestCategory.Regression,
  ID: "11102",
})("Cart Is Not Opened When Empty", async t => {
  // #region Arrange
  const gotoMainPageCmd = MainPage.goToMainPage();
  await gotoMainPageCmd.execute();
  // #endregion

  // Act
  const homePageCmd = MainPage.goToCart().withClickIcon().withCheckCartPopUp();
  await homePageCmd.execute();

  // Assert
  await t.expect(homePageCmd.IsCartPopUpOpened).ok();
  await t.expect(isEmpty(homePageCmd.Message)).notOk();

  // Act
  const homePage1Cmd = MainPage.goToCart().withOpenUrl().withCheckMainPageDisplayed();
  await homePage1Cmd.execute();

  // Assert
  await t.expect(homePage1Cmd.IsMainPageDisplayed).ok();
});

test.meta({
  CATEGORY: TestCategory.Regression,
  ID: "11108",
})("Cart Booking Unable With Empty Required Fields", async t => {
  // #region Arrange
  const cartModel = new RootModel();
  cartModel.data.cartWithPaymentProviders.cart.customerInfo.email = "";
  cartModel.data.cartWithPaymentProviders.cart.customerInfo.name = "";
  cartModel.data.cartWithPaymentProviders.cart.customerInfo.nationality = "";
  cartModel.data.cartWithPaymentProviders.cart.customerInfo.phoneNumber = "";

  const openCartPageCmd = CartPage.openPage().withCartRequestHook(cartModel);
  await openCartPageCmd.execute();
  // #endregion

  // Act
  await CartPage.reserve().execute();

  // Assert
  const validateCmd = CartPage.validation()
    .withValidateAgreement()
    .withValidateEmail()
    .withValidateName();
  await validateCmd.execute();

  await t
    .expect(isEmpty(validateCmd.NameValidateMessage))
    .notOk()
    .expect(isEmpty(validateCmd.EmailValidateMessage))
    .notOk()
    .expect(isEmpty(validateCmd.AgreementValidateMessage))
    .notOk();
});

test.meta({
  CATEGORY: TestCategory.Regression,
  ID: "11110",
})("Cart Can Edit Vacation Package", async t => {
  // #region Arrange
  const cartModel = new RootModel();

  const vacation = getTourModel();
  vacation.type = "Vacation packages";
  vacation.title = "Test Best Vacation";
  vacation.totalPrice = 1000;

  cartModel.data.cartWithPaymentProviders.cart.tours = [vacation];

  const openCartPageCmd = CartPage.openPage().withCartRequestHook(cartModel);
  await openCartPageCmd.execute();
  // #endregion

  // Act
  const editCmd = CartPage.editBookedItem()
    .withName(cartModel.data.cartWithPaymentProviders.cart.tours[0].title)
    .withLink(cartModel.data.cartWithPaymentProviders.cart.tours[0].linkUrl)
    .withBook();
  await editCmd.execute();

  // Assert
  const readCmd = CartPage.readCartPage().withCheckItemBookedDisplayed(vacation.title);
  await readCmd.execute();

  await t.expect(readCmd.IsBookedItemDisplayed).ok();
});

test.meta({
  CATEGORY: TestCategory.Regression,
  ID: "11120",
})("Cart Remove Expired Booking", async t => {
  // #region Arrange
  const cartModel = new RootModel();
  const flightModel = getflightModel();
  cartModel.data.cartWithPaymentProviders.cart.flights = [flightModel];
  cartModel.data.cartWithPaymentProviders.cart.tours = [];
  const openCartPageCmd = CartPage.openPage().withCartRequestHook(cartModel);
  await openCartPageCmd.execute();
  // #endregion

  // Act
  const removeCartcmd = CartPage.remove().withName("Offer expired");
  await removeCartcmd.execute();

  // Assert
  const isClosed = removeCartcmd.IsDialogClosed;
  await t.expect(isClosed).eql(true);
});

test.meta({
  CATEGORY: TestCategory.Regression,
  ID: "11137",
})("Cart Negative Booking Cars", async t => {
  // #region Arrange
  const cartModel = new RootModel();
  const carModel = getCarModel();
  cartModel.data.cartWithPaymentProviders.cart.tours = [];
  cartModel.data.cartWithPaymentProviders.cart.cars = [carModel];

  const openCartPageCmd = CartPage.openPage().withCartRequestHook(cartModel);
  await openCartPageCmd.execute();
  // #endregion

  // Act
  const reserveCmd = CartPage.reserve()
    .withCardNumber("4111111111")
    .withCVC("777")
    .withExpiryDate("01/26")
    .withSetAgreed();
  await reserveCmd.execute();

  // Assert
  const validateCmd = CartPage.validation().withValidateCartNumber();
  await validateCmd.execute();

  await t.expect(isEmpty(validateCmd.CartNumberValidateMessage)).notOk();
});

test.meta({
  CATEGORY: TestCategory.Regression,
  ID: "11135",
})("Cart Negative Booking Tours", async t => {
  // #region Arrange
  const cartModel = new RootModel();
  const tourModel = getTourModel();
  cartModel.data.cartWithPaymentProviders.cart.tours = [];
  cartModel.data.cartWithPaymentProviders.cart.tours = [tourModel];

  const openCartPageCmd = CartPage.openPage().withCartRequestHook(cartModel);
  await openCartPageCmd.execute();
  // #endregion

  const reserveCmd = CartPage.reserve()
    .withCardNumber("4111111111111111")
    .withCVC("777")
    .withExpiryDate("01/20")
    .withSetAgreed();
  await reserveCmd.execute();

  // Assert
  const validateCmd = CartPage.validation().withValidateExpireDate();
  await validateCmd.execute();

  await t.expect(isEmpty(validateCmd.ExpireDateValidateMessage)).notOk();
});

test.meta({
  CATEGORY: TestCategory.Regression,
  ID: "11138",
})("Cart Negative Booking Flights", async t => {
  // #region Arrange
  const cartModel = new RootModel();
  const flightModel = getflightModel();
  flightModel.expiredTime = "0000-00-00T00:00:00.000Z";
  cartModel.data.cartWithPaymentProviders.cart.tours = [];
  cartModel.data.cartWithPaymentProviders.cart.flights = [flightModel];

  const openCartPageCmd = CartPage.openPage().withCartRequestHook(cartModel);
  await openCartPageCmd.execute();
  // #endregion

  // Act
  const reserveCmd = CartPage.reserve()
    .withCardNumber("4111111111")
    .withCVC("777")
    .withExpiryDate("01/26")
    .withSetAgreed();
  await reserveCmd.execute();

  // Assert
  const validateCmd = CartPage.validation().withValidateCartNumber();
  await validateCmd.execute();

  await t.expect(isEmpty(validateCmd.CartNumberValidateMessage)).notOk();
});

test.meta({
  CATEGORY: TestCategory.Regression,
  ID: "11136",
})("Cart Negative Booking Stays", async t => {
  // #region Arrange
  const cartModel = new RootModel();
  const stayModel = getStayModel();
  cartModel.data.cartWithPaymentProviders.cart.tours = [];
  cartModel.data.cartWithPaymentProviders.cart.stays = [stayModel];

  const openCartPageCmd = CartPage.openPage().withCartRequestHook(cartModel);
  await openCartPageCmd.execute();
  // #endregion

  const reserveCmd = CartPage.reserve()
    .withCardNumber("4111111111111111")
    .withCVC("777")
    .withExpiryDate("01/20")
    .withSetAgreed();
  await reserveCmd.execute();

  // Assert
  const validateCmd = CartPage.validation().withValidateExpireDate();
  await validateCmd.execute();

  await t.expect(isEmpty(validateCmd.ExpireDateValidateMessage)).notOk();
});
