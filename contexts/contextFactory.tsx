import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useCallback,
  SetStateAction,
} from "react";

type SetContext<T> = {
  setContextState: (state: Partial<T>) => void;
  setAllContextState: React.Dispatch<SetStateAction<T>>;
};

const baseState = {
  setContextState: () => {},
  setAllContextState: () => {},
};

const contextFactory = <T extends {}>(defaultState: T, displayName?: string) => {
  const context = createContext<T & SetContext<T>>({
    ...defaultState,
    ...baseState,
  });
  const { Provider } = context;
  if (displayName) {
    // eslint-disable-next-line functional/immutable-data
    context.displayName = displayName;
  }

  const ContextProvider = ({
    children,
    ...props
  }: Partial<T> & {
    children?: ReactNode;
  }) => {
    const [ctxtState, setAllContextState] = useState<T>({
      ...defaultState,
      ...props,
    });

    const setContextState = useCallback(newState => {
      setAllContextState(prevState => ({ ...prevState, ...newState }));
    }, []);

    return (
      <Provider
        value={{
          ...ctxtState,
          setAllContextState,
          setContextState,
        }}
      >
        {children}
      </Provider>
    );
  };

  return {
    context,
    Provider: ContextProvider,
    useContext: () => useContext<T & SetContext<T>>(context),
  };
};

export default contextFactory;
