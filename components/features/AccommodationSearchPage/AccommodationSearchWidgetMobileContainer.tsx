import React, { useContext, useCallback, SyntheticEvent, useMemo } from "react";

import {
  AccommodationSearchPageStateContext,
  AccommodationSearchPageCallbackContext,
} from "./AccommodationSearchPageStateContext";
import { StepsEnum } from "./AccommodationSearchWidgetModal/enums";
import {
  constructAccommodationFilterSections,
  getAccommodationMobileSteps,
} from "./utils/accommodationSearchUtils";
import { constructAccommodationFilters } from "./utils/accommodationSearchFilterUtils";

import AccommodationIcon from "components/icons/accommodation.svg";
import TextDateRangeFromQuery from "components/ui/Filters/TextDateRangeFromQuery";
import CustomNextDynamic from "lib/CustomNextDynamic";
import { FilterSectionListType, SelectedFilter } from "components/ui/Filters/FilterTypes";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import useToggle from "hooks/useToggle";
import { useNumberOfSelectedFilters } from "components/ui/Filters/utils/filtersUtils";
import { useTranslation, Trans } from "i18n";
import { Namespaces } from "shared/namespaces";
import { AccommodationFilterQueryParam } from "types/enums";
import { useModalHistoryContext } from "contexts/ModalHistoryContext";

const AccommodationSearchFilterList = CustomNextDynamic(
  () => import("./AccommodationSearchFilterList"),
  {
    ssr: false,
    loading: () => null,
  }
);

const SearchAndFilterMobileFooter = CustomNextDynamic(
  () => import("components/ui/SearchWidget/SearchAndFilterMobileFooter"),
  {
    ssr: false,
    loading: () => null,
  }
);

const AccommodationSearchWidgetModal = CustomNextDynamic(
  () => import("./AccommodationSearchWidgetModal/AccommodationSearchWidgetModal"),
  {
    ssr: false,
    loading: () => null,
  }
);

const FilterModal = CustomNextDynamic(() => import("components/ui/Filters/FilterModal"), {
  ssr: false,
  loading: () => null,
});

const AccommodationSearchWidgetMobileContainer = ({
  isMobileFooterShown,
  totalAccommodations,
  isLoading,
  areFiltersLoading,
  filters,
  accommodationCategoryName,
  defaultFilters,
  showFilters,
  selectedFilters,
  withCurrencyConversion = true,
}: {
  isMobileFooterShown: boolean;
  showFilters: boolean;
  totalAccommodations?: number;
  isLoading: boolean;
  areFiltersLoading: boolean;
  filters: FilterSectionListType;
  accommodationCategoryName?: string;
  defaultFilters: AccommodationSearchTypes.AccommodationFilter[];
  selectedFilters: SelectedFilter[];
  withCurrencyConversion?: boolean;
}) => {
  const { t } = useTranslation(Namespaces.accommodationSearchNs);
  const isMobile = useIsMobile();

  const [showFilterModal, toggleFilterModal] = useToggle(false);
  const {
    isSearchWidgetModalOpen,
    searchWidgetModalStep,
    searchWidgetOpenedStep,
    selectedDates,
    location,
  } = useContext(AccommodationSearchPageStateContext);

  const { onChangeModalStep, onSearchWidgetToggle, onSearchClick } = useContext(
    AccommodationSearchPageCallbackContext
  );

  const { resetState } = useModalHistoryContext();
  const steps = useMemo(
    () =>
      getAccommodationMobileSteps(
        showFilters,
        searchWidgetOpenedStep,
        selectedDates,
        location.name
      ),
    [showFilters, searchWidgetOpenedStep]
  );
  const isFirstStep = searchWidgetModalStep === steps[0];
  const isLastStep = searchWidgetModalStep === steps[steps.length - 1];
  const currentStepIndex = steps.indexOf(searchWidgetModalStep);
  const onPreviousClick = useCallback(() => {
    if (!isFirstStep) onChangeModalStep(steps[currentStepIndex - 1]);
  }, [onChangeModalStep, currentStepIndex, isFirstStep, steps]);

  const onModalClose = useCallback(() => {
    onSearchWidgetToggle(false);
    resetState();
  }, [onSearchWidgetToggle, resetState]);

  const onModalContinue = useCallback(
    (e: SyntheticEvent) => {
      if (!isLastStep) {
        onChangeModalStep(steps[currentStepIndex + 1]);
      } else {
        onSearchClick(e);
        onModalClose();
        onChangeModalStep(StepsEnum.Details);
      }
    },
    [isLastStep, onChangeModalStep, steps, currentStepIndex, onSearchClick, onModalClose]
  );

  const numberOfSelectedFilters = useNumberOfSelectedFilters(
    constructAccommodationFilterSections()
  );

  const defaultFiltersSections = useMemo(
    () => constructAccommodationFilters(defaultFilters, [], t, {}, accommodationCategoryName),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <>
      {isMobile && isSearchWidgetModalOpen && (
        <AccommodationSearchWidgetModal
          currentStep={searchWidgetModalStep}
          onPreviousClick={onPreviousClick}
          onModalClose={onModalClose}
          onModalContinue={onModalContinue}
          isLastStep={isLastStep}
        />
      )}
      {isMobile && showFilterModal && (
        <FilterModal
          onClose={toggleFilterModal}
          totalResults={totalAccommodations}
          isLoading={isLoading}
        >
          <AccommodationSearchFilterList
            filters={filters}
            loading={areFiltersLoading && defaultFiltersSections.length === 0}
            defaultFiltersSections={defaultFiltersSections}
            selectedFilters={selectedFilters}
            withCurrencyConversion={withCurrencyConversion}
          />
        </FilterModal>
      )}
      {isMobileFooterShown && (
        <SearchAndFilterMobileFooter
          onLeftButtonClick={onSearchWidgetToggle}
          onFilterButtonClick={toggleFilterModal}
          isSearchResults={showFilters}
          numberOfSelectedFilters={numberOfSelectedFilters}
          leftButtonSvgIcon={AccommodationIcon}
          leftButtonLabel={
            <TextDateRangeFromQuery
              from={AccommodationFilterQueryParam.DATE_FROM}
              to={AccommodationFilterQueryParam.DATE_TO}
            >
              <Trans ns={Namespaces.accommodationSearchNs}>Find accommodation</Trans>
            </TextDateRangeFromQuery>
          }
        />
      )}
    </>
  );
};

export default AccommodationSearchWidgetMobileContainer;
