import contextFactory from "contexts/contextFactory";

export interface StateContext {
  similarToursDateFrom?: string;
  similarToursDateTo?: string;
  startingLocationId?: string;
  startingLocationName?: string;
  childrenAges: number[];
  adults: number;
  setContextState: (state: Partial<this>) => void;
}

const defaultState: StateContext = {
  similarToursDateFrom: undefined,
  similarToursDateTo: undefined,
  startingLocationId: undefined,
  startingLocationName: undefined,
  childrenAges: [],
  adults: 0,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setContextState: () => {},
};

const { context, Provider, useContext } = contextFactory<StateContext>(
  defaultState,
  "ToursStateProvider"
);

export default context;
export const ToursStateProvider = Provider;
export const useToursContext = useContext;
