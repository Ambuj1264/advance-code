import React from "react";
import styled from "@emotion/styled";
import { useTheme } from "emotion-theming";
import { css } from "@emotion/core";

import ToggleButton, {
  ToggleButtonOption,
  ToggleButtonLabel,
} from "components/ui/Inputs/ToggleButton";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import { LabelParagraph } from "components/ui/SearchWidget/Label";
import { mqMax } from "styles/base";
import { gutters, whiteColor } from "styles/variables";
import { typographyCaption } from "styles/typography";

type ReversedThemeColors = {
  theme: Theme;
  reverse: boolean;
};

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledLabel = styled(LabelParagraph)(
  ({ theme, reverse }: ReversedThemeColors) => css`
    display: inline-block;
    margin-right: ${gutters.large / 2}px;
    color: ${reverse ? theme.colors.primary : whiteColor};
    ${typographyCaption};
  `
);

const StyledToggleButton = styled(ToggleButton)<{
  reverse: boolean;
}>(({ reverse, theme }) => [
  !reverse &&
    css`
      ${mqMax.large} {
        ${ToggleButtonOption} {
          color: ${theme.colors.primary};
        }
        ${ToggleButtonLabel} {
          background: ${theme.colors.primary};
        }
      }
    `,
  css`
    ${ToggleButtonOption} {
      ${typographyCaption};
    }
  `,
]);

const VacationPackageFlightToggle = ({
  onChange,
  isChecked,
  className,
  reverseColors = false,
  onClick,
}: {
  isChecked: boolean;
  reverseColors?: boolean;
  className?: string;
  onChange: (checked: boolean) => void;
  onClick?: () => void;
}) => {
  const theme: Theme = useTheme();
  const { t } = useTranslation(Namespaces.vacationPackageNs);

  return (
    <ToggleContainer className={className} onClick={onClick}>
      <StyledLabel theme={theme} reverse={reverseColors} includeMediumUpSize={false}>
        {t("Include flights?")}
      </StyledLabel>
      <StyledToggleButton
        checked={isChecked}
        highlightCheckedOption={false}
        onChange={onChange}
        offValue={t("No")}
        onValue={t("Yes")}
        id="vacationIncludeFlightsToggle"
        reverse={!reverseColors}
      />
    </ToggleContainer>
  );
};

export default VacationPackageFlightToggle;
