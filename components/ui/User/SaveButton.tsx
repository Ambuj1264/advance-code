import React, { SyntheticEvent } from "react";
import { useTheme } from "emotion-theming";

import Tooltip from "../Tooltip/Tooltip";

import LoadingSuccess from "./LoadingSuccess";

import Button from "components/ui/Inputs/Button";
import { ButtonSize } from "types/enums";
import { Trans } from "i18n";
import { Namespaces } from "shared/namespaces";

const SaveButton = ({
  className,
  buttonText,
  successMessage = "Successfully saved",
  isUpdating,
  saveSuccess,
  onSaveClick,
  tooltipErrorMessage,
  href,
  buttonSize = ButtonSize.Small,
}: {
  className?: string;
  buttonText: string;
  successMessage?: string;
  isUpdating: boolean;
  saveSuccess: boolean;
  onSaveClick: (e: SyntheticEvent) => void;
  tooltipErrorMessage?: string;
  href?: string;
  buttonSize?: ButtonSize;
}) => {
  const theme: Theme = useTheme();

  const button = (
    <Button
      className={className}
      type="button"
      onClick={tooltipErrorMessage ? () => {} : onSaveClick}
      href={href}
      theme={theme}
      color="action"
      buttonSize={buttonSize}
      testId="saveButton"
    >
      {isUpdating || saveSuccess ? (
        <LoadingSuccess
          isUpdating={isUpdating}
          saveSuccess={saveSuccess}
          successMessage={successMessage}
        />
      ) : (
        <Trans ns={Namespaces.commonNs}>{buttonText}</Trans>
      )}
    </Button>
  );

  return tooltipErrorMessage ? (
    <Tooltip title={tooltipErrorMessage} testid="saveButtonTooltip" fullWidth>
      {button}
    </Tooltip>
  ) : (
    button
  );
};

export default SaveButton;
