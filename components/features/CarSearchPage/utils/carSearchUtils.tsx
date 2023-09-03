import React from "react";
import { SerializedStyles } from "@emotion/core";
import CheckmarkIcon from "@travelshift/ui/icons/checkmark.svg";
import { pipe } from "fp-ts/lib/pipeable";
import { findIndex, modifyAt, flatten } from "fp-ts/lib/Array";
import { fromNullable, map, getOrElse } from "fp-ts/lib/Option";
import memoizeOne from "memoize-one";
import { parseUrl } from "use-query-params";

import carSearchReviewsPaginated from "../queries/CarSearchReviewsPaginatedQuery.graphql";
import CarProvidersQuery from "../queries/CarProvidersQuery.graphql";

import { getCarPickupCNLangContext } from "components/ui/CarSearchWidget/useCarPickupLocationQuery";
import ShuttleBusIcon from "components/icons/shuttle-bus.svg";
import InTerminalIcon from "components/icons/in-terminal.svg";
import DepositIcon from "components/icons/money-wallet-open.svg";
import { Trans } from "i18n";
import ExtraDriverIcon from "components/icons/extra-driver.svg";
import CustomerSupportIcon from "components/icons/phone-support.svg";
import CarProtectionIcon from "components/icons/car-protection.svg";
import FreeCancellationIcon from "components/icons/file-text-remove.svg";
import OutOfHoursIcon from "components/icons/out-of-hours.svg";
import BestPriceGuranteeIcon from "components/icons/check-shield-alternate.svg";
import HotelDeliveryIcon from "components/icons/car-key.svg";
import ConfirmationIcon from "components/icons/tags-check-alternate.svg";
import UnlimitedMilageIcon from "components/icons/unlimited-milage.svg";
import GpsIncludedIcon from "components/icons/car-gps.svg";
import CarIcon from "components/icons/car.svg";
import TravellersIcon from "components/icons/travellers.svg";
import BagIcon from "components/icons/bag-handle.svg";
import CarGearIcon from "components/icons/car-dashboard-gear.svg";
import CarGasIcon from "components/icons/gas-load.svg";
import RoadIcon from "components/icons/road-straight.svg";
import CarSearchIcon from "components/icons/car-actions-search-1.svg";
import RoadWoodsIcon from "components/icons/road-woods.svg";
import SnowIcon from "components/icons/temperature-snowflake-1.svg";
import MinimumAgeIconRound from "components/ui/Information/MinimumAgeIconRound";
import GarageIcon from "components/icons/car-garage.svg";
import GpsIcon from "components/icons/gps.svg";
import ChecklistIcon from "components/icons/notes-checklist-flip.svg";
import { constructImages } from "utils/globalUtils";
import FuelIcon from "components/icons/car-dashboard-fuel.svg";
import {
  getFuelPolicyString,
  getCarCategoryValue,
  constructCarProductUrl,
  constructHeadline,
} from "utils/sharedCarUtils";
import {
  FilterSectionListType,
  RangeFilterSectionType,
  FilterSectionType,
} from "components/ui/Filters/FilterTypes";
import SeatsIcon from "components/icons/multiple-actions--check-1.svg";
import DepositAmountIcon from "components/icons/cash-payment-coin.svg";
import {
  FilterType,
  LandingPageType,
  PageType,
  CarFilterQueryParam,
  CarProvider,
  Marketplace,
  SupportedLanguages,
  OrderBy,
  OrderDirection,
  CarSubTypeId,
} from "types/enums";
import { convertImage } from "utils/imageUtils";
import BreadcrumbsQuery from "components/ui/Breadcrumbs/BreadcrumbsQuery.graphql";
import FAQQuery from "components/features/SearchPage/queries/FAQQuery.graphql";
import FrontValuePropsQuery from "components/ui/FrontValuePropositions/FrontValuePropsQuery.graphql";
import CarSearchCategoryQuery from "components/features/CarSearchPage/queries/CarSearchCategoryQuery.graphql";
import CarProductUrlQuery from "components/features/CarSearchPage/queries/CarProductUrlQuery.graphql";
import { mockImage0 } from "utils/mockData/mockGlobalData";
import PageMetadataQuery from "hooks/queries/PageMetadataQuery.graphql";
import { getFAQVariables } from "components/features/SearchPage/utils/searchUtils";
import TopCarRentalsQuery from "components/features/CarSearchPage/queries/TopCarRentalsQuery.graphql";
import DefaultDriverCountryQuery from "components/ui/CarSearchWidget/DriverInformation/queries/DefaultDriverCountryQuery.graphql";
import CarPickupLocationsQuery from "components/ui/CarSearchWidget/LocationPicker/queries/CarPickupLocationsQuery.graphql";
import {
  byPriceConstructor,
  byPriceDescConstructor,
  byRating,
  byPopularityDescConstructor,
  getCarSortOptions,
  Label,
  iconStyles as sortIconStyles,
} from "components/ui/Sort/sortUtils";
import { Namespaces } from "shared/namespaces";
import FireIcon from "components/icons/fire.svg";
import {
  getMarketplaceFromUrl,
  longCacheHeaders,
  shouldSkipBreadcrumbsQuery,
  urlToRelative,
} from "utils/apiUtils";
import { normalizeGraphCMSLocale } from "utils/helperUtils";
import { whiteColor } from "styles/variables";
import {
  getSectionTypeFilters,
  getSectionTypeSelectedFilters,
  getPriceSelectedFilter,
} from "components/ui/Filters/utils/filtersUtils";
import { roundPriceToInteger } from "utils/currencyFormatUtils";

