import React, { ChangeEvent, Context, SyntheticEvent, useCallback, useContext } from "react";
import styled from "@emotion/styled";
import { useQueryParams, StringParam, NumberParam, ArrayParam } from "use-query-params";
import usePreviousState from "@travelshift/ui/hooks/usePreviousState";

import { searchWidgetAlignment } from "../VacationPackagesSearchWidget/VacationPackageSearchWidget";

import { getUUID } from "utils/helperUtils";
import { Marketplace, FilterQueryParam } from "types/enums";
import {
  useSetNumberOfGuestsByTypeInSearchContext,
  useUpdateChildrenAgesInSearchContext,
} from "components/ui/FrontSearchWidget/frontHooks";
import {
  DateRangeEnum,
  constructQueryFromSelectedDates,
  constructSelectedDatesFromQuery,
  isSameSelectedDates,
} from "components/ui/DatePicker/utils/datePickerUtils";
import {
  clearDatesInLocalStorage,
  clearEndDateInLocalStorage,
  setDatesInLocalStorage,
} from "utils/localStorageUtils";
import SearchIcon from "components/icons/search.svg";
import AutocompleteInput, {
  InputStyled,
} from "components/ui/Inputs/AutocompleteInput/AutocompleteInput";
import { useTranslation, Trans } from "i18n";
import { gutters } from "styles/variables";
import TravellerPicker from "components/ui/Inputs/TravellerPicker/TravellerPicker";
import { mqMin } from "styles/base";
import { QueryParamTypes } from "components/ui/Filters/QueryParamTypes";
import Label from "components/ui/SearchWidget/Label";
import SearchWidgetButton from "components/ui/SearchWidget/SearchWidgetButton";
import SearchWidgetDatePicker from "components/ui/SearchWidget/SearchWidgetDatePicker";
import { Namespaces } from "shared/namespaces";
import { SearchWidgetMobile, SearchWidgetDesktop } from "components/ui/SearchWidget/SearchWidget";
import { StartingLocationTypes } from "components/ui/Map/utils/mapUtils";
import { useSettings } from "contexts/SettingsContext";

export const AutocompleteInputStyled = styled(AutocompleteInput)`
  margin-bottom: ${gutters.small / 2}px;
  ${InputStyled} {
    Input {
      height: 100%;
      padding-top: 0;
    }
  }
`;

const StyledSearchWidgetDatePicker = styled(SearchWidgetDatePicker)`
  ${searchWidgetAlignment};
`;

const TravellerPickerStyled = styled(TravellerPicker)<{}>`
  margin-bottom: ${gutters.large / 2}px;

  ${mqMin.large} {
    margin-bottom: ${gutters.large}px;
    ${searchWidgetAlignment};
  }
`;
export type MergedFilterState = {
  startingLocationId?: string;
  startingLocationName?: string;
  startingLocationTypes?: StartingLocationTypes[];
  adults?: number;
  children?: number;
  teenagers?: number;
  dateFrom?: string;
  dateTo?: string;
};

