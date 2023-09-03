import { Marketplace } from "types/enums";
import { asPathWithoutQueryParams } from "utils/routerUtils";

export const constructAggregateRating = (reviewTotalScore: number, reviewTotalCount: number) => ({
  "@type": "AggregateRating",
  ratingValue: reviewTotalScore,
  reviewCount: reviewTotalCount,
});

export const constructStructuredReviews = (reviews: ReadonlyArray<QueryReview>) => {
  return reviews.map(review => ({
    "@type": "Review",
    reviewBody: review.text,
    datePublished: review.createdDate,
    author: {
      "@type": "Person",
      name: review.user.name,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.reviewScore,
    },
  }));
};

export const constructAggregateOffer = ({
  lowPrice,
  priceCurrency,
  url,
}: {
  lowPrice: number;
  priceCurrency: string;
  url: string;
}) => ({
  "@type": "AggregateOffer",
  lowPrice,
  priceCurrency,
  url,
});

export const constructHrefLangs = (
  translations: LocaleLink[],
  host: string,
  activeLocale: string
) =>
  translations.map(({ uri, locale }) => {
    const isAbsoluteURI = /^(http|https):\/\//.test(uri);

    if (isAbsoluteURI) return { uri, locale };

    if (activeLocale === "zh_CN" && locale !== "zh_CN" && host.includes("guidetoiceland")) {
      return { uri: `https://${host.replace(/^cn\./, "")}${uri}`, locale };
    }
    if (activeLocale !== "zh_CN" && locale === "zh_CN" && host.includes("guidetoiceland")) {
      return { uri: `https://cn.${host}${uri}`, locale };
    }
    return { uri: `https://${host}${uri}`, locale };
  });

export const constructSEOProduct = (products: SharedTypes.Product[]) =>
  products.map(product => ({
    url: product.linkUrl,
    name: product.headline,
    image: product.image.url,
    price: product.ssrPrice,
    reviewTotalScore: product.averageRating,
    reviewTotalCount: product.reviewsCount,
    establishmentName: "GTI",
  }));

export const constructAlternateCanonical = ({
  canonicalQueryParamString,
  marketplaceUrl,
  asPath,
}: {
  canonicalQueryParamString?: string;
  marketplaceUrl: string;
  asPath: string;
}) => {
  const postfix = canonicalQueryParamString ? `?${canonicalQueryParamString}` : "";

  return `${asPathWithoutQueryParams(`${marketplaceUrl}${asPath}`)}${postfix}`;
};

export const constructPublisher = ({
  websiteName,
  marketplace,
  marketplaceUrl,
}: {
  websiteName: string;
  marketplace: Marketplace;
  marketplaceUrl: string;
}) => ({
  "@type": "Organization",
  name: websiteName,
  logo: {
    "@type": "ImageObject",
    url: `https://assets.web.prod.tshiftcdn.com/_next/static/icons/${marketplace}-base-512x512.png`,
  },
  url: marketplaceUrl,
});