export type CarSelectedInfo = {
  selectedDates: SharedTypes.SelectedDates;
  pickupId: string;
  dropoffId: string;
  pickupLocationName: string;
  dropoffLocationName: string;
};

export const carsListImgixParams = {
  "min-w": undefined,
  fit: "clamp",
  bg: whiteColor,
};

export const getPickupQuickfact = (t: TFunction, type?: string | null) => {
  if (type === "Airport") {
    return [
      {
        name: t("Pick-up"),
        value: t("In terminal"),
        Icon: InTerminalIcon,
      },
    ];
  }
  if (type === "Off Terminal/ Shuttle") {
    return [
      {
        name: t("Pick-up"),
        value: t("Shuttle bus"),
        Icon: ShuttleBusIcon,
      },
    ];
  }
  return [];
};
export const constructProductSpecs = (
  isGTI: boolean,
  t: TFunction,
  {
    category,
    passengerQuantity,
    bagQuantity,
    manualTransmission,
    fuelPolicy,
    doors,
    highlandCapabilities,
    airConIncluded,
    minAge,
    model,
    depositRequired,
  }: SharedCarTypes.QueryQuickFacts,
  included: SharedCarTypes.CarIncluded[],
  convertCurrency: (value: number) => number,
  currencyCode: string,
  locationType?: string | null
): SharedTypes.ProductSpec[] => {
  const highlandCapabilitiesString = highlandCapabilities ? "Yes" : "No";
  const airconString = airConIncluded ? "Included" : "Not Included";
  const transmissionType = manualTransmission ? "Manual" : "Automatic";
  const theftProtection = included.find(i => i.includedId === "TP");
  const collisionDamageWaiver = included.find(i => i.includedId === "CDW");
  const convertedtheftProtectionPrice =
    theftProtection?.coverageAmount &&
    roundPriceToInteger(convertCurrency(theftProtection.coverageAmount));
  const convertedCollisionDamageWaiverPrice =
    collisionDamageWaiver?.coverageAmount &&
    roundPriceToInteger(convertCurrency(collisionDamageWaiver.coverageAmount));
  return [
    {
      name: t("Category"),
      value: getCarCategoryValue(category, t),
      Icon: CarIcon,
    },
    {
      name: t("Transmission"),
      value: t(transmissionType),
      Icon: CarGearIcon,
    },
    {
      name: t("People"),
      value: t("Seats {numberOfSeats} people", {
        numberOfSeats: passengerQuantity,
      }),
      Icon: TravellersIcon,
    },
    {
      name: t("Large bags"),
      value: t("{numberOfBags} bags", { numberOfBags: bagQuantity }),
      Icon: BagIcon,
    },
    ...(fuelPolicy !== null
      ? [
          {
            name: t("Fuel policy"),
            value: t(getFuelPolicyString(fuelPolicy)),
            Icon: CarGasIcon,
          },
        ]
      : []),
    ...getPickupQuickfact(t, locationType),
    ...(theftProtection && convertedtheftProtectionPrice
      ? [
          {
            name: t(theftProtection.name),
            value: t("{coverageAmount} {coverageCurrency} Excess", {
              coverageAmount: convertedtheftProtectionPrice.toLocaleString(),
              coverageCurrency: currencyCode,
            }),
            Icon: CarProtectionIcon,
          },
        ]
      : []),
    ...(collisionDamageWaiver && convertedCollisionDamageWaiverPrice
      ? [
          {
            name: t(collisionDamageWaiver.name),
            value: t("{coverageAmount} {coverageCurrency} Excess", {
              coverageAmount: convertedCollisionDamageWaiverPrice.toLocaleString(),
              coverageCurrency: currencyCode,
            }),
            Icon: CarSearchIcon,
          },
        ]
      : []),
    {
      name: t("Deposit"),
      value: depositRequired === true ? t("Required") : t("Not Required"),
      Icon: DepositIcon,
    },
    ...(model !== null && model !== 0
      ? [
          {
            name: t("Year"),
            value: model.toString(),
            Icon: CarSearchIcon,
          },
        ]
      : []),
    ...(doors !== 0
      ? [
          {
            name: t("Doors"),
            value: t("{numberOfDoors} doors", { numberOfDoors: doors }),
            Icon: CarSearchIcon,
          },
        ]
      : []),
    ...(isGTI
      ? [
          {
            name: t("Highland Capabilities"),
            value: t(highlandCapabilitiesString),
            Icon: RoadWoodsIcon,
          },
        ]
      : []),
    {
      name: t("Air con"),
      value: t(airconString),
      Icon: SnowIcon,
    },
    ...(minAge > 0
      ? [
          {
            name: t("Minimum age of driver"),
            value: t("{minAge} years", { minAge }),
            Icon: (css: SerializedStyles) => <MinimumAgeIconRound value={`${minAge}`} css={css} />,
          },
        ]
      : []),
  ];
};

