import React, { SyntheticEvent } from "react";
import { useTheme } from "emotion-theming";

import Tooltip from "components/ui/Tooltip/Tooltip";
import Button from "components/ui/Inputs/Button";
import { ButtonSize } from "types/enums";
import { Trans } from "i18n";

const AccommodationSearchWidgetButton = ({
  onModalContinue,
  tooltipErrorMessage,
  isLastStep,
}: {
  onModalContinue: (e: SyntheticEvent) => void;
  tooltipErrorMessage?: string;
  isLastStep: boolean;
}) => {
  const theme: Theme = useTheme();
  const errorHandler = (e: SyntheticEvent) => {
    e.preventDefault(); // prevents form submission in error case
  };

  const button = (
    <Button
      onClick={tooltipErrorMessage ? errorHandler : onModalContinue}
      theme={theme}
      buttonSize={ButtonSize.Small}
      color="action"
    >
      <Trans>{isLastStep ? "Search" : "Continue"}</Trans>
    </Button>
  );

  return tooltipErrorMessage ? (
    <Tooltip title={tooltipErrorMessage} fullWidth>
      {button}
    </Tooltip>
  ) : (
    button
  );
};

export default AccommodationSearchWidgetButton;
