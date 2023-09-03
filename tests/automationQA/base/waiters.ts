/* eslint-disable no-await-in-loop */
import { Selector, t } from "testcafe";

export default class Waiters {
  static async waitElementDisappear(elementSelector: string, timeout?: number): Promise<boolean> {
    try {
      const actualTimeout = timeout || 45000;
      await t
        .expect(Selector(elementSelector).with({ visibilityCheck: true }).exists)
        .notOk("", { timeout: actualTimeout });
      return true;
    } catch (err) {
      return false;
    }
  }

  static async waitElementVisible(elementSelector: string, timeout?: number): Promise<boolean> {
    try {
      const actualTimeout = timeout || 45000;
      await t
        .expect(Selector(elementSelector).with({ visibilityCheck: true }).exists)
        .ok("", { timeout: actualTimeout });
      return true;
    } catch (err) {
      return false;
    }
  }

  static async waitSelectorVisible(elementSelector: Selector, timeout?: number): Promise<boolean> {
    try {
      const actualTimeout = timeout || 45000;
      await t
        .expect(elementSelector.with({ visibilityCheck: true }).exists)
        .ok("", { timeout: actualTimeout });
      return true;
    } catch (err) {
      return false;
    }
  }
}
