import { Selector } from "testcafe";

import { baseUrl } from "../../utils/testcafe/testcafeConstants";
import {
  checkConsoleWarningsForMissingRequestHookFields,
  fixtureDesktop,
} from "../../utils/testcafe/utils";

import { cartTourMock, getCartRequestMock } from "./cart.mocks";

const cartPageUrl = `${baseUrl}/cart`;

fixtureDesktop("Cart page brand icons").afterEach(checkConsoleWarningsForMissingRequestHookFields);

const TEST_SPEED = 0.6;

const creditCardInput = Selector('[id="cardNumber"]')
  .with({
    visibilityCheck: true,
  })
  .nth(0);

test("Should display Mastercard brand icon", async t => {
  await t
    .navigateTo(cartPageUrl)
    .addRequestHooks(
      getCartRequestMock({
        cartData: {
          flights: [],
          cars: [],
          tours: [cartTourMock],
          stays: [],
          gteStays: [],
          customs: [],
          toursAndTickets: [],
          vacationPackages: [],
        },
        preferredPaymentProvider: "SALTPAY",
      })
    )
    .setTestSpeed(TEST_SPEED)
    .expect(creditCardInput.exists)
    .ok("", { timeout: 30000 });

  await t.typeText(creditCardInput, "54", {
    replace: true,
  });

  const masterCardBrandIcon = Selector('[data-testid="card-icon-mc"]')
    .with({
      visibilityCheck: true,
    })
    .nth(0);

  await t.expect(masterCardBrandIcon.exists).ok("");

  await t.typeText(creditCardInput, "5555 5555 5555 4444", {
    replace: true,
  });

  await t.expect(masterCardBrandIcon.exists).ok("");

  await t.typeText(creditCardInput, "2222 4000 7000 0005", {
    replace: true,
  });

  await t.expect(masterCardBrandIcon.exists).ok("");
});

test("Should display Visa brand icon", async t => {
  await t
    .navigateTo(cartPageUrl)
    .addRequestHooks(
      getCartRequestMock({
        cartData: {
          flights: [],
          cars: [],
          tours: [cartTourMock],
          stays: [],
          gteStays: [],
          customs: [],
          toursAndTickets: [],
          vacationPackages: [],
        },
        preferredPaymentProvider: "SALTPAY",
      })
    )
    .setTestSpeed(TEST_SPEED)
    .expect(creditCardInput.exists)
    .ok("", { timeout: 30000 });

  await t.typeText(creditCardInput, "41", {
    replace: true,
  });

  const visaBrandIcon = Selector('[data-testid="card-icon-visa"]')
    .with({
      visibilityCheck: true,
    })
    .nth(0);

  await t.expect(visaBrandIcon.exists).ok("");

  await t.typeText(creditCardInput, "4111 1111 4555 1142", {
    replace: true,
  });

  await t.expect(visaBrandIcon.exists).ok("");

  await t.typeText(creditCardInput, "4646 4646 4646 4646 464", {
    replace: true,
  });

  await t.expect(visaBrandIcon.exists).ok("");
});

test("Should display Maestro brand icon", async t => {
  await t
    .navigateTo(cartPageUrl)
    .addRequestHooks(
      getCartRequestMock({
        cartData: {
          flights: [],
          cars: [],
          tours: [cartTourMock],
          stays: [],
          gteStays: [],
          customs: [],
          toursAndTickets: [],
          vacationPackages: [],
        },
        preferredPaymentProvider: "SALTPAY",
      })
    )
    .setTestSpeed(TEST_SPEED)
    .expect(creditCardInput.exists)
    .ok("", { timeout: 30000 });

  const maestroBrandIcon = Selector('[data-testid="card-icon-maestro"]')
    .with({
      visibilityCheck: true,
    })
    .nth(0);

  await t.typeText(creditCardInput, "6771 7980 2100 0008", {
    replace: true,
  });

  await t.expect(maestroBrandIcon.exists).ok("");
});

test("Should display UnionPay brand icon", async t => {
  await t
    .navigateTo(cartPageUrl)
    .addRequestHooks(
      getCartRequestMock({
        cartData: {
          flights: [],
          cars: [],
          tours: [cartTourMock],
          stays: [],
          gteStays: [],
          customs: [],
          toursAndTickets: [],
          vacationPackages: [],
        },
        preferredPaymentProvider: "SALTPAY",
      })
    )
    .setTestSpeed(TEST_SPEED)
    .expect(creditCardInput.exists)
    .ok("", { timeout: 30000 });

  const unionPayBrandIcon = Selector('[data-testid="card-icon-cup"]')
    .with({
      visibilityCheck: true,
    })
    .nth(0);

  await t.typeText(creditCardInput, "8171 9999 2766 0000", {
    replace: true,
  });

  await t.expect(unionPayBrandIcon.exists).ok("");

  await t.typeText(creditCardInput, "8171 9999 0000 0000 021", {
    replace: true,
  });

  await t.expect(unionPayBrandIcon.exists).ok("");
});