const FilterGeneralDetailsForm = ({
  id = "starting-location-id",
  locationLabel,
  locationPlaceholder,
  startingLocationItems,
  onLocationInputClick,
  onDateInputClick,
  onTravellersInputClick,
  onLocationInputChange,
  onLocationItemSelect,
  onSearch,
  isMobile,
  context,
  className,
}: {
  id?: string;
  locationLabel: string;
  locationPlaceholder?: string;
  startingLocationItems?: SharedTypes.AutocompleteItem[];
  onLocationInputClick?: (e: SyntheticEvent) => void;
  onDateInputClick?: (e: SyntheticEvent, type?: DateRangeEnum) => void;
  onTravellersInputClick?: (e: SyntheticEvent) => void;
  onLocationInputChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onLocationItemSelect?: (selectedValue?: SharedTypes.AutocompleteItem) => void;
  onSearch?: (mergedState: MergedFilterState) => void;
  isMobile?: boolean;
  context: Context<any>;
  className?: string;
}) => {
  const { marketplace } = useSettings();
  const isGTE = marketplace === Marketplace.GUIDE_TO_EUROPE;
  const { t } = useTranslation(Namespaces.tourSearchNs);
  const [queryState, setQueryParams] = useQueryParams({
    [FilterQueryParam.STARTING_LOCATION_ID]: StringParam,
    [FilterQueryParam.ADULTS]: NumberParam,
    [FilterQueryParam.CHILDREN]: NumberParam,
    [FilterQueryParam.DATE_FROM]: StringParam,
    [FilterQueryParam.DATE_TO]: StringParam,
    [FilterQueryParam.STARTING_LOCATION_NAME]: StringParam,
    [FilterQueryParam.CHILDREN_AGES]: ArrayParam,
    [FilterQueryParam.REQUEST_ID]: StringParam,
  });
  const {
    selectedLocationId,
    adultsFilter,
    childrenFilter,
    filterDateFrom,
    filterDateTo,
    selectedLocationName,
    selectedLocationTypes,
    setContextState,
    childrenAges,
  } = useContext(context);
  const updateChildrenAges = useUpdateChildrenAgesInSearchContext();
  const setNumberOfGuestsByTypeInSearchContext = useSetNumberOfGuestsByTypeInSearchContext(context);
  // Date exists in context only when user interacts with DatePicker
  // We should prefer data from Context, not from queryState
  const isDateContext = filterDateFrom !== undefined || filterDateTo !== undefined;
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
    childrenAges.length !== queryChildrenAges?.length;
  const mergedState = {
    ...queryState,
    ...(selectedLocationId && { startingLocationId: selectedLocationId }),
    ...(selectedLocationName && { startingLocationName: selectedLocationName }),
    ...(selectedLocationTypes && {
      startingLocationTypes: selectedLocationTypes,
    }),
    ...(adultsFilter && { adults: adultsFilter }),
    ...(childrenFilter !== undefined && { children: childrenFilter }),
    ...(isDateContext && { dateFrom: filterDateFrom }),
    ...(isDateContext && { dateTo: filterDateTo }),
    ...(childrenAges && childrenAges.length >= 0 && { childrenAges }),
    ...(isGTE && hasSearchCriteriaChanged ? { requestId: getUUID() } : {}),
    page: 1,
  };
  const { adults } = mergedState;
  const querySelectedDates = constructSelectedDatesFromQuery({
    dateFrom,
    dateTo,
  });
  const prevQuerySelectedDates = usePreviousState(querySelectedDates);
  const isQuerySelectedDatesChanged = isSameSelectedDates(
    querySelectedDates,
    prevQuerySelectedDates
  );
  if (isQuerySelectedDatesChanged) {
    setDatesInLocalStorage(querySelectedDates);
  }

  const locationItemSelect = useCallback(
    (selectedValue?: SharedTypes.AutocompleteItem) => {
      onLocationItemSelect?.(selectedValue);
      setContextState({
        selectedLocationId: selectedValue?.id,
        selectedLocationName: selectedValue?.name,
        selectedLocationTypes: selectedValue?.types,
      });
    },
    [setContextState, onLocationItemSelect]
  );

  const setRangeDates = useCallback(
    (dates: SharedTypes.SelectedDates) => {
      setDatesInLocalStorage(dates);

      if (!dates.to) {
        clearEndDateInLocalStorage();
      }

      const queryDates = constructQueryFromSelectedDates(dates);
      setContextState({
        filterDateFrom: queryDates.dateFrom,
        filterDateTo: queryDates.dateTo,
      });
    },
    [setContextState]
  );

  const setNumberOfGuests = useCallback(
    (type: SharedTypes.TravelerType, number: number) => {
      setNumberOfGuestsByTypeInSearchContext(type, number);
    },
    [setNumberOfGuestsByTypeInSearchContext]
  );

  const onSearchClick = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      if (onSearch) {
        onSearch(mergedState);
      } else {
        setQueryParams(
          {
            ...mergedState,
          },
          QueryParamTypes.PUSH
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setQueryParams, mergedState]
  );

  const onDatesClear = useCallback(() => {
    clearDatesInLocalStorage();
    setContextState({
      filterDateFrom: "",
      filterDateTo: "",
    });
  }, [setContextState]);

  const selectedDates = {
    from: filterDateFrom ? new Date(filterDateFrom) : undefined,
    to: filterDateTo ? new Date(filterDateTo) : undefined,
  };
  const browserDate = new Date();
  const initialMonth = selectedDates.from || selectedDates.to || browserDate;
  const Wrapper = isMobile ? SearchWidgetMobile : SearchWidgetDesktop;

  return (
    <Wrapper>
      <Label>{locationLabel}</Label>
      <AutocompleteInputStyled
        id={id}
        listItems={startingLocationItems}
        placeholder={locationPlaceholder}
        defaultValue={selectedLocationName}
        onInputChange={onLocationInputChange}
        onItemClick={locationItemSelect}
        onInputClick={onLocationInputClick}
        ListIcon={SearchIcon}
        disabled={!!onLocationInputClick}
        isWideDropdown={false}
        className={className}
      />

      <Label>
        <Trans>Select travel period</Trans>
      </Label>
      <StyledSearchWidgetDatePicker
        id={id}
        selectedDates={selectedDates}
        initialMonth={initialMonth}
        onDateSelection={setRangeDates}
        onDateInputClick={onDateInputClick}
        minDays={1}
        dates={{ unavailableDates: [], min: browserDate }}
        fromPlaceholder={t("Starting date")}
        toPlaceholder={t("Final date")}
        preOpenCalendar={false}
        allowSeparateSelection
        disabled={!!onDateInputClick}
        onClear={onDatesClear}
      />

      <Label>
        <Trans>Select number of travelers</Trans>
      </Label>
      <TravellerPickerStyled
        id={id}
        numberOfGuests={{ adults, children: childrenAges }}
        onSetNumberOfGuests={setNumberOfGuests}
        updateChildrenAges={updateChildrenAges}
        guestGroups={[
          {
            id: "adults",
            defaultNumberOfType: 1,
            type: "adults",
          },
          {
            id: "children",
            defaultNumberOfType: 0,
            type: "children",
          },
        ]}
        onInputClick={onTravellersInputClick}
        disabled={!!onTravellersInputClick}
        namespace={Namespaces.tourSearchNs}
      />

      <SearchWidgetButton onSearchClick={onSearchClick} />
    </Wrapper>
  );
};

export default FilterGeneralDetailsForm;
