import memoizeOne from "memoize-one";

import { VacationSearchQueryParamsType } from "./useVacationSearchQueryParams";
import {
  decodeVpFilterTypeValues,
  encodeVPTypeFilterValue,
  VacationPackageVpType,
  VacationPackageVpTypeEnum,
} from "./vacationSearchFilterUtils";

import { GraphCMSPageType, OrderBy, OrderDirection } from "types/enums";
import {
  constructVacationPackageProductProps,
  constructVacationPackageProductSpecs,
} from "components/features/VacationPackageProductPage/utils/vacationPackageUtils";
import { asPathWithoutQueryParams, getPathWithoutSlugAndQueryParams } from "utils/routerUtils";
import { constructGraphCMSImage } from "components/ui/LandingPages/utils/landingPageUtils";
import { decodeOccupanciesArray } from "components/features/AccommodationSearchPage/utils/useAccommodationSearchQueryParams";
import { getGraphCMSFlagImage } from "utils/imageUtils";

export const getVacationPackageQueryCondition = memoizeOne((normalizesAsPath: string) => ({
  metadataUri: normalizesAsPath,
  isDeleted: false,
}));

export const getVacationPackagesSearchPageQueryCondition = memoizeOne((asPath?: string) => ({
  pageType: GraphCMSPageType.VacationPackages,
  metadataUri: asPath ? asPathWithoutQueryParams(asPath) : undefined,
}));

export const getVacationPackageProductBreadcrumbsQueryCondition = memoizeOne((asPath: string) => ({
  pageType: GraphCMSPageType.VacationPackages,
  metadataUri: getPathWithoutSlugAndQueryParams(asPath),
}));

export const constructVacationPackageProduct = ({
  vacationProduct,
  vacationPackageT,
  slug,
  encodedQueryParamsString = "",
}: {
  vacationPackageT: TFunction;
  vacationProduct?: QueryVacationPackagesSearchTypes.VacationPackage;
  slug?: string;
  encodedQueryParamsString?: string;
}): SharedTypes.Product => {
  const metaUri = vacationProduct?.cmsObject?.metaUri ?? "";
  const linkUrl = metaUri
    ? `${metaUri}${encodedQueryParamsString ? `?${encodedQueryParamsString}` : ""}`
    : "";
  const vpImage = vacationProduct?.cmsObject?.image;
  return {
    id: vacationProduct?.id ?? "",
    image: constructGraphCMSImage(
      GraphCMSPageType.VacationPackages,
      vpImage
        ? {
            ...vpImage,
            id: vacationProduct?.cmsObject?.id ?? "",
          }
        : undefined
    ) as Image,
    linkUrl,
    headline: vacationProduct?.cmsObject?.title ?? "",
    description: vacationProduct?.cmsObject?.description ?? "",
    reviewsCount: vacationProduct?.cmsObject?.reviewCount ?? 0,
    averageRating: vacationProduct?.cmsObject?.reviewScore ?? 0,
    price: vacationProduct?.price?.amount ?? 0,
    ssrPrice: vacationProduct?.price?.amount ?? 0,
    specs: constructVacationPackageProductSpecs(vacationPackageT, vacationProduct?.cmsObject).slice(
      0,
      4
    ),
    props: constructVacationPackageProductProps(
      vacationPackageT,
      vacationProduct?.cmsObject?.valueProps
    ).slice(0, 3),
    slug,
  };
};

export const constructVacationPackageSectionCard = ({
  vacationProduct,
  vacationPackageT,
  slug,
  encodedQueryParamsString = "",
}: {
  vacationPackageT: TFunction;
  vacationProduct?: QueryVacationPackagesSearchTypes.VacationPackage;
  slug?: string;
  encodedQueryParamsString?: string;
}): LandingPageTypes.LandingPageSectionCard => {
  const metaUri = vacationProduct?.cmsObject?.metaUri ?? "";
  const linkUrl = metaUri
    ? `${metaUri}${encodedQueryParamsString ? `?${encodedQueryParamsString}` : ""}`
    : "";
  const vpImage = vacationProduct?.cmsObject?.image;
  const flagHandle = vacationProduct?.cmsObject?.flagHandle;
  const countryName = vacationProduct?.cmsObject?.countryName;
  return {
    pageType: GraphCMSPageType.VpProductPage,
    image: constructGraphCMSImage(
      GraphCMSPageType.VacationPackages,
      vpImage
        ? {
            ...vpImage,
            id: vacationProduct?.cmsObject?.id ?? "",
          }
        : undefined
    ) as Image,
    linkUrl,
    title: vacationProduct?.cmsObject?.title ?? "",
    subtitle: vacationProduct?.cmsObject?.description ?? "",
    review: {
      totalCount: vacationProduct?.cmsObject?.reviewCount ?? 0,
      totalScore: vacationProduct?.cmsObject?.reviewScore ?? 0,
    },
    price: vacationProduct?.price?.amount ?? 0,
    productSpecs: constructVacationPackageProductSpecs(
      vacationPackageT,
      vacationProduct?.cmsObject
    ),
    productProps: constructVacationPackageProductProps(
      vacationPackageT,
      vacationProduct?.cmsObject?.valueProps
    ),
    slug,
    ...(flagHandle?.length && countryName?.length
      ? {
          country: countryName,
          destinationFlag: getGraphCMSFlagImage({
            image: {
              id: flagHandle,
              handle: flagHandle,
            },
            customName: countryName,
            altText: countryName,
          }),
        }
      : {}),
  };
};

