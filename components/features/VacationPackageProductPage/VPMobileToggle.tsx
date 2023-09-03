import { css } from "@emotion/core";
import styled from "@emotion/styled";
import React from "react";

import Tooltip from "components/ui/Tooltip/Tooltip";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { mqMax } from "styles/base";
import { typographySubtitle3 } from "styles/typography";
import { greyColor, gutters, whiteColor } from "styles/variables";
import {
  Ball,
  ToggleButtonLabel,
  ToggleButtonOption,
  ToggleButtonSmall,
} from "components/ui/Inputs/ToggleButton";
import { getInfoTextWidth } from "components/ui/Tooltip/utils/tooltipUtils";

const widgetFooterHeight = "32px";

export const IncludeToggleContainer = styled.div`
  display: flex;
  align-items: flex-end;
  width: 100%;
  height: ${widgetFooterHeight};
  line-height: ${widgetFooterHeight};
`;

export const SearchWidgetSmallLabel = styled.div(() => [
  typographySubtitle3,
  css`
    display: flex;
    align-items: center;
    margin-right: ${gutters.small / 3}px;
    height: 24px;
    color: ${whiteColor};
    ${mqMax.large} {
      color: ${greyColor};
    }
  `,
]);

export const StyledToggleButtonSmall = styled(ToggleButtonSmall)<{}>(
  ({ theme }) =>
    css`
      height: 24px;
      ${ToggleButtonOption} {
        &:first-of-type {
          ${mqMax.large} {
            color: ${theme.colors.primary};
          }
        }
        ${mqMax.large} {
          color: ${theme.colors.primary};
        }
      }
      ${ToggleButtonLabel} {
        ${mqMax.large} {
          background: ${theme.colors.primary};
        }
      }
      ${Ball} {
        ${mqMax.large} {
          background: ${whiteColor};
        }
      }
    `
);

const VPMobileToggle = ({
  labelText,
  id = labelText,
  className,
  isTooltipVisible = false,
  checked,
  onChange,
  tooltip,
}: {
  labelText: string;
  id?: string;
  className?: string;
  isTooltipVisible?: boolean;
  checked: boolean;
  onChange: (checked: boolean) => void;
  tooltip?: string;
}) => {
  const { t } = useTranslation(Namespaces.vacationPackageNs);
  const tooltipWidth = tooltip ? getInfoTextWidth(tooltip, 220) + gutters.large : 0;

  return (
    <IncludeToggleContainer className={className}>
      <SearchWidgetSmallLabel>{t(labelText)}</SearchWidgetSmallLabel>
      {tooltip ? (
        <Tooltip
          title={tooltip}
          direction="center"
          tooltipWidth={tooltipWidth}
          isVisible={isTooltipVisible}
        >
          <StyledToggleButtonSmall
            checked={checked}
            onChange={onChange}
            offValue={t("No")}
            onValue={t("Yes")}
            id={`searchWidgetIncludeToggle${id}`}
            reverse
          />
        </Tooltip>
      ) : (
        <StyledToggleButtonSmall
          checked={checked}
          onChange={onChange}
          offValue={t("No")}
          onValue={t("Yes")}
          id={`searchWidgetIncludeToggle${id}`}
          reverse
        />
      )}
    </IncludeToggleContainer>
  );
};

export default VPMobileToggle;
