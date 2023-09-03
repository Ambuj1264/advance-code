import React, { ReactNode } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { SeeAllWrapper } from "./SectionRowSeeAll";

import { skeletonPulse, mqMin } from "styles/base";
import SectionContent from "components/ui/Section/SectionContent";
import Section from "components/ui/Section/Section";
import Row from "components/ui/Grid/Row";

export const SectionHeadingPulse = styled.div([
  skeletonPulse,
  css`
    display: block;
    margin: 0 auto;
    max-width: 450px;
    height: 18px;
  `,
]);

export const SectionSubHeadingPulse = styled.div([
  skeletonPulse,
  css`
    display: block;
    margin: 11px auto 5px;
    max-width: 450px;
    height: 14px;

    ${mqMin.large} {
      margin: 14px auto 6px;
      height: 16px;
    }
  `,
]);

export const StyledSeeAllWrapper = styled(SeeAllWrapper)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 24px;
`;

export const LinkPulse = styled.div([
  skeletonPulse,
  css`
    display: inline-block;
    width: 150px;
    height: 20px;
  `,
]);

const SectionRowSkeleton = ({
  children,
  CustomRowWrapper,
  includeCategoryLink,
  className,
  isFirstSection,
}: {
  children: ReactNode;
  CustomRowWrapper?: React.FC<any>;
  includeCategoryLink?: boolean;
  className?: string;
  isFirstSection?: boolean;
}) => {
  const RowWrapper = CustomRowWrapper || Row;
  return (
    <Section className={className} isFirstSection={isFirstSection}>
      <SectionHeadingPulse />
      <SectionSubHeadingPulse />
      <SectionContent>
        <RowWrapper>{children}</RowWrapper>
        {includeCategoryLink && (
          <StyledSeeAllWrapper>
            <LinkPulse />
          </StyledSeeAllWrapper>
        )}
      </SectionContent>
    </Section>
  );
};

export default SectionRowSkeleton;
