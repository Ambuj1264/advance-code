import React from "react";
import { css } from "@emotion/core";
import { useTheme } from "emotion-theming";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";

import { gutters } from "styles/variables";
import InformationCircle from "components/icons/information-circle.svg";
import Tooltip from "components/ui/Tooltip/Tooltip";
import { capitalize } from "utils/globalUtils";

const buttonStyles = () => css`
  margin-left: ${gutters.small / 3}px;
  width: 22px;
  height: 22px;
`;

export const InformationCircleIcon = styled(InformationCircle)<{
  theme?: Theme;
}>(({ theme }) => [
  css`
    display: inline-block;
    width: 14px;
    height: 14px;
    vertical-align: middle;
    fill: ${rgba(theme.colors.primary, 0.4)};
  `,
]);

const InformationTooltip = ({
  information,
  direction = "center",
  tooltipWidth = 200,
  className,
  topThreshold,
  infoButtonClassName = "infoButton",
}: {
  information: string | React.ReactNode;
  direction?: TooltipTypes.Direction;
  tooltipWidth?: number;
  className?: string;
  topThreshold?: number;
  infoButtonClassName?: string;
}) => {
  const theme: Theme = useTheme();
  const maybeCapitalized = typeof information === "string" ? capitalize(information) : information;
  return (
    <Tooltip
      title={maybeCapitalized}
      tooltipWidth={tooltipWidth}
      direction={direction}
      className={className}
      topThreshold={topThreshold}
    >
      <button type="button" css={buttonStyles} className={infoButtonClassName}>
        <InformationCircleIcon theme={theme} />
      </button>
    </Tooltip>
  );
};

export default InformationTooltip;
