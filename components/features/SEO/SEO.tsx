import React from "react";
import Head from "next/head";

import useActiveLocale from "hooks/useActiveLocale";
import { useSettings } from "contexts/SettingsContext";
import { GraphCMSPageType, OpenGraphType, SupportedLanguages } from "types/enums";
import { formatImagesForSEOmeta } from "utils/imageUtils";
import { getReplacedLocale } from "components/ui/utils/uiUtils";
import { constructGtiCnCanonicalUrl, urlToRelative } from "utils/apiUtils";
import { getPlaceMetaInfo } from "components/ui/LandingPages/utils/landingPageUtils";

const SEO = ({
  isIndexed,
  images,
  title,
  description,
  hreflangs,
  openGraphType = OpenGraphType.WEBSITE,
  openGraphUrl,
  alternateCanonicalUrl,
  alternateCanonicalUrlForCnLocale,
  alternateOpenGraphUrlForActiveLocale,
  placeInfo,
  funnelType,
  review,
}: {
  isIndexed: boolean;
  images: Image[];
  title: string;
  description?: string;
  openGraphUrl?: string;
  hreflangs: {
    uri: string;
    locale: string;
  }[];
  openGraphType?: OpenGraphType;
  alternateCanonicalUrl?: string;
  alternateCanonicalUrlForCnLocale?: string;
  alternateOpenGraphUrlForActiveLocale?: string;
  placeInfo?: LandingPageTypes.Place;
  funnelType?: GraphCMSPageType;
  review?: {
    totalScore: number;
    totalCount: number;
  };
}) => {
  const activeLocale = useActiveLocale();
  const { websiteName, marketplace, marketplaceUrl } = useSettings();

  const canonicalUrlForActiveLocale = hreflangs.find(
    hreflang => hreflang.locale === activeLocale
  )?.uri;
  let canonicalUrl = canonicalUrlForActiveLocale || alternateCanonicalUrl;

  canonicalUrl = constructGtiCnCanonicalUrl({
    asPath: urlToRelative(canonicalUrl ?? ""),
    marketplace,
    marketplaceUrl,
    activeLocale,
    alternateGtiCnCanonicalUrl: !canonicalUrlForActiveLocale
      ? alternateCanonicalUrlForCnLocale
      : undefined,
    defaultNonGtiCnCanonicalUrl: canonicalUrl ?? "",
  });

  const metaImages = formatImagesForSEOmeta(images);

  const placeData = placeInfo ? getPlaceMetaInfo(placeInfo) : undefined;

  return (
    <Head>
      {canonicalUrl && (
        <>
          <link rel="canonical" href={canonicalUrl} />
          <meta
            property="og:url"
            content={
              openGraphUrl ??
              (canonicalUrlForActiveLocale ? canonicalUrl : alternateOpenGraphUrlForActiveLocale) ??
              canonicalUrl
            }
          />
        </>
      )}
      {description && (
        <>
          <meta name="description" content={description} />
          <meta property="og:description" content={description} />
        </>
      )}
      {!isIndexed && <meta name="robots" content="noindex" />}
      {isIndexed &&
        hreflangs.map(({ locale, uri }) => {
          return (
            <link
              rel="alternate"
              href={uri}
              hrefLang={getReplacedLocale(locale as SupportedLanguages, [
                {
                  old: SupportedLanguages.Chinese,
                  new: SupportedLanguages.LegacyChinese,
                },
              ]).replace("_", "-")}
              key={uri}
            />
          );
        })}
      <meta property="og:title" content={title} />
      {openGraphType && <meta property="og:type" content={openGraphType} />}
      <meta property="og:site_name" content={websiteName} />
      <meta property="og:locale" content={activeLocale} />
      {isIndexed &&
        hreflangs.map(
          ({ locale }) =>
            locale !== activeLocale && (
              <meta key={locale} property="og:locale:alternate" content={locale} />
            )
        )}

      {metaImages.map(image => (
        <meta property="og:image" content={image.url} key={image.id} />
      ))}
      {metaImages.length > 0 && isIndexed && (
        <meta name="robots" content="max-image-preview:large" />
      )}
      {placeData && (
        <>
          {placeData.countryPlaceId && (
            <meta name="travelshift_countryid" content={placeData.countryPlaceId} />
          )}
          {placeData.country && <meta name="travelshift_country" content={placeData.country} />}
          {placeData.alpha2 && <meta name="travelshift_alpha2" content={placeData.alpha2} />}
          {placeData.city && <meta name="travelshift_city" content={placeData.city} />}
          {placeData.cityPlaceId && (
            <meta name="travelshift_cityid" content={placeData.cityPlaceId} />
          )}
        </>
      )}
      {funnelType && <meta name="travelshift_funnelType" content={funnelType} />}
      {review && (
        <>
          {review.totalScore > 0 && (
            <meta name="travelshift_totalScore" content={`${review.totalScore}`} />
          )}
          {review.totalCount > 0 && (
            <meta name="travelshift_totalCount" content={`${review.totalCount}`} />
          )}
        </>
      )}
    </Head>
  );
};

export default SEO;
