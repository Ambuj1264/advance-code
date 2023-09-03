import React, { useCallback } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import ArrowIcon from "@travelshift/ui/icons/arrow.svg";
import { constructUniqueIdentifier } from "@travelshift/ui/utils/utils";

import ClientLinkPrefetch from "../ClientLinkPrefetch";

import { useIsDesktop } from "hooks/useMediaQueryCustom";
import useToggle from "hooks/useToggle";
import { PageType } from "types/enums";
import { urlToRelative } from "utils/apiUtils";
import LazyImage from "components/ui/Lazy/LazyImage";
import { typographyH4, typographySubtitle1 } from "styles/typography";
import Row from "components/ui/Grid/Row";
import { whiteColor, gutters, boxShadowTileRegular } from "styles/variables";
import { mqMin, mqMax, column } from "styles/base";
import { Card, CardContent, CardTitle, Description } from "components/ui/Teaser/TeaserComponents";
import { Trans } from "i18n";
import { Namespaces } from "shared/namespaces";
import { getProductSlugFromHref } from "utils/routerUtils";

const ExpandWrapper = styled.label`
  display: block;
  padding-top: ${gutters.small}px;
  ${mqMin.medium} {
    display: none;
  }
`;

const Title = styled.h2([
  typographyH4,
  css`
    color: ${whiteColor};
  `,
]);

const SubHeading = styled.span([
  typographySubtitle1,
  css`
    color: ${whiteColor};
  `,
]);

const StyledArrowIcon = styled(ArrowIcon)(
  ({ theme }) => css`
    margin-top: 10px;
    width: 14px;
    height: 14px;
    transform: rotate(90deg);
    transition: transform 0.2s ease-in-out;
    fill: ${theme.colors.primary};
  `
);

const ExpandButton = styled.span(
  ({ theme }) => css`
    display: block;
    margin: auto;
    border: 1px solid ${theme.colors.primary};
    border-radius: 50%;
    width: 32px;
    height: 32px;
    background: ${whiteColor};
  `
);

const StyledCard = styled(Card)(
  ({ theme }) =>
    css`
      height: 100%;
      padding-right: ${gutters.small / 2}px;
      padding-left: ${gutters.small / 2}px;
      &:hover {
        background: ${theme.colors.primary};
        cursor: pointer;
        ${CardTitle}, ${Description} {
          color: ${whiteColor};
        }
      }

      ${CardContent} {
        margin-left: 0;
      }
    `
);

const SubcategoryItem = styled.div([
  column({ small: 1, medium: 1 / 2, large: 1 / 3, desktop: 1 / 4 }),
  css`
    margin-top: ${gutters.small}px;
    width: 100%;
    height: 80px;
    text-align: center;
  `,
]);

const HiddenCheckbox = styled.input`
  display: none;
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;

  ${mqMin.medium} {
    flex-direction: row;
  }

  ${mqMax.medium} {
    /* stylelint-disable-next-line selector-max-type */
    ${HiddenCheckbox} ~ & {
      height: 0px;
      overflow: hidden;
      transition: height 200ms;
    }
    /* stylelint-disable-next-line selector-max-type */
    ${HiddenCheckbox}:checked ~ & {
      height: auto;
      overflow: visible;
    }
  }
`;

const CardContainerSkeleton = styled.div`
  display: none;

  ${mqMin.medium} {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
`;

const Container = styled.div`
  position: relative;
  display: flex;
  box-shadow: ${boxShadowTileRegular};
  border-radius: 6px;
  height: 179px;
  overflow: hidden;
`;

const HeadingWrapper = styled.div`
  position: absolute;
  top: 100px;
  left: 50%;
  width: 100%;
  text-align: center;
  transform: translate(-50%, -50%);
  ${mqMin.medium} {
    top: 90px;
  }
`;

const StyledLazyImage = styled(LazyImage)`
  height: 185px;
  object-fit: cover;
  & > img {
    object-fit: cover;
  }
`;

const CoverImage = ({ src, alt }: { src: string; alt?: string }) => (
  <StyledLazyImage src={src} sizes="100vw" alt={alt} imgixParams={{ fit: "crop" }} />
);

const SkeletonLink = styled.a`
  width: 100%;
  text-align: center;
`;

