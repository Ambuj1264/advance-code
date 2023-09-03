import React, { useCallback } from "react";
import styled from "@emotion/styled";

import { QueryParamTypes } from "../../ui/Filters/QueryParamTypes";

import { useBestPlacesContext } from "./BestPlacesStateContext";
import useBestPlacesQueryParams from "./useBestPlacesQueryParams";

import { BestPlacesPage, DisplayType, PageType } from "types/enums";
import { gutters } from "styles/variables";
import MediaQuery from "components/ui/MediaQuery";
import AutocompleteInput from "components/ui/Inputs/AutocompleteInput/AutocompleteInput";
import SearchIcon from "components/icons/search.svg";
import DomainSwitcher from "components/features/BestPlaces/DomainSwitcher";
import { StepsEnum } from "components/ui/AdvancedFilterMobileSteps/advancedFilterHelpers";
import { MapOverlayWrapper } from "components/ui/Map/MapOverlayLinks";

const StyledAutocompleteInput = styled(AutocompleteInput)`
  padding: ${gutters.small}px ${gutters.small}px 0;
`;

const BestPlacesMapHeader = ({
  className,
  alwaysDisplay = false,
  locationPlaceholder,
}: {
  className?: string;
  alwaysDisplay?: boolean;
  locationPlaceholder?: string;
}) => {
  const { setContextState } = useBestPlacesContext();
  const [{ activeTab, startingLocationName: selectedLocationName }, setQueryParams] =
    useBestPlacesQueryParams();
  const openLocationModalStep = useCallback(() => {
    setContextState({
      isAdvancedSearchModalOpen: true,
      advancedSearchCurrentStep: StepsEnum.Details,
    });
  }, [setContextState]);

  const onDomainButtonClick = useCallback(
    (pageType: PageType, id: BestPlacesPage) => {
      if (pageType === PageType.BEST_PLACES) {
        setQueryParams(
          {
            activeTab: activeTab === id ? undefined : id,
            attractionIds: undefined,
            page: undefined,
          },
          QueryParamTypes.PUSH_IN
        );
      }
    },
    [activeTab, setQueryParams]
  );

  const domainSwitcherPageTypes = [
    PageType.BEST_PLACES,
    PageType.TOURSEARCH,
    PageType.ACCOMMODATION_SEARCH,
    PageType.CARSEARCH,
  ];

  return (
    <MapOverlayWrapper id="mapHeader" alwaysDisplay={alwaysDisplay} className={className}>
      <MediaQuery toDisplay={DisplayType.Large}>
        <StyledAutocompleteInput
          id="starting-location-id-mobile"
          placeholder={locationPlaceholder || selectedLocationName}
          onInputClick={openLocationModalStep}
          ListIcon={SearchIcon}
        />
      </MediaQuery>
      <DomainSwitcher
        pageTypes={domainSwitcherPageTypes}
        onItemClick={onDomainButtonClick}
        activeItemId={activeTab}
      />
    </MapOverlayWrapper>
  );
};

export default BestPlacesMapHeader;
