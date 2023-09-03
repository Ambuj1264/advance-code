import { pipe } from "fp-ts/lib/pipeable";
import { findFirst, filterMap, map as mapArray, chain as chainArray } from "fp-ts/lib/Array";
import { toUndefined, fromNullable, isSome } from "fp-ts/lib/Option";
import { Column } from "@travelshift/ui/components/Footer/FooterColumns";
import { Item } from "@travelshift/ui/components/Footer/FooterSection";

const containsSocialMediaType = (items: Item[]) =>
  pipe(
    items,
    findFirst(item => item.type === "socialmedia"),
    isSome
  );

export const getSocialMediaItems = (columns: Column[]) =>
  pipe(
    columns,
    chainArray(column => column.sections),
    mapArray(section => section.items),
    filterMap(fromNullable),
    findFirst(containsSocialMediaType),
    toUndefined
  );
