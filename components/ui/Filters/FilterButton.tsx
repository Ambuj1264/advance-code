import React from "react";
import rgba from "polished/lib/color/rgba";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { isFilterDisabled } from "./utils/filtersUtils";

import { mqMin } from "styles/base";
import { gutters, borderRadiusSmall, greyColor, whiteColor } from "styles/variables";
import { typographyBody2 } from "styles/typography";

const Trigger = styled.label(({ theme }) => [
  typographyBody2,
  css`
    margin-top: ${gutters.small / 2}px;
    margin-right: ${gutters.large / 2}px;
    border: 1px solid ${theme.colors.primary};
    border-radius: ${borderRadiusSmall};
    height: 30px;
    padding: 0 ${gutters.small / 2}px;
    user-select: none;
    color: ${greyColor};
    line-height: 27px;
    ${mqMin.large} {
      &:hover {
        cursor: pointer;
      }
    }
  `,
]);

export const HiddenCheckbox = styled.input<{
  disableDefaultCheckedFilter: boolean;
}>(
  ({ theme, disableDefaultCheckedFilter }) => css`
    position: absolute;
    display: none;
    &:checked + ${Trigger} {
      background-color: ${theme.colors.primary};
      color: ${whiteColor};
    }
    &:disabled:not(:checked) + ${Trigger}, &:disabled:hover:not(:checked) + ${Trigger} {
      border: 1px solid ${rgba(greyColor, 0.4)};
      background: initial;
      cursor: default;
      color: ${rgba(greyColor, 0.4)};
    }

    &:disabled:checked + ${Trigger}, &:disabled:hover:checked + ${Trigger} {
      border: 1px solid ${rgba(greyColor, 0.4)};
      background: ${rgba(theme.colors.primary, 0.7)};
      cursor: ${disableDefaultCheckedFilter ? "default" : "pointer"};
      color: ${whiteColor};
    }
  `
);

const FilterButton = ({
  id,
  defaultChecked,
  children,
  onClick,
  disabled = false,
  disableDefaultCheckedFilter = false,
}: {
  id: string;
  children: string;
  onClick: (id: string) => void;
  defaultChecked: boolean;
  disabled?: boolean;
  disableDefaultCheckedFilter?: boolean;
}) => {
  const htmlId = `filterButton${id}`;
  return (
    <>
      <HiddenCheckbox
        type="checkbox"
        id={htmlId}
        checked={defaultChecked}
        onChange={() => {}}
        value={id}
        name="durationIds"
        disabled={disabled}
        disableDefaultCheckedFilter={disableDefaultCheckedFilter}
      />
      <Trigger
        onClick={() =>
          !isFilterDisabled(disabled, defaultChecked, disableDefaultCheckedFilter) && onClick(id)
        }
        htmlFor={htmlId}
      >
        {children}
      </Trigger>
    </>
  );
};

export default FilterButton;
