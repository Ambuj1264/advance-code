import React, { useMemo } from "react";
import { useQuery } from "@apollo/react-hooks";
import { useTheme } from "emotion-theming";
// eslint-disable-next-line no-restricted-imports
import LazyHydrate from "react-lazy-hydration";

import ArticleQuery from "./queries/ArticleQuery.graphql";
import ArticleTourLandingUrlQuery from "./queries/ArticleTourLandingUrlQuery.graphql";

import ItemListStructuredData from "components/features/SEO/ItemListStructuredData?ssrOnly";
import ArticleStructuredData from "components/features/SEO/ArticleStructuredData?ssrOnly";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import {
  convertTableOfContentIntoStructuredDataList,
  getPageColor,
} from "components/ui/ArticleLayout/utils/articleLayoutUtils";
import TOCLoader from "components/ui/ArticleLayout/TOCLoader";
import { constructContent } from "components/ui/ArticleLayout/utils/contentUtils";
import {
  Author,
  Cover,
  FacebookComments,
  Row,
  WidgetsFullWidth,
  WidgetsRow,
  WrapOldHtml,
} from "components/ui/ArticleLayout";
import BreadcrumbsContainer from "components/ui/Breadcrumbs/BreadcrumbsContainer";
import BookingWidgetFooterMobile from "components/ui/ArticleLayout/BookingWidgetFooterMobile";
import SEOContainer from "components/features/SEO/SEOContainer";
import {
  ContentPageWrapper,
  ContentLayoutHeadingWrapper,
  WidgetsRowWrapper,
} from "components/ui/ArticleLayout/ArticleLayout";
import AdminGearLoader from "components/features/AdminGear/AdminGearLoader";
import { getArticleAdminLinks } from "components/features/AdminGear/utils";
import { useSettings } from "contexts/SettingsContext";
import { PageType, OpenGraphType, Marketplace } from "types/enums";
import Alert from "components/ui/Alert";
import useSession from "hooks/useSession";
import ArticleLayoutHeading from "components/ui/ArticleLayout/ArticleLayoutHeading";
import useActiveLocale from "hooks/useActiveLocale";
import DefaultPageLoading from "components/ui/Loading/DefaultLoadingPage";
import LazyHydrateWrapper from "components/ui/LazyHydrateWrapper";

const ArticleContainer = ({
  slug,
  categorySlug,
}: {
  slug: string;
  categorySlug: string | undefined;
}) => {
  const theme: Theme = useTheme();
  const { user } = useSession();
  const { adminUrl, marketplace } = useSettings();
  const activeLocale = useActiveLocale();
  const { t: commonCarNsT } = useTranslation(Namespaces.commonCarNs);
  const { t: commonNsT } = useTranslation(Namespaces.commonNs);
  const { t: quickFactsNsT } = useTranslation(Namespaces.quickFactsNs);

  const { error, data, loading } = useQuery<ContentTypes.QueryArticleContentData>(ArticleQuery, {
    variables: { slug, categorySlug },
  });
  const { data: dataTourLandingUrl } = useQuery<ContentTypes.QueryArticleTourLandingUrl>(
    ArticleTourLandingUrlQuery
  );

  const pageType = PageType.ARTICLE;
  const article = useMemo(() => {
    if (!data || !data.contentPage) {
      return undefined;
    }
    return constructContent(
      {
        ...data,
        ...dataTourLandingUrl,
      },
      {
        commonNsT,
        commonCarNsT,
        quickFactsNsT,
        pageType,
      },
      marketplace === Marketplace.GUIDE_TO_ICELAND
    );
  }, [data, dataTourLandingUrl, commonNsT, commonCarNsT, quickFactsNsT, pageType, marketplace]);

  const adminLinks = useMemo(() => {
    if (data?.contentPage) {
      const articleId = data.contentPage.id;

      return getArticleAdminLinks(activeLocale, adminUrl, articleId, pageType);
    }
    return [];
  }, [activeLocale, adminUrl, data, pageType]);

  if (error) return null;

  const articleUrlForStructuredData = article?.url ?? "";

  return (
    <>
      <TOCLoader tableOfContents={article?.tableOfContents} />
      {article?.metaImages && (
        <SEOContainer isIndexed images={article.metaImages} openGraphType={OpenGraphType.ARTICLE} />
      )}
      <ContentPageWrapper id="articleContainer" data-testid="articleContainer">
        <AdminGearLoader links={adminLinks} />

        {/* We need this on top as it's fixed positioned and we want help to browser to parse it and render earlier */}
        {article?.tourLandingUrl && (
          <LazyHydrateWrapper ssrOnly>
            <BookingWidgetFooterMobile tourLandingUrl={article.tourLandingUrl} />
          </LazyHydrateWrapper>
        )}

        <LazyHydrateWrapper ssrOnly>
          <BreadcrumbsContainer
            slug={slug}
            type={pageType}
            isLoading={loading}
            firstCrumbOnly={marketplace === Marketplace.GUIDE_TO_EUROPE}
          />
        </LazyHydrateWrapper>

        {loading && <DefaultPageLoading />}

        {article && (
          <>
            <Cover images={article.images} />

            <LazyHydrateWrapper ssrOnly>
              <Row
                main={
                  <ContentLayoutHeadingWrapper>
                    <ArticleLayoutHeading
                      title={article.title}
                      textColor={getPageColor(pageType, theme)}
                    />
                    <Author author={article.author} pageType={pageType} />
                  </ContentLayoutHeadingWrapper>
                }
              />
            </LazyHydrateWrapper>
            <WidgetsRowWrapper>
              <WidgetsRow
                contextPatch={{
                  slug,
                  id: article.id,
                  pageType,
                }}
                left={{ widgets: article.content.left }}
                main={{
                  // eslint-disable-next-line react/no-unstable-nested-components
                  wrapWidgets: children => (
                    <WrapOldHtml images={article.images}>{children}</WrapOldHtml>
                  ),
                  before: user?.isAdmin && article.draft && (
                    <>
                      <Alert>
                        <b>Draft article!</b> This article is draft.
                      </Alert>
                      <br />
                    </>
                  ),
                  widgets: article.content.main,
                  after: (
                    <FacebookComments
                      url={article.metadata.facebookLikeUrl}
                      commentsUrlOverride={article.metadata.facebookCommentsUrlOverride}
                    />
                  ),
                }}
                right={{ widgets: article.content.right }}
              />
            </WidgetsRowWrapper>
            <WidgetsFullWidth widgets={article.bottom || []} />
            <LazyHydrate ssrOnly>
              <ArticleStructuredData
                pageType={pageType}
                image={article.image}
                publicationDate={article.publishedTime}
                modifiedTime={article.modifiedTime}
                metadata={article.metadata}
                author={article.author}
                title={article.title}
                url={articleUrlForStructuredData}
              />

              <ItemListStructuredData
                pageType={pageType}
                publicationDate={article.publishedTime}
                modifiedTime={article.modifiedTime}
                author={article.author}
                url={articleUrlForStructuredData}
                itemList={convertTableOfContentIntoStructuredDataList(
                  articleUrlForStructuredData,
                  article.tableOfContents
                )}
              />
            </LazyHydrate>
          </>
        )}
      </ContentPageWrapper>
    </>
  );
};

export default ArticleContainer;
