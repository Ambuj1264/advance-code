import React, { useCallback, useContext } from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import { useTheme } from "emotion-theming";

import TripPlannerFeedbackButtons from "./TripPlannerFeedbackButtons";
import TripPlannerDropdownRow from "./TripPlannerDropdownRow";
import TripPlannerMapAndSlidersContent from "./TripPlannerMapAndSlidersContent";
import { iconStyles } from "./TripPlannerStyledComponents";
import TripPlannerModal from "./TripPlannerModal";
import TripPlannerItinerary from "./TripPlannerItinerary";
import { TripPlannerDay } from "./types/tripPlannerTypes";
import TripPlannerStateContext from "./contexts/TripPlannerStateContext";

import { DefaultMarginBottom, DefaultMarginTop, mqMin } from "styles/base";
import { gutters } from "styles/variables";
import CogBrowserIcon from "components/icons/cog-browser.svg";
import { ButtonSize } from "types/enums";
import Logo from "components/ui/Logo/Logo";
import useToggle from "hooks/useToggle";
import { typographyH2 } from "styles/typography";
import Row from "components/ui/Grid/Row";

const Heading = styled.h1(({ theme }) => [
  typographyH2,
  DefaultMarginTop,
  DefaultMarginBottom,
  css`
    color: ${theme.colors.primary};
    text-align: center;
  `,
]);

const StyledLogo = styled(Logo)(() => [
  DefaultMarginTop,
  css`
    max-width: 140px;
  `,
]);

const ContentWrapper = styled.div`
  padding-bottom: 150px;

  ${mqMin.large} {
    padding-bottom: 250px;
  }
`;

const IconWrapper = styled.div`
  margin: ${gutters.small}px auto;
  text-align: right;
`;

const iconClickable = css`
  display: inline-block;
  width: auto;
  height: 16px;
  cursor: pointer;
`;

const TripPlannerContent = ({
  countries,
}: {
  countries: { id: string; name: string; airports: string[] }[];
}) => {
  const [isToggledJSON, toggleJSON] = useToggle();
  const theme: Theme = useTheme();
  const { setContextState, selectedTrip, trips, isFetchingTrips, fetchingError } =
    useContext(TripPlannerStateContext);

  const onChangeSelectedTrip = useCallback(
    (newTripId: string) => {
      const newSelectedTrip = trips?.find(trip => trip.id === newTripId);
      setContextState({ selectedTrip: newSelectedTrip });
    },
    [trips, setContextState]
  );

  return (
    <>
      <ContentWrapper>
        <StyledLogo marketplace="travelshift-generic" />
        <Heading theme={theme}>Trip Planner</Heading>
        <TripPlannerDropdownRow
          countries={countries}
          theme={theme}
          columns={{ small: 2, medium: 3, large: 4 }}
        />
        <IconWrapper>
          <CogBrowserIcon css={[iconStyles(false), iconClickable]} onClick={toggleJSON} />
        </IconWrapper>
        <TripPlannerMapAndSlidersContent
          theme={theme}
          trips={trips}
          onChangeSelectedTrip={onChangeSelectedTrip}
          fetchError={fetchingError}
          isLoading={isFetchingTrips}
        />
        <Row>
          {selectedTrip?.days.map((day: TripPlannerDay, index: number) => {
            return <TripPlannerItinerary day={day} key={day.id} dayIndex={index + 1} />;
          })}
        </Row>
        <TripPlannerFeedbackButtons
          theme={theme}
          buttonSize={ButtonSize.Medium}
          disabled={!trips}
        />
      </ContentWrapper>
      {isToggledJSON && (
        <TripPlannerModal
          id="json-modal"
          onClose={toggleJSON}
          title="JSON console"
          disableTextArea
          textToDisplay={selectedTrip?.tripJSON || "No trip data"}
        />
      )}
    </>
  );
};

export default TripPlannerContent;
