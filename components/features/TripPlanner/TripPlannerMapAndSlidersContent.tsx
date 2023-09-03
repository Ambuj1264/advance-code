import React, { useContext, useMemo } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import TripPlannerSliders from "./TripPlannerSliders";
import TripPlannerMap from "./TripPlannerMap";
import { DropdownWrapper, iconStyles } from "./TripPlannerStyledComponents";
import TripPlannerStateContext from "./contexts/TripPlannerStateContext";
import { TripPlannerTrip } from "./types/tripPlannerTypes";

import ListStarsIcon from "components/icons/list-stars.svg";
import Row from "components/ui/Grid/Row";
import { gutters } from "styles/variables";
import Column from "components/ui/Grid/Column";
import { mqMin } from "styles/base";
import Dropdown from "components/ui/Inputs/Dropdown/Dropdown";
import DropdownOption from "components/ui/Inputs/Dropdown/DropdownOption";

const StyledRow = styled(Row)(() => [
  css`
    margin-bottom: ${gutters.large + gutters.small}px;
    align-content: center;
  `,
]);

const StyledColumn = styled(Column)<{
  columnWidth: SharedTypes.Columns;
}>(({ columnWidth }) => [
  css`
    width: ${columnWidth.small}%;
    ${mqMin.large} {
      width: ${columnWidth.large}%;
    }
  `,
]);

const TripPlannerMapAndSlidersContent = ({
  theme,
  trips,
  onChangeSelectedTrip,
  isLoading,
  fetchError,
}: {
  theme: Theme;
  trips?: TripPlannerTrip[];
  onChangeSelectedTrip: (id: string) => void;
  isLoading: boolean;
  fetchError: string;
}) => {
  const { selectedTrip } = useContext(TripPlannerStateContext);

  const tripOptions = useMemo(() => {
    return (
      trips?.map((trip: TripPlannerTrip, index: number) => {
        return {
          value: trip.id,
          nativeLabel: `Trip ${index + 1}`,
          label: (
            <DropdownOption
              id={`${trip.id}TripDropdownOption`}
              label={`Trip ${index + 1}`}
              isSelected={trip.id === selectedTrip?.id}
            />
          ),
        };
      }) || [
        {
          value: undefined,
          nativeLabel: "No available trips",
          label: undefined,
          isDisabled: true,
        },
      ]
    );
  }, [trips, selectedTrip]);

  return (
    <StyledRow>
      <Column columns={{ small: 1, large: 4 }}>
        <TripPlannerSliders theme={theme} />
        <DropdownWrapper>
          <Dropdown
            isDisabled={!trips}
            id="tripSelector"
            onChange={onChangeSelectedTrip}
            defaultValue={tripOptions[0]}
            selectedValue={selectedTrip?.id}
            icon={<ListStarsIcon css={iconStyles(!trips)} />}
            options={tripOptions}
            shouldLoadWhenVisible
          />
        </DropdownWrapper>
      </Column>
      <StyledColumn columnWidth={{ small: 100, large: 75 }}>
        <TripPlannerMap theme={theme} fetchError={fetchError} isLoading={isLoading} />
      </StyledColumn>
    </StyledRow>
  );
};

export default TripPlannerMapAndSlidersContent;
