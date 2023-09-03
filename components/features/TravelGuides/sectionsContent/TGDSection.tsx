import styled from "@emotion/styled";
import React from "react";
import { css } from "@emotion/core";

import { TGDSectionType } from "../types/travelGuideEnums";

import SectionImage from "./SectionImage";

import { MobileContainer } from "components/ui/Grid/Container";
import Section from "components/ui/Section/Section";
import { typographyH3, typographyH4, typographyH5 } from "styles/typography";
import ExpandableText from "components/ui/ExpandableText/ExpandableText";
import { appBarHeight, fontWeightBold, fontWeightSemibold, gutters } from "styles/variables";
import LazyHydrateWrapper from "components/ui/LazyHydrateWrapper";
import { mqMax, mqMin } from "styles/base";

export const StyledTGSection = styled(Section)<{
  isFirstSection?: boolean;
  isSubSection?: boolean;
}>(({ isSubSection, isFirstSection = false, theme }) => [
  css`
    margin-top: ${isSubSection ? `${gutters.large / 2}px` : `${gutters.large}px`};
    ${mqMin.large} {
      margin-top: ${isSubSection ? `${gutters.small}px` : `${gutters.large * 2}px`};
    }
    a {
      color: ${theme.colors.primary};
      font-weight: ${fontWeightSemibold};
    }
  `,
  isFirstSection &&
    css`
      margin-top: ${gutters.large / 2}px;
      ${mqMin.large} {
        margin-top: ${gutters.large}px;
      }
    `,
]);

const SectionTitle = styled.h2<{}>(
  ({ theme }) =>
    css`
      ${typographyH5};
      margin-bottom: ${gutters.small / 2}px;
      color: ${theme.colors.primary};
      ${mqMin.large} {
        ${typographyH3};
      }
    `
);

const TopContentWrapper = styled.div`
  margin-bottom: ${gutters.small}px;
  width: 100%;
  height: 100%;
`;

const SubSectionTitle = styled.h3<{}>(
  ({ theme }) =>
    css`
      margin-bottom: 0;
      color: ${theme.colors.primary};
      font-size: 18px;
      font-weight: ${fontWeightBold};
      line-height: 24px;
      ${mqMin.large} {
        margin-bottom: ${gutters.small / 2}px;
        ${typographyH4}
      }
    `
);

const SectionAnchor = styled.span`
  position: absolute;
  top: -${appBarHeight}px;
`;

const StyledMobileContainer = styled(MobileContainer)`
  ${mqMax.large} {
    padding-right: 0;
    padding-left: 0;
  }
`;

export const BottomContentWrapper = styled.div`
  margin-top: ${gutters.small}px;
`;

const TGDSection = ({
  section,
  bottomContent,
  isSubsection = false,
  ssrOnly = false,
  image,
}: {
  section: TravelGuideTypes.DestinationSection;
  bottomContent?: React.ReactNode;
  isSubsection?: boolean;
  ssrOnly?: boolean;
  image?: ImageWithSizes;
}) => {
  const isFirstSection = section.sectionType === TGDSectionType.IntroductionConstant;
  return (
    <StyledTGSection hasAnchorTarget isFirstSection={isFirstSection} isSubSection={isSubsection}>
      <SectionAnchor id={section.id} />
      <StyledMobileContainer>
        <LazyHydrateWrapper whenVisible={!isFirstSection} ssrOnly={ssrOnly}>
          {isSubsection ? (
            <SubSectionTitle>{section.title}</SubSectionTitle>
          ) : (
            <SectionTitle>{section.title}</SectionTitle>
          )}
          {image && (
            <TopContentWrapper>
              <SectionImage imageUrl={image.url} imageAlt={image.name} />
            </TopContentWrapper>
          )}
          <ExpandableText id={section.id} text={section.description} autoExpand />
        </LazyHydrateWrapper>
        {bottomContent ? <BottomContentWrapper>{bottomContent}</BottomContentWrapper> : null}
      </StyledMobileContainer>
    </StyledTGSection>
  );
};

export default TGDSection;
