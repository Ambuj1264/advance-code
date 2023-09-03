import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { useTranslation } from "react-i18next";

import ToggleButton, { ToggleButtonOption } from "components/ui/Inputs/ToggleButton";
import { Namespaces } from "shared/namespaces";
import { fontSizeCaption } from "styles/variables";
import { mqMin } from "styles/base";
import { typographyCaption } from "styles/typography";

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledToggleButton = styled(ToggleButton)(() => [
  css`
    margin-top: 8px;
    ${ToggleButtonOption} {
      ${typographyCaption};
    }

    ${mqMin.large} {
      margin-top: 0;
      ${ToggleButtonOption} {
        &:first-of-type,
        &:last-of-type {
          font-size: ${fontSizeCaption};
          line-height: 16px;
        }
      }
    }
  `,
]);

const TripsDateToggle = ({
  onChange,
  isChecked,
  className,
}: {
  isChecked: boolean;
  className?: string;
  onChange: (checked: boolean) => void;
}) => {
  const { t } = useTranslation(Namespaces.tourSearchNs);
  return (
    <ToggleContainer className={className}>
      <StyledToggleButton
        checked={isChecked}
        onChange={onChange}
        offValue={t("Exact date")}
        onValue={t("Select date range")}
        id="dateRangeToggle"
        reverse
        highlightCheckedOption={false}
      />
    </ToggleContainer>
  );
};

export default TripsDateToggle;
