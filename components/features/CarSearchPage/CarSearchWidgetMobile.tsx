import React, { useContext, useCallback } from "react";

import SearchAndFilterMobileFooter from "components/ui/SearchWidget/SearchAndFilterMobileFooter";
import TextDateRangeFromQuery from "components/ui/Filters/TextDateRangeFromQuery";
import { Namespaces } from "shared/namespaces";
import { Trans } from "i18n";
import CustomNextDynamic from "lib/CustomNextDynamic";
import { FilterSectionListType, SelectedFilter } from "components/ui/Filters/FilterTypes";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import CarSearchWidgetStateContext from "components/ui/CarSearchWidget/contexts/CarSearchWidgetStateContext";
import CarSearchWidgetCallbackContext from "components/ui/CarSearchWidget/contexts/CarSearchWidgetCallbackContext";
import CarSearchWidgetMobileModal from "components/ui/CarSearchWidget/CarSearchWidgetMobile";
import { StepsEnum } from "components/ui/CarSearchWidget/enums";
import { useNumberOfSelectedFilters } from "components/ui/Filters/utils/filtersUtils";
import { CarFilterQueryParam } from "types/enums";
import { useModalHistoryContext } from "contexts/ModalHistoryContext";

const CarSearchFilterList = CustomNextDynamic(() => import("./CarSearchFilterList"), {
  ssr: false,
  loading: () => null,
});

const FilterModal = CustomNextDynamic(() => import("components/ui/Filters/FilterModal"), {
  ssr: false,
  loading: () => null,
});

const CarSearchWidgetMobile = ({
  isMobileFooterShown,
  isSearchResults,
  filters,
  loading,
  showMobileActionButtonLoadingIndicator = false,
  totalCars,
  isFilterModalOpen,
  toggleFilterModal,
  selectedFilters,
}: {
  isMobileFooterShown: boolean;
  isSearchResults: boolean;
  totalCars: number;
  filters: FilterSectionListType;
  loading: boolean;
  showMobileActionButtonLoadingIndicator?: boolean;
  selectedFilters: SelectedFilter[];

  isFilterModalOpen: boolean;
  toggleFilterModal: (isOpen: boolean) => void;
}) => {
  const isMobile = useIsMobile();

  const openFilterModal = useCallback(() => toggleFilterModal(true), []);
  const closeFilterModal = useCallback(() => toggleFilterModal(false), []);

  const { isSearchWidgetOpen, searchWidgetStep } = useContext(CarSearchWidgetStateContext);

  const { onCloseModal, openModalOnStep, onSetSearchWidgetStep, onSearchClick } = useContext(
    CarSearchWidgetCallbackContext
  );

  const { resetState } = useModalHistoryContext();

  const isFinalStep = searchWidgetStep === StepsEnum.Dates;

  const onCloseSearchModal = useCallback(() => {
    onCloseModal();
    resetState();
  }, [onCloseModal, resetState]);

  const onPreviousClick = useCallback(() => {
    onSetSearchWidgetStep(searchWidgetStep - 1);
  }, [onSetSearchWidgetStep, searchWidgetStep]);
  const openLocationStep = useCallback(() => openModalOnStep(StepsEnum.Details), [openModalOnStep]);
  const onFooterButtonClick = useCallback(
    e => {
      if (isFinalStep) {
        onSearchClick(e);
        onCloseSearchModal();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        onSetSearchWidgetStep(searchWidgetStep + 1);
      }
    },
    [isFinalStep, onSearchClick, onSetSearchWidgetStep, onCloseSearchModal, searchWidgetStep]
  );
  const numberOfSelectedFilters = useNumberOfSelectedFilters(filters);

  const onCloseFilterModal = useCallback(() => {
    closeFilterModal();
    resetState();
  }, [closeFilterModal, resetState]);

  return (
    <>
      {isMobileFooterShown && (
        <SearchAndFilterMobileFooter
          onLeftButtonClick={openLocationStep}
          onFilterButtonClick={openFilterModal}
          isSearchResults={isSearchResults}
          numberOfSelectedFilters={numberOfSelectedFilters}
          leftButtonLabel={
            <TextDateRangeFromQuery
              from={CarFilterQueryParam.DATE_FROM}
              to={CarFilterQueryParam.DATE_TO}
              withTime
            >
              <Trans ns={Namespaces.carSearchNs}>Find cars</Trans>
            </TextDateRangeFromQuery>
          }
        />
      )}
      {isMobile && isFilterModalOpen && (
        <FilterModal
          onClose={onCloseFilterModal}
          totalResults={totalCars}
          isLoading={loading || showMobileActionButtonLoadingIndicator}
        >
          <CarSearchFilterList
            filters={filters}
            loading={loading}
            selectedFilters={selectedFilters}
          />
        </FilterModal>
      )}
      {isMobile && isSearchWidgetOpen && (
        <CarSearchWidgetMobileModal
          currentStep={searchWidgetStep}
          onModalClose={onCloseSearchModal}
          onPreviousClick={onPreviousClick}
          onFooterButtonClick={onFooterButtonClick}
          searchWidgetView={searchWidgetStep === StepsEnum.Details ? "pickupInfo" : "dates"}
        />
      )}
    </>
  );
};

export default CarSearchWidgetMobile;
