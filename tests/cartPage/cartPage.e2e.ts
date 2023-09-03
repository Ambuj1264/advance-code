import { Selector } from "testcafe";

import { baseUrl } from "../../utils/testcafe/testcafeConstants";
import {
  checkConsoleWarningsForMissingRequestHookFields,
  fixtureDesktop,
} from "../../utils/testcafe/utils";

import {
  cartCarMock,
  cartSelfDriveTourMock,
  cartStayMock,
  cartTourMock,
  getCartRequestMock,
} from "./cart.mocks";

const cartPageUrl = `${baseUrl}/cart`;

fixtureDesktop("Cart page").afterEach(checkConsoleWarningsForMissingRequestHookFields);

test("Should display SALTPAY payment provider for 1 tour product (1 day tour)", async t => {
  const saltPayCartContainer = Selector('[data-testid="SALTPAY-container"]')
    .with({
      visibilityCheck: true,
    })
    .nth(0);
  const adyenComponentsContainer = Selector('[data-testid="ADYEN-components-container"]')
    .with({
      visibilityCheck: true,
    })
    .nth(0);

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
    .expect(saltPayCartContainer.exists)
    .ok("", { timeout: 30000 })
    .expect(adyenComponentsContainer.exists)
    .ok("", { timeout: 30000 });
});

test("Should display SALTPAY payment provider for 1 car product", async t => {
  const saltPayCartContainer = Selector('[data-testid="SALTPAY-container"]')
    .with({
      visibilityCheck: true,
    })
    .nth(0);
  const adyenComponentsContainer = Selector('[data-testid="ADYEN-components-container"]')
    .with({
      visibilityCheck: true,
    })
    .nth(0);

  await t
    .navigateTo(cartPageUrl)
    .addRequestHooks(
      getCartRequestMock({
        cartData: {
          flights: [],
          cars: [cartCarMock],
          tours: [],
          stays: [],
          gteStays: [],
          customs: [],
          toursAndTickets: [],
          vacationPackages: [],
        },
        preferredPaymentProvider: "SALTPAY",
      })
    )
    .expect(saltPayCartContainer.exists)
    .ok("", { timeout: 30000 })
    .expect(adyenComponentsContainer.exists)
    .ok("", { timeout: 30000 });
});

test("Should display SALTPAY payment provider for 1 car product", async t => {
  const saltPayCartContainer = Selector('[data-testid="SALTPAY-container"]')
    .with({
      visibilityCheck: true,
    })
    .nth(0);
  const adyenComponentsContainer = Selector('[data-testid="ADYEN-components-container"]')
    .with({
      visibilityCheck: true,
    })
    .nth(0);

  await t
    .navigateTo(cartPageUrl)
    .addRequestHooks(
      getCartRequestMock({
        cartData: {
          flights: [],
          cars: [],
          tours: [],
          stays: [cartStayMock],
          gteStays: [cartStayMock],
          customs: [],
          toursAndTickets: [],
          vacationPackages: [],
        },
        preferredPaymentProvider: "SALTPAY",
      })
    )
    .expect(saltPayCartContainer.exists)
    .ok("", { timeout: 30000 })
    .expect(adyenComponentsContainer.exists)
    .ok("", { timeout: 30000 });
});

test("Should display ADYEN payment provider for tour self-drive tour", async t => {
  const adyenCartContainer = Selector('[data-testid="ADYEN-container"]')
    .with({
      visibilityCheck: true,
    })
    .nth(0);
  const adyenComponentsContainer = Selector('[data-testid="ADYEN-components-container"]')
    .with({
      visibilityCheck: true,
    })
    .nth(0);

  await t
    .navigateTo(cartPageUrl)
    .addRequestHooks(
      getCartRequestMock({
        cartData: {
          flights: [],
          cars: [],
          tours: [cartSelfDriveTourMock],
          stays: [],
          gteStays: [],
          customs: [],
          toursAndTickets: [],
          vacationPackages: [],
        },
        preferredPaymentProvider: "ADYEN",
      })
    )
    .expect(adyenCartContainer.exists)
    .ok("", { timeout: 30000 })
    .expect(adyenComponentsContainer.exists)
    .ok("", { timeout: 30000 });
});

test("Should display ADYEN payment provider for 2 products", async t => {
  const adyenCartContainer = Selector('[data-testid="ADYEN-container"]')
    .with({
      visibilityCheck: true,
    })
    .nth(0);
  const adyenComponentsContainer = Selector('[data-testid="ADYEN-components-container"]')
    .with({
      visibilityCheck: true,
    })
    .nth(0);

  await t
    .navigateTo(cartPageUrl)
    .addRequestHooks(
      getCartRequestMock({
        cartData: {
          flights: [],
          cars: [cartCarMock],
          tours: [],
          stays: [cartStayMock],
          gteStays: [],
          customs: [],
          toursAndTickets: [],
          vacationPackages: [],
        },
        preferredPaymentProvider: "ADYEN",
      })
    )
    .expect(adyenCartContainer.exists)
    .ok("", { timeout: 30000 })
    .expect(adyenComponentsContainer.exists)
    .ok("", { timeout: 30000 });
});
