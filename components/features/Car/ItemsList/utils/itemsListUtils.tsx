import { Option, getOrElse, map } from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
import { findFirst } from "fp-ts/lib/Array";

export const constructModalData = (
  title: string,
  items: SharedTypes.Icon[]
): ItemList.ModalData => ({
  title,
  items,
});

export const constructItem = (itemsList: SharedTypes.Icon[], itemId: string): SharedTypes.Icon =>
  pipe(
    itemsList,
    findFirst((item: SharedTypes.Icon) => item.id === itemId),
    getOrElse(() => ({} as SharedTypes.Icon))
  );

export const constructModal = (
  itemsList: SharedTypes.Icon[],
  selectedId: Option<string>,
  initialTitle: string
): ItemList.ModalData =>
  pipe(
    selectedId,
    map(id => {
      const item = constructItem(itemsList, id);
      return constructModalData(item.title, [item]);
    }),
    getOrElse(() => constructModalData(initialTitle, itemsList))
  );
