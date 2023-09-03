import React, { useState } from "react";
import styled from "@emotion/styled";
import { useRouter } from "next/router";

import PaginationMetatags from "../PaginatedContent/PaginationMetatags";

import TopArticleGridListLoading from "./TopArticleGridListLoading";
import { StyledGridColumn } from "./TopArticleShared";

import { useGlobalContext } from "contexts/GlobalContext";
import { getProductSlugFromHref, cleanAsPath } from "utils/routerUtils";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import { PageType } from "types/enums";
import { constructGtiCnCanonicalUrl, urlToRelative } from "utils/apiUtils";
import { convertImageWithNumberId } from "utils/imageUtils";
import PaginatedContent from "components/ui/PaginatedContent/PaginatedContent";
import LazyComponent, { LazyloadOffset } from "components/ui/Lazy/LazyComponent";
import ClientLinkPrefetch from "components/ui/ClientLinkPrefetch";
import TeaserOverlayBanner from "components/ui/Teaser/TeaserOverlayBanner";
import TeaserSideCardHorizontal from "components/ui/Teaser/variants/TeaserSideCardHorizontal";
import SectionRow from "components/ui/Section/SectionRow";
import SectionContent from "components/ui/Section/SectionContent";
import { TileProductSSRSkeletonGridElement } from "components/ui/Search/TileProductCardSkeleton";
import Row from "components/ui/Grid/Row";
import { useSettings } from "contexts/SettingsContext";
import { gutters } from "styles/variables";
import LazyHydrateWrapper from "components/ui/LazyHydrateWrapper";
import useActiveLocale from "hooks/useActiveLocale";

const StyledSectionRow = styled(SectionRow)`
  ${SectionContent} {
    margin-top: 0;
  }
  ${Row} {
    margin-bottom: ${gutters.small}px;
  }
`;

const TeaserCard = ({ article }: { article: SharedTypes.TopArticle }) => {
  const image: Image = convertImageWithNumberId(article.image);
  const OverlayBanner = article.bannerId ? <TeaserOverlayBanner icon={article.bannerId} /> : null;

  return (
    <StyledGridColumn>
      <ClientLinkPrefetch
        linkUrl={urlToRelative(article.url)}
        clientRoute={
          article.clientRoute ?? {
            query: {
              slug: getProductSlugFromHref(article.url),
            },
            route: `/${PageType.ARTICLE}`,
            as: urlToRelative(article.url),
          }
        }
        title={article.title}
      >
        <TeaserSideCardHorizontal
          url={article.url}
          title={article.title}
          description={article.metadata.description}
          image={image}
          hasCallToAction={false}
          overlay={OverlayBanner}
          author={article.author}
          hasMaxwidth={false}
        />
      </ClientLinkPrefetch>
    </StyledGridColumn>
  );
};

const NUMBER_OF_TOP_ITEMS = 8;

const TopArticleGridList = ({
  metadata,
  articles,
  loading,
  isArticleCategory,
  totalPages,
  currentPage,
}: {
  metadata: SharedTypes.PageSectionMetadata;
  articles: SharedTypes.TopArticle[];
  loading: boolean;
  isArticleCategory: boolean;
  totalPages: number;
  currentPage: number;
}) => {
  const { asPath } = useRouter();
  const { marketplaceUrl, marketplace } = useSettings();
  const activeLocale = useActiveLocale();
  const [cacheHitPaginationLoading, setCacheHitPaginationLoading] = useState(false);
  const { isClientNavigation } = useGlobalContext();
  const shouldShowSkeletonItems = !isClientNavigation.current;
  const isMobile = useIsMobile();
  const fullItems =
    currentPage > 1 || !shouldShowSkeletonItems ? articles : articles.slice(0, NUMBER_OF_TOP_ITEMS);
  const skeletonItems = !shouldShowSkeletonItems ? [] : articles.slice(fullItems.length);

  const isLoading = cacheHitPaginationLoading || loading;
  const onPaginationClick = () => {
    setCacheHitPaginationLoading(true);
    setTimeout(() => setCacheHitPaginationLoading(false), 750);
  };

  const canonical = constructGtiCnCanonicalUrl({
    marketplace,
    activeLocale,
    asPath,
    shouldCleanAsPath: true,
    marketplaceUrl,
    defaultNonGtiCnCanonicalUrl: `${marketplaceUrl}/${cleanAsPath(asPath)}`,
  });

  return (
    <>
      {isArticleCategory && (
        <PaginationMetatags
          currentPage={currentPage}
          totalPages={totalPages}
          canonical={canonical}
        />
      )}
      <PaginatedContent
        name="page"
        isLoading={isLoading}
        totalPages={totalPages}
        enablePagination={isArticleCategory && totalPages > 1}
        setQueryParam
        onPageChange={onPaginationClick}
        runPageChangeOnMount={false}
        usePaginatedLinks
      >
        <StyledSectionRow
          title={metadata.title}
          subtitle={metadata.subtitle}
          categoryLink={metadata.url}
          isLegacyRoute
          isFirstSection={isArticleCategory}
        >
          <>
            {isLoading && <TopArticleGridListLoading />}
            {!isLoading && (
              <>
                {fullItems.map(article => (
                  <TeaserCard key={article.id} article={article} />
                ))}
                {skeletonItems.length > 0 && (
                  <LazyComponent
                    lazyloadOffset={isMobile ? LazyloadOffset.Tiny : LazyloadOffset.Medium}
                    loadingElement={
                      <LazyHydrateWrapper ssrOnly>
                        {skeletonItems.map(article => (
                          <StyledGridColumn key={article.id}>
                            <TileProductSSRSkeletonGridElement
                              headline={article.title}
                              linkUrl={article.url}
                            />
                          </StyledGridColumn>
                        ))}
                      </LazyHydrateWrapper>
                    }
                  >
                    {skeletonItems.map(article => (
                      <TeaserCard key={article.id} article={article} />
                    ))}
                  </LazyComponent>
                )}
              </>
            )}
          </>
        </StyledSectionRow>
      </PaginatedContent>
    </>
  );
};

export default TopArticleGridList;
