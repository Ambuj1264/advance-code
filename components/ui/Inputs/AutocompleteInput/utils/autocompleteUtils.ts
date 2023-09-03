import { map, getOrElse } from "fp-ts/lib/Option";
import { findFirst } from "fp-ts/lib/Array";
import { pipe } from "fp-ts/lib/pipeable";

import { useIsMobile } from "hooks/useMediaQueryCustom";
import { isIOSUserAgent } from "utils/globalUtils";

export const replaceSpecialChar = (value: string) =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export const getPlaceholderById = (
  autocompleteOptions: SharedTypes.AutocompleteItem[],
  id?: string,
  placeholder?: string
): string =>
  !id
    ? placeholder || ""
    : pipe(
        autocompleteOptions,
        findFirst(option => option.id === id),
        map(option => option.name),
        getOrElse(() => placeholder || "")
      );

export const useHideMobileKeyboard = () => {
  const isMobile = useIsMobile();
  return typeof window !== "undefined"
    ? isMobile && !isIOSUserAgent(window.navigator.userAgent)
    : false;
};
