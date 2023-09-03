import { Selector } from "testcafe";

import { scrollToBottom } from "./utils";

export const checkProductPriceIsPresent = () =>
  // eslint-disable-next-line consistent-return
  test("Make sure that price for product is present", async t => {
    await scrollToBottom();

    const priceWrapperSelector = Selector('[data-testid="cardFooter"]')
      .with({
        visibilityCheck: true,
        timeout: 40000,
      })
      .nth(0);

    const productPriceSelector = Selector('span[data-testid="productPrice"]')
      .with({
        visibilityCheck: true,
        timeout: 40000,
      })
      .nth(0);

    await t
      .expect(priceWrapperSelector.exists)
      .ok("", { timeout: 40000 })
      .expect(productPriceSelector.exists)
      .ok("", { timeout: 40000 })
      .expect(productPriceSelector.innerText)
      .match(/^[0-9,.]*$/g);
  });