export const getCheckboxQueryParamFilters = (queryParamFilters: CarSearchTypes.CarFilterParams) =>
  Object.keys(queryParamFilters).reduce((paramFilters: CarSearchTypes.CarFilterParams, key) => {
    if (key !== "carType" && key !== "depositAmount") {
      // eslint-disable-next-line functional/immutable-data, no-param-reassign
      paramFilters[key as keyof CarSearchTypes.CarFilterParams] =
        queryParamFilters[key as keyof CarSearchTypes.CarFilterParams];
    }
    return paramFilters;
  }, {});

export const getProductPropIcon = (iconKey: SharedCarTypes.CarProductProp) => {
  switch (iconKey) {
    case "additionalDriver": {
      return ExtraDriverIcon;
    }
    case "customerSupport": {
      return CustomerSupportIcon;
    }
    case "extendedProtection":
    case "fullProtection": {
      return CarProtectionIcon;
    }
    case "freeCancellation": {
      return FreeCancellationIcon;
    }
    case "gpsIncluded": {
      return GpsIncludedIcon;
    }
    case "hotelDelivery": {
      return HotelDeliveryIcon;
    }
    case "instantConfirmation": {
      return ConfirmationIcon;
    }
    case "outOfHoursPickUp": {
      return OutOfHoursIcon;
    }
    case "priceGuarantee": {
      return BestPriceGuranteeIcon;
    }
    case "snowTires":
    case "windscreenTyreCoverage": {
      return CarSearchIcon;
    }
    case "unlimitedMileage": {
      return UnlimitedMilageIcon;
    }
    default: {
      return CheckmarkIcon;
    }
  }
};

export const constructProductProps = (
  t: TFunction,
  productProps: SharedCarTypes.QueryProductProp[]
): SharedTypes.ProductProp[] =>
  productProps.map(({ iconKey }) => ({
    title: t(iconKey),
    Icon: getProductPropIcon(iconKey),
  }));

export const constructCarnectImage = (images: ReadonlyArray<QueryImage>) => {
  return images.map(image => ({
    id: image.id?.toString() || image.url,
    url: image.url.replace("https://static.carhire-solutions.com", "https://carnect.imgix.net"),
    name: image.alt || image.name || "",
  }));
};

export const constructCarSearch = (
  t: TFunction,
  selectedInfo: CarSelectedInfo,
  cars: CarSearchTypes.QueryCarSearch[],
  marketplace: Marketplace,
  convertCurrency: (value: number) => number,
  currencyCode: string,
  activeLocale: SupportedLanguages,
  driverAge?: number,
  countryCode?: string,
  carProductUrl?: string,
  editCarOfferCartId?: string
): CarSearchTypes.CarSearch[] => {
  return cars.map(offer => {
    const {
      idContext,
      carInfo,
      vendor,
      totalCharge,
      productProps,
      priceOrderScore,
      recommendedOrderScore,
      filters,
      rentalRate,
      provider,
      included,
      quickFacts,
      selected,
    } = offer;
    const discount = rentalRate.vehicleCharges?.discount;
    const { vehicleCategory, name, images } = carInfo;
    const {
      reviewAverageFormatted,
      reviewCount,
      name: establishmentName,
      image: establishmentImage,
    } = vendor;
    const { estimatedTotalAmount, currency } = totalCharge;
    const formattedProvider = provider.toUpperCase() as CarProvider;

    return {
      selected,
      id: idContext,
      vehicleCategory,
      name,
      provider: formattedProvider,
      headline: constructHeadline(t, name, activeLocale),
      linkUrl: carProductUrl
        ? constructCarProductUrl(
            carProductUrl,
            idContext,
            selectedInfo,
            formattedProvider,
            quickFacts.category,
            name,
            driverAge,
            countryCode,
            editCarOfferCartId
          )
        : "",
      image:
        provider === CarProvider.CARNECT
          ? constructCarnectImage(images.map(image => ({ ...image, id: image.imageId })))[0]
          : constructImages(
              images.map(image => ({
                ...image,
                id: image.imageId,
              }))
            )[0],
      carSpecs: constructProductSpecs(
        marketplace === Marketplace.GUIDE_TO_ICELAND,
        t,
        quickFacts,
        provider === CarProvider.CARNECT ? included : [],
        convertCurrency,
        currencyCode,
        vendor?.pickupLocation?.locationType
      ),
      carProps: constructProductProps(t, productProps),
      averageRating: Number(reviewAverageFormatted),
      reviewsCount: reviewCount,
      price: estimatedTotalAmount,
      currency,
      establishment: {
        name: establishmentName,
        image: establishmentImage,
      },
      priceOrderScore,
      recommendedOrderScore,
      filters,
      ribbonLabelText: discount
        ? t("{discountPercentage}% discount", {
            discountPercentage: discount.percent,
          })
        : undefined,
      totalSaved: discount ? discount.amount : undefined,
      category: quickFacts.category,
    };
  });
};

