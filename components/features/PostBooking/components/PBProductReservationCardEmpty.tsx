import React from "react";
import styled from "@emotion/styled";
import { range } from "fp-ts/lib/Array";
import { useTranslation } from "react-i18next";
import { css } from "@emotion/core";

import { typographyBody1 } from "styles/typography";
import { Namespaces } from "shared/namespaces";
import { clampLines, mqMax, mqMin } from "styles/base";
import { ProductCardContainer } from "components/ui/ProductCard/ProductCardContainer";
import { ProductCardFooterContainer } from "components/ui/ProductCard/ProductcardFooterContainer";
import { getClientSideUrl } from "utils/helperUtils";
import { useSettings } from "contexts/SettingsContext";
import {
  ProductCardActionButton,
  ProductCardActionButtonsWrapper,
  StyledActionButton,
  StyledActionButtonContentWrapper,
  StyledActionButtonTitle,
} from "components/ui/ProductCard/ProductCardActionButton";
import {
  borderRadiusSmall,
  fontWeightSemibold,
  gutters,
  lightGreyColor,
  loadingBlue,
  placeholderColor,
} from "styles/variables";
import { RightColumn, Title } from "components/ui/ProductCard/ProductCardOverview";
import { PageType, SupportedLanguages } from "types/enums";

const ProductCardHeader = styled.div`
  height: 24px;
  background-color: ${placeholderColor};
  ${mqMax.large} {
    height: 32px;
  }
`;

const OverviewSection = styled.div`
  display: flex;
  ${mqMax.large} {
    flex-direction: column;
  }
`;

const ProductCardContainerStyled = styled(ProductCardContainer)`
  margin: 0 auto;
  max-width: 1038px;
  padding: 0;
  ${mqMax.large} {
    width: 328px;
  }
  ${mqMin.large} {
    padding: 0;
  }
`;

const ImagePlaceholder = styled.div`
  flex: 0 0 269px;
  height: 204px;
  background-color: ${loadingBlue};
  ${mqMax.large} {
    flex: none;
    width: 100%;
    height: 161px;
  }
`;

const ProductSpecsPlaceholderSection = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const ProductSpecTitlePlaceholderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
`;

const ProductSpecsPlaceholderWrapper = styled.div`
  display: flex;
  margin-right: 150px;
  &:nth-of-type(even) {
    margin-right: 0;
  }
  ${mqMax.large} {
    margin-right: 10px;
  }
`;

const ProductSpecIconPlaceholder = styled.div`
  margin-right: ${gutters.small / 2}px;
  border-radius: ${borderRadiusSmall};
  width: 32px;
  height: 24px;
  background: ${lightGreyColor};
`;

const ProductSpecTitlePlaceholder = styled.div`
  margin-bottom: 4px;
  width: 97px;
  height: 12px;
  background: ${lightGreyColor};
  ${mqMax.large} {
    width: 56px;
  }
`;
const ProductSpecTitlePlaceholderLonger = styled(ProductSpecTitlePlaceholder)`
  width: 168px;
  ${mqMax.large} {
    width: 102px;
  }
`;

const ProductCardFooterContainerStyled = styled(ProductCardFooterContainer)`
  margin: auto;
  height: 48px;
`;

const ProductCardActionButtonStyled = styled(ProductCardActionButton)`
  ${StyledActionButtonTitle} {
    max-width: 100%;
  }
`;

const TitleStyled = styled(Title)([
  typographyBody1,
  clampLines(2),
  ({ theme }) => css`
    display: block;
    margin-bottom: 20px;
    color: ${theme.colors.primary};
    font-weight: ${fontWeightSemibold};
  `,
]);

const ProductCardActionButtonsWrapperStyled = styled(ProductCardActionButtonsWrapper)`
  display: flex;
  justify-content: flex-end;

  ${StyledActionButton} {
    flex-grow: 0;
    max-width: none;
  }
  ${StyledActionButtonContentWrapper} {
    padding: 0 ${gutters.small}px;
  }
`;

const ProductSpecsPlaceholder = () => {
  return (
    <ProductSpecsPlaceholderWrapper>
      <ProductSpecIconPlaceholder />
      <ProductSpecTitlePlaceholderWrapper>
        <ProductSpecTitlePlaceholder />
        <ProductSpecTitlePlaceholderLonger />
      </ProductSpecTitlePlaceholderWrapper>
    </ProductSpecsPlaceholderWrapper>
  );
};

export const PBProductReservationCardEmpty = () => {
  const { t: postbookingT } = useTranslation(Namespaces.postBookingNs);
  const { marketplace } = useSettings();

  return (
    <ProductCardContainerStyled>
      <ProductCardHeader />
      <OverviewSection>
        <ImagePlaceholder />
        <RightColumn>
          <TitleStyled>{postbookingT("Book all you need in one place")}</TitleStyled>
          <ProductSpecsPlaceholderSection>
            {range(0, 5).map(i => (
              <ProductSpecsPlaceholder key={i} />
            ))}
          </ProductSpecsPlaceholderSection>
        </RightColumn>
      </OverviewSection>
      <ProductCardFooterContainerStyled>
        <ProductCardActionButtonsWrapperStyled isTileCard={false} isSingleButton>
          <ProductCardActionButtonStyled
            title={postbookingT("Book your trip now!")}
            displayType="secondary"
            clientRoute={{
              as: getClientSideUrl(
                "vacationPackages",
                SupportedLanguages.English, // TODO: use proper locale when we have vp search for all
                marketplace
              ),
              route: `/${PageType.VACATION_PACKAGES_LANDING}`,
            }}
          />
        </ProductCardActionButtonsWrapperStyled>
      </ProductCardFooterContainerStyled>
    </ProductCardContainerStyled>
  );
};
