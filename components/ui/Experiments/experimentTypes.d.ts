declare namespace ExperimentTypes {
  type OptimizeExperiment = {
    experimentId: string;
    experimentName: import("./experimentEnums").ActiveExperiments;
    variationId: string;
  };
  type OptimizeExperiments = OptimizeExperiment[];
}
