import React from "react";
import { useTheme } from "emotion-theming";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import SectionWithTitle, { Header } from "components/ui/Section/SectionWithTitle";
import {
  ValueSkeleton,
  SubtitleValueSkeleton,
  SectionSeperator,
} from "components/ui/Order/OrderComponents";
import { gutters } from "styles/variables";
import { mqMax, mqMin, skeletonPulse } from "styles/base";

const Wrapper = styled.div`
  ${mqMax.large} {
    padding-right: ${gutters.small}px;
    padding-bottom: 100px;
    padding-left: ${gutters.small}px;
  }
`;

const SectionWithTitleStyled = styled(SectionWithTitle)`
  ${mqMin.large} {
    margin-top: 0;
    border: none;
    border-radius: 0;
    padding: 0 ${gutters.small}px;
  }
  ${Header} {
    ${mqMin.large} {
      display: none;
    }
  }
`;

const SectionHeaderSkeleton = styled.h2([
  skeletonPulse,
  css`
    margin-top: 15px;
    margin-bottom: 10px;
    width: 170px;
    height: 28px;
  `,
]);

const VoucherSectionSkeletonWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
const VoucherValueSkeletonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${gutters.small}px;
  width: 50%;
  ${mqMax.large} {
    width: 100%;
  }
`;

const VoucherSectionsSkeletonWrapper = styled.div`
  ${mqMax.large} {
    padding: 0 ${gutters.small}px;
  }
`;

const SectionSeperatorStyled = styled(SectionSeperator)`
  margin: ${gutters.small}px 0;
  ${mqMax.large} {
    margin: ${gutters.small}px ${gutters.small / 2}px;
  }
`;

const VoucherSectionSkeleton = () => {
  return (
    <VoucherSectionsSkeletonWrapper>
      <SectionHeaderSkeleton />
      <VoucherSectionSkeletonWrapper>
        <VoucherValueSkeletonWrapper>
          <ValueSkeleton />
          <SubtitleValueSkeleton />
        </VoucherValueSkeletonWrapper>
        <VoucherValueSkeletonWrapper>
          <ValueSkeleton />
          <SubtitleValueSkeleton />
        </VoucherValueSkeletonWrapper>
        <VoucherValueSkeletonWrapper>
          <ValueSkeleton />
          <SubtitleValueSkeleton />
        </VoucherValueSkeletonWrapper>
        <VoucherValueSkeletonWrapper>
          <ValueSkeleton />
          <SubtitleValueSkeleton />
        </VoucherValueSkeletonWrapper>
      </VoucherSectionSkeletonWrapper>
    </VoucherSectionsSkeletonWrapper>
  );
};

const PBVoucherModalSkeleton = () => {
  const theme: Theme = useTheme();
  return (
    <Wrapper>
      <SectionWithTitleStyled color={theme.colors.primary}>
        <VoucherSectionSkeleton />
        <SectionSeperatorStyled />
        <VoucherSectionSkeleton />
        <SectionSeperatorStyled />
        <VoucherSectionSkeleton />
        <SectionSeperatorStyled />
      </SectionWithTitleStyled>
    </Wrapper>
  );
};

export default PBVoucherModalSkeleton;
