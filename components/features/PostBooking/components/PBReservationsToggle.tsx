import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import ToggleButton, {
  ToggleButtonLabel,
  ToggleButtonOption,
} from "components/ui/Inputs/ToggleButton";
import { Namespaces } from "shared/namespaces";
import { typographyCaption } from "styles/typography";
import { greyColor, gutters } from "styles/variables";
import useToggle from "hooks/useToggle";
import { mqMin } from "styles/base";

const PBToggleWrapper = styled.div(
  () => css`
    display: flex;
    margin-top: ${gutters.small}px;

    ${mqMin.large} {
      align-self: flex-start;
      margin-top: ${gutters.large}px;
    }
  `
);

const FilterByLabel = styled.span(
  () => css`
    flex-grow: 0;
    flex-shrink: 0;
    ${typographyCaption};
    margin-right: ${gutters.small / 2}px;
    color: ${greyColor};
  `
);
const ToggleButtonStyled = styled(ToggleButton)(
  ({ theme, checked }) => css`
    flex-grow: 0;
    flex-shrink: 0;
    ${ToggleButtonOption} {
      ${typographyCaption};
      color: ${theme.colors.primary};
      &:first-of-type,
      &:last-of-type {
        ${checked ? typographyCaption : ""};
      }
    }
    ${ToggleButtonLabel} {
      background-color: ${theme.colors.primary};
    }
  `
);

const PBReservationsToggle = ({
  onChange,
  checked,
}: {
  onChange: (checked: boolean) => void;
  checked: boolean;
}) => {
  const { t: postbookingT } = useTranslation(Namespaces.postBookingNs);

  return (
    <PBToggleWrapper>
      <FilterByLabel>{postbookingT("Filter by")}:</FilterByLabel>
      <ToggleButtonStyled
        checked={checked}
        onChange={onChange}
        onValue={postbookingT("Upcoming")}
        offValue={postbookingT("Previous")}
        id="pb-reservations-toggle"
      />
    </PBToggleWrapper>
  );
};

export const usePBReservationsToggle = (isToggleChecked = true) => {
  const [checked, setChecked] = useToggle(isToggleChecked);

  const onChange = useCallback(
    isChecked => {
      setChecked(isChecked);
    },
    [setChecked]
  );

  return { checked, onChange };
};

export default PBReservationsToggle;
