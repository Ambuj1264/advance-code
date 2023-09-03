/* eslint-disable no-await-in-loop */
/* eslint-disable class-methods-use-this */
import { RequestMock } from "testcafe";

import CommandBase from "../../base/commandBase";
import CartPageObj from "../pageModel/cartPageObj";

const cartWithPaymentProvidersQuery = /cartWithPaymentProvidersQuery/;
const activeUserQuery = /query%20activeUser/;

export default class OpenCommand extends CommandBase {
  protected isOpenPageWithHook = true;

  protected cartResponse: string;

  protected activeUserResponse: string;

  protected hooks: object[] = [];

  // #region Methods
  getCartRequestHook(responseJson: string): object {
    const submitApplicationMockSuccess = RequestMock()
      .onRequestTo(
        request =>
          request.method === "post" &&
          new RegExp(cartWithPaymentProvidersQuery).test(request.body.toString())
      )
      .respond(responseJson, 200);

    return submitApplicationMockSuccess;
  }

  getActiveUserRequestHook(responseJson: string): object {
    const submitApplicationMockSuccess = RequestMock()
      .onRequestTo({ url: activeUserQuery, method: "GET" })
      .respond(responseJson, 200);

    return submitApplicationMockSuccess;
  }

  withCartRequestHook(responseJson: object): OpenCommand {
    this.cartResponse = JSON.stringify(responseJson);
    return this;
  }

  withActiveUserRequestHook(responseJson: object): OpenCommand {
    this.activeUserResponse = JSON.stringify(responseJson);
    return this;
  }

  // #endregion

  // #region Actions
  protected async executeUsingUI() {
    const cartPageObj = new CartPageObj();

    if (this.isOpenPageWithHook) {
      if (this.cartResponse) {
        this.hooks.push(this.getCartRequestHook(this.cartResponse));
      }

      if (this.activeUserResponse) {
        this.hooks.push(this.getActiveUserRequestHook(this.activeUserResponse));
      }

      await cartPageObj.openPageWithHook(this.hooks);
    } else {
      await cartPageObj.openPage();
    }

    // #endregion
  }
}