const getFilterTypeById = (id: string) => {
  if (id === "carType") {
    return FilterType.BUTTONS;
  }
  if (id === "depositAmount") {
    return FilterType.RANGE;
  }
  return FilterType.CHECKBOX;
};

const getFilterIconFromId = (id: string) => {
  switch (id) {
    case CarFilterQueryParam.CAR_TYPE:
      return CarIcon;
    case CarFilterQueryParam.MILAGE:
      return RoadIcon;
    case CarFilterQueryParam.SUPPLIER:
      return GarageIcon;
    case CarFilterQueryParam.INCLUDED_EXTRAS:
      return ChecklistIcon;
    case CarFilterQueryParam.SUPPLIER_LOCATION:
      return GpsIcon;
    case CarFilterQueryParam.INCLUDED_INSURANCES:
      return CarProtectionIcon;
    case CarFilterQueryParam.FUEL_POLICY:
      return FuelIcon;
    case CarFilterQueryParam.SEATS:
      return SeatsIcon;
    case CarFilterQueryParam.DEPOSIT_AMOUNT:
      return DepositAmountIcon;
    case CarFilterQueryParam.CAR_FEATURES:
    default:
      return CarSearchIcon;
  }
};

export const removeDuplicateCarFilterOptions = (filters: CarSearchTypes.CarFilterOption[]) => [
  ...new Map(filters.map(o => [o.filterOptionId, o])).values(),
];

export const areCarTypeOptionsOnCar = (
  carFilters: CarSearchTypes.CarAppliedFilter[],
  queryCarType?: string[]
) =>
  queryCarType?.some(type =>
    carFilters.some(filter => filter.filterId === "carType" && filter.items.includes(type))
  ) ?? true;

export const areOptionsOnCar = (
  carFilters: CarSearchTypes.CarAppliedFilter[],
  queryParamFilters?: string[]
) =>
  queryParamFilters?.every((paramFilter: string) =>
    carFilters.some(filter => filter.items.includes(paramFilter))
  ) ?? true;

export const areDepositAmountOptionsOnCar = memoizeOne(
  (carFilters: CarSearchTypes.CarAppliedFilter[], queryDepositAmount?: string[]) => {
    const depositFilter = carFilters.find(
      filter => filter.filterId === CarFilterQueryParam.DEPOSIT_AMOUNT
    );
    if (!depositFilter || !queryDepositAmount) return true;
    const numDepositAmount = queryDepositAmount.map(amount => Number(amount));
    return depositFilter.items.some(item => {
      return (
        Number(item) >= Number(Math.min(...numDepositAmount)) &&
        Number(item) <= Number(Math.max(...numDepositAmount))
      );
    });
  }
);

export const mergeQueryParamFilters = memoizeOne(
  (queryParamFilters: CarSearchTypes.CarFilterParams) => {
    const checkboxFilters = getCheckboxQueryParamFilters(queryParamFilters);
    return Object.values(checkboxFilters).reduce((filterList: string[], items) => {
      if (items !== undefined) {
        return filterList.concat(items);
      }
      return filterList;
    }, []);
  }
);

export const getAllDepositAmounts = memoizeOne((cars: CarSearchTypes.CarSearch[]) => {
  const depositAmountItems: string[] = flatten(
    cars.map(
      (car: CarSearchTypes.CarSearch) =>
        car.filters.find(filter => filter.filterId === "depositAmount")?.items ?? []
    )
  );
  const uniqueAmounts =
    depositAmountItems.filter((val, id) => {
      return depositAmountItems.indexOf(val) === id;
    }) || [];
  const uniqueAmountNumbers: number[] = uniqueAmounts.map(u => Number(u));
  const depositAmounts = {
    min: Math.min(...uniqueAmountNumbers),
    max: Math.max(...uniqueAmountNumbers),
    values: uniqueAmounts
      .map(amount => ({
        value: amount,
        count: depositAmountItems.filter(amountItem => amountItem === amount).length,
      }))
      .sort((a, b) => (Number(a.value) > Number(b.value) ? 1 : -1)),
  };
  return depositAmounts;
});
const getFilteredCars = (
  cars: CarSearchTypes.CarSearch[],
  filterId: string,
  queryParamFilters: CarSearchTypes.CarFilterParams
) =>
  cars.filter(car => {
    const paramFilters = mergeQueryParamFilters(queryParamFilters);
    const filterByCarType =
      filterId !== CarFilterQueryParam.CAR_TYPE
        ? areCarTypeOptionsOnCar(car.filters, queryParamFilters.carType)
        : true;
    const filterByDepositAmount =
      filterId !== CarFilterQueryParam.DEPOSIT_AMOUNT
        ? areDepositAmountOptionsOnCar(car.filters, queryParamFilters.depositAmount)
        : true;
    return filterByCarType && areOptionsOnCar(car.filters, paramFilters) && filterByDepositAmount;
  });

