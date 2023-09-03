import contextFactory from "contexts/contextFactory";

export interface AuthStateContext {
  auth0Instance?: auth0.WebAuth;
  isSubmitting: boolean;
  isReset: boolean;
  host: string;
  pwLoginError: string;

  setContextState: (state: Partial<this>) => void;
}

export const defaultState: AuthStateContext = {
  auth0Instance: undefined,
  isSubmitting: false,
  isReset: false,
  host: "guidetoeurope.com",
  pwLoginError: "",

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setContextState: () => {},
};

const { context, Provider, useContext } = contextFactory<AuthStateContext>(defaultState);

export default context;
export const AuthStateContextProvider = Provider;
export const useAuthStateContext = useContext;