test("Should display AMEX brand icon", async t => {
  await t
    .navigateTo(cartPageUrl)
    .addRequestHooks(
      getCartRequestMock({
        cartData: {
          flights: [],
          cars: [],
          tours: [cartTourMock],
          stays: [],
          gteStays: [],
          customs: [],
          toursAndTickets: [],
          vacationPackages: [],
        },
        preferredPaymentProvider: "SALTPAY",
      })
    )
    .setTestSpeed(TEST_SPEED)
    .expect(creditCardInput.exists)
    .ok("", { timeout: 30000 });

  await t.typeText(creditCardInput, "34", {
    replace: true,
  });

  const amexBrandIcon = Selector('[data-testid="card-icon-amex"]')
    .with({
      visibilityCheck: true,
    })
    .nth(0);

  await t.expect(amexBrandIcon.exists).ok("");

  await t.typeText(creditCardInput, "374251033270007", {
    replace: true,
  });

  await t.expect(amexBrandIcon.exists).ok("");
});

test("Should display Cartes Bancaires brand icon", async t => {
  await t
    .navigateTo(cartPageUrl)
    .addRequestHooks(
      getCartRequestMock({
        cartData: {
          flights: [],
          cars: [],
          tours: [cartTourMock],
          stays: [],
          gteStays: [],
          customs: [],
          toursAndTickets: [],
          vacationPackages: [],
        },
        preferredPaymentProvider: "SALTPAY",
      })
    )
    .setTestSpeed(TEST_SPEED)
    .expect(creditCardInput.exists)
    .ok("", { timeout: 30000 });

  const carteBancaireBrandIcon = Selector('[data-testid="card-icon-cartebancaire"]')
    .with({
      visibilityCheck: true,
    })
    .nth(0);

  await t.typeText(creditCardInput, "4360 0000 0100 0005", {
    replace: true,
  });

  await t.expect(carteBancaireBrandIcon.exists).ok("");

  await t.typeText(creditCardInput, "4035 5010 0000 0008", {
    replace: true,
  });

  await t.expect(carteBancaireBrandIcon.exists).ok("");

  await t.typeText(creditCardInput, "5017670000001800", {
    replace: true,
  });

  await t.expect(carteBancaireBrandIcon.exists).ok("");
});

test("Should display different brand icons", async t => {
  await t
    .navigateTo(cartPageUrl)
    .addRequestHooks(
      getCartRequestMock({
        cartData: {
          flights: [],
          cars: [],
          tours: [cartTourMock],
          stays: [],
          gteStays: [],
          customs: [],
          toursAndTickets: [],
          vacationPackages: [],
        },
        preferredPaymentProvider: "SALTPAY",
      })
    )
    .setTestSpeed(TEST_SPEED)
    .expect(creditCardInput.exists)
    .ok("", { timeout: 30000 });

  const visaBrandIcon = Selector('[data-testid="card-icon-visa"]')
    .with({
      visibilityCheck: true,
    })
    .nth(0);

  const masterCardBrandIcon = Selector('[data-testid="card-icon-mc"]')
    .with({
      visibilityCheck: true,
    })
    .nth(0);

  await t.typeText(creditCardInput, "54", {
    replace: true,
  });

  await t.expect(masterCardBrandIcon.exists).ok("");

  await t.typeText(creditCardInput, "4141 4141 4141 4141", {
    replace: true,
  });

  await t.expect(visaBrandIcon.exists).ok("");

  await t.pressKey("ctrl+a").typeText(creditCardInput, "5555 5555 5555 4444", {
    paste: true,
  });

  await t.expect(masterCardBrandIcon.exists).ok("");

  const carteBancaireBrandIcon = Selector('[data-testid="card-icon-cartebancaire"]')
    .with({
      visibilityCheck: true,
    })
    .nth(0);

  await t.pressKey("ctrl+a").typeText(creditCardInput, "4360 0000 0100 0005", {
    paste: true,
  });

  await t.expect(carteBancaireBrandIcon.exists).ok("");
});
