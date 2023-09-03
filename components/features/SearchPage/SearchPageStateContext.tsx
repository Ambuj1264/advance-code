import { StepsEnum } from "components/ui/AdvancedFilterMobileSteps/advancedFilterHelpers";
import { DEFAULT_TRAVELER_AMOUNT } from "components/ui/Inputs/TravellerPicker/TravellerPicker";
import contextFactory from "contexts/contextFactory";

type SearchPageStateContext = {
  isAdvancedSearchModalOpen: boolean;
  advancedSearchCurrentStep: StepsEnum;
  selectedLocationName?: string;
  selectedLocationId?: string;
  startingLocationItems?: SharedTypes.AutocompleteItem[];
  locationPlaceholder?: string;
  adultsFilter: number;
  childrenFilter?: number;
  childrenAges: number[];
  filterDateFrom?: string;
  filterDateTo?: string;
  isFullStepsModal: boolean;
};

const defaultState: SearchPageStateContext = {
  isAdvancedSearchModalOpen: false,
  advancedSearchCurrentStep: StepsEnum.Details,
  selectedLocationName: undefined,
  selectedLocationId: undefined,
  startingLocationItems: undefined,
  locationPlaceholder: undefined,
  adultsFilter: DEFAULT_TRAVELER_AMOUNT,
  childrenFilter: undefined,
  childrenAges: [],
  filterDateFrom: undefined,
  filterDateTo: undefined,
  isFullStepsModal: false,
};

const { context, Provider } = contextFactory<SearchPageStateContext>(defaultState);

export default context;
export const SearchPageStateContextProvider = Provider;
