import React, { useCallback, useState, ChangeEvent, useMemo } from "react";

import BestPlacesStateContext, { useBestPlacesContext } from "../BestPlacesStateContext";
import {
  constructBestPlacesFilterSections,
  getDestnationFilterData,
  normalizeDestinationName,
} from "../utils/bestPlacesUtils";
import useBestPlacesQueryParams from "../useBestPlacesQueryParams";

import BestPlacesFilterWidgetDesktop from "./BestPlacesFilterWidgetDesktop";

import { useGlobalContext } from "contexts/GlobalContext";
import { MergedFilterState } from "components/features/SearchPage/FilterGeneralDetailsForm";
import { QueryParamTypes } from "components/ui/Filters/QueryParamTypes";
import { constructSelectedDatesFromQuery } from "components/ui/DatePicker/utils/datePickerUtils";
import { setDatesInLocalStorage, setTravelersInLocalStorage } from "utils/localStorageUtils";
import CustomNextDynamic from "lib/CustomNextDynamic";
import { useNumberOfSelectedFilters } from "components/ui/Filters/utils/filtersUtils";
import { StepsEnum } from "components/ui/AdvancedFilterMobileSteps/advancedFilterHelpers";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import useToggle from "hooks/useToggle";
import { useIsMobile, useIsTablet, useIsTabletStrict } from "hooks/useMediaQueryCustom";
import AdvancedFilterStepsModal from "components/ui/AdvancedFilterMobileSteps/AdvancedFilterStepsModal";
import { BestPlacesPage } from "types/enums";

const FilterGeneralDetailsForm = CustomNextDynamic(
  () => import("components/features/SearchPage/FilterGeneralDetailsForm"),
  {
    loading: () => null,
    ssr: false,
  }
);

const BestPlacesFilterModal = CustomNextDynamic(() => import("../BestPlacesFilterModal"), {
  ssr: false,
  loading: () => null,
});

const SearchAndFilterMobileFooter = CustomNextDynamic(
  () => import("components/ui/SearchWidget/SearchAndFilterMobileFooter"),
  {
    ssr: false,
    loading: () => null,
  }
);

