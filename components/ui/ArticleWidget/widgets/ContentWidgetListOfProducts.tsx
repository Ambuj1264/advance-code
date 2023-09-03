import React, { useContext } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { useTheme } from "emotion-theming";

import ContentProductWidget from "./ContentProductWidget";

import ClientLinkPrefetch from "components/ui/ClientLinkPrefetch";
import { getPageColor } from "components/ui/ArticleLayout/utils/articleLayoutUtils";
import ArticleContext from "components/ui/ArticleLayout/ArticleContext";
import { TileProductCardSSRSkeleton } from "components/ui/Search/TileProductCard";
import LazyComponent, { LazyloadOffset } from "components/ui/Lazy/LazyComponent";
import ArrowRightIcon from "components/icons/arrow-right.svg";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import { column, row, mqMin } from "styles/base";
import { gutters, breakpointsMin, breakpointsMax, fontWeightBold } from "styles/variables";
import { TeaserListVariant, PageType } from "types/enums";
import { typographySubtitle1, typographySubtitle2 } from "styles/typography";
import { Header } from "components/ui/TeaserList/TeaserListComponents";
import { useGlobalContext } from "contexts/GlobalContext";
import LazyHydrateWrapper from "components/ui/LazyHydrateWrapper";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: ${gutters.small}px 0;
`;

const StyledHorizontalHeader = styled.h2<{ textColor: string }>([
  typographySubtitle1,
  ({ textColor }) => css`
    align-self: flex-start;
    color: ${textColor};
    font-weight: ${fontWeightBold};
    text-align: left;
  `,
]);

const ListOfProducts = styled.ul([
  row,
  css`
    align-self: center;
    margin: 0;
    margin-top: ${gutters.small}px;
    width: calc(100% + ${gutters.small}px);
    padding-left: 0;
    list-style: none;

    ${mqMin.large} {
      width: calc(100% + ${gutters.large}px);
    }
  `,
]);

const ListItem = styled.li<{ isHorizontal?: boolean }>([
  ({ isHorizontal }) =>
    isHorizontal
      ? [
          column({ small: 1, medium: 1 / 3, large: 1, desktop: 1 / 3 }),
          css`
            & + & {
              margin-top: ${gutters.small}px;
            }

            ${mqMin.medium} {
              & + & {
                margin-top: 0;
              }
            }

            @media (min-width: ${breakpointsMin.large}px) and (max-width: ${breakpointsMax.desktop}px) {
              margin-right: auto;
              margin-left: auto;
              max-width: 65%;

              & + & {
                margin-top: ${gutters.small}px;
              }
            }
          `,
        ]
      : [
          column({ small: 1 }),
          css`
            & + & {
              margin-top: ${gutters.small}px;
            }
          `,
        ],
]);

const categoryLinkStyles = (theme: Theme) => css`
  align-self: flex-end;
  margin-top: ${gutters.small}px;
  ${typographySubtitle2};
  color: ${theme.colors.primary};

  &:hover,
  &:focus {
    text-decoration: underline;
  }
`;

const CategoryLink = styled(ClientLinkPrefetch)(({ theme }) => categoryLinkStyles(theme));

const ArrowRightIconStyled = styled(ArrowRightIcon)(
  ({ theme }) => css`
    margin-left: ${gutters.small / 2}px;
    width: 12px;
    height: 12px;
    fill: ${theme.colors.primary};
  `
);

const ListHeader = ({
  title,
  url,
  icon,
  isHorizontal,
}: {
  title?: string;
  url?: string;
  icon?: string;
  isHorizontal: boolean;
}) => {
  const { pageType } = useContext(ArticleContext);
  const theme: Theme = useTheme();

  if (!title) {
    return null;
  }

  const headerColor = getPageColor(pageType, theme);

  if (isHorizontal) {
    const titleComponent = url ? <a href={url}>{title}</a> : title;
    return (
      <StyledHorizontalHeader textColor={headerColor}>{titleComponent}</StyledHorizontalHeader>
    );
  }

  return <Header title={title} icon={icon} url={url} textColor={headerColor} />;
};

const ContentWidgetListOfProducts = ({
  widget,
}: {
  widget: ArticleWidgetTypes.ContentWidgetListOfProducts;
}) => {
  const isMobile = useIsMobile();
  const { isClientNavigation } = useGlobalContext();
  const shouldShowSkeletonItems = !isClientNavigation.current;

  if (!widget.items.length) {
    return null;
  }

  const isHorizontal = widget.variant === TeaserListVariant.HORIZONTAL;

  const products = widget.items as TeaserTypes.Product[];

  const listOfProducts = (
    <ListOfProducts>
      {products.map(product => (
        <ListItem isHorizontal={isHorizontal} key={product.id}>
          <ContentProductWidget product={product} />
        </ListItem>
      ))}
    </ListOfProducts>
  );

  return (
    <Wrapper>
      <ListHeader
        title={widget.title}
        url={widget.titleLink}
        icon={widget.icon}
        isHorizontal={isHorizontal}
      />
      {!shouldShowSkeletonItems ? (
        listOfProducts
      ) : (
        <LazyComponent
          lazyloadOffset={isMobile ? LazyloadOffset.Tiny : LazyloadOffset.Medium}
          loadingElement={
            <LazyHydrateWrapper ssrOnly>
              <ListOfProducts>
                {products.map(product => (
                  <ListItem isHorizontal={isHorizontal} key={product.id}>
                    <TileProductCardSSRSkeleton
                      key={product.id}
                      linkUrl={product.linkUrl}
                      headline={product.name}
                    />
                  </ListItem>
                ))}
              </ListOfProducts>
            </LazyHydrateWrapper>
          }
        >
          {listOfProducts}
        </LazyComponent>
      )}
      {widget.categoryLinkClientRoute ? (
        <CategoryLink
          linkUrl={widget.categoryLinkClientRoute.as}
          useRegularLink={widget.categoryLinkClientRoute.route === `/${PageType.PAGE}`}
          clientRoute={widget.categoryLinkClientRoute}
          title={widget.categoryLinkTitle}
        >
          {widget.categoryLinkTitle}
          <ArrowRightIconStyled />
        </CategoryLink>
      ) : null}
    </Wrapper>
  );
};

export default ContentWidgetListOfProducts;
