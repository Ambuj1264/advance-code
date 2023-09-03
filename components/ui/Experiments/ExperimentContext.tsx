import contextFactory from "contexts/contextFactory";

type ExperimentContextState = {
  optimizeExperiments: ExperimentTypes.OptimizeExperiments;
};

const defaultState: ExperimentContextState = {
  optimizeExperiments: [],
};

const { context, Provider, useContext } = contextFactory<ExperimentContextState>(defaultState);

export default context;
export const ExperimentContextProvider = Provider;
export const useExperimentContext = useContext;
