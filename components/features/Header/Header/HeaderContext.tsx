import { useCallback } from "react";

import contextFactory from "contexts/contextFactory";

const defaultHeaderContext = {
  menuOpen: false,
  searchOpen: false,
};

const { Provider, useContext } = contextFactory<typeof defaultHeaderContext>(defaultHeaderContext);

export const useOnToggleMenu = () => {
  const { setAllContextState } = useContext();

  return useCallback(() => {
    setAllContextState(state => ({
      menuOpen: !state.menuOpen,
      searchOpen: false,
    }));
  }, [setAllContextState]);
};

export const useOnCloseMenu = () => {
  const { setContextState } = useContext();

  return useCallback(() => {
    setContextState({
      menuOpen: false,
      searchOpen: false,
    });
  }, [setContextState]);
};

export const useOnToggleSearch = () => {
  const { setAllContextState } = useContext();

  return useCallback(() => {
    setAllContextState(state => ({
      menuOpen: false,
      searchOpen: !state.searchOpen,
    }));
  }, [setAllContextState]);
};

export const HeaderContextProvider = Provider;
export const useHeaderContext = useContext;