export const getFlightCodeFromId = (originId: string) => {
  const [codeOrCountryCode, originIdCode = codeOrCountryCode] = originId.split(":");

  return originIdCode;
};

const defaultSortingOrder = undefined;

const getOrderingFilter = (orderBy?: OrderBy, orderDirection?: OrderDirection) => {
  if (!orderBy && !orderDirection) return defaultSortingOrder;
  const isDESC = orderDirection === OrderDirection.DESC;
  switch (orderBy) {
    case OrderBy.PRICE: {
      if (isDESC) {
        return "PRICE_DESC";
      }
      return "PRICE_ASC";
    }
    case OrderBy.DURATION: {
      if (isDESC) {
        return "DURATION_DESC";
      }
      return "DURATION_ASC";
    }
    case OrderBy.POPULARITY:
    default:
      return defaultSortingOrder;
  }
};

export const constructVPSearchQueryVariables = ({
  queryParams,
  numberOfItems = 24,
  requestId,
  fromLandingPage,
  type,
}: {
  queryParams: VacationSearchQueryParamsType;
  numberOfItems?: number;
  requestId?: string;
  fromLandingPage?: boolean;
  type?: VacationPackageVpType;
}) => {
  const {
    numberOfDays,
    activityIds,
    destinationIds,
    countryIds,
    price,
    page = 1,
    orderBy,
    orderDirection,
    includeFlights,
    types,
  } = queryParams;
  const destinationCode = getFlightCodeFromId(queryParams.destinationId ?? "");
  const flightCode = includeFlights ? queryParams?.originId ?? "" : "";
  const isVariationType = type === "Cheap" || type === "Luxury";
  const landingPagePriceVariations =
    isVariationType && type && fromLandingPage ? [VacationPackageVpTypeEnum[type]] : undefined;
  const landingPageTypes =
    !isVariationType && type && type !== "VpTopLevel" && fromLandingPage
      ? [VacationPackageVpTypeEnum[type]]
      : undefined;
  const decodedVpFilterTypeValues = decodeVpFilterTypeValues(types);
  const order = getOrderingFilter(orderBy as OrderBy, orderDirection as OrderDirection);
  const filter = {
    types: decodedVpFilterTypeValues?.SubType ?? landingPageTypes,
    priceVariations: decodedVpFilterTypeValues?.Variation ?? landingPagePriceVariations,
    variations: decodedVpFilterTypeValues?.VariationSelectors,
    ...(price && price.length
      ? {
          priceFrom: price?.[0] ?? null,
          priceTo: price?.[1] ?? null,
        }
      : {}),
    attractions: activityIds,
    destinations: destinationIds,
    countries: countryIds,
    numberOfDays,
    take: numberOfItems,
    skip: (page - 1) * numberOfItems,
    order,
  };

  return {
    input: {
      from: queryParams.dateFrom,
      to: queryParams.dateTo,
      paxMix: decodeOccupanciesArray(queryParams.occupancies),
      flightFrom: flightCode || "",
      startingPoint: destinationCode,
      ...(requestId ? { requestId } : {}),
      ...(fromLandingPage ? { fromLandingPage } : {}),
      filter,
    },
  };
};

export const constructVPSearchLandingQueryVariables = (
  // eslint-disable-next-line default-param-last
  flightId = "europe",
  subtype?: VacationPackageVpType,
  // eslint-disable-next-line default-param-last
  itemsPerPage = 5
) => {
  return constructVPSearchQueryVariables({
    queryParams: {
      destinationId: flightId,
    },
    numberOfItems: itemsPerPage,
    fromLandingPage: true,
    type: subtype,
  });
};

export const doesVpHasAllRequiredSearchQueryParams = ({
  dateFrom,
  dateTo,
  occupancies,
  destinationId,
  destinationName,
  includeFlights,
  originId,
  originName,
}: VacationSearchQueryParamsType) => {
  const hasDates = Boolean(dateFrom && dateTo);
  const hasOccupancies = Boolean(occupancies);
  const hasDestination = Boolean(destinationId && destinationName);
  const hasOrigin = Boolean(originId && originName);

  return (
    hasDestination &&
    hasDates &&
    hasOccupancies &&
    (!includeFlights || (includeFlights && hasOrigin))
  );
};

export const getVPDefaultTypeFilter = (vpSubType?: VacationPackageVpType) => {
  if (!vpSubType || vpSubType === "VpTopLevel") return undefined;
  const isVariationCategory = vpSubType === "Cheap" || vpSubType === "Luxury";
  const vpCategoryType: QueryVacationPackagesSearchTypes.VacationPackageCategoryTypeFilter =
    isVariationCategory ? "Variation" : "SubType";
  const subtypeId = VacationPackageVpTypeEnum[vpSubType as VacationPackageVpType];
  return [encodeVPTypeFilterValue(subtypeId, vpCategoryType)];
};

export const hasSameDepartureAndArrivalCities = (originId?: string, destinationId?: string) => {
  return originId?.startsWith("city:") && originId === destinationId;
};
