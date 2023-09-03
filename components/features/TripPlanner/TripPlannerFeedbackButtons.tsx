import React, { useState, useContext } from "react";
import styled from "@emotion/styled";
import Bubbles from "@travelshift/ui/components/Bubbles/Bubbles";

import { BubblesWrapper, ButtonStyled, ButtonWrapper } from "./TripPlannerStyledComponents";
import TripPlannerModal from "./TripPlannerModal";
import { sendFeedbackToEndpoint } from "./utils/tripPlannerUtils";
import TripPlannerStateContext from "./contexts/TripPlannerStateContext";

import { ButtonSize } from "types/enums";
import { gutters } from "styles/variables";
import { DefaultMarginTop, mqMin } from "styles/base";
import Row from "components/ui/Grid/Row";
import useToggle from "hooks/useToggle";

const StyledRow = styled(Row)`
  ${DefaultMarginTop};
  align-items: center;
  justify-content: center;
  padding: 0 ${gutters.small / 2}px;

  ${mqMin.medium} {
    justify-content: flex-end;
  }

  ${mqMin.large} {
    padding: 0;
  }
`;

const TripPlannerFeedbackButtons = ({
  theme,
  buttonSize = ButtonSize.Medium,
  disabled,
}: {
  theme: Theme;
  buttonSize: ButtonSize;
  disabled: boolean;
}) => {
  const { selectedCountry, selectedTrip, duration, maxDrivingHours } =
    useContext(TripPlannerStateContext);

  const tripParameters = { duration, maxDrivingHours };
  const [isToggleWrong, toggleWrong] = useToggle();
  const [isToggleCouldBeBetter, toggleCouldBeBetter] = useToggle();
  const [isToggleCorrect, toggleCorrect] = useToggle();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const checkboxGroup = [
    {
      id: "attraction-missing",
      label: "Famous attraction missing",
    },
    {
      id: "destination-missing",
      label: "Odd destination or missing destinations",
    },
    {
      id: "too-short-stay",
      label: "Stay in a location is too short",
    },
    {
      id: "too-many-attractions",
      label: "Too many attractions in a day",
    },
    {
      id: "too-few-attractions",
      label: "Not enough attractions in a day",
    },
  ];

  const handleSubmit = async () => {
    setIsLoading(true);
    sendFeedbackToEndpoint(
      { type: "correct" },
      tripParameters,
      selectedTrip!.tripJSON,
      selectedCountry!.id
    )
      .catch((err: Error) => {
        setError(err.toString());
      })
      .finally(() => {
        toggleCorrect();
        setIsLoading(false);
      });
  };

  return (
    <StyledRow>
      <ButtonWrapper>
        <ButtonStyled
          id="correctButton"
          type="button"
          buttonSize={buttonSize}
          disabled={isLoading || disabled}
          theme={theme}
          color="action"
          onClick={handleSubmit}
        >
          {isLoading ? (
            <BubblesWrapper>
              <Bubbles theme={theme} />
            </BubblesWrapper>
          ) : (
            "Correct"
          )}
        </ButtonStyled>
      </ButtonWrapper>
      <ButtonWrapper>
        <ButtonStyled
          id="couldBeBetterButton"
          type="button"
          buttonSize={buttonSize}
          disabled={isLoading || disabled}
          theme={theme}
          onClick={toggleCouldBeBetter}
          color="warning"
        >
          Could be better
        </ButtonStyled>
      </ButtonWrapper>
      <ButtonWrapper>
        <ButtonStyled
          id="wrongInfoButton"
          type="button"
          buttonSize={buttonSize}
          disabled={isLoading || disabled}
          theme={theme}
          color="error"
          onClick={toggleWrong}
        >
          Wrong
        </ButtonStyled>
      </ButtonWrapper>
      {isToggleCorrect && (
        <TripPlannerModal
          id="correct-data-modal"
          onClose={toggleCorrect}
          title="Thanks for the feedback"
          isDataSent
          responseError={error}
        />
      )}
      {isToggleWrong && (
        <TripPlannerModal
          id="wrong-data-modal"
          onClose={toggleWrong}
          title="What went wrong?"
          feedbackType={{ type: "wrong" }}
        />
      )}
      {isToggleCouldBeBetter && (
        <TripPlannerModal
          id="could-be-better-data-modal"
          onClose={toggleCouldBeBetter}
          title="What could be better?"
          checkboxGroup={checkboxGroup}
          feedbackType={{ type: "could be better" }}
        />
      )}
    </StyledRow>
  );
};

export default TripPlannerFeedbackButtons;
