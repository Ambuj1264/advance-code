import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import FlightExtraHighlights from "./FlightExtraHighlights";
import FlightExtraSelector from "./FlightExtraSelector";

import InformationIcon from "components/icons/plane-check-in.svg";
import { greyColor, gutters, borderRadius, blackColor } from "styles/variables";
import { mqMin } from "styles/base";
import { typographySubtitle2, typographyCaption } from "styles/typography";

const Wrapper = styled.div([
  css`
    position: relative;
    margin: 0 ${gutters.small}px;
    border: 1px solid ${rgba(greyColor, 0.4)};
    border-radius: ${borderRadius};
    height: 100%;
    padding: 16px;
    cursor: pointer;
    overflow: hidden;
    & + & {
      margin-top: ${gutters.small}px;
      ${mqMin.large} {
        margin-top: ${gutters.large}px;
      }
    }
  `,
]);

const Title = styled.div<{ hasNoHighlights: boolean }>(({ hasNoHighlights }) => [
  typographySubtitle2,
  css`
    margin-bottom: ${hasNoHighlights ? 0 : 8}px;
    color: ${rgba(blackColor, 0.7)};
    ${mqMin.large} {
      margin-bottom: 0;
      width: 160px;
      min-width: 160px;
    }
  `,
]);

const FlightExtraContentWrapper = styled.div``;

const FlightExtraContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  &:not(:last-of-type) {
    margin-bottom: ${gutters.large / 2}px;
  }
  ${mqMin.large} {
    flex-direction: row;
    align-items: center;
  }
`;

const AdditionalInformation = styled.div(
  typographyCaption,
  css`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    color: ${greyColor};
    ${mqMin.desktop} {
      margin-left: 160px;
    }
  `
);

const StyledInformationIcon = styled(InformationIcon)(
  ({ theme }) => css`
    margin-right: ${gutters.small / 2}px;
    width: 16px;
    height: 16px;
    fill: ${theme.colors.primary};
  `
);

const FlightExtra = ({
  id,
  extraId,
  isSelected,
  isIncluded,
  bagCombination,
  inputType,
  price,
  currency,
  onChange,
  className,
  additionalInformation,
}: {
  id: string;
  extraId: string;
  isSelected?: boolean;
  isIncluded?: boolean;
  bagCombination: FlightTypes.Bag[];
  price: number;
  currency: string;
  inputType: FlightTypes.FlightExtraInputType;
  onChange: (id: string) => void;
  className?: string;
  additionalInformation?: string;
}) => (
  <Wrapper
    onClick={() => !isSelected && onChange(extraId)}
    className={className}
    data-testid={`${id}-selected-${isSelected}`}
  >
    <FlightExtraContentWrapper>
      {bagCombination.map(({ title, highlights }) => (
        <FlightExtraContent key={`${id}${title}`}>
          <Title hasNoHighlights={highlights.length === 0}>{title}</Title>
          <FlightExtraHighlights highlights={highlights} />
        </FlightExtraContent>
      ))}
      {additionalInformation && (
        <AdditionalInformation>
          <StyledInformationIcon />
          {additionalInformation}
        </AdditionalInformation>
      )}
    </FlightExtraContentWrapper>
    <FlightExtraSelector
      id={id}
      extraId={extraId}
      isSelected={isSelected}
      isIncluded={isIncluded}
      inputType={inputType}
      price={price}
      currency={currency}
      onChange={onChange}
      dataTestid={`${id}-selected-${isSelected}`}
    />
  </Wrapper>
);

export default FlightExtra;