const BestPlacesSearchWidgetContainer = ({
  locationPlaceholder,
  filters,
  onLocationInputChange,
  onLocationItemSelect,
  activeTab,
  isLoading,
  totalPlaces,
  isMobileFooterShown,
  onShowLessFiltersClick,
}: {
  locationPlaceholder: string;
  filters: BestPlacesTypes.Filters;
  onLocationInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onLocationItemSelect?: (selectedValue?: SharedTypes.AutocompleteItem) => void;
  activeTab?: BestPlacesPage;
  isLoading: boolean;
  totalPlaces?: number;
  isMobileFooterShown: boolean;
  onShowLessFiltersClick?: () => void;
}) => {
  const [queryState, setQueryParams] = useBestPlacesQueryParams();
  const { destinationId } = queryState;

  const activeDestination = getDestnationFilterData(destinationId, filters);

  const {
    isAdvancedSearchModalOpen,
    advancedSearchCurrentStep: currentStep,
    setContextState,
    startingLocationItems,
    isFullStepsModal,
    filterDateFrom,
    filterDateTo,
    childrenAges,
    adultsFilter,
  } = useBestPlacesContext();
  const [stepsState, setStepsState] = useState<SearchPageTypes.StepsModalState>({});
  const isMobile = useIsMobile();
  const isTabletStrict = useIsTabletStrict();
  const isTablet = useIsTablet();
  const [showFilterModal, toggleFilterModal] = useToggle(false);
  const { t } = useTranslation(Namespaces.bestPlacesNs);
  const { isMobileSearchWidgetBtnClicked } = useGlobalContext();
  const numberOfGuests = useMemo(
    () => ({ adults: adultsFilter, children: childrenAges }),
    [adultsFilter, childrenAges]
  );
  // Date exists in context only when user interacts with DatePicker
  // We should prefer data from Context, not from queryState
  const isDateContext = filterDateFrom !== undefined || filterDateTo !== undefined;

  const mergedState = useMemo(
    () => ({
      ...queryState,
      ...activeDestination,
      ...stepsState,
      ...(isDateContext && { dateFrom: filterDateFrom }),
      ...(isDateContext && { dateTo: filterDateTo }),
    }),
    [activeDestination, filterDateFrom, filterDateTo, isDateContext, queryState, stepsState]
  );

  const setCurrentStep = useCallback(
    (step: StepsEnum) => {
      setContextState({ advancedSearchCurrentStep: step });
    },
    [setContextState]
  );

  const toggleIsOpen = useCallback(() => {
    setContextState({
      isAdvancedSearchModalOpen: !isAdvancedSearchModalOpen,
      isFullStepsModal: false,
    });
  }, [isAdvancedSearchModalOpen, setContextState]);

  const onSearch = useCallback(
    ({
      startingLocationId,
      startingLocationName,
      startingLocationTypes,
      dateFrom,
      dateTo,
      adults = 0,
      children = 0,
      teenagers = 0,
    }: MergedFilterState) => {
      isMobileSearchWidgetBtnClicked.current = true;

      const numberOfTravelers = { adults, children, teenagers };
      let destinationIdByLocation: number | undefined;
      // try to find destination id in filters data
      if (startingLocationName) {
        const selectedDestination = filters.destinations.find(
          ({ name: destinationItemName }) =>
            destinationItemName === normalizeDestinationName(startingLocationName)
        );
        destinationIdByLocation = selectedDestination ? Number(selectedDestination.id) : undefined;
      }

      setQueryParams(
        {
          destinationId: destinationIdByLocation,
          startingLocationId,
          startingLocationName,
          startingLocationTypes,
          page: undefined,
        },
        QueryParamTypes.PUSH_IN
      );

      setDatesInLocalStorage(
        constructSelectedDatesFromQuery({
          dateFrom,
          dateTo,
        })
      );
      // TODO - looks like we need to refactor TravellerPicker to match TravelersContainer data types
      if (adults > 0) {
        setTravelersInLocalStorage(numberOfTravelers, "adults", adults, {
          childrenMaxAge: 0,
          teenagerMaxAge: 0,
        });
      }
      if (children > 0) {
        setTravelersInLocalStorage(numberOfTravelers, "children", children, {
          childrenMaxAge: 0,
          teenagerMaxAge: 0,
        });
      }
    },
    [filters.destinations, isMobileSearchWidgetBtnClicked, setQueryParams]
  );

  const onApplyClick = useCallback(() => {
    const isLastStep = currentStep === StepsEnum.Dates;

    if (isFullStepsModal && !isLastStep) {
      setCurrentStep(currentStep + 1);
      return;
    }

    onSearch(stepsState);
    toggleIsOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, queryState, stepsState, setQueryParams, toggleIsOpen]);

  const onPreviousClick = useCallback(() => {
    const isFirstStep = currentStep === StepsEnum.Details;

    if (!isFirstStep) setCurrentStep(currentStep - 1);
  }, [currentStep, setCurrentStep]);

  const mergeStepsState = useCallback(
    (replaceState: SearchPageTypes.StepsModalState) => {
      setStepsState({ ...stepsState, ...replaceState });
    },
    [stepsState]
  );

  const onModalClose = useCallback(() => {
    setStepsState(mergedState);
    toggleIsOpen();
  }, [mergedState, toggleIsOpen]);

  const numberOfSelectedFilters = useNumberOfSelectedFilters(constructBestPlacesFilterSections());

  // This needs to changed to include the landing page
  const locationLabel = () => {
    if (activeTab === BestPlacesPage.ATTRACTIONS) {
      return t("Search attractions");
    }
    if (activeTab === BestPlacesPage.DESTINATIONS) {
      return t("Search destinations");
    }
    return t("Search");
  };

  const onCalendarButtonClick = useCallback(() => {
    if (setContextState)
      setContextState({
        isAdvancedSearchModalOpen: true,
        advancedSearchCurrentStep: StepsEnum.Details,
        isFullStepsModal: true,
      });
  }, [setContextState]);

  return (
    <>
      {(isMobileFooterShown || isTablet) && (
        <SearchAndFilterMobileFooter
          onFilterButtonClick={toggleFilterModal}
          numberOfSelectedFilters={numberOfSelectedFilters}
          onLeftButtonClick={onCalendarButtonClick}
        />
      )}
      {showFilterModal && (
        <BestPlacesFilterModal
          activeTab={activeTab}
          onClose={toggleFilterModal}
          filters={filters}
          totalPlaces={totalPlaces}
          isLoading={isLoading}
        />
      )}
      {isTablet && (
        <>
          <FilterGeneralDetailsForm
            locationLabel={locationLabel()}
            startingLocationItems={startingLocationItems}
            onLocationInputChange={onLocationInputChange}
            onLocationItemSelect={onLocationItemSelect}
            locationPlaceholder={locationPlaceholder}
            context={BestPlacesStateContext}
            onSearch={onSearch}
            id="best-places-autocomplete"
          />
          <BestPlacesFilterWidgetDesktop
            filters={filters}
            activeTab={activeTab}
            onShowLessFiltersClick={onShowLessFiltersClick}
          />
        </>
      )}
      {(isMobile || isTabletStrict) && isAdvancedSearchModalOpen && (
        <AdvancedFilterStepsModal
          context={BestPlacesStateContext}
          numberOfGuests={numberOfGuests}
          namespace={Namespaces.tourSearchNs}
          currentStep={currentStep}
          onApplyClick={onApplyClick}
          onPreviousClick={onPreviousClick}
          onModalClose={onModalClose}
          setStepsState={mergeStepsState}
          childs={mergedState.children}
          onLocationInputChange={onLocationInputChange}
          startingLocationItems={startingLocationItems}
          placeholder={locationPlaceholder}
          isFullStepsModal={isFullStepsModal}
          setContextState={setContextState}
          {...mergedState}
        />
      )}
    </>
  );
};

export default BestPlacesSearchWidgetContainer;
