import React, { useMemo } from "react";
import { useQuery } from "@apollo/react-hooks";
import styled from "@emotion/styled";
import { useTheme } from "emotion-theming";
import { useRouter } from "next/router";

import BlogQuery from "./queries/BlogQuery.graphql";

import SEOContainer from "components/features/SEO/SEOContainer";
import { constructAlternateCanonical } from "components/features/SEO/utils/SEOUtils";
import ItemListStructuredData from "components/features/SEO/ItemListStructuredData?ssrOnly";
import ArticleStructuredData from "components/features/SEO/ArticleStructuredData?ssrOnly";
import BookingWidgetFooterMobile from "components/ui/ArticleLayout/BookingWidgetFooterMobile";
import BreadcrumbsContainer from "components/ui/Breadcrumbs/BreadcrumbsContainer";
import CustomNextDynamic from "lib/CustomNextDynamic";
import { useTranslation } from "i18n";
import { constructContent } from "components/ui/ArticleLayout/utils/contentUtils";
import {
  convertTableOfContentIntoStructuredDataList,
  getPageColor,
} from "components/ui/ArticleLayout/utils/articleLayoutUtils";
import {
  Author,
  Cover,
  Row,
  WidgetsFullWidth,
  WidgetsRow,
  WrapOldHtml,
} from "components/ui/ArticleLayout";
import {
  ContentPageWrapper,
  ContentLayoutHeadingWrapper,
  WidgetsRowWrapper,
  FacebookComments,
} from "components/ui/ArticleLayout/ArticleLayout";
import AdminGearLoader from "components/features/AdminGear/AdminGearLoader";
import useActiveLocale from "hooks/useActiveLocale";
import { getBlogAdminLinks } from "components/features/AdminGear/utils";
import { useSettings } from "contexts/SettingsContext";
import { PageType, OpenGraphType, Marketplace } from "types/enums";
import { gutters } from "styles/variables";
import ArticleLayoutHeading from "components/ui/ArticleLayout/ArticleLayoutHeading";
import TOCLoader from "components/ui/ArticleLayout/TOCLoader";
import { Namespaces } from "shared/namespaces";
import DefaultPageLoading from "components/ui/Loading/DefaultLoadingPage";
import LazyHydrateWrapper from "components/ui/LazyHydrateWrapper";

const ContactUser = CustomNextDynamic(() => import("components/features/ContactUser"), {
  loading: () => null,
});

const RightButtonContainer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: flex-end;
`;

const CenterButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: ${gutters.large}px auto 0;
`;

const BlogContainer = ({ slug }: { slug: string }) => {
  const theme: Theme = useTheme();
  const { adminUrl, marketplace } = useSettings();
  const activeLocale = useActiveLocale();
  const { marketplaceUrl } = useSettings();
  const { asPath } = useRouter();
  const { t } = useTranslation(Namespaces.commonNs);
  const { t: articleT } = useTranslation(Namespaces.articleNs);
  const { t: commonCarNsT } = useTranslation(Namespaces.commonCarNs);
  const { t: quickFactsNsT } = useTranslation(Namespaces.quickFactsNs);

  const { error, data, loading } = useQuery<ContentTypes.QueryContentData>(BlogQuery, {
    variables: { slug },
  });

  const pageType = PageType.BLOG;
  const adminLinks = useMemo(() => {
    if (data?.contentPage) {
      const articleId = data.contentPage.id;

      return getBlogAdminLinks(activeLocale, adminUrl, articleId, pageType);
    }
    return [];
  }, [activeLocale, adminUrl, data, pageType]);

  if (loading) return <DefaultPageLoading />;
  if (error || !data || !data.contentPage) return null;

  const article = constructContent(
    data,
    {
      commonNsT: t,
      commonCarNsT,
      quickFactsNsT,
      pageType,
    },
    marketplace === Marketplace.GUIDE_TO_ICELAND
  );

  const { metadata, url, title, metaImages } = article;

  const articleUrlForStructuredData = url;
  const contactUserTranslations = {
    modalTitle: t("Contact {author}", {
      author: article.author.name,
    }),
    placeholder: articleT("Write a message to {author}", {
      author: article.author.name,
    }),
  };
  const alternateCanonicalUrl = constructAlternateCanonical({
    asPath,
    marketplaceUrl,
  });

  return (
    <>
      <TOCLoader tableOfContents={article.tableOfContents} />
      <SEOContainer
        isIndexed
        images={metaImages}
        openGraphType={OpenGraphType.ARTICLE}
        alternateCanonicalUrl={alternateCanonicalUrl}
      />
      <ContentPageWrapper id="blogContainer">
        <AdminGearLoader links={adminLinks} />
        {/* We need this on top as it's fixed positioned and we want help to browser to parse it and render earlier */}
        <LazyHydrateWrapper ssrOnly>
          <BookingWidgetFooterMobile tourLandingUrl={article.tourLandingUrl!} />
        </LazyHydrateWrapper>

        <LazyHydrateWrapper ssrOnly>
          <BreadcrumbsContainer slug={slug} type={pageType} />
        </LazyHydrateWrapper>
        <Cover images={article.images} />
        <ContentLayoutHeadingWrapper>
          <Row
            main={
              <LazyHydrateWrapper ssrOnly>
                <ArticleLayoutHeading title={title} textColor={getPageColor(pageType, theme)} />
                <Author author={article.author} pageType={pageType} />
              </LazyHydrateWrapper>
            }
            right={
              <LazyHydrateWrapper on="mouseenter">
                <RightButtonContainer>
                  <ContactUser author={article.author} translations={contactUserTranslations} />
                </RightButtonContainer>
              </LazyHydrateWrapper>
            }
          />
        </ContentLayoutHeadingWrapper>
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
              widgets: article.content.main,
              after: (
                <>
                  <LazyHydrateWrapper on="mouseenter">
                    <CenterButtonContainer>
                      <ContactUser author={article.author} translations={contactUserTranslations} />
                    </CenterButtonContainer>
                  </LazyHydrateWrapper>
                  <FacebookComments
                    url={article.metadata.facebookLikeUrl}
                    commentsUrlOverride={article.metadata.facebookCommentsUrlOverride}
                  />
                </>
              ),
            }}
            right={{ widgets: article.content.right }}
          />
        </WidgetsRowWrapper>
        <WidgetsFullWidth widgets={article.bottom || []} />
        <LazyHydrateWrapper ssrOnly>
          <ArticleStructuredData
            pageType={pageType}
            image={article.image}
            publicationDate={article.publishedTime}
            modifiedTime={article.modifiedTime}
            metadata={metadata}
            author={article.author}
            title={title}
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
        </LazyHydrateWrapper>
      </ContentPageWrapper>
    </>
  );
};

export default BlogContainer;
