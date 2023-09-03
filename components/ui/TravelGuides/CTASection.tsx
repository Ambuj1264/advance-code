import { css } from "@emotion/core";
import styled from "@emotion/styled";
import React from "react";

import { TextContentWrapper } from "../ProductCard/QuickFactsWithoutModals";
import { ArrowCircleStyledGreen } from "../Search/TileProductCardFooter";

import { typographySubtitle1, typographySubtitle2, typographySubtitle3 } from "styles/typography";
import {
  borderRadius,
  borderRadiusLarger,
  borderRadiusSmall,
  greyColor,
  gutters,
  whiteColor,
} from "styles/variables";
import { GraphCMSPageType } from "types/enums";
import { iconsByPageType } from "components/features/TravelGuides/utils/travelGuideUtils";
import Information from "components/icons/information-circle-with-white.svg";
import { mqMax, mqMin } from "styles/base";

const CTAContainer = styled.a<{}>(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: ${gutters.large}px;
    border: 1px solid ${theme.colors.primary};
    border-radius: ${borderRadius};
    height: 62px;
    padding: 0 ${gutters.small / 2}px;
    ${mqMin.large} {
      margin-top: 0;
      height: 72px;
    }
  `
);

const LeftItemsWrapper = styled.div`
  display: flex;
  flex: 0.85;
  align-items: center;
  ${mqMin.large} {
    flex: 0.75;
  }
`;

const RightItemWrapper = styled.div`
  display: flex;
  flex: 0.15;
  align-items: center;
  justify-content: flex-end;
  ${mqMin.large} {
    flex: 0.25;
  }
`;

const DummyButton = styled.div<{}>(
  ({ theme }) => css`
    ${typographySubtitle2};
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: ${borderRadiusSmall};
    width: 100%;
    min-height: 42px;
    background-color: ${theme.colors.action};
    color: ${whiteColor};
    ${mqMax.large} {
      display: none;
    }
  `
);

const StyledArrowCircleStyledGreen = styled(ArrowCircleStyledGreen)`
  width: 24px;
  height: 24px;
  ${mqMin.large} {
    display: none;
  }
`;

const IconWrapper = styled.div<{}>(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: ${gutters.small}px;
    border-radius: ${borderRadiusLarger};
    width: 40px;
    height: 40px;
    background-color: ${theme.colors.primary};
  `
);

const SmallText = styled.p(
  [typographySubtitle3],
  css`
    color: ${greyColor};
  `
);

const MainText = styled.p<{}>([
  typographySubtitle1,
  ({ theme }) =>
    css`
      color: ${theme.colors.primary};
    `,
]);

const CTASection = ({
  mainText,
  uri,
  pageType,
  buttonText = "See more",
  t,
}: {
  mainText: string;
  uri: string;
  pageType?: GraphCMSPageType;
  buttonText?: string;
  t: TFunction;
}) => {
  const IconToRender = pageType === undefined ? Information : iconsByPageType[pageType];

  const StyledIcon = styled(IconToRender)`
    margin: auto;
    width: 20px;
    height: 20px;
    fill: ${whiteColor};
  `;
  return (
    <CTAContainer href={uri} target="_blank">
      <LeftItemsWrapper>
        <IconWrapper>
          <StyledIcon />
        </IconWrapper>
        <TextContentWrapper>
          <SmallText>{t("Find")}</SmallText>
          <MainText>{mainText}</MainText>
        </TextContentWrapper>
      </LeftItemsWrapper>
      <RightItemWrapper>
        <DummyButton>{t(buttonText)}</DummyButton>
        <StyledArrowCircleStyledGreen />
      </RightItemWrapper>
    </CTAContainer>
  );
};

export default CTASection;
