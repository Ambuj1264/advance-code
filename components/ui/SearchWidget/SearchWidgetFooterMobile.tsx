import React, { SyntheticEvent, useMemo, useCallback } from "react";
import { useTheme } from "emotion-theming";

import MobileStickyFooter, {
  MobileStickyFooterPropsType,
} from "../StickyFooter/MobileStickyFooter";
import Tooltip from "../Tooltip/Tooltip";

import { ButtonSize } from "types/enums";
import Button from "components/ui/Inputs/Button";

const SearchWidgetFooterMobile = ({
  onButtonClick,
  buttonCallToAction,
  href,
  tooltipErrorMessage,
  leftContent,
}: {
  onButtonClick: (e: SyntheticEvent) => void;
  buttonCallToAction: string;
  href?: string;
  tooltipErrorMessage?: string;
  leftContent?: React.ReactNode;
}) => {
  const theme: Theme = useTheme();
  const errorHandler = useCallback((e: SyntheticEvent) => {
    e.preventDefault();
  }, []);

  const button = useMemo(
    () => (
      <Button
        onClick={tooltipErrorMessage ? errorHandler : onButtonClick}
        color="action"
        buttonSize={ButtonSize.Small}
        theme={theme}
        href={href}
      >
        {buttonCallToAction}
      </Button>
    ),
    [buttonCallToAction, errorHandler, href, onButtonClick, theme, tooltipErrorMessage]
  );

  const buttonWithErrorTooltip = useMemo(
    () =>
      tooltipErrorMessage ? (
        <Tooltip title={tooltipErrorMessage} fullWidth>
          {button}
        </Tooltip>
      ) : (
        button
      ),
    [button, tooltipErrorMessage]
  );

  const footerProps: MobileStickyFooterPropsType = useMemo(
    () =>
      leftContent
        ? {
            leftContent,
            rightContent: buttonWithErrorTooltip,
          }
        : {
            fullWidthContent: buttonWithErrorTooltip,
          },
    [buttonWithErrorTooltip, leftContent]
  );

  return <MobileStickyFooter {...footerProps} />;
};

export default SearchWidgetFooterMobile;
