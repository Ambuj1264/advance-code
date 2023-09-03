import { useEffect } from "react";

import { declareDataLayer } from "../Tracking/declareDataLayer";

import { ActiveExperiments } from "./experimentEnums";

import { useExperimentContext } from "components/ui/Experiments/ExperimentContext";
import { getOptimizeExperiments } from "components/ui/Experiments/experimentUtils";

const pushOptimizeExperimentToDataLayer = ({
  experimentId,
  experimentVariation,
}: {
  experimentId: string;
  experimentVariation: string;
}) => {
  declareDataLayer();
  // eslint-disable-next-line functional/immutable-data
  window.dataLayer?.push({
    expId: experimentId,
    expVar: experimentVariation,
  });
};

const useOptimizeExperiments = ({
  experimentName,
  experimentVariation,
}: {
  experimentName: ActiveExperiments;
  experimentVariation: string;
}) => {
  const { optimizeExperiments } = useExperimentContext();

  const { experimentId } =
    (optimizeExperiments.find(
      experiment => experiment.experimentName === experimentName
    ) as ExperimentTypes.OptimizeExperiment) || getOptimizeExperiments();

  useEffect(() => {
    if (experimentId) {
      pushOptimizeExperimentToDataLayer({ experimentId, experimentVariation });
    }
  }, [experimentId, experimentVariation]);
};

export default useOptimizeExperiments;