export const isOptionDisabled = (
  optionId: string,
  filteredCars: CarSearchTypes.CarSearch[],
  isCarType: boolean,
  hasPrefilledOption: boolean
) => {
  if (filteredCars.length > 0) {
    const isFilterInCars = filteredCars.some(car =>
      car.filters.some(filter => filter.items.some(item => item === optionId))
    );
    if (isCarType) {
      return !isFilterInCars || hasPrefilledOption;
    }
    return !isFilterInCars;
  }
  return false;
};

const constructFilterSectionFilter = (
  option: CarSearchTypes.CarFilterOption,
  isDisabled: boolean,
  carSearchT: TFunction
): SearchPageTypes.Filter => ({
  id: option.filterOptionId,
  name: carSearchT(option.name),
  checked: option.isPrefilled,
  disabled: isDisabled,
});

export const constructCarFilters = (
  combinedFilters: CarSearchTypes.CarFilter[],
  cars: CarSearchTypes.CarSearch[],
  queryParamFilters: CarSearchTypes.CarFilterParams,
  carSearchT: TFunction
): FilterSectionListType => {
  const constructedFilters =
    combinedFilters.map((filter: CarSearchTypes.CarFilter) => {
      const hasPrefilledOption = filter.options.some(option => option.isPrefilled);
      const filteredCars = getFilteredCars(cars, filter.filterId, queryParamFilters);
      if (filter.filterId === CarFilterQueryParam.DEPOSIT_AMOUNT) {
        const depositAmountFilters = getAllDepositAmounts(filteredCars);

        return {
          type: getFilterTypeById(filter.filterId),
          sectionId: filter.filterId,
          min: depositAmountFilters.min,
          max: depositAmountFilters.max,
          filters: depositAmountFilters.values.map(
            val =>
              ({
                id: val.value,
                count: val.count,
              } as SearchPageTypes.RangeFilter)
          ),
          title: carSearchT(filter.type),
          Icon: getFilterIconFromId(filter.filterId),
        } as RangeFilterSectionType & {
          type: FilterType;
        };
      }
      const sectionFilters = filter.options.map(option => {
        const isDisabled = isOptionDisabled(
          option.filterOptionId,
          filteredCars,
          filter.filterId === CarFilterQueryParam.CAR_TYPE,
          hasPrefilledOption
        );
        return constructFilterSectionFilter(option, isDisabled, carSearchT);
      });

      if (filter.filterId === CarFilterQueryParam.SUPPLIER) {
        // eslint-disable-next-line functional/immutable-data
        sectionFilters.sort((a, b) => a.name.localeCompare(b.name));
      }
      return {
        type: getFilterTypeById(filter.filterId),
        sectionId: filter.filterId,
        filters: sectionFilters,
        title: carSearchT(filter.type),
        Icon: getFilterIconFromId(filter.filterId),
      } as FilterSectionType & { type: FilterType };
    }) ?? [];
  return constructedFilters;
};

export const constructCombinedFilters = (filters: CarSearchTypes.CarFilter[]) => {
  const combinedFilters = filters
    .reduce(
      (prev, curr) =>
        pipe(
          prev,
          findIndex(f => f.filterId === curr.filterId),
          map((i: number) =>
            pipe(
              prev,
              modifyAt(i, (a: CarSearchTypes.CarFilter) => {
                return {
                  ...a,
                  filterId: a.filterId,
                  options: removeDuplicateCarFilterOptions([...a.options, ...curr.options]),
                };
              }),
              getOrElse(() => [...prev, curr])
            )
          ),
          getOrElse(() => [...prev, curr])
        ),
      [] as CarSearchTypes.CarFilter[]
    )
    .filter(aFilter => aFilter.options.length > 0);

  return combinedFilters;
};

const byPriceCar = byPriceConstructor("priceOrderScore");
const byPriceDescCar = byPriceDescConstructor("priceOrderScore");
const byPopularityCar = byPopularityDescConstructor("recommendedOrderScore");

const getSortFn = (orderBy?: OrderBy, orderDirection?: OrderDirection) => {
  if (orderBy === OrderBy.POPULARITY) {
    return byPopularityCar;
  }
  if (orderBy === OrderBy.RATING) {
    return byRating;
  }
  if (orderBy === OrderBy.PRICE && orderDirection === OrderDirection.DESC) {
    return byPriceDescCar;
  }
  return byPriceCar;
};

export const sortCarSearchResults = (
  cars: CarSearchTypes.CarSearch[],
  orderBy?: OrderBy,
  orderDirection?: OrderDirection
) => {
  const sortFn = getSortFn(orderBy, orderDirection);
  return cars.slice(0).sort(sortFn);
};

const CAR_LOCATION_LIMIT = 10;

