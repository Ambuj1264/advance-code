import React, { SyntheticEvent, useMemo, useEffect, useCallback } from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";

import TripsDatePicker from "./TripsDatePicker";

import { useIsDesktop } from "hooks/useMediaQueryCustom";
import {
  useGetParticularStepOpenHandler,
  useToursLocationHooks,
  useSetNumberOfGuestsByType,
  useUpdateChildrenAges,
  useToggleCalendarClientSideState,
} from "components/ui/FrontSearchWidget/frontHooks";
import {
  AutocompleteInputLarge,
  TravellerPickerLarge,
} from "components/ui/FrontSearchWidget/FrontTabsShared";
import { frontGuestGroups } from "components/ui/FrontSearchWidget/utils/frontUtils";
import {
  DesktopColumn,
  TabContent,
  SearchWidgetButtonStyled,
} from "components/ui/SearchWidget/SearchWidgetShared";
import {
  FrontStepKeys,
  useFrontSearchContext,
} from "components/ui/FrontSearchWidget/FrontSearchStateContext";
import Label from "components/ui/SearchWidget/Label";
import SearchIcon from "components/icons/search.svg";
import {
  TripsMobileStepsEnum,
  ActiveLocationAutocomplete,
} from "components/ui/FrontSearchWidget/utils/FrontEnums";
import { useSettings } from "contexts/SettingsContext";
import useGTETourDefaultLocations from "components/features/GTETourSearchPage/useTourDefaultLocations";
import { useTranslation, Trans } from "i18n";
import { Namespaces } from "shared/namespaces";
import { Marketplace } from "types/enums";
import { gutters } from "styles/variables";

const AutocompleteInputLargeStyled = styled(AutocompleteInputLarge)(
  () => css`
    margin-bottom: 0;
  `
);

const TripsTab = ({
  onSearchClick,
  isMobile,
  useDesktopStyle = true,
}: {
  onSearchClick: (e: SyntheticEvent) => void;
  isMobile: boolean;
  useDesktopStyle?: boolean;
}) => {
  const { t: commonSearchT } = useTranslation(Namespaces.commonSearchNs);
  const { t: tourSearchT } = useTranslation(Namespaces.tourSearchNs);
  const { marketplace } = useSettings();
  const isDesktop = useIsDesktop();
  const isGTE = marketplace === Marketplace.GUIDE_TO_EUROPE;
  const {
    dateFrom,
    dateTo,
    adults,
    childrenAges,
    isSingleDate,
    tripStartingLocationItems,
    tripStartingLocationName,
    setContextState,
  } = useFrontSearchContext();
  const { onLocationInputChange, onLocationItemClick } = useToursLocationHooks(marketplace);
  const defaultLocationsList = useGTETourDefaultLocations({
    shouldSkip: Boolean(tripStartingLocationItems?.length),
  });
  const setNumberOfGuests = useSetNumberOfGuestsByType();
  const updateChildrenAges = useUpdateChildrenAges();
  const tripsStepsController = useGetParticularStepOpenHandler<TripsMobileStepsEnum>(
    FrontStepKeys.tripsCurrentStep
  );
  const onLocationInputClick = tripsStepsController(TripsMobileStepsEnum.Details, {
    activeLocationAutocomplete: ActiveLocationAutocomplete.Destination,
  });
  const onDateInputClick = tripsStepsController(TripsMobileStepsEnum.Dates, {
    activeLocationAutocomplete: ActiveLocationAutocomplete.None,
  });
  const onTravellersInputClick = tripsStepsController(TripsMobileStepsEnum.Details, {
    activeLocationAutocomplete: ActiveLocationAutocomplete.None,
  });

  const numberOfGuests = useMemo(
    () => ({
      adults,
      children: childrenAges,
    }),
    [adults, childrenAges]
  );

  useEffect(() => {
    if (defaultLocationsList.length > 0 && !tripStartingLocationItems?.length) {
      setContextState({ tripStartingLocationItems: defaultLocationsList });
    }
  }, [defaultLocationsList, tripStartingLocationItems, setContextState]);

  const onSearchButtonClick = useCallback(
    (e: SyntheticEvent) => {
      const isLocationMissing = !tripStartingLocationName;
      if (isLocationMissing && !isDesktop) {
        e.preventDefault();
        onLocationInputClick();
      } else {
        onSearchClick(e);
      }
    },
    [tripStartingLocationName, onLocationInputClick, onSearchClick]
  );

  const isAllDatesSelected = Boolean(isSingleDate ? dateFrom && dateTo : dateFrom);

  const isCalendarOpen = useToggleCalendarClientSideState(
    Boolean(tripStartingLocationName) && !isAllDatesSelected && useDesktopStyle
  );

  return (
    <TabContent data-testid="tripsTab" useDesktopStyle={useDesktopStyle}>
      <DesktopColumn
        baseWidth={30}
        flexOrderMobile={1}
        mobileFlexGrow={1}
        useDesktopStyle={useDesktopStyle}
      >
        <Label>
          <Trans ns={Namespaces.tourSearchNs}>Select starting location</Trans>
        </Label>
        <AutocompleteInputLargeStyled
          id="trips-location-id"
          listItems={tripStartingLocationItems}
          defaultValue={tripStartingLocationName}
          onInputChange={onLocationInputChange}
          onItemClick={onLocationItemClick}
          onInputClick={onLocationInputClick}
          ListIcon={SearchIcon}
          disabled={isMobile}
          placeholder={tourSearchT("Select your destination")}
          useProduct
        />
      </DesktopColumn>

      <DesktopColumn
        baseWidth={30}
        flexOrderMobile={3}
        mobileMarginBottom={gutters.small}
        useDesktopStyle={useDesktopStyle}
      >
        <Label>
          <Trans ns={Namespaces.commonNs}>Select date range</Trans>
        </Label>
        <TripsDatePicker
          dateFrom={dateFrom}
          dateTo={dateTo}
          onDateInputClick={onDateInputClick}
          isMobile={isMobile}
          isSingleDate={isSingleDate}
          useDesktopStyle={useDesktopStyle}
          isOpen={isCalendarOpen}
        />
      </DesktopColumn>

      <DesktopColumn
        baseWidth={25}
        flexOrderMobile={2}
        mobileFlexGrow={1}
        useDesktopStyle={useDesktopStyle}
      >
        <Label>
          <Trans ns={Namespaces.tourSearchNs}>Add travelers</Trans>
        </Label>
        <TravellerPickerLarge
          numberOfGuests={numberOfGuests}
          onSetNumberOfGuests={setNumberOfGuests}
          updateChildrenAges={updateChildrenAges}
          guestGroups={frontGuestGroups}
          onInputClick={onTravellersInputClick}
          namespace={Namespaces.tourSearchNs}
          disabled={isMobile}
        />
      </DesktopColumn>

      <DesktopColumn baseWidth={15} flexOrderMobile={4} useDesktopStyle={useDesktopStyle}>
        <SearchWidgetButtonStyled
          onSearchClick={onSearchButtonClick}
          tooltipErrorMessage={
            !tripStartingLocationName && isGTE && isDesktop
              ? commonSearchT("Please fill in your search information")
              : undefined
          }
        />
      </DesktopColumn>
    </TabContent>
  );
};

export default TripsTab;
