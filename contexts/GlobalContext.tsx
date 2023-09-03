import { MutableRefObject } from "react";

import contextFactory from "./contextFactory";

type GlobalContextType = {
  isClientNavigation: MutableRefObject<boolean | null>;
  isMobileSearchWidgetBtnClicked: MutableRefObject<boolean | undefined>;
  intercomLastPing: MutableRefObject<string | undefined>;
  isMobileKeyboardOpen: boolean | undefined;
  isPWAInstallerAvailable: boolean;
};

const defaultState: GlobalContextType = {
  isClientNavigation: { current: false },
  isMobileSearchWidgetBtnClicked: { current: false },
  intercomLastPing: { current: undefined },
  isMobileKeyboardOpen: false,
  isPWAInstallerAvailable: false,
};

const { context, Provider, useContext } = contextFactory<GlobalContextType>(defaultState);

export default context;
export const GlobalContextProvider = Provider;
export const useGlobalContext = useContext;
