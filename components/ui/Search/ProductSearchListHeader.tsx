import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { useTheme } from "emotion-theming";

import Button from "components/ui/Inputs/Button";
import SectionHeading from "components/ui/Section/SectionHeading";
import SectionSubHeading from "components/ui/Section/SectionSubHeading";
import { gutters } from "styles/variables";
import { skeletonPulse, mqMin } from "styles/base";
import { NoResultWrapper } from "components/ui/Search/SearchList";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";

/* All heights and margins below are not connected
 * to project's gutters and use to avoid layout rattling
 * during loading.
 *
 * That is why it was left as is.
 */

export const SkeletonHeading = styled.span([
  skeletonPulse,
  css`
    display: block;
    margin: 0 auto;
    width: 50%;
    height: 22px;
  `,
]);

export const SkeletonSubHeading = styled.span([
  skeletonPulse,
  css`
    display: block;
    margin: 10px auto 0;
    width: 70%;
    height: 16px;
    ${mqMin.large} {
      margin-top: 12px;
      height: 18px;
    }
  `,
]);

export const Wrapper = styled.div<{
  isCompact?: boolean;
}>(({ isCompact }) => [
  css`
    margin-bottom: ${gutters.small}px;
    ${mqMin.desktop} {
      margin-bottom: ${gutters.small / 2}px;
    }
  `,
  isCompact &&
    css`
      ${mqMin.desktop} {
        margin-bottom: 0;
      }
      & > ${SectionSubHeading} {
        margin-top: 0px;
      }
      & > ${SkeletonSubHeading} {
        ${mqMin.large} {
          margin-top: 4px;
        }
      }
    `,
]);

const Skeleton = ({ isCompact, className }: { isCompact?: boolean; className?: string }) => (
  <Wrapper isCompact={isCompact} className={className}>
    <SkeletonHeading />
    <SkeletonSubHeading />
  </Wrapper>
);

export const StyledSectionHeading = styled(SectionHeading)<{ skipSubheader: boolean }>(
  ({ skipSubheader }) => css`
    line-height: 28px;
    ${mqMin.medium} {
      margin-bottom: ${skipSubheader ? gutters.small : 0}px;
      line-height: 18px;
    }
  `
);

const ClearFiltersButton = styled(Button, { shouldForwardProp: () => true })(
  ({ theme }) =>
    css`
      display: inline-block;
      margin: 0 ${gutters.small / 2}px;
      border: 1px solid ${theme.colors.primary};
      width: auto;
      font-weight: normal;
    `
);

const getSubheaderMessage = (t: TFunction, hasFilters: boolean, totalProducts: number) => {
  if (totalProducts === 0 && hasFilters) {
    return t("Please update your search criteria or");
  }
  if (totalProducts === 0) {
    return t("Please update your search criteria");
  }
  return t("Refine the results by using the filters");
};

const ProductSearchListHeader = ({
  loading,
  isCompact = true,
  header,
  customSubheader,
  totalProducts = 0,
  onClearFilters,
  className,
  hasFilters,
  skipSubheader = false,
}: {
  loading: boolean;
  isCompact?: boolean;
  header?: string;
  customSubheader?: string;
  totalProducts?: number;
  onClearFilters?: () => void;
  className?: string;
  hasFilters: boolean;
  skipSubheader?: boolean;
}) => {
  const theme: Theme = useTheme();
  const { t } = useTranslation(Namespaces.commonSearchNs);
  const subheader = customSubheader || getSubheaderMessage(t, hasFilters, totalProducts);
  if (loading || !header) {
    return <Skeleton className={className} isCompact={isCompact} />;
  }
  return (
    <Wrapper isCompact={isCompact} className={className} data-testid="searchPageTitle">
      <StyledSectionHeading skipSubheader={skipSubheader}>{header}</StyledSectionHeading>
      {!skipSubheader && <SectionSubHeading>{subheader}</SectionSubHeading>}
      {hasFilters && totalProducts === 0 && onClearFilters && !loading && (
        <NoResultWrapper>
          <ClearFiltersButton onClick={onClearFilters} theme={theme} type="button" inverted>
            {t("Clear filters")}
          </ClearFiltersButton>
        </NoResultWrapper>
      )}
    </Wrapper>
  );
};

export default ProductSearchListHeader;
