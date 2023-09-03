import React, { SyntheticEvent } from "react";
import { useTheme } from "emotion-theming";

import Tooltip from "../Tooltip/Tooltip";

import Button from "components/ui/Inputs/Button";
import { ButtonSize } from "types/enums";
import { Trans } from "i18n";
import { Namespaces } from "shared/namespaces";

const SearchWidgetButton = ({
  className,
  onSearchClick,
  tooltipErrorMessage,
  href,
  buttonSize = ButtonSize.Medium,
}: {
  className?: string;
  onSearchClick: (e: SyntheticEvent) => void;
  tooltipErrorMessage?: string;
  href?: string;
  buttonSize?: ButtonSize;
}) => {
  const theme: Theme = useTheme();
  const errorHandler = (e: SyntheticEvent) => {
    e.preventDefault();
  };

  const button = (
    <Button
      className={className}
      type="submit"
      onClick={tooltipErrorMessage ? errorHandler : onSearchClick}
      href={href}
      theme={theme}
      color="action"
      buttonSize={buttonSize}
      testId="searchButton"
    >
      <Trans ns={Namespaces.commonNs}>Search</Trans>
    </Button>
  );

  return tooltipErrorMessage ? (
    <Tooltip title={tooltipErrorMessage} testid="searchWidgetTooltip" fullWidth>
      {button}
    </Tooltip>
  ) : (
    button
  );
};

export default SearchWidgetButton;
