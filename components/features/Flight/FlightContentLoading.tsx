import React, { Fragment } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { range } from "fp-ts/lib/Array";

import {
  ItemWrapper,
  Column,
  ContentWrapper,
  SectionContentWrapper,
  Separator,
  MarginWrapper,
} from "../../ui/FlightsShared/flightShared";

import { skeletonPulse, mqMin } from "styles/base";
import { gutters, boxShadowStrong, borderRadius, lightGreyColor } from "styles/variables";

const SectionWrapper = styled.div`
  box-shadow: ${boxShadowStrong};
  width: 100%;
  padding-bottom: ${gutters.large}px;
  ${mqMin.large} {
    border-radius: ${borderRadius};
  }
`;

const LoadingBanner = styled.div`
  display: flex;
  align-items: center;
  border-radius: ${borderRadius} ${borderRadius} 0 0;
  height: 35px;
  background-color: ${lightGreyColor};
`;

const RouteWrapper = styled.div`
  display: flex;
  flex-direction: column;
  ${mqMin.large} {
    flex-basis: calc(50% - 33px);
  }
`;

const RouteHeadingLoading = styled.div`
  display: flex;
  align-items: flex-end;
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${gutters.large}px;
  width: 100%;
`;

const TitleSkeleton = styled.div([
  skeletonPulse,
  css`
    width: 40%;
    height: 32px;
  `,
]);

const ContentTitleSkeleton = styled.div([
  skeletonPulse,
  css`
    margin-bottom: ${gutters.large}px;
    width: 40%;
    height: 24px;
  `,
]);

const ContentLineSkeleton = styled.div<{ short?: boolean }>(({ short = false }) => [
  skeletonPulse,
  css`
    margin-bottom: ${gutters.small}px;
    width: ${short ? 25 : 45}%;
    height: 14px;
  `,
]);

const SectionHeadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: ${gutters.large * 2}px 0 ${gutters.large}px 0;
  height: 28px;
`;

const SectionHeadingLoading = styled.div([
  skeletonPulse,
  css`
    width: 35%;
  `,
]);

const LoadingLabel = styled.div([
  skeletonPulse,
  css`
    width: 50px;
    height: 16px;
  `,
]);

const LoadingInput = styled.div([
  skeletonPulse,
  css`
    width: 100%;
    height: 48px;
  `,
]);

const contentSectionLoading = (
  <RouteWrapper>
    <RouteHeadingLoading>
      <ContentTitleSkeleton />
    </RouteHeadingLoading>
    <ContentLineSkeleton short />
    <ContentLineSkeleton short />
    <ContentLineSkeleton />
    <ContentLineSkeleton short />
    <ContentLineSkeleton short />
    <ContentLineSkeleton />
    <ContentLineSkeleton />
    <ContentLineSkeleton short />
    <ContentLineSkeleton />
    <ContentLineSkeleton short />
    <ContentLineSkeleton short />
  </RouteWrapper>
);

const inputColumnLoading = (rows: number) => (
  <ContentWrapper>
    {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
    {range(1, rows).map(index => (
      <Fragment key={index.toString()}>
        <Column>
          <ItemWrapper>
            <LoadingLabel />
            <LoadingInput />
          </ItemWrapper>
        </Column>
        <Column>
          <ItemWrapper>
            <LoadingLabel />
            <LoadingInput />
          </ItemWrapper>
        </Column>
      </Fragment>
    ))}
  </ContentWrapper>
);

const sectionWithTitle = (rows: number) => (
  <>
    <SectionHeadingWrapper>
      <SectionHeadingLoading />
    </SectionHeadingWrapper>
    <SectionWrapper>
      <LoadingBanner />
      {inputColumnLoading(rows)}
    </SectionWrapper>
  </>
);

const FlightContentLoading = () => (
  <>
    <SectionWrapper>
      <LoadingBanner />
      <MarginWrapper>
        <TitleWrapper>
          <TitleSkeleton />
        </TitleWrapper>
        <SectionContentWrapper>
          {contentSectionLoading}
          <Separator />
          {contentSectionLoading}
        </SectionContentWrapper>
      </MarginWrapper>
    </SectionWrapper>
    {sectionWithTitle(1)}
    {sectionWithTitle(3)}
  </>
);

export default FlightContentLoading;