export const getCarSearchAndCategoryQueries = ({
  slug = "",
  path,
  pageType,
  landingPageType,
  marketplaceUrl,
  locale,
}: {
  slug?: string;
  path?: string;
  pageType: PageType;
  landingPageType?: LandingPageType;
  marketplaceUrl: string;
  locale: SupportedLanguages;
}) => {
  const marketplace = getMarketplaceFromUrl(marketplaceUrl);
  const maybeCNLangContext = getCarPickupCNLangContext(marketplace, locale);

  return [
    {
      query: BreadcrumbsQuery,
      variables: {
        slug,
        type: pageType.toUpperCase(),
        landingPageType: landingPageType?.toUpperCase(),
      },
      skip:
        landingPageType?.toUpperCase() !== undefined
          ? false
          : shouldSkipBreadcrumbsQuery({ slug, type: pageType.toUpperCase() }),
      context: { headers: longCacheHeaders },
    },
    { query: TopCarRentalsQuery },
    {
      query: carSearchReviewsPaginated,
      variables: { slug, page: 1 },
    },
    {
      query: FAQQuery,
      variables: getFAQVariables({
        slug,
        landingPage: landingPageType,
        pageType,
      }),
    },
    {
      query: FrontValuePropsQuery,
    },
    {
      query: CarSearchCategoryQuery,
      variables: {
        slug,
      },
      isRequiredForPageRendering: true,
    },
    {
      query: CarProductUrlQuery,
      isRequiredForPageRendering: true,
    },
    {
      query: DefaultDriverCountryQuery,
      variables: {
        url: marketplaceUrl,
        locale: normalizeGraphCMSLocale(locale),
      },
    },
    ...(path
      ? [
          {
            query: PageMetadataQuery,
            variables: { path },
            context: { headers: longCacheHeaders },
          },
        ]
      : []),
    {
      query: CarProvidersQuery,
    },
    {
      query: CarPickupLocationsQuery,
      variables: {
        input: {
          searchQuery: "",
          type: "From",
          limit: CAR_LOCATION_LIMIT,
        },
      },
      context: maybeCNLangContext,
    },
    {
      query: CarPickupLocationsQuery,
      variables: {
        input: {
          searchQuery: "",
          type: "To",
          limit: CAR_LOCATION_LIMIT,
        },
      },
      context: maybeCNLangContext,
    },
  ];
};

export const constructTopCarRentals = (
  carRentals: CarSearchTypes.TopCarRentalQuery[]
): CarSearchTypes.TopCarRental[] =>
  carRentals.map(({ url, image, reviewTotalCount, reviewTotalScore }) => ({
    url,
    image: image ? convertImage(image) : image,
    reviewTotalScore: Number(reviewTotalScore),
    reviewTotalCount,
  }));

export const constructTopCarProductSpecs = (
  t: TFunction,
  { category, bags, seats, automatic }: CarSearchTypes.QueryTopCar
): SharedTypes.ProductSpec[] => {
  return [
    {
      name: t("Category"),
      value: category,
      Icon: CarIcon,
    },
    {
      name: t("People"),
      value: t("Seats {numberOfSeats} people", {
        numberOfSeats: seats,
      }),
      Icon: TravellersIcon,
    },
    {
      name: t("Large bags"),
      value: t("{numberOfBags} bags", { numberOfBags: bags }),
      Icon: BagIcon,
    },
    {
      name: t("Transmission"),
      value: automatic ? t("Automatic") : t("Manual"),
      Icon: CarGearIcon,
    },
  ];
};

export const constructCarCategoryInfo = (
  queryCategory?: SharedTypes.QuerySearchCategoryInfo & {
    reviews: {
      count: number;
      rating: number;
    };
  }
): SharedTypes.SearchCategoryInfo =>
  pipe(
    queryCategory,
    fromNullable,
    map(category => ({
      id: category.id,
      categoryName: category.categoryName,
      informationTitle: category.informationTitle,
      information: category.information,
      cover: {
        name: category.name,
        description: category.description,
        image: convertImage(category.image),
      },
    })),
    getOrElse(
      () =>
        ({
          id: 0,
          categoryName: "",
          informationTitle: "",
          information: "",
          cover: {
            name: "",
            description: "",
            image: mockImage0,
          },
        } as SharedTypes.SearchCategoryInfo)
    )
  );

export const filterCarSearchResults = (
  cars: CarSearchTypes.CarSearch[],
  queryParamFilters: CarSearchTypes.CarFilterParams
): CarSearchTypes.CarSearch[] =>
  cars.filter(car => {
    const mergedQueryFilters = mergeQueryParamFilters(queryParamFilters);
    return (
      areCarTypeOptionsOnCar(car.filters, queryParamFilters.carType) &&
      areOptionsOnCar(car.filters, mergedQueryFilters) &&
      areDepositAmountOptionsOnCar(car.filters, queryParamFilters.depositAmount)
    );
  });

export const shouldDisableDefaultCheckedFilter = (filters: FilterSectionListType) =>
  filters.some(
    filter =>
      filter.sectionId === CarFilterQueryParam.CAR_TYPE &&
      filter.filters.some(
        (option: SearchPageTypes.Filter | SearchPageTypes.RangeFilter) =>
          "disabled" in option && "checked" in option && option.checked && option.disabled
      )
  );

