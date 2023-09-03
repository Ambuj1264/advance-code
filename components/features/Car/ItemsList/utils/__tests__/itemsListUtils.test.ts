import { none, some } from "fp-ts/lib/Option";

import { constructModalData, constructItem, constructModal } from "../itemsListUtils";

const singleItem: SharedTypes.Icon = {
  id: "1",
  title: "Test1",
  description: "Test description",
};

const items: SharedTypes.Icon[] = [
  singleItem,
  {
    id: "2",
    title: "Test2",
    description: "Test description",
  },
  {
    id: "3",
    title: "Test3",
    description: "Test description",
  },
];

describe("constructModalData", () => {
  const title = "Test";
  const modalData = constructModalData(title, items);
  test("should has a proper title", () => {
    expect(modalData.title).toEqual(title);
  });
  test("should has proper items", () => {
    expect(modalData.items).toEqual(items);
  });
});

describe("constructItem", () => {
  test("should contain item", () => {
    expect(constructItem(items, singleItem.id)).toEqual(singleItem);
  });
  test("should contains empty item", () => {
    expect(constructItem(items, "0")).toEqual({});
  });
});

describe("constructModal", () => {
  const allItemsTitle = "Test all modal title";
  const allItemsModal = constructModal(items, none, allItemsTitle);
  test("should has a proper all items title", () => {
    expect(allItemsModal.title).toEqual(allItemsTitle);
  });
  test("should has proper items", () => {
    expect(allItemsModal.items).toEqual(items);
  });

  const singleItemModal = constructModal(items, some(singleItem.id), "");
  test("should has a title equls to item title", () => {
    expect(singleItemModal.title).toEqual(singleItem.title);
  });
  test("should has a proper item", () => {
    expect(singleItemModal.items).toEqual([singleItem]);
  });
  test("should contain only one item", () => {
    expect(singleItemModal.items.length).toEqual(1);
  });
});