const SkeletonWrapper = styled.div`
  max-height: 1265px;

  ${mqMin.medium} {
    max-height: none;
  }
`;
export const CategoryCover = ({ category }: { category: SearchPageTypes.Category }) => {
  const { id, name: categoryTitle, tours, image, subCategories, url } = category;
  const htmlId = constructUniqueIdentifier(`${id}categoryIdExpandCheckbox`);
  const isDesktop = useIsDesktop();

  const [isSubcategoryItemsVisible, toggleIsSubcategoryItemsVisible] = useToggle(isDesktop);

  const onExpandClick = useCallback(() => {
    toggleIsSubcategoryItemsVisible();
  }, [toggleIsSubcategoryItemsVisible]);

  return (
    <>
      <HiddenCheckbox type="checkbox" id={htmlId} />
      <Container>
        <CoverImage src={image.url} alt={categoryTitle} />
        <HeadingWrapper>
          <ClientLinkPrefetch
            clientRoute={{
              query: {
                slug: getProductSlugFromHref(url),
              },
              route: `/${PageType.TOURCATEGORY}`,
              as: urlToRelative(url),
            }}
            linkUrl={url}
          >
            <Title>{categoryTitle}</Title>
            <SubHeading>
              <Trans
                ns={Namespaces.tourSearchNs}
                i18nKey="{numberOfTours} tours"
                defaults="{numberOfTours} tours"
                values={{
                  numberOfTours: tours,
                }}
              />
            </SubHeading>
          </ClientLinkPrefetch>
          <ExpandWrapper htmlFor={htmlId} onClick={onExpandClick}>
            <ExpandButton>
              <StyledArrowIcon
                css={css`
                  /* stylelint-disable-next-line selector-max-type */
                  ${HiddenCheckbox}:checked ~ * & {
                    margin-top: ${gutters.small / 2}px;
                    transform: rotate(270deg);
                    transition: transform 0.2s ease-in-out, margin-top 0.2s ease-in-out;
                  }
                `}
              />
            </ExpandButton>
          </ExpandWrapper>
        </HeadingWrapper>
      </Container>
      <CardContainer>
        <Row>
          {subCategories.map(subCategory => (
            <SubcategoryItem key={subCategory.id}>
              <ClientLinkPrefetch
                clientRoute={{
                  query: {
                    slug: getProductSlugFromHref(subCategory.url),
                  },
                  route: `/${PageType.TOURCATEGORY}`,
                  as: urlToRelative(subCategory.url),
                }}
                linkUrl={subCategory.url}
                disablePrefetch={!isSubcategoryItemsVisible}
              >
                <StyledCard hasShadow>
                  <CardContent>
                    <CardTitle isSmall>{subCategory.name}</CardTitle>
                    <Description>
                      <Trans
                        ns={Namespaces.tourSearchNs}
                        i18nKey="{numberOfTours} tours"
                        defaults="{numberOfTours} tours"
                        values={{
                          numberOfTours: subCategory.tours,
                        }}
                      />
                    </Description>
                  </CardContent>
                </StyledCard>
              </ClientLinkPrefetch>
            </SubcategoryItem>
          ))}
        </Row>
      </CardContainer>
    </>
  );
};

export const CategoryCoverSkeleton = ({
  category: { name: categoryTitle, tours, subCategories, url },
}: {
  category: SearchPageTypes.Category;
}) => {
  return (
    <SkeletonWrapper>
      <Container>
        <SkeletonLink href={`${url}`}>
          <h2>{categoryTitle}</h2>
          <Trans
            ns={Namespaces.tourSearchNs}
            i18nKey="{numberOfTours} tours"
            defaults="{numberOfTours} tours"
            values={{
              numberOfTours: tours,
            }}
          />
        </SkeletonLink>
      </Container>
      <CardContainerSkeleton>
        <Row>
          {subCategories.map(subCategory => (
            <SubcategoryItem key={subCategory.id}>
              <a href={subCategory.url}>
                {subCategory.name}
                <Trans
                  ns={Namespaces.tourSearchNs}
                  i18nKey="{numberOfTours} tours"
                  defaults="{numberOfTours} tours"
                  values={{
                    numberOfTours: subCategory.tours,
                  }}
                />
              </a>
            </SubcategoryItem>
          ))}
        </Row>
      </CardContainerSkeleton>
    </SkeletonWrapper>
  );
};

export default CategoryCover;
