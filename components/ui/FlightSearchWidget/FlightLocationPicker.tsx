import React, { useCallback, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { useHideMobileKeyboard } from "../Inputs/AutocompleteInput/utils/autocompleteUtils";
import { Wrapper } from "../Inputs/Input";

import FlightGetLocationsQuery from "./queries/FlightLocations.graphql";
import { updateChineseLocaleFlightsQueryHeader } from "./utils/flightSearchWidgetUtils";

import useOnDidUpdate from "hooks/useOnDidUpdate";
import { AutocompleteInputLargeHalf } from "components/ui/FrontSearchWidget/FrontTabsShared";
import SearchIcon from "components/icons/search.svg";
import {
  AutocompleteDoubleWrapper,
  AutocompleteStyled,
  InputStyled,
  Separator,
} from "components/ui/Inputs/AutocompleteInput/AutocompleteInput";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { mqMin } from "styles/base";
import { AutoCompleteType, FlightFunnelType } from "types/enums";
import useActiveLocale from "hooks/useActiveLocale";
import { useSettings } from "contexts/SettingsContext";

const StyledAutocompleteDoubleWrapper = styled(AutocompleteDoubleWrapper)(
  ({ reducedHeightDesktop, theme }: { reducedHeightDesktop: boolean; theme?: Theme }) =>
    reducedHeightDesktop
      ? css`
          height: 48px;

          ${Wrapper} {
            display: flex;
            align-items: center;
          }
          ${mqMin.large} {
            height: 50px;
          }
          ${Separator} {
            ${mqMin.large} {
              top: 11px;
            }
          }

          ${InputStyled} {
            border-color: ${theme?.colors.primary};
          }
        `
      : ""
);

const FlightLocationPicker = ({
  id,
  className,
  isMobile,
  onOriginLocationChange,
  onDestinationLocationChange,
  onOriginLocationClick,
  onDestinationLocationClick,
  onOpenDropdown,
  onCloseDropdown,
  defaultOrigin,
  defaultDestination,
  origin,
  destination,
  AutocompleteComponent = AutocompleteInputLargeHalf,
  isOriginDisabled,
  isDestinationDisabled,
  autocompleteFunnel = FlightFunnelType.FLIGHT,
  originInputRef,
}: {
  id: string;
  className?: string;
  isMobile?: boolean;
  onOriginLocationChange: (originId?: string, originName?: string, countryCode?: string) => void;
  onDestinationLocationChange: (destinationId?: string, destinationName?: string) => void;
  onOriginLocationClick?: () => void;
  onDestinationLocationClick?: () => void;
  onOpenDropdown?: () => void;
  onCloseDropdown?: () => void;
  defaultOrigin?: string;
  defaultDestination?: string;
  origin?: string;
  destination?: string;
  AutocompleteComponent?: AutocompleteStyled;
  isOriginDisabled?: boolean;
  isDestinationDisabled?: boolean;
  autocompleteFunnel?: FlightFunnelType;
  originInputRef?: React.MutableRefObject<VacationPackageTypes.originInputRef>;
}) => {
  const defaultOriginInput = defaultOrigin || origin;
  const defaultDestinationInput = defaultDestination || destination || "europe";
  const [originInput, setOriginInput] = useState(defaultOriginInput);
  const [destinationInput, setDestinationInput] = useState(defaultDestinationInput);
  const { t } = useTranslation(Namespaces.flightSearchNs);
  const activeLocale = useActiveLocale();
  const { marketplace } = useSettings();
  const updateChineseHeaders = updateChineseLocaleFlightsQueryHeader(activeLocale, marketplace);

  const { data: originData } = useQuery<FlightSearchTypes.FlightLocations>(
    FlightGetLocationsQuery,
    {
      variables: {
        input: {
          searchQuery: originInput?.toLowerCase() ?? "",
          type: "From",
          funnel: autocompleteFunnel,
        },
      },
      ...updateChineseHeaders,
    }
  );
  const { data: destinationData } = useQuery<FlightSearchTypes.FlightLocations>(
    FlightGetLocationsQuery,
    {
      variables: {
        input: {
          searchQuery: destinationInput.toLowerCase() ?? "",
          type: "To",
          funnel: FlightFunnelType.FLIGHT,
        },
      },
      ...updateChineseHeaders,
    }
  );
  const originLocations = originData?.flightGetLocations?.locations ?? [];
  const destinationLocations = destinationData?.flightGetLocations?.locations ?? [];
  const hideMobileKeyboard = useHideMobileKeyboard();
  const originPlaceholder = defaultOrigin || t("Flying from");
  const destinationPlaceholder = defaultDestination || t("Flying to");
  const onOriginInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setOriginInput(e.target.value);
      if (e.target.value.length === 0) {
        onOriginLocationChange(undefined, undefined);
      }
    },
    [onOriginLocationChange]
  );
  const onOriginItemClick = useCallback(
    item => {
      if (item) {
        onOriginLocationChange(item.id, item.name, item.countryCode);
      }
    },
    [onOriginLocationChange]
  );
  const onDestinationInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDestinationInput(e.target.value);
      if (e.target.value.length === 0) {
        onDestinationLocationChange(undefined, undefined);
      }
    },
    [onDestinationLocationChange]
  );
  const onDestinationInputClick = useCallback(
    item => {
      if (item) {
        onDestinationLocationChange(item.id, item.name);
      }
    },
    [onDestinationLocationChange]
  );

  useOnDidUpdate(() => {
    setOriginInput(origin ?? "");
  }, [origin]);

  return (
    <StyledAutocompleteDoubleWrapper
      className={className}
      styledAutocompleteComponent={AutocompleteComponent}
      reducedHeightDesktop
    >
      <AutocompleteComponent
        id={`${id}Origin`}
        listItems={originLocations}
        placeholder={originPlaceholder}
        onInputChange={onOriginInputChange}
        onItemClick={onOriginItemClick}
        onCloseDropdown={onCloseDropdown}
        onOpenDropdown={onOpenDropdown}
        onInputClick={onOriginLocationClick}
        ListIcon={SearchIcon}
        disabled={isOriginDisabled || isMobile}
        hideMobileKeyboard={hideMobileKeyboard}
        halfWidth
        defaultValue={defaultOriginInput}
        defaultAutocompleteIconType={AutoCompleteType.PLANE_TAKEOFF}
        className={className}
        originInputRef={originInputRef}
      />
      <AutocompleteComponent
        id={`${id}Destination`}
        listItems={destinationLocations}
        placeholder={destinationPlaceholder}
        onInputChange={onDestinationInputChange}
        onItemClick={onDestinationInputClick}
        onCloseDropdown={onCloseDropdown}
        onOpenDropdown={onOpenDropdown}
        onInputClick={onDestinationLocationClick}
        ListIcon={SearchIcon}
        disabled={isDestinationDisabled || isMobile}
        hideMobileKeyboard={hideMobileKeyboard}
        halfWidth
        defaultValue={destinationInput}
        defaultAutocompleteIconType={AutoCompleteType.PLANE_LAND}
        className={className}
      />
    </StyledAutocompleteDoubleWrapper>
  );
};

export default FlightLocationPicker;
