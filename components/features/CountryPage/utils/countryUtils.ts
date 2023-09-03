import { PageType, Marketplace } from "types/enums";

export const DEFAULT_METADATA = {
  title: "",
  subtitle: "",
};

export const normalizeCountryHeaderData = ({
  metadata: { title, subtitle },
  image,
}: CountryPageTypes.QueryCategoryHeader): SharedTypes.CategoryHeaderData => ({
  title,
  description: subtitle,
  images: [{ ...image }],
});

// For monolith marketplaces
export const isFlightsEnabled = (marketplace: Marketplace) =>
  marketplace === Marketplace.GUIDE_TO_ICELAND ||
  marketplace === Marketplace.GUIDE_TO_THE_PHILIPPINES;

export const getPropsWithDefaults = (
  countryData: CountryPageTypes.PageQuery | undefined,
  marketplaceFlightService: SharedTypes.PageItemType,
  marketplace: Marketplace
) => ({
  countryCoverProps: {
    ...(countryData
      ? normalizeCountryHeaderData(countryData.frontHeader)
      : { images: [], title: "", description: "" }),
    frontVideoId: countryData?.settings.frontVideoId ?? undefined,
  },
  frontBestTravelPlansProps: {
    metadata: countryData?.frontBestTravelPlans.metadata ?? DEFAULT_METADATA,
  },
  frontTopToursProps: {
    metadata: countryData?.frontTopTours.metadata ?? DEFAULT_METADATA,
  },
  frontTopAttractionsProps: {
    attractions: countryData?.frontTopAttractions.attractions ?? [],
    metadata: countryData?.frontTopAttractions.metadata ?? DEFAULT_METADATA,
  },
  frontTopArticlesProps: {
    articles: countryData?.frontTopArticles?.articles ?? [],
    metadata: countryData?.frontTopArticles?.metadata ?? DEFAULT_METADATA,
  },
  topTravelCommunityProps: {
    items: countryData?.settings.frontTopTravelCommunity.categories ?? [],
    metadata: countryData?.settings.frontTopTravelCommunity.metadata ?? DEFAULT_METADATA,
  },
  frontTopGalleriesProps: {
    images: countryData?.frontTopGalleries.images ?? [],
    metadata: countryData?.frontTopGalleries.metadata ?? DEFAULT_METADATA,
  },
  frontTopServices: [
    ...[...(countryData?.settings.frontServices ?? [])],
    ...(isFlightsEnabled(marketplace) ? [marketplaceFlightService] : []),
  ],
});

export const getMarketplaceFlightService = (flightUrl: string, flightTitle: string) => ({
  title: flightTitle,
  uri: flightUrl,
  isLegacy: false,
  type: "flight",
  pageType: PageType.FLIGHTSEARCH,
});
