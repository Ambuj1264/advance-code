import { Selector, ClientFunction } from "testcafe";

import { baseUrl } from "../utils/testcafe/testcafeConstants";
import { fixtureDesktop, makeSureGetIsSafe } from "../utils/testcafe/utils";

const getLocation = ClientFunction(() => document.location.href);

const TIMEOUT = 45000;

const validatePrice = async (t: TestController, tourActualPrice: string) => {
  const currencyPicker = Selector('[data-testid="navBarCurrencyPicker"]').with({
    visibilityCheck: true,
  });
  await t.expect(currencyPicker.exists).ok({ timeout: TIMEOUT });
  await t.click(currencyPicker);
  const usdCurrencyOption = Selector("#USDcurrencyPickerOption").with({
    visibilityCheck: true,
  });
  await t.expect(usdCurrencyOption.exists).ok({ timeout: TIMEOUT });
  await t.click(usdCurrencyOption);

  const productPriceElement = Selector(
    '[data-testid="itemContainerTour"] [data-testid="productPrice"]'
  )
    .nth(0)
    .with({ boundTestRun: t, visibilityCheck: true });
  await makeSureGetIsSafe(productPriceElement, t);
  await t
    .expect(
      Selector('[data-testid="paymentFormFooter"] [data-testid="productCurrency"]').with({
        visibilityCheck: true,
      }).innerText
    )
    .eql("USD", { timeout: 10000 });
  const productPriceValue = await productPriceElement.innerText;
  await t.expect(tourActualPrice).eql(productPriceValue);

  const totalCartPriceElement = Selector(
    '[data-testid="paymentFormFooter"] [data-testid="productPrice"]'
  )
    .nth(0)
    .with({ boundTestRun: t, visibilityCheck: true });
  await makeSureGetIsSafe(totalCartPriceElement, t);

  const totalCartPrice = await totalCartPriceElement.innerText;

  await t.expect(totalCartPrice).eql(productPriceValue);
};

const validateFunnel = () => {
  test("Navigate to tour search page and book a tour", async t => {
    const bookTouTourLink = Selector("#BookyourtoursNavItem").with({
      visibilityCheck: true,
    });
    await t.expect(bookTouTourLink.exists).ok({ timeout: TIMEOUT });

    await t
      .click(bookTouTourLink)
      .expect(Selector("h1").innerText)
      .eql("Book Your Trip in Iceland", { timeout: TIMEOUT });

    const bookTourTripTitle = await Selector("h1").innerText;

    const selectedTourCategory = Selector("h3").nth(3).with({ visibilityCheck: true });

    await t.expect(selectedTourCategory.exists).ok();

    await t.click(selectedTourCategory);

    await t.expect(Selector("h1").innerText).notEql(bookTourTripTitle, { timeout: TIMEOUT });

    const selectedTour = Selector("h3").nth(3).with({ visibilityCheck: true });

    await t.expect(selectedTour.exists).ok({ timeout: TIMEOUT });

    const selectedTourName = await selectedTour.innerText;

    await t.click(selectedTour);

    await t.expect(Selector("h1").innerText).eql(selectedTourName, { timeout: TIMEOUT });

    await t.maximizeWindow();

    const nextMonthButton = Selector("#nextMonth").with({
      visibilityCheck: true,
    });
    await t.expect(nextMonthButton.exists).ok({ timeout: TIMEOUT });

    // Select currency to receive session_id
    // Tour adding using POST request, and we need to have session_id before adding tour to cart
    // Otherwise we can't add tour on branch deployments
    await t.click(Selector('[data-testid="navBarCurrencyPicker"]'));
    await t.click(Selector("#USDcurrencyPickerOption", { timeout: 5000 }));

    await t.click(nextMonthButton).click(".DayPicker-Day[aria-disabled='false']");

    const travellersOptions = Selector('[data-testid="toggleTravelers"]');
    await t.click(travellersOptions);

    const incrementTravellersButton = Selector("#adultsIncrement");
    const isIncrementTravellersDisabled = await incrementTravellersButton.hasAttribute("disabled");

    await t.click(incrementTravellersButton);

    await t
      .expect(travellersOptions.innerText)
      .eql(`${isIncrementTravellersDisabled ? "1 traveler" : "2 travelers"}`, {
        timeout: 10000,
      });

    const tourPricePerPersonElement = Selector('[data-testid="footerPriceValue"]').with({
      visibilityCheck: true,
    });

    await t.expect(tourPricePerPersonElement.exists).ok();

    const tourActualPrice = await tourPricePerPersonElement.innerText;

    const bookButton = Selector('[data-testid="continueBookButton"]');
    await t.click(bookButton);

    await makeSureGetIsSafe(
      Selector('[data-testid="paymentMethods"]').with({
        visibilityCheck: true,
      }),
      t
    );
    const cartTourTitleElement = Selector(
      '[data-testid="itemContainerTour"] [data-testid="cartItemTitle"]'
    )
      .nth(0)
      .with({ visibilityCheck: true });

    const cartTourTitle = (await cartTourTitleElement.innerText).trim();

    await t.expect(cartTourTitle).eql(selectedTourName);

    await validatePrice(t, tourActualPrice);

    // Use direct navigation instead of clicking on the locales dropdown because all links are absolute
    const koCart = "/ko/cart";
    await t.navigateTo(`${baseUrl}${koCart}`);
    await t.expect(getLocation()).eql(`${baseUrl}${koCart}`, { timeout: TIMEOUT });
    await makeSureGetIsSafe(
      Selector('[data-testid="paymentMethods"]').with({
        visibilityCheck: true,
      }),
      t
    );
    await validatePrice(t, tourActualPrice);

    const jaCart = "/ja/cart";
    await t.navigateTo(`${baseUrl}${jaCart}`);
    await t.expect(getLocation()).eql(`${baseUrl}${jaCart}`, { timeout: TIMEOUT });
    await makeSureGetIsSafe(
      Selector('[data-testid="paymentMethods"]').with({
        visibilityCheck: true,
      }),
      t
    );
    await validatePrice(t, tourActualPrice);

    // TODO: add actual checkout on dev branches.
  });
};

fixtureDesktop("English tours funnels tests", baseUrl);

validateFunnel();
