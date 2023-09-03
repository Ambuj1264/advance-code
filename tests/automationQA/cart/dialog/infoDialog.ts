import { t, Selector } from "testcafe";

import Waiters from "../../base/waiters";

export default class InfoDialog {
  // #region selectors
  private dialogRootSelector = "#informationCartItemModal";

  private dialogRoot: Selector = Selector(this.dialogRootSelector, {
    visibilityCheck: true,
  });

  private dialogTitleSelector: Selector = Selector(this.dialogRoot).find(
    "[data-testid='cart-product-info-title']"
  );

  private closeDialogButton: Selector = Selector("[data-testid='modal-close-button']");
  // #endregion

  // #region methods
  async waitDialogOpened(): Promise<void> {
    await this.dialogRoot.with({ visibilityCheck: true })();
  }

  async waitDialogClosed(): Promise<boolean> {
    const state = await Waiters.waitElementDisappear(this.dialogRootSelector);
    return state;
  }

  async closeDialog() {
    await t.click(this.closeDialogButton);
    await this.waitDialogClosed();
  }

  async getDialogTitle(): Promise<string> {
    const title = await this.dialogTitleSelector.innerText;
    return title.trim();
  }
  // #endregion
}
