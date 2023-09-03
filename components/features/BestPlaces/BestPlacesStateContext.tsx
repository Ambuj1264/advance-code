import { StepsEnum } from "components/ui/AdvancedFilterMobileSteps/advancedFilterHelpers";
import contextFactory from "contexts/contextFactory";

type BestPlacesStateContext = {
  isAdvancedSearchModalOpen: boolean;
  advancedSearchCurrentStep: StepsEnum;
  locationPlaceholder?: string;
  selectedLocationName?: string;
  selectedLocationId?: string;
  startingLocationItems?: SharedTypes.AutocompleteItem[];
  childrenAges: number[];
  adultsFilter: number;
  childrenFilter: number;
  filterDateFrom?: string;
  filterDateTo?: string;
  isFullStepsModal: boolean;
};

const defaultState: BestPlacesStateContext = {
  isAdvancedSearchModalOpen: false,
  advancedSearchCurrentStep: StepsEnum.Details,
  locationPlaceholder: undefined,
  selectedLocationName: undefined,
  selectedLocationId: undefined,
  startingLocationItems: undefined,
  childrenAges: [],
  adultsFilter: 2,
  childrenFilter: 0,
  filterDateFrom: undefined,
  filterDateTo: undefined,
  isFullStepsModal: false,
};

const { context, Provider, useContext } = contextFactory<BestPlacesStateContext>(defaultState);

export default context;
export const BestPlacesStateContextProvider = Provider;
export const useBestPlacesContext = useContext;
