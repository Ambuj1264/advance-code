import React, { useCallback, useContext, useState, ChangeEvent, useMemo } from "react";

import SearchPageStateContext from "../SearchPageStateContext";
import { constructTourFilterSections, useSearchQueryParams } from "../utils/searchUtils";

import { getUUID } from "utils/helperUtils";
import { useSettings } from "contexts/SettingsContext";
import { SelectedFilter } from "components/ui/Filters/FilterTypes";
import { useGlobalContext } from "contexts/GlobalContext";
import { StepsEnum } from "components/ui/AdvancedFilterMobileSteps/advancedFilterHelpers";
import CustomNextDynamic from "lib/CustomNextDynamic";
import { useNumberOfSelectedFilters } from "components/ui/Filters/utils/filtersUtils";
import { QueryParamTypes } from "components/ui/Filters/QueryParamTypes";
import { useIsMobile, useIsTablet, useIsTabletStrict } from "hooks/useMediaQueryCustom";
import { Namespaces } from "shared/namespaces";
import useToggle from "hooks/useToggle";
import { useTranslation } from "i18n";
import { setToursLocation } from "utils/localStorageUtils";
import { AutoCompleteType, FilterQueryParam, Marketplace } from "types/enums";
import { useOnGTETourLocationProductClick } from "components/ui/FrontSearchWidget/frontHooks";
import TextDateRangeFromQuery from "components/ui/Filters/TextDateRangeFromQuery";

const SearchWidgetDesktopContainer = CustomNextDynamic(
  () => import("./SearchWidgetDesktopContainer"),
  {
    ssr: false,
    loading: () => null,
  }
);

const AdvancedFilterStepsModal = CustomNextDynamic(
  () => import("components/ui/AdvancedFilterMobileSteps/AdvancedFilterStepsModal"),
  {
    ssr: false,
    loading: () => null,
  }
);

const FilterGeneralDetailsForm = CustomNextDynamic(() => import("../FilterGeneralDetailsForm"), {
  loading: () => null,
  ssr: false,
});

