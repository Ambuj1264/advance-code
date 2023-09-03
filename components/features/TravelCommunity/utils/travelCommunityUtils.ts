import { getFlagIcon } from "@travelshift/ui/utils/flagUtils";

import PopularTipsQuery from "../queries/PopularTipsQuery.graphql";
import LatestTipsQuery from "../queries/LatestTipsQuery.graphql";
import TopBloggersQuery from "../queries/TopBloggersQuery.graphql";
import BloggerLanguagesQuery from "../queries/BloggerLanguagesQuery.graphql";

import FrontValuePropsQuery from "components/ui/FrontValuePropositions/FrontValuePropsQuery.graphql";
import PageMetadataQuery from "hooks/queries/PageMetadataQuery.graphql";
import BreadcrumbsQuery from "components/ui/Breadcrumbs/BreadcrumbsQuery.graphql";
import TravelCommunityQuery from "components/features/TravelCommunity/queries/TravelCommunityQuery.graphql";
import { convertImage } from "utils/imageUtils";
import { getProductSlugFromHref, removeLocaleCode } from "utils/routerUtils";
import { longCacheHeaders, urlToRelative } from "utils/apiUtils";
import { PageType, LandingPageType, SupportedLanguages } from "types/enums";
import { DEFAULT_METADATA } from "components/features/CountryPage/utils/countryUtils";

export const NUMBER_OF_TOP_BLOGGERS = 12;

export const constructTips = (
  queryPopularTips: SharedTypes.QueryBlog[],
  locale: SupportedLanguages
): SharedTypes.TopArticle[] =>
  queryPopularTips.map((queryPopularTip: SharedTypes.QueryBlog) => ({
    id: queryPopularTip.id,
    url: queryPopularTip.url,
    clientRoute: {
      query: {
        slug: getProductSlugFromHref(queryPopularTip.url),
        category: removeLocaleCode(queryPopularTip.url, locale).split("/")[2],
      },
      route: `/${PageType.BLOG}`,
      as: urlToRelative(queryPopularTip.url),
    },
    title: queryPopularTip.title,
    metadata: {
      description: queryPopularTip.metadata.description,
    },
    image: {
      id: String(queryPopularTip.image.id),
      url: queryPopularTip.image.url,
      name: queryPopularTip.title,
    },
    author: {
      id: queryPopularTip.author.id,
      name: queryPopularTip.author.name,
      image: {
        id: String(queryPopularTip.author.image.id),
        url: queryPopularTip.author.image.url.split("?")[0],
      },
    },
  }));

export const getTravelCommunityQueries = ({
  slug,
  pageType,
  landingPageType,
}: {
  slug: string;
  pageType: PageType;
  landingPageType: LandingPageType;
}) => {
  const pageTypeForTravelCommunityQuery =
    landingPageType === LandingPageType.LOCALBLOGGERS
      ? PageType.LOCALCOMMUNITY
      : PageType.TRAVELCOMMUNITY;

  return [
    {
      query: BreadcrumbsQuery,
      variables: {
        type: pageType.toUpperCase(),
        landingPageType: landingPageType.toUpperCase(),
      },
      context: { headers: longCacheHeaders },
    },
    {
      query: FrontValuePropsQuery,
    },
    {
      query: PageMetadataQuery,
      variables: { path: slug },
      context: { headers: longCacheHeaders },
    },
    {
      query: PopularTipsQuery,
      variables: {
        type: pageType,
      },
    },
    {
      query: LatestTipsQuery,
      variables: {
        type: pageType,
      },
    },
    {
      query: TravelCommunityQuery,
      variables: { pageType: pageTypeForTravelCommunityQuery },
      isRequiredForPageRendering: true,
    },
    {
      query: TopBloggersQuery,
      variables: {
        type: pageType,
        page: 1,
        languageId: "",
        limit: NUMBER_OF_TOP_BLOGGERS,
      },
    },
    {
      query: BloggerLanguagesQuery,
      variables: {
        type: pageType,
      },
    },
  ] as SharedTypes.Query[];
};

export const constructTopBloggers = (
  queryBloggers: TravelCommunityTypes.QueryBlogger[],
  isLocals: boolean
): TravelCommunityTypes.Blogger[] =>
  queryBloggers.map((queryBlogger: TravelCommunityTypes.QueryBlogger) => ({
    id: queryBlogger.id,
    name: queryBlogger.name ?? "",
    url: queryBlogger.url ?? "",
    image: queryBlogger.image ? convertImage(queryBlogger.image) : undefined,
    faceImage: queryBlogger.faceImage ? convertImage(queryBlogger.faceImage) : undefined,
    country: queryBlogger.country ?? "",
    Icon: isLocals ? undefined : getFlagIcon(queryBlogger.countryCode),
    languages: queryBlogger.languages?.map(lang => lang?.code) ?? [],
  }));

export const normalizeTravelCommunityHeaderData = ({
  metadata: { title, subtitle },
  header: { image },
}: TravelCommunityTypes.QueryCategoryHeader): SharedTypes.CategoryHeaderData => ({
  title,
  description: subtitle,
  images: [{ ...image }],
});

export const getPropsWithDefaults = (
  travelCommunityData: TravelCommunityTypes.PageQuery | undefined
) => ({
  travelCoverProps: {
    ...(travelCommunityData
      ? normalizeTravelCommunityHeaderData(travelCommunityData.settings.pageHeader)
      : { images: [], title: "", description: "" }),
  },
  topAttractionsProps: {
    attractions: travelCommunityData?.topAttractions.attractions ?? [],
    metadata: travelCommunityData?.topAttractions.metadata ?? DEFAULT_METADATA,
  },
  bestTravelPlansProps: {
    tours: travelCommunityData?.bestTravelPlans.tours ?? [],
    metadata: travelCommunityData?.bestTravelPlans.metadata ?? DEFAULT_METADATA,
  },
});