export const getCarSortingOptions = (theme: Theme) => [
  ...getCarSortOptions(theme),
  <>
    <FireIcon css={sortIconStyles(theme)} />
    <Label>
      <Trans ns={Namespaces.carSearchNs}>Most recommended</Trans>
    </Label>
  </>,
];

export const getDefaultLocations = (autofilter?: string) => {
  try {
    const parsedAutoFilter = JSON.parse(autofilter || "");
    return {
      defaultPickupId: parsedAutoFilter.defaultPickupLocation as string,
      defaultDropoffId: parsedAutoFilter.defaultDropoffLocation as string,
    };
  } catch {
    return {
      defaultPickupId: undefined,
      defaultDropoffId: undefined,
    };
  }
};

export const getCarsSubtypeImage = (carSubType?: CarSubTypeId, isSearchResults?: boolean) => {
  if (!carSubType) return undefined;
  switch (carSubType) {
    case CarSubTypeId.SMALL:
      return {
        id: CarSubTypeId.SMALL,
        url: "https://gte-gcms.imgix.net/kd6qIZKBQvatNgxSZXJf",
        name: "small car fallback",
        width: isSearchResults ? 330 : 360,
        height: 250,
      };
    case CarSubTypeId.MEDIUM:
      return {
        id: CarSubTypeId.MEDIUM,
        url: "https://gte-gcms.imgix.net/AGeNgIxyT3iFAom9D2iW",
        name: "medium car fallback",
        width: isSearchResults ? 330 : 360,
        height: 250,
      };
    case CarSubTypeId.LARGE:
      return {
        id: CarSubTypeId.LARGE,
        url: "https://gte-gcms.imgix.net/iwjtLM1VRgldi4LOlgCT",
        name: "large car fallback",
        width: isSearchResults ? 330 : 360,
        height: 250,
      };
    case CarSubTypeId.ESTATE:
      return {
        id: CarSubTypeId.ESTATE,
        url: "https://gte-gcms.imgix.net/QY3m2c8ERDO7NQXwih0U",
        name: "estate car fallback",
        width: isSearchResults ? 330 : 360,
        height: 250,
      };
    case CarSubTypeId.MINIVAN:
      return {
        id: CarSubTypeId.MINIVAN,
        url: "https://gte-gcms.imgix.net/DTPmMTtR7u2XNcxMcL2b",
        name: "mini van fallback",
        width: isSearchResults ? 330 : 360,
        height: 250,
      };
    case CarSubTypeId.JEEPSUV:
    case CarSubTypeId.PREMIUM:
      return {
        id: CarSubTypeId.PREMIUM,
        url: "https://gte-gcms.imgix.net/W69yfr22S0uVTic0pYzP",
        name: "jeep/suv fallback",
        width: isSearchResults ? 330 : 360,
        height: 250,
      };
    case CarSubTypeId.CONVERTIBLE:
      return {
        id: CarSubTypeId.CONVERTIBLE,
        url: "https://gte-gcms.imgix.net/K1VuQrdSvWCvlTERanDF",
        name: "convertible car fallback",
        width: isSearchResults ? 330 : 360,
        height: 100,
      };
    case CarSubTypeId.CAMPERVAN:
    case CarSubTypeId.MINICAMPER:
      return {
        id: CarSubTypeId.CAMPERVAN,
        url: "https://gte-gcms.imgix.net/xuMD5MC6Tryu8INKm092",
        name: "camper van car fallback",
        width: isSearchResults ? 330 : 360,
        height: 250,
      };
    case CarSubTypeId.VAN:
      return {
        id: CarSubTypeId.VAN,
        url: "https://gte-gcms.imgix.net/LEXlrkTRluCb36SQgzgY",
        name: "van fallback",
        width: isSearchResults ? 330 : 360,
        height: 250,
      };
    default:
      return undefined;
  }
};

export const constructCarProducts = (cars: CarSearchTypes.CarSearch[], currencyCode: string) =>
  cars.map(
    ({
      id,
      vehicleCategory,
      image,
      linkUrl,
      headline,
      averageRating,
      reviewsCount,
      price,
      totalSaved,
      carSpecs,
      carProps,
      establishment,
      provider,
      ribbonLabelText,
    }) => {
      const { query } = parseUrl(linkUrl);
      return {
        id,
        fallBackImg: getCarsSubtypeImage(vehicleCategory as CarSubTypeId, true),
        image,
        linkUrl,
        headline,
        averageRating,
        reviewsCount,
        price,
        totalSaved,
        ribbonLabelText,
        ssrPrice: price,
        specs: carSpecs,
        props: carProps,
        establishment,
        shouldFormatPrice: provider !== CarProvider.CARNECT || currencyCode === "ISK",
        useDefaultImageHeight: image.url.includes("carhire"),
        clientRoute: {
          query: {
            ...query,
            carId: id,
          },
          route: `/${PageType.CAR}`,
          as: urlToRelative(linkUrl),
        },
      };
    }
  );

