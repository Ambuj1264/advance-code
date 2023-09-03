import React, { memo } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { fontWeightRegular, gutters } from "styles/variables";
import { typographySubtitle2 } from "styles/typography";
import RadioButton from "components/ui/Inputs/RadioButton";
import { OptionPriceSkeleton } from "components/ui/BookingWidget/DropdownHeader";
import { mqMax } from "styles/base";

type Props = {
  value: string;
  checked: boolean;
  name: string;
  groupName: string;
  priceInformation: string;
  onChange: () => void;
  shouldShowPriceSkeleton: boolean;
};

const PriceDifference = styled.div<{ checked: boolean }>(({ checked, theme }) => [
  typographySubtitle2,
  css`
    margin-top: 3px;
    color: ${checked ? theme.colors.action : theme.colors.primary};
    font-weight: ${fontWeightRegular};
    text-align: right;
  `,
]);

const RadioButtonWrapped = styled(RadioButton)`
  ${mqMax.medium} {
    max-width: 220px;
  }
`;

const ExperienceRowWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin: ${gutters.large}px 0;
`;

const ExperienceRow = ({
  value,
  checked,
  name,
  groupName,
  priceInformation,
  onChange,
  shouldShowPriceSkeleton,
}: Props) => (
  <ExperienceRowWrapper>
    <RadioButtonWrapped
      checked={checked}
      label={name}
      name={groupName}
      value={value}
      id={`${groupName}Option${value}Mobile`}
      onChange={onChange}
    />
    {shouldShowPriceSkeleton ? (
      <OptionPriceSkeleton />
    ) : (
      <PriceDifference checked={checked}>{priceInformation}</PriceDifference>
    )}
  </ExperienceRowWrapper>
);

export default memo(ExperienceRow);
