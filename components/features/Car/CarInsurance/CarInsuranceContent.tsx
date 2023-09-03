import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { useTheme } from "emotion-theming";
import CheckMarkIcon from "@travelshift/ui/icons/checkmark.svg";

import { gutters, greyColor } from "styles/variables";
import { typographyCaptionSmall, typographyBody2 } from "styles/typography";
import { IconContainer } from "components/ui/IconList/IconItem";
import { mqMin } from "styles/base";

const Wrapper = styled.div([
  typographyBody2,
  css`
    margin-bottom: ${gutters.large}px;
    color: ${greyColor};
  `,
]);

const ItemWrapper = styled.span`
  display: flex;
  align-items: flex-start;
  margin-top: ${gutters.small}px;
  width: 100%;
  ${mqMin.medium} {
    margin-top: ${gutters.small}px;
  }
`;

const ItemTitle = styled.span(
  ({ theme }) =>
    css`
      color: ${theme.colors.action};
    `
);

const ItemDescription = styled.span`
  padding-left: ${gutters.small / 4}px;
`;

const Disclaimer = styled.div(({ theme }) => [
  typographyCaptionSmall,
  css`
    margin-top: ${gutters.large}px;
    a {
      color: ${theme.colors.primary};
      :hover {
        text-decoration: underline;
      }
    }
  `,
]);

const CarInsuranceContent = ({ insuranceInfo }: { insuranceInfo: CarTypes.InsuranceInfo }) => {
  const theme: Theme = useTheme();
  return (
    <Wrapper>
      {insuranceInfo.description}
      {insuranceInfo.inclusionsList.map((inclusionItem: CarTypes.InsuranceInclusion, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <ItemWrapper key={`inclusionItem${index}`}>
          <IconContainer>
            <CheckMarkIcon
              css={css`
                height: auto;
              `}
              style={{
                fill: theme.colors.action,
                width: "16px",
                minWidth: "16px",
                marginTop: "7px",
              }}
            />
          </IconContainer>
          <span>
            <ItemTitle>{inclusionItem.title}</ItemTitle>
            <ItemDescription>{inclusionItem.content}</ItemDescription>
          </span>
        </ItemWrapper>
      ))}
      <Disclaimer dangerouslySetInnerHTML={{ __html: insuranceInfo.disclaimer }} />
    </Wrapper>
  );
};

export default CarInsuranceContent;