export const getCarSelectedFilters = ({
  carType,
  includedInsurances,
  fuelType,
  seats,
  supplier,
  carFeatures,
  includedExtras,
  depositAmount,
  supplierLocation,
  fuelPolicy,
  milage,
  filters,
  currencyCode,
  convertCurrency,
}: {
  carType?: string[];
  includedInsurances?: string[];
  fuelType?: string[];
  seats?: string[];
  supplier?: string[];
  carFeatures?: string[];
  includedExtras?: string[];
  depositAmount?: string[];
  supplierLocation?: string[];
  fuelPolicy?: string[];
  milage?: string[];
  filters: FilterSectionListType;
  currencyCode: string;
  convertCurrency: (value: number) => number;
}) => {
  if (!filters) {
    return [];
  }
  const carTypeFilters = getSectionTypeFilters(filters, CarFilterQueryParam.CAR_TYPE);
  const selectedCarTypes = carType
    ? getSectionTypeSelectedFilters(
        carTypeFilters,
        carType,
        CarFilterQueryParam.CAR_TYPE,
        FilterType.BUTTONS
      )
    : [];

  const includedInsurancesFilters = getSectionTypeFilters(
    filters,
    CarFilterQueryParam.INCLUDED_INSURANCES
  );
  const selectedIncludedInsurances = includedInsurances
    ? getSectionTypeSelectedFilters(
        includedInsurancesFilters,
        includedInsurances,
        CarFilterQueryParam.INCLUDED_INSURANCES,
        FilterType.CHECKBOX
      )
    : [];

  const seatsFilters = getSectionTypeFilters(filters, CarFilterQueryParam.SEATS);
  const selectedSeats = seats
    ? getSectionTypeSelectedFilters(
        seatsFilters,
        seats,
        CarFilterQueryParam.SEATS,
        FilterType.CHECKBOX
      )
    : [];

  const supplierLocationFilters = getSectionTypeFilters(
    filters,
    CarFilterQueryParam.SUPPLIER_LOCATION
  );
  const selectedSupplierLocations = supplierLocation
    ? getSectionTypeSelectedFilters(
        supplierLocationFilters,
        supplierLocation,
        CarFilterQueryParam.SUPPLIER_LOCATION,
        FilterType.CHECKBOX
      )
    : [];

  const carFeaturesFilters = getSectionTypeFilters(filters, CarFilterQueryParam.CAR_FEATURES);
  const selectedCarFeatures = carFeatures
    ? getSectionTypeSelectedFilters(
        carFeaturesFilters,
        carFeatures,
        CarFilterQueryParam.CAR_FEATURES,
        FilterType.CHECKBOX
      )
    : [];

  const fuelPolicyFilters = getSectionTypeFilters(filters, CarFilterQueryParam.FUEL_POLICY);
  const selectedFuelPolicies = fuelPolicy
    ? getSectionTypeSelectedFilters(
        fuelPolicyFilters,
        fuelPolicy,
        CarFilterQueryParam.FUEL_POLICY,
        FilterType.CHECKBOX
      )
    : [];

  const milageFilters = getSectionTypeFilters(filters, CarFilterQueryParam.MILAGE);
  const selectedMilage = milage
    ? getSectionTypeSelectedFilters(
        milageFilters,
        milage,
        CarFilterQueryParam.MILAGE,
        FilterType.CHECKBOX
      )
    : [];

  const selectedDepositAmount = getPriceSelectedFilter(
    CarFilterQueryParam.DEPOSIT_AMOUNT,
    currencyCode,
    convertCurrency,
    depositAmount
  );

  const includedExtrasFilters = getSectionTypeFilters(filters, CarFilterQueryParam.INCLUDED_EXTRAS);
  const selectedIncludedExtras = includedExtras
    ? getSectionTypeSelectedFilters(
        includedExtrasFilters,
        includedExtras,
        CarFilterQueryParam.INCLUDED_EXTRAS,
        FilterType.CHECKBOX
      )
    : [];

  const supplierFilters = getSectionTypeFilters(filters, CarFilterQueryParam.SUPPLIER);
  const selectedSupplier = supplier
    ? getSectionTypeSelectedFilters(
        supplierFilters,
        supplier,
        CarFilterQueryParam.SUPPLIER,
        FilterType.CHECKBOX
      )
    : [];

  const fuelTypeFilters = getSectionTypeFilters(filters, CarFilterQueryParam.FUEL_TYPE);
  const selectedFuelType = fuelType
    ? getSectionTypeSelectedFilters(
        fuelTypeFilters,
        fuelType,
        CarFilterQueryParam.FUEL_TYPE,
        FilterType.CHECKBOX
      )
    : [];

  return [
    ...selectedCarTypes,
    ...selectedIncludedInsurances,
    ...selectedSeats,
    ...selectedSupplierLocations,
    ...selectedCarFeatures,
    ...selectedFuelPolicies,
    ...selectedMilage,
    ...(selectedDepositAmount ? [selectedDepositAmount] : []),
    ...selectedIncludedExtras,
    ...selectedSupplier,
    ...selectedFuelType,
  ];
};
