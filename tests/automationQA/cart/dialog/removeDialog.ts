import { t, Selector } from "testcafe";

import Waiters from "../../base/waiters";

export default class RemoveDialog {
  // #region selectors
  private dialogRootSelector = "#removeItemModal";

  private dialogRoot: Selector = Selector(this.dialogRootSelector);

  private removeButton: Selector = Selector('button[type="button"]')
    .with({ visibilityCheck: true })
    .withText("Remove");

  private backButton: Selector = Selector('button[type="button"]')
    .with({ visibilityCheck: true })
    .withText("Back");

  // #endregion

  // #region methods
  async waitDialogOpened() {
    await this.dialogRoot.with({ visibilityCheck: true })();
  }

  async waitDialogClosed(): Promise<boolean> {
    const state = await Waiters.waitElementDisappear(this.dialogRootSelector);
    return state;
  }

  async confirmRemoving(): Promise<boolean> {
    await this.waitDialogOpened();
    await t.click(this.removeButton);
    const isClosed = await this.waitDialogClosed();
    return isClosed;
  }

  async cancelRemoving(): Promise<boolean> {
    await this.waitDialogOpened();
    await t.click(this.backButton);
    const isClosed = await this.waitDialogClosed();
    return isClosed;
  }
  // #endregion
}
