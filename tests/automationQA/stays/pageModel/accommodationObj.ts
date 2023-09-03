import { t, Selector } from "testcafe";

import { baseUrl } from "../../../../utils/testcafe/testcafeConstants";

export default class AccommodationPageObj {
  public Url: string;

  constructor() {
    this.Url = `${baseUrl}/accommodation`;
  }

  // #region selectors
  private staysThumbnail: Selector = Selector('[data-testid="imageWrapper"]');

  private continueBookButton: Selector = Selector('[data-testid="continueBookButton"]');

  private roomDropDown: Selector = Selector('[data-testid="roomDropdown"]').with({
    visibilityCheck: true,
  });

  private roomOption = this.roomDropDown
    .find('[id="Room1RoomOption"]')
    .with({ visibilityCheck: true });
  // #endregion

  // #region methods
  async selectStays() {
    await t.click(this.staysThumbnail).resizeWindow(1280, 720);
  }

  async selectRoom() {
    await t.click(this.roomDropDown).click(this.roomOption);
  }

  async continueBook() {
    await t.click(this.continueBookButton);
  }
  // #endregion
}
