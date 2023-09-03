import contextFactory from "contexts/contextFactory";
import { Direction } from "types/enums";

export type MobileFooterContextState = {
  isMobileFooterShown: boolean;
  contactUsBottomPosition: number | undefined;
  isContactUsHidden: boolean;
  contactUsButtonPosition?: Direction;
};

const defaultState: MobileFooterContextState = {
  isMobileFooterShown: true,
  contactUsBottomPosition: undefined,
  isContactUsHidden: false,
  contactUsButtonPosition: undefined,
};

const { context, Provider } = contextFactory<MobileFooterContextState>(defaultState);

// eslint-disable-next-line functional/immutable-data
context.displayName = "MobileFooterContext";

export default context;
export const MobileFooterContextProvider = Provider;
