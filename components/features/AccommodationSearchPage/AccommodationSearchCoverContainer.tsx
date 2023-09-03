import React, { useContext } from "react";
import styled from "@emotion/styled";

import AccommodationSearchWidgetMobileContainer from "./AccommodationSearchWidgetMobileContainer";
import {
  AccommodationSearchPageCallbackContext,
  AccommodationSearchPageStateContext,
} from "./AccommodationSearchPageStateContext";
import { StepsEnum } from "./AccommodationSearchWidgetModal/enums";

import { useIsMobile } from "hooks/useMediaQueryCustom";
import { ContentWrapper } from "components/ui/Tabs/RoundedTabs";
import { mqMin } from "styles/base";
import SearchCoverContainer from "components/ui/Search/SearchCoverContainer";
import { FilterSectionListType, SelectedFilter } from "components/ui/Filters/FilterTypes";
import StaysTabContent from "components/ui/FrontSearchWidget/Stays/StaysTabContent";
import { gutters } from "styles/variables";
import LoadingCover from "components/ui/Loading/LoadingCover";
import FrontValuePropositionsSkeleton from "components/ui/FrontValuePropositions/FrontValuePropositionsSkeleton";
import { Wrapper as TooltipWrapper } from "components/ui/Tooltip/Tooltip";
import { ActiveLocationAutocomplete } from "components/ui/FrontSearchWidget/utils/FrontEnums";

const StyledContentWrapper = styled(ContentWrapper)<{}>`
  position: relative;
  padding: ${gutters.small / 2}px ${gutters.small}px ${gutters.small}px ${gutters.small}px;
  text-align: left;

  ${TooltipWrapper} {
    button[type="submit"] {
      margin-top: 0;
    }
  }

  ${mqMin.large} {
    padding: ${gutters.small / 2}px ${gutters.large}px ${gutters.small * 2}px ${gutters.large}px;
  }
`;

const AccommodationSearchWidgetWrapper = styled.div`
  width: 100%;
  max-width: 548px;
  padding: ${gutters.small}px;

  ${mqMin.large} {
    max-width: 1156px;
  }

  ${mqMin.desktop} {
    padding: 0 ${gutters.large}px;
  }
`;

const AccommodationSearchCoverContainer = ({
  isMobileFooterShown,
  showFilters,
  filters,
  totalAccommodations,
  searchCategory,
  defaultFilters,
  shouldShowCover,
  partialLoading,
  selectedFilters,
}: {
  isMobileFooterShown: boolean;
  showFilters: boolean;
  filters: FilterSectionListType;
  totalAccommodations?: number;
  searchCategory?: SharedTypes.SearchCategoryInfo;
  defaultFilters: AccommodationSearchTypes.AccommodationFilter[];
  shouldShowCover: boolean;
  partialLoading: SharedTypes.PartialLoading;
  selectedFilters: SelectedFilter[];
}) => {
  const isMobile = useIsMobile();
  const isMobileOrSSR = isMobile || typeof window === "undefined";

  const {
    onSearchClick,
    onDateSelection,
    onClearDates,
    onLocationInputChange,
    onLocationItemSelect,
    onSetNumberOfGuests,
    onSetNumberOfRooms,
    openModalOnStep,
    onUpdateChildrenAges,
    onSetActiveLocationAutocomplete,
  } = useContext(AccommodationSearchPageCallbackContext);
  const {
    selectedDates,
    locationItems,
    numberOfGuests,
    numberOfRooms,
    location,
    isDesktopCalendarOpen,
  } = useContext(AccommodationSearchPageStateContext);
  const address = location?.name || "";

  if (!searchCategory) {
    return (
      <>
        <LoadingCover />
        <FrontValuePropositionsSkeleton />
      </>
    );
  }
  return (
    <>
      <SearchCoverContainer cover={searchCategory.cover} showCover={shouldShowCover}>
        <AccommodationSearchWidgetWrapper>
          <StyledContentWrapper noTabs>
            <StaysTabContent
              onSearchClick={onSearchClick}
              isMobile={isMobileOrSSR}
              onSetNumberOfRooms={onSetNumberOfRooms}
              selectedDates={selectedDates}
              numberOfGuests={numberOfGuests}
              onDateInputClick={() => {
                openModalOnStep(StepsEnum.Dates);
                onSetActiveLocationAutocomplete(ActiveLocationAutocomplete.None);
              }}
              onGuestsInputClick={() => {
                openModalOnStep(StepsEnum.Details);
                onSetActiveLocationAutocomplete(ActiveLocationAutocomplete.None);
              }}
              onDatesClear={onClearDates}
              onDateSelection={onDateSelection}
              onLocationInputChange={onLocationInputChange}
              onLocationItemClick={onLocationItemSelect}
              updateChildrenAges={onUpdateChildrenAges}
              locationItems={locationItems}
              accommodationType={location?.type}
              address={address}
              numberOfRooms={numberOfRooms}
              onLocationInputClick={() => {
                openModalOnStep(StepsEnum.Details);
                onSetActiveLocationAutocomplete(ActiveLocationAutocomplete.Destination);
              }}
              onSetNumberOfGuests={onSetNumberOfGuests}
              isDesktopCalendarOpen={isDesktopCalendarOpen}
              occupancies={[]}
              setOccupancies={() => {}}
            />
          </StyledContentWrapper>
        </AccommodationSearchWidgetWrapper>
      </SearchCoverContainer>
      <AccommodationSearchWidgetMobileContainer
        isMobileFooterShown={isMobileFooterShown}
        showFilters={showFilters}
        filters={filters}
        totalAccommodations={totalAccommodations}
        isLoading={partialLoading.allProvidersLoading}
        areFiltersLoading={partialLoading.allProvidersLoading}
        accommodationCategoryName={searchCategory?.categoryName}
        defaultFilters={defaultFilters}
        selectedFilters={selectedFilters}
      />
    </>
  );
};

export default AccommodationSearchCoverContainer;