const SearchFilterModal = CustomNextDynamic(() => import("./SearchFilterModal"), {
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

const SearchWidgetContainer = ({
  filters,
  totalTours,
  isLoading,
  onLocationInputChange,
  isMobileFooterShown,
  selectedFilters,
  className,
}: {
  filters?: SearchPageTypes.Filters;
  totalTours?: number;
  isLoading: boolean;
  onLocationInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  isMobileFooterShown: boolean;
  selectedFilters?: SelectedFilter[];
  className?: string;
}) => {
  const { marketplace } = useSettings();
  const isGTE = marketplace === Marketplace.GUIDE_TO_EUROPE;
  const [queryState, setQueryParams] = useSearchQueryParams();
  const { t } = useTranslation(Namespaces.tourSearchNs);
  const { t: commonT } = useTranslation(Namespaces.commonNs);
  const {
    isAdvancedSearchModalOpen,
    advancedSearchCurrentStep: currentStep,
    setContextState,
    startingLocationItems,
    selectedLocationName,
    isFullStepsModal,
    filterDateFrom,
    filterDateTo,
    childrenAges,
    adultsFilter,
    selectedLocationId,
  } = useContext(SearchPageStateContext);

  const [stepsState, setStepsState] = useState<SearchPageTypes.StepsModalState>({});
  const [showFilterModal, toggleFilterModal] = useToggle(false);
  const isMobile = useIsMobile();
  const isTabletStrict = useIsTabletStrict();
  const isTablet = useIsTablet();
  const { isMobileSearchWidgetBtnClicked } = useGlobalContext();
  const numberOfGuests = { adults: adultsFilter, children: childrenAges };
  // Date exists in context only when user interacts with DatePicker
  // We should prefer data from Context, not from queryState
  const isDateContext = filterDateFrom !== undefined || filterDateTo !== undefined;
  const onGTETourLocationProductClick = useOnGTETourLocationProductClick();
  const mergedState = useMemo(
    () => ({
      ...queryState,
      ...stepsState,
      ...(isDateContext && { dateFrom: filterDateFrom }),
      ...(isDateContext && { dateTo: filterDateTo }),
      ...(childrenAges && childrenAges.length && { childrenAges, children: childrenAges.length }),
    }),
    [childrenAges, filterDateFrom, filterDateTo, isDateContext, queryState, stepsState]
  );
  const {
    dateFrom,
    dateTo,
    startingLocationId,
    adults: queryAdults,
    childrenAges: queryChildrenAges,
  } = queryState;
  const hasSearchCriteriaChanged =
    filterDateFrom !== dateFrom ||
    filterDateTo !== dateTo ||
    startingLocationId !== selectedLocationId ||
    queryAdults !== adultsFilter ||
    childrenAges.length !== (queryChildrenAges || []).length;
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

  const onApplyClick = useCallback(() => {
    const isLastStep = currentStep === StepsEnum.Dates;
    if (isFullStepsModal && !isLastStep) {
      setCurrentStep(currentStep + 1);
      return;
    }
    if (isFullStepsModal && isLastStep) {
      isMobileSearchWidgetBtnClicked.current = true;
      setQueryParams(
        {
          ...mergedState,
          page: undefined,
          ...(isGTE && hasSearchCriteriaChanged ? { requestId: getUUID() } : {}),
        },
        QueryParamTypes.PUSH_IN
      );
    }

    toggleIsOpen();
  }, [
    currentStep,
    isFullStepsModal,
    toggleIsOpen,
    setCurrentStep,
    isMobileSearchWidgetBtnClicked,
    setQueryParams,
    mergedState,
  ]);

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

  const onLocationItemSelect = useCallback((selectedValue?: SharedTypes.AutocompleteItem) => {
    if (selectedValue?.type === AutoCompleteType.PRODUCT && isGTE) {
      onGTETourLocationProductClick(selectedValue!.id);
    }
    setToursLocation({
      id: selectedValue?.id,
      name: selectedValue?.name,
    });
  }, []);

  const onMobileFooterLeftButtonClick = useCallback(() => {
    if (setContextState)
      setContextState({
        isAdvancedSearchModalOpen: true,
        advancedSearchCurrentStep: StepsEnum.Details,
        isFullStepsModal: true,
      });
  }, [setContextState]);

  const numberOfSelectedFilters = useNumberOfSelectedFilters(constructTourFilterSections());

  return (
    <>
      {(isMobileFooterShown || isTablet) && (
        <SearchAndFilterMobileFooter
          onFilterButtonClick={toggleFilterModal}
          onLeftButtonClick={onMobileFooterLeftButtonClick}
          leftButtonLabel={
            <TextDateRangeFromQuery from={FilterQueryParam.DATE_FROM} to={FilterQueryParam.DATE_TO}>
              {commonT("Travel details")}
            </TextDateRangeFromQuery>
          }
          numberOfSelectedFilters={numberOfSelectedFilters}
        />
      )}
      {showFilterModal && (
        <SearchFilterModal
          onClose={toggleFilterModal}
          filters={filters}
          totalTours={totalTours}
          isLoading={isLoading}
          selectedFilters={selectedFilters}
        />
      )}
      {isTablet && (
        <>
          <FilterGeneralDetailsForm
            locationLabel={t("Starting location")}
            startingLocationItems={startingLocationItems}
            onLocationInputChange={onLocationInputChange}
            onLocationItemSelect={onLocationItemSelect}
            context={SearchPageStateContext}
            className={className}
          />
          <SearchWidgetDesktopContainer
            filters={filters}
            selectedFilters={selectedFilters}
            isLoading={isLoading}
          />
        </>
      )}
      {(isMobile || isTabletStrict) && isAdvancedSearchModalOpen && (
        <AdvancedFilterStepsModal
          context={SearchPageStateContext}
          namespace={Namespaces.tourSearchNs}
          currentStep={currentStep}
          onApplyClick={onApplyClick}
          onPreviousClick={onPreviousClick}
          onModalClose={onModalClose}
          setStepsState={mergeStepsState}
          childs={mergedState.children}
          onLocationInputChange={onLocationInputChange}
          startingLocationItems={startingLocationItems}
          selectedLocationName={selectedLocationName}
          isFullStepsModal={isFullStepsModal}
          setContextState={setContextState}
          numberOfGuests={numberOfGuests}
          {...mergedState}
        />
      )}
    </>
  );
};

export default SearchWidgetContainer;
