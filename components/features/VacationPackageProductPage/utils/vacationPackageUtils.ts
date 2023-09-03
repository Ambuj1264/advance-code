import { pipe } from "fp-ts/lib/pipeable";
import { flatten } from "fp-ts/lib/Array";
import { head as nonEmptyHead, map as nonEmptyMap, NonEmptyArray } from "fp-ts/lib/NonEmptyArray";
import { addDays, addYears, subWeeks } from "date-fns";
import memoizeOne from "memoize-one";
import { encodeQueryParams, stringify } from "use-query-params";
import { NextRouter } from "next/router";

import { VPQuickfactId, VPStaysTypes } from "../types/VPProductPageEnums";

import { constructGTETourSearchResults } from "components/features/GTETourSearchPage/utils/gteTourSearchUtils";
import routes from "shared/routes";
import { getAdjustedDatesInLocalStorage } from "utils/localStorageUtils";
import {
  constructSelectedDatesFromQuery,
  normaliseDates,
} from "components/ui/DatePicker/utils/datePickerUtils";
import { constructHreflangs } from "components/ui/utils/uiUtils";
import { getFormattedDate, yearMonthDayFormat } from "utils/dateUtils";
import Icon from "components/ui/GraphCMSIcon";
import BestPriceIcon from "components/icons/discount-circle.svg";
import Like from "components/icons/like-circle.svg";
import ClockIcon from "components/icons/clock.svg";
import {
  constructGraphCMSImage,
  defaultTourSEOImage,
} from "components/ui/LandingPages/utils/landingPageUtils";
import {
  CarCategory,
  CarPlaceholderCategory,
  CarSubTypeId,
  FlightRanking,
  GraphCMSPageType,
  TravelStopType,
} from "types/enums";
import CarIcon from "components/icons/car.svg";
import PremiumCarIcon from "components/icons/car-3.svg";
import TravellersIcon from "components/icons/travellers.svg";
import BagIcon from "components/icons/bag-handle.svg";
import CarGearIcon from "components/icons/car-dashboard-gear.svg";
import { getCarCategoryValue } from "utils/sharedCarUtils";
import { capitalize } from "utils/globalUtils";
import {
  getPassengerBaggageInputParam,
  NO_CHECKED_BAGGAGE_ID,
} from "components/features/Flight/utils/flightUtils";
import currencyFormatter from "utils/currencyFormatUtils";
import {
  VPQueryParamScheme,
  VPQueryParamsType,
} from "components/features/VacationPackages/hooks/useVPQueryParams";
import {
  constructTravelStopAttractions,
  constructTravelStopDestinations,
  generateQuickfacts,
} from "components/ui/TravelStop/travelStopUtils";
import { emptyArray } from "utils/constants";
import { getMapZoom } from "components/ui/Map/utils/mapUtils";
import { memoizeOneObj } from "utils/helperUtils";
import { BagType } from "components/features/FlightSearchPage/types/flightEnums";
import { getCarsSubtypeImage } from "components/features/CarSearchPage/utils/carSearchUtils";

export const constructPriceLabel = ({
  tFunction,
  currencyCode,
  price,
  isSelected = false,
  isPricePerDay = false,
}: {
  tFunction: TFunction;
  currencyCode: string;
  price?: number;
  isSelected?: boolean;
  isPricePerDay?: boolean;
}) => {
  if (price !== undefined) {
    const ceiledPrice = price >= 0 ? Math.ceil(price) : -Math.ceil(Math.abs(price));

    const formattedPrice = currencyFormatter(ceiledPrice);

    if (isSelected) {
      return tFunction("Selected");
    }

    const sign = ceiledPrice > 0 ? "+" : "";
    const perDayLabel = isPricePerDay ? ` ${tFunction("per day")}` : "";
    return `${sign}${formattedPrice} ${currencyCode}${perDayLabel}`;
  }
  return price;
};

export const constructMapData = (
  latitude: number,
  longitude: number,
  location: string,
  nearbyPoints?: SharedTypes.MapPoint[]
) => {
  return {
    latitude,
    longitude,
    location,
    zoom: getMapZoom(false, false),
    points: nearbyPoints || [],
    options: {
      fullscreenControl: true,
      mapTypeControl: false,
      streetViewControl: false,
    },
    isCountryMap: true,
  };
};

export const constructNearbyPoints = (
  vacationPackageAttractions: TravelStopTypes.QueryGraphCMSAttraction[]
) =>
  vacationPackageAttractions.map(
    (attraction: TravelStopTypes.QueryGraphCMSAttraction, index: number) => ({
      id: index,
      type: TravelStopType.ATTRACTION,
      latitude: attraction.location.latitude,
      longitude: attraction.location.longitude,
      orm_name: attraction.title,
      title: attraction.title,
      image: constructGraphCMSImage(GraphCMSPageType.VacationPackages, attraction.mainImage),
      reviewTotalCount: attraction.reviewCount,
      reviewTotalScore: attraction.reviewScore,
      isGoogleReview: false,
    })
  );

const constructDestinationPoints = (
  vpDestinationsInfo: VacationPackageTypes.VPDestinationInfo[]
): SharedTypes.MapPoint[] => {
  return vpDestinationsInfo
    .map(dest => {
      const { location } = dest.destination;
      if (!location) {
        return undefined;
      }
      return {
        id: dest.id,
        type: TravelStopType.DESTINATION,
        title: dest.title,
        latitude: location.latitude,
        longitude: location.longitude,
        orm_name: dest.title,
        numberOfNights: dest.numberOfNights,
        reviewTotalCount: 0,
        reviewTotalScore: 0,
        isGoogleReview: false,
        childPoints: constructNearbyPoints(dest.attractionLandingPages),
      };
    })
    .filter(Boolean) as SharedTypes.MapPoint[];
};
export const constructPolylineMapData = (
  vpDestinationsInfo: VacationPackageTypes.VPDestinationInfo[]
) => {
  const onlyOneDestination = vpDestinationsInfo.length === 1;
  const points = onlyOneDestination
    ? constructNearbyPoints(vpDestinationsInfo[0].attractionLandingPages)
    : constructDestinationPoints(vpDestinationsInfo);
  if (points.length === 0) return undefined;
  return {
    latitude: points[0].latitude,
    longitude: points[0].longitude,
    location: points[0].title,
    zoom: getMapZoom(false, false),
    usePolyLine: !onlyOneDestination,
    points,
    options: {
      fullscreenControl: true,
      mapTypeControl: false,
      streetViewControl: false,
    },
    isCountryMap: true,
  };
};

export const constructVPDestinationsInfo = (
  days: VacationPackageTypes.QueryVacationPackageDay[]
) => {
  return days.reduce((destinationsInfo, currentDay) => {
    const { attractionLandingPages, staysDestinationId, destinationLandingPages } = currentDay;
    const destination = staysDestinationId
      ? destinationLandingPages.find(dest => dest.uniqueId === staysDestinationId)
      : undefined;
    if (!destination || !staysDestinationId) {
      return destinationsInfo;
    }
    const lastDestination = destinationsInfo.pop();
    if (!lastDestination) {
      return [
        {
          id: staysDestinationId,
          title: destination.title,
          destination,
          attractionLandingPages,
          numberOfNights: 1,
        },
      ];
    }
    if (lastDestination.id === staysDestinationId) {
      return [
        ...destinationsInfo,
        {
          ...lastDestination,
          attractionLandingPages: [
            ...lastDestination.attractionLandingPages,
            ...attractionLandingPages,
          ],
          numberOfNights: lastDestination.numberOfNights + 1,
        },
      ];
    }
    return [
      ...destinationsInfo,
      lastDestination,
      {
        id: staysDestinationId,
        title: destination.title,
        destination,
        attractionLandingPages,
        numberOfNights: 1,
      },
    ];
  }, [] as VacationPackageTypes.VPDestinationInfo[]);
};

const constructVPDays = (
  days: VacationPackageTypes.QueryVacationPackageDay[],
  vacationPackageNs: TFunction
): VacationPackageTypes.VacationPackageDay[] =>
  days.map(day => ({
    id: day.id,
    region: day.title,
    description: day.description || "",
    destinations: constructTravelStopDestinations(day.destinationLandingPages, vacationPackageNs),
    attractions: constructTravelStopAttractions(day.attractionLandingPages, vacationPackageNs),

    attractionsMapData:
      day.attractionLandingPages[0] !== undefined
        ? constructMapData(
            day.attractionLandingPages[0].location.latitude,
            day.attractionLandingPages[0].location.longitude,
            day.attractionLandingPages[0].title,
            constructNearbyPoints(day.attractionLandingPages)
          )
        : undefined,
  }));

// be careful when changing props: this is used by the search page as well
export const constructVacationPackageProductSpecs = (
  quickFactsNsT: TFunction,
  vacationPackage?: QueryVacationPackagesSearchTypes.GraphCmsVacationPackage,
  customTranslateOptions?: VacationPackageTypes.TranslateOptions,
  dynamicQuickFacts?: TravelStopTypes.Quickfact[]
): SharedTypes.ProductSpec[] => {
  const translateOptions = customTranslateOptions || {
    startsIn: vacationPackage?.startsIn,
    endsIn: vacationPackage?.endsIn,
    startTime: vacationPackage?.startTime,
    endTime: vacationPackage?.endTime,
    days: Number(vacationPackage?.days ?? 0),
    nights: vacationPackage?.nights,
    Available: vacationPackage?.available,
  };
  const quickfacts =
    (dynamicQuickFacts ||
      vacationPackage?.quickfactsList?.quickfacts || // used by product page
      vacationPackage?.quickfacts) ?? // used by search results page
    [];
  return generateQuickfacts(quickfacts, quickFactsNsT, translateOptions);
};

export const constructVPProductSpecs = ({
  productSpecs = emptyArray as never as VacationPackageTypes.Quickfact[],
  vacationIncludesCar,
  vacationIncludesFlight,
  quickFactsNsT,
  vpDestinationsInfo,
  translateOptions,
}: {
  productSpecs?: VacationPackageTypes.Quickfact[];
  vacationIncludesCar: boolean;
  vacationIncludesFlight: boolean;
  quickFactsNsT: TFunction;
  vpDestinationsInfo: VacationPackageTypes.VPDestinationInfo[];
  translateOptions: VacationPackageTypes.TranslateOptions;
}) => {
  const finalSpecs = productSpecs.map(spec => {
    if (!vacationIncludesCar && spec.quickfactId === VPQuickfactId.CarRental) {
      return {
        ...spec,
        name: {
          value: "Optional",
        },
        information: {
          value: quickFactsNsT(
            "We offer a large selection of cars to fit your perfect vacation. Add a car either in the content or the booking widget."
          ),
        },
      };
    }
    if (!vacationIncludesFlight && spec.quickfactId === VPQuickfactId.Flight) {
      return {
        ...spec,
        name: {
          value: "Optional",
        },
        information: {
          value: quickFactsNsT("You can choose to add or skip flights by toggling the switcher."),
        },
      };
    }
    if (spec.quickfactId === VPQuickfactId.Hotel) {
      const bulletPoints = vpDestinationsInfo.map(destInfo =>
        quickFactsNsT("{nightsInDestination} nights in {destination}", {
          nightsInDestination: destInfo.numberOfNights,
          destination: destInfo.title,
        })
      );
      return {
        ...spec,
        information: {
          value: spec.information?.value ?? "",
          bulletPoints,
        },
      };
    }
    return {
      ...spec,
      information: spec.information?.value
        ? {
            value: quickFactsNsT(spec.information?.value, translateOptions),
          }
        : undefined,
    };
  }) as VacationPackageTypes.Quickfact[];
  return constructVacationPackageProductSpecs(
    quickFactsNsT,
    undefined,
    translateOptions,
    finalSpecs
  );
};

// be careful when changing props: this is used by the search page as well
export const constructVacationPackageProductProps = (
  vacationT: TFunction,
  valuePropsList?: VacationPackageTypes.ValueProp[]
): SharedTypes.ProductProp[] => {
  const valueProps = valuePropsList ?? [];

  return valueProps.map(valueProp => ({
    Icon: Icon(valueProp.icon?.handle),
    title: vacationT(valueProp?.title ?? ""),
  }));
};

export const constructVPIncluded = ({
  tFunc,
  included = emptyArray as never as VacationPackageTypes.IncludedItems[],
  vacationLength,
  vacationIncludesCar,
}: {
  tFunc: TFunction;
  included?: VacationPackageTypes.IncludedItems[];
  vacationLength?: number;
  vacationIncludesCar: boolean;
}) => {
  return included
    .map(includedItem => {
      // filter out some value props based on selected features
      if (
        !vacationIncludesCar &&
        (includedItem.id === "car" || includedItem.id === "cdw-insurance")
      ) {
        return undefined;
      }

      if (includedItem.id === "car") {
        const carTitle = tFunc("{numberOfDays} days car rental", {
          numberOfDays: vacationLength ?? 0,
        });
        return {
          id: includedItem.id,
          title: carTitle,
          icon: includedItem.icon,
        };
      }
      if (includedItem.id === "hotel") {
        const hotelTitle = tFunc("{numberOfNights} nights hotel", {
          numberOfNights: vacationLength ? vacationLength - 1 : 0,
        });
        return {
          id: includedItem.id,
          title: hotelTitle,
          icon: includedItem.icon,
        };
      }
      return {
        id: includedItem.id,
        title: tFunc(includedItem.title),
        icon: includedItem.icon,
      };
    })
    .filter(Boolean) as VacationPackageTypes.IncludedItems[];
};

export const constructSortedByDailyAttractions = (
  allVPAttractions: TravelStopTypes.TravelStops[],
  vacationPackageDays: VacationPackageTypes.VacationPackageDay[]
) => {
  const allDailyAttractionNames = vacationPackageDays.reduce((prev, curr) => {
    return [...prev, ...curr.attractions.map(attraction => attraction.info.title)];
  }, [] as string[]);

  const sortedArray = allVPAttractions.sort(
    (a, b) =>
      allDailyAttractionNames.indexOf(a.info.title) - allDailyAttractionNames.indexOf(b.info.title)
  );
  return sortedArray;
};

const constructVisitedPlacesImages = (visitedPlaces?: VacationPackageTypes.VisitedPlaceImages) => {
  const visitedPlaceImages = visitedPlaces?.reduce((acc: SharedTypes.GraphCMSAsset[], place) => {
    const { images, mainImage } = place;
    const array: SharedTypes.GraphCMSAsset[] = [...images, ...(mainImage ? [mainImage] : [])];
    return [...acc, ...array];
  }, [] as SharedTypes.GraphCMSAsset[]);
  return visitedPlaceImages?.map(image =>
    constructGraphCMSImage(GraphCMSPageType.VacationPackages, image)
  );
};

const contructVPProductImages = (
  vpAttractions: TravelStopTypes.QueryGraphCMSAttraction[],
  vpDestinations: TravelStopTypes.QueryGraphCMSDestination[],
  visitedPlaces?: VacationPackageTypes.VisitedPlaceImages
) => {
  const visitedPlaceImages = constructVisitedPlacesImages(visitedPlaces);
  return [
    ...(visitedPlaceImages || ([] as ImageWithSizes[])),
    ...([...vpAttractions, ...vpDestinations]
      .filter(travelStop => travelStop.mainImage?.handle !== undefined)
      .map(travelStop =>
        constructGraphCMSImage(GraphCMSPageType.VacationPackages, travelStop.mainImage)
      ) as ImageWithSizes[]),
  ];
};

export const constructVacationPackageContent = (
  vacationPackage: VacationPackageTypes.QueryVacationPackageContent[],
  vacationPackageNs: TFunction,
  marketplaceUrl: string
): VacationPackageTypes.VacationPackageResult =>
  pipe(
    vacationPackage as NonEmptyArray<VacationPackageTypes.QueryVacationPackageContent>,
    nonEmptyMap(data => {
      const vacationPackageDays = constructVPDays(data.vacationPackageDays, vacationPackageNs);
      const unsortedVPAttractions = constructTravelStopAttractions(
        data.vacationPackageAttractions,
        vacationPackageNs
      );
      const vpDestinationsInfo = constructVPDestinationsInfo(data.vacationPackageDays);
      const mapData = constructPolylineMapData(vpDestinationsInfo);
      // Some packages have not been updated in hygraph so we need to keep the old map data for those, otherwise we dont show any data on the map
      const oldMapData = data.vacationPackageAttractions[0]
        ? constructMapData(
            data.vacationPackageAttractions[0].location.latitude,
            data.vacationPackageAttractions[0].location.longitude,
            data.vacationPackageAttractions[0].title,
            constructNearbyPoints(data.vacationPackageAttractions)
          )
        : undefined;
      return {
        id: data.id,
        days: Number(data?.dayData?.[0].days) || Number(data.vacationPackageDays?.length || 0),
        tripId: data.tripId,
        isDeleted: data.isDeleted,
        cheapestMonth: data.cheapestMonth,
        title: data.title,
        nights: Number(data?.dayData?.[0].nights ?? 0),
        metadataUri: data.metadataUri,
        canonicalUrl: data.canonicalUrl,
        images: contructVPProductImages(
          data.vacationPackageAttractions,
          data.destinations,
          data.visitedPlaces
        ),
        description: data.description,
        productSpecs: data.quickfactsList?.quickfacts,
        productProps: data.valuePropsList.valueProps,
        includedList: data?.includedList?.includedItems,
        reviewCount: data.reviewCount,
        reviewScore: data.reviewScore,
        vpDestinationsInfo,
        mapData: (mapData?.points?.length ?? 0) > 0 ? mapData : oldMapData,
        vacationPackageDestinations: constructTravelStopDestinations(
          data.destinations,
          vacationPackageNs,
          vpDestinationsInfo
        ),
        vacationPackageAttractions: constructSortedByDailyAttractions(
          unsortedVPAttractions,
          vacationPackageDays
        ),
        vacationPackageDays,
        fromPrice: data.fromPrice,
        startPlace: data.startPlace,
        endPlace: data.endPlace,
        startsIn: data.startsIn,
        endsIn: data.endsIn,
        available: data.available,
        hreflangs: constructHreflangs(data.hreflangs, marketplaceUrl),
        subType: data.subType?.subtype,
        tripDatabaseId: data?.travelplanMetadata?.versions?.objectid,
        variationId: data?.travelplanMetadata?.versions?.variationId,
        envelopeId:
          data?.travelplanMetadata?.versions?.envelopeId ||
          data?.travelplanMetadata?.versions?.revision,
      };
    }),
    nonEmptyHead
  );

// Flights
export const calculateFlightDuration = (itinerary: FlightSearchTypes.FlightItinerary) => {
  const totalOutboundDuration = itinerary.outboundRoute.totalDurationSec;
  const totalInboundDuration = itinerary.inboundRoute?.totalDurationSec;
  if (totalOutboundDuration !== undefined && totalInboundDuration !== undefined) {
    return totalOutboundDuration + totalInboundDuration;
  }
  return totalOutboundDuration;
};

const getFlightRank = (index: number): FlightRanking => {
  switch (index) {
    case 0:
      return FlightRanking.BEST;
    case 1:
      return FlightRanking.CHEAPEST;
    case 2:
      return FlightRanking.FASTEST;
    default:
      return FlightRanking.NORANK;
  }
};

const getCurrentFlightPrices = (
  itineraries: FlightSearchTypes.FlightItinerary[],
  prices: VacationPackageTypes.FlightPrice[]
) => {
  return itineraries.map(
    itinerary =>
      prices.find(flightPrice => flightPrice.bookingToken === String(itinerary.id))?.flightPrice
  );
};

export const getFlightsbyRankings = (
  itinerary: FlightSearchTypes.FlightItinerary[],
  prices?: VacationPackageTypes.FlightPrice[]
): VacationPackageTypes.VacationFlightItinerary[] => {
  const sortedFlightPrices = prices ? getCurrentFlightPrices(itinerary, prices) : undefined;
  return itinerary.map((itineraryItem: FlightSearchTypes.FlightItinerary, index: number) => ({
    ...itineraryItem,
    flightRanking: getFlightRank(index),
    vpPrice: sortedFlightPrices ? sortedFlightPrices[index] : undefined,
  }));
};

export const getFlightTitleByRanking = (
  flightRanking: FlightRanking,
  vacationPackageT: TFunction
) => {
  switch (flightRanking) {
    case FlightRanking.BEST:
      return {
        shortName: vacationPackageT("Best"),
        fullName: vacationPackageT("Best flights"),
        Icon: Like,
      };
    case FlightRanking.CHEAPEST:
      return {
        shortName: vacationPackageT("Cheapest"),
        fullName: vacationPackageT("Cheapest flights"),
        Icon: BestPriceIcon,
      };
    default:
      return {
        shortName: vacationPackageT("Fastest"),
        fullName: vacationPackageT("Fastest flights"),
        Icon: ClockIcon,
      };
  }
};

// Car Utils

const carCategoryOrder = {
  [CarCategory.SMALL]: 1,
  [CarCategory.MEDIUM]: 2,
  [CarCategory.PREMIUM]: 3,
  [CarCategory.LARGE]: 4,
  [CarCategory.ESTATE]: 5,
  [CarCategory.JEEPSUV]: 6,
  [CarCategory.CONVERTIBLE]: 7,
  [CarCategory.VAN]: 8,
  [CarCategory.MINIVAN]: 9,
  [CarCategory.CAMPERVAN]: 10,
  [CarCategory.MINICAMPER]: 11,
  [CarCategory.UNSPECIFIED]: 12,
};

// TODO: Add unit tests
const getAllAvailableSortedCarTypes = (cars: CarSearchTypes.QueryCarSearch[]): CarCategory[] => {
  return [...new Set(cars.map(car => car.quickFacts.category as CarCategory))].sort(
    (a, b) => carCategoryOrder[a] - carCategoryOrder[b]
  );
};

export const getCarsWithPrices = (
  carResults: VacationPackageTypes.VPCarSearch[],
  prices?: VacationPackageTypes.CarPrice[]
) => {
  return carResults.map(car => {
    const carPriceById = prices
      ? prices.find(carPrice => carPrice.offerReference === String(car.id))?.totalPrice
      : undefined;
    return {
      ...car,
      ...{
        vpPrice: carPriceById,
      },
    };
  });
};
// TODO: Add unit tests
const getSortedCarsByTypeWithPrice = (
  cars: CarSearchTypes.CarSearch[],
  availableCarTypes: CarCategory[],
  prices?: VacationPackageTypes.CarPrice[]
) => {
  return flatten(
    availableCarTypes.map(type => {
      const carOffersByCarType = cars.filter(car => car.category === type);
      if (!carOffersByCarType.length) return [];

      return carOffersByCarType.map(carOfferByType => {
        const carPriceById = prices
          ? prices.find(carPrice => carPrice.offerReference === String(carOfferByType.id))
              ?.totalPrice
          : undefined;

        return {
          ...carOfferByType,
          ...{
            vpPrice: carPriceById,
          },
        };
      });
    })
  );
};

export const constructVPCarProducts = (
  cars: CarSearchTypes.CarSearch[],
  queryCars: CarSearchTypes.QueryCarSearch[],
  prices?: VacationPackageTypes.CarPrice[]
) => {
  const availableCarTypes = getAllAvailableSortedCarTypes(queryCars);
  const sortedCarsByTypeWithPrice = getSortedCarsByTypeWithPrice(cars, availableCarTypes, prices);
  return sortedCarsByTypeWithPrice
    .map(car => {
      const type = queryCars.find(queryCar => queryCar.idContext === car.id)?.quickFacts.category;

      return {
        ...car,
        fallBackImg: getCarsSubtypeImage(car.vehicleCategory as CarSubTypeId, true),
        subtype: type ? capitalize(type) : undefined,
        Icon:
          type === CarCategory.PREMIUM || type === (CarPlaceholderCategory.PREMIUM as string)
            ? PremiumCarIcon
            : CarIcon,
      };
    })
    .filter(Boolean)
    .slice(0, 3) as VacationPackageTypes.VPCarSearch[];
};

// TODO: Add unit tests
const constructPlaceholderCar = ({
  t,
  category,
  id,
  subtype,
  handle,
  price,
}: {
  t: TFunction;
  category: string;
  id: string;
  subtype: string;
  handle: string;
  price?: number;
}) => {
  const specs = [
    {
      name: t("Category"),
      value: getCarCategoryValue(category, t),
      Icon: CarIcon,
      isLoading: false,
    },
    {
      name: t("Transmission"),
      value: "",
      Icon: CarGearIcon,
      isLoading: true,
    },
    {
      name: t("People"),
      value: "",
      Icon: TravellersIcon,
      isLoading: true,
    },
    {
      name: t("Large bags"),
      value: "",
      Icon: BagIcon,
      isLoading: true,
    },
  ];
  return {
    id,
    subtype,
    image: constructGraphCMSImage(GraphCMSPageType.Cars, {
      id: handle,
      handle,
    }),
    carSpecs: specs,
    Icon: subtype === CarPlaceholderCategory.PREMIUM ? PremiumCarIcon : CarIcon,
    price,
  };
};

// TODO: Add unit tests
export const constructVPCarPlaceholderProducts = (
  t: TFunction,
  placeholderQueryCars: VacationPackageTypes.CarSubTypesQueryResult,
  fallbackOffers?: VacationPackageTypes.VPCarSearch[]
) => {
  const placeholders = placeholderQueryCars.subTypes;
  const subTypes = [
    CarPlaceholderCategory.SMALL,
    CarPlaceholderCategory.MEDIUM,
    CarPlaceholderCategory.PREMIUM,
  ];
  const constructedPlaceholders = placeholders
    .map(car => {
      if (car.typeImage && car.subtype) {
        const { id, handle } = car.typeImage;
        const fallbackPrice = fallbackOffers?.find(
          fallbackOffer => fallbackOffer.subtype === car.subtype
        )?.vpPrice;
        if (subTypes.includes(car.subtype as CarPlaceholderCategory)) {
          return constructPlaceholderCar({
            t,
            category: car.subtype.toUpperCase(),
            subtype: car.subtype,
            id,
            handle: handle ?? "",
            price: fallbackPrice,
          });
        }
      }
      return undefined;
    })
    .filter(Boolean);
  return constructedPlaceholders as VacationPackageTypes.VPPlaceholderCar[];
};

export const getCarOffersDataByAirport = memoizeOne(
  (destinationId: string, data?: VacationPackageTypes.VPCarsSearchQueryResponse) => {
    const carOffersDataByAirport = data?.carOffers?.find(
      carOffersByAirport => carOffersByAirport.id === destinationId
    )?.results;

    const carOffersDefaultData = !carOffersDataByAirport
      ? data?.carOffers?.find(carOffersByAirport => carOffersByAirport.id === "")?.results ??
        data?.carOffers[0]?.results
      : undefined;

    return {
      carOffersDataByAirport,
      carOffersDefaultData,
    };
  }
);

export const constructCarPriceInput = ({
  selectedCarId,
  insurances,
  extras,
}: {
  selectedCarId?: string;
  insurances: CarBookingWidgetTypes.SelectedInsurance[];
  extras: CarBookingWidgetTypes.SelectedExtra[];
}): VacationPackageTypes.CarPriceInput[] => {
  return [
    {
      extras: extras
        .map(extra => ({ ...extra, id: Number(extra.id) }))
        .filter(({ id }) => Boolean(id)),
      insurances: insurances.filter(insurance => insurance.selected).map(insurance => insurance.id),
      offerReference: selectedCarId,
      selected: true,
    },
  ];
};

export const constructFlightPriceInput = ({
  flight,
  passengers,
}: {
  flight?: VacationPackageTypes.VacationFlightItinerary;
  passengers: FlightTypes.PassengerDetails[];
}): VacationPackageTypes.FlightPriceInput[] => {
  if (flight) {
    const modifiedPassengers = passengers.map(passenger => {
      return {
        baggage: getPassengerBaggageInputParam(passenger.bags),
      } as VacationPackageTypes.FlightPassengerInput;
    });
    return [
      {
        bookingToken: flight.id,
        passengers: modifiedPassengers,
        numberOfBags: modifiedPassengers?.reduce(
          (accumulator, currValue) => accumulator + (currValue.baggage?.length ?? 0),
          0
        ),
        numberOfPassengers: flight.numberOfPassengers,
        selected: true,
      },
    ];
  }
  return [];
};

export const extractGroupedDaysValue = (
  day: number,
  productId: number | string,
  hotels?: VacationPackageTypes.VacationPackageStayProduct[]
) => {
  return (hotels?.filter(hotel => hotel.productId === Number(productId) && hotel.day === day)[0]
    ?.groupedWithDays ?? emptyArray) as number[];
};

export const getHotelSelectedRoomCombination = (
  roomCombinations: StayBookingWidgetTypes.RoomCombination[]
) =>
  roomCombinations
    .filter(roomComb => roomComb.isSelected)
    .map(room => ({
      ...room,
      availabilities: room.availabilities.filter(availability => availability.isSelected),
    }));

export const getSelectedRoomTypes = memoizeOne(
  (selectedHotelsRooms: VacationPackageTypes.SelectedVPStaysRoomType[]) => {
    return selectedHotelsRooms.map(hotel => ({
      ...hotel,
      roomCombinations: getHotelSelectedRoomCombination(hotel.roomCombinations),
    }));
  }
);

export const constructStayPriceInput = ({
  selectedStayDay,
  selectedHotelsRooms,
}: {
  selectedStayDay: number;
  selectedHotelsRooms: VacationPackageTypes.SelectedVPStaysRoomType[];
}): VacationPackageTypes.StaysPriceInput[] => {
  const selectedRooms = getSelectedRoomTypes(selectedHotelsRooms);
  const currentlySelectedStay = selectedRooms.find(stay =>
    stay.groupedWithDays.some(day => day === selectedStayDay)
  ) as VacationPackageTypes.SelectedVPStaysRoomType;
  if (!currentlySelectedStay) {
    return emptyArray as unknown as VacationPackageTypes.StaysPriceInput[];
  }
  const { productId, groupedWithDays } = currentlySelectedStay;

  const selectedRoomCombination = currentlySelectedStay.roomCombinations.find(
    roomComb => roomComb.isSelected
  );
  const selectedAvailability = selectedRoomCombination?.availabilities.find(
    availability => availability.isSelected
  );
  return groupedWithDays.map(day => ({
    key: day,
    value: [
      {
        productId: Number(productId),
        selected: true,
        availabilityId: selectedAvailability?.availabilityId ?? "",
      },
    ],
  }));
};

export const constructToursPriceInput = ({
  selectedTourDay,
  selectedToursProductIds,
  selectedTours,
}: {
  selectedTourDay?: number;
  selectedToursProductIds?: VacationPackageTypes.SelectedToursProductIds[];
  selectedTours: GTETourBookingWidgetTypes.MutationAddGTETourToCartInput[];
}): VacationPackageTypes.ToursPriceInput[] => {
  if (!selectedTourDay) return emptyArray as unknown as VacationPackageTypes.ToursPriceInput[];
  const selectedDayTours =
    selectedToursProductIds?.filter(tour => tour.day === selectedTourDay) ??
    (emptyArray as never as VacationPackageTypes.SelectedToursProductIds[]);

  return [
    {
      key: selectedTourDay,
      value: selectedDayTours.map(tour => {
        const paxMix =
          selectedTours.find(selectedTour => {
            const isProductCodeMatch = selectedTour.productCode === tour.productId;
            const isOptionCodeMatch = selectedTour.productOptionCode === tour.optionCode;
            const isStartTimeMatch =
              selectedTour.startTime === tour.startTime ||
              (!selectedTour.startTime && !tour.startTime);

            return isProductCodeMatch && isOptionCodeMatch && isStartTimeMatch;
          })?.paxMix ?? (emptyArray as never as GTETourBookingWidgetTypes.AgeBand[]);

        return {
          productCode: tour.productId,
          ...(tour.optionCode ? { optionCode: tour.optionCode } : null),
          ...(tour.startTime ? { startTime: tour.startTime } : null),
          paxMix,
        };
      }),
    },
  ];
};
// End of calculate price utils

export const sortCarsArray = (cars: VacationPackageTypes.VPCarSearch[], isMobile: boolean) => {
  if (isMobile) {
    return cars
      ? // eslint-disable-next-line no-nested-ternary
        cars.slice().sort((a, b) => (a.selected === b.selected ? 0 : a.selected ? -1 : 1))
      : [];
  }
  return cars;
};

const hotelTypesOrder: { [key: string]: number } = {
  [VPStaysTypes.BUDGET]: 1,
  [VPStaysTypes.COMFORT]: 2,
  [VPStaysTypes.QUALITY]: 3,
};

export const sortStaysArray = (
  stays: VacationPackageTypes.VacationPackageStayProduct[],
  isMobile: boolean
) => {
  if (isMobile) {
    return stays
      ? // eslint-disable-next-line no-nested-ternary
        stays.slice().sort((a, b) => (a.selected === b.selected ? 0 : a.selected ? -1 : 1))
      : [];
  }
  return stays
    ? stays
        .slice()
        .sort(
          (a, b) => hotelTypesOrder[a.type.toLowerCase()] - hotelTypesOrder[b.type.toLowerCase()]
        )
    : [];
};
const getStayVPPriceByDayAndId = (
  currentStay: VacationPackageTypes.VacationPackageStayProduct,
  stayPrices?: VacationPackageTypes.StayPrice[]
) => {
  if (stayPrices) {
    const currentStayDay = stayPrices.find(stay => stay.key === currentStay.day);
    return currentStayDay?.value.find(value => value.productId === currentStay.productId)?.price;
  }
  return undefined;
};

const getStayRoomAvailabilities = (
  roomCombinations: StayBookingWidgetTypes.QueryRoomCombination[]
) =>
  roomCombinations.reduce((availabilityArray, currentRoomComb) => {
    const roomCombAvailabilities: VacationPackageTypes.StayPriceAvailability[] =
      currentRoomComb.availabilities.map(av => ({
        availabilityId: av.availabilityId,
        price: av.priceObject.price,
        selected: av.isSelected,
      }));
    return [...availabilityArray, ...roomCombAvailabilities];
  }, [] as VacationPackageTypes.StayPriceAvailability[]);

const getStayVPRoomCombinationsPriceByDayAndId = memoizeOne(
  (
    selectedHotelsRoom: VacationPackageTypes.SelectedVPStaysRoomType,
    stayPrices?: VacationPackageTypes.StayPrice[]
  ) => {
    const { day, productId, roomCombinations } = selectedHotelsRoom;
    const currentStayDay = stayPrices?.find(stay => stay.key === day);
    const currentHotel = currentStayDay?.value.find(value => value.productId === productId);
    const currentRoomCombinations = currentHotel?.roomCombinations ?? [];
    const currentRoomAvailabilities = getStayRoomAvailabilities(currentRoomCombinations);
    return roomCombinations.map(roomCombination => {
      return {
        ...roomCombination,
        availabilities: roomCombination.availabilities.map(availability => {
          const currentAvailability = currentRoomAvailabilities.find(
            roomAvailability => roomAvailability.availabilityId === availability.availabilityId
          );
          return {
            ...availability,
            priceObject: {
              price: currentAvailability?.price ?? 0,
              currency: "EUR",
              priceDisplayValue: String(currentAvailability?.price ?? 0),
            },
          };
        }),
      };
    });
  }
);

export const addVPStayPrices = (
  stays: VacationPackageTypes.VacationPackageStayProduct[],
  selectedHotelsRooms: VacationPackageTypes.SelectedVPStaysRoomType[],
  stayPrices?: VacationPackageTypes.StayPrice[]
) => {
  const hotels: VacationPackageTypes.VacationPackageStayProduct[] = stays.map(stay => ({
    ...stay,
    vpPrice: getStayVPPriceByDayAndId(stay, stayPrices),
  }));
  const newSelectedHotelsRooms: VacationPackageTypes.SelectedVPStaysRoomType[] =
    selectedHotelsRooms.map(selectedHotelsRoom => ({
      ...selectedHotelsRoom,
      roomCombinations: getStayVPRoomCombinationsPriceByDayAndId(selectedHotelsRoom, stayPrices),
    }));
  return {
    hotels,
    selectedHotelsRooms: newSelectedHotelsRooms,
  };
};

export const findStaysByDay = ({
  staysData,
  dayNumber,
}: {
  staysData?: VacationPackageTypes.VacationPackageStayProduct[];
  dayNumber: number;
}) =>
  staysData?.filter(hotel => hotel.day === dayNumber) ??
  ([] as VacationPackageTypes.VacationPackageStayProduct[]);

export const constructStaysQuickFacts = (
  stay: VacationPackageTypes.VacationPackageStayProduct,
  totalGuests: number,
  quickFactsNsT: TFunction,
  isDesktop?: boolean
) => {
  const { quickFacts } = stay;
  if (!quickFacts) {
    return [];
  }
  const selectedRoom = stay.roomCombinations.find(room => room.isSelected);
  const translateOptions: { [key: string]: string | number } = {
    checkin: stay?.checkInTime ?? "",
    checkout: stay?.checkOutTime ?? "",
    distanceFromCenter: stay?.distanceFromCenter ?? "",
    starClass: stay?.starClass ?? 0,
    subtype: stay?.subtype ?? "",
    numberOfGuests: totalGuests,
    address: stay?.address ?? "",
    roomTypes: selectedRoom?.title ?? "",
  };

  return quickFacts
    .filter(
      (fact: VacationPackageTypes.VacationPackageQuickFact) =>
        fact.icon && fact.name && fact.name.value !== "{checkin} & {checkout}"
    )
    .map(item => {
      return {
        Icon: Icon(item?.icon?.handle ?? "", isDesktop),
        name: item.title ? quickFactsNsT(item.title) : "",
        value: quickFactsNsT(item?.name?.value ?? "", translateOptions),
      };
    });
};

export const constructStaysSearchParams = ({
  tripId,
  occupancies,
  selectedDates,
  requestId,
  ipCountryCode,
}: {
  tripId: string;
  occupancies: StayBookingWidgetTypes.Occupancy[];
  selectedDates: SharedTypes.SelectedDates;
  requestId: string;
  ipCountryCode?: string;
}) => {
  return {
    requestId,
    ...(tripId && { vacationPackageId: tripId }),
    occupancies,
    from: selectedDates?.from ? getFormattedDate(selectedDates?.from, yearMonthDayFormat) : "",
    isMobile: false,
    alpha2CountryCodeOfCustomer: ipCountryCode,
  };
};

export const getSelectedHotelsRooms = memoizeOne(
  (hotels?: VacationPackageTypes.VacationPackageStayProduct[]) => {
    const selectedHotels = hotels?.filter(hotel => hotel.selected);
    return (selectedHotels?.reduce((result, hotel) => {
      const alreadyHasHotel = result.some(resHotel =>
        resHotel.groupedWithDays.every(day =>
          hotel.groupedWithDays.some(hotelDay => hotelDay === day)
        )
      );
      if (alreadyHasHotel) {
        return result;
      }
      const selectedRoomCombination: StayBookingWidgetTypes.RoomCombination[] =
        getHotelSelectedRoomCombination(hotel.roomCombinations);

      return [
        ...result,
        {
          productId: hotel.productId,
          day: hotel.day,
          groupedWithDays: hotel.groupedWithDays,
          title: selectedRoomCombination?.[0]?.title ?? "",
          fromPrice: selectedRoomCombination?.[0]?.availabilities?.[0].priceObject?.price ?? 0,
          dateCheckingIn: hotel.dateCheckingIn || "",
          dateCheckingOut: hotel.dateCheckingOut || "",
          roomCombinations: hotel.roomCombinations,
        },
      ];
    }, [] as VacationPackageTypes.SelectedVPStaysRoomType[]) ??
      emptyArray) as VacationPackageTypes.SelectedVPStaysRoomType[];
  }
);

export const getUpdatedSelectedHotelsRooms = memoizeOne(
  (
    day: number,
    productId: number | string,
    roomCombinationId: string,
    availabilityId: string,
    hotels: VacationPackageTypes.SelectedVPStaysRoomType[]
  ) =>
    hotels.map(hotel => {
      const isSelectedHotel =
        hotel.productId === productId && hotel.groupedWithDays.some(date => date === day);
      if (!isSelectedHotel) {
        return hotel;
      }
      return {
        ...hotel,
        roomCombinations: hotel.roomCombinations.map(roomComb => {
          return {
            ...roomComb,
            isSelected: roomComb.roomCombinationId === roomCombinationId,
            availabilities: roomComb.availabilities.map(availability => ({
              ...availability,
              isSelected: availability.availabilityId === availabilityId,
            })),
          };
        }),
      };
    })
);

export const getNewSelectedHotels = memoizeOne(
  (
    groupedDays: number[],
    productId: number | string,
    hotels: VacationPackageTypes.VacationPackageStayProduct[]
  ): VacationPackageTypes.VacationPackageStayProduct[] =>
    hotels.map(hotel => {
      const isSelected = groupedDays.some(day => day === Number(hotel.day))
        ? hotel.productId === Number(productId)
        : hotel.selected;
      return {
        ...hotel,
        selected: isSelected,
        vpPrice: undefined,
      };
    })
);

export const constructVacationDateTo = (
  numberOfDays: number,
  queryDateFrom?: Date
): Date | undefined => {
  if (queryDateFrom && numberOfDays > 1) {
    return addDays(queryDateFrom, numberOfDays - 1);
  }

  return queryDateFrom;
};

export const constructCheapestOrNearestDates = (
  nearestDateFallback: Date,
  vacationLengthInDays: number,
  queryCheapestDate?: VacationPackageTypes.QueryVacationPackageContent["cheapestMonth"]
): SharedTypes.SelectedDates => {
  const cheapestDate = queryCheapestDate ? new Date(queryCheapestDate) : new Date();

  const selectedCheapestOrDefaultDate =
    cheapestDate.valueOf() <= Date.now() ? nearestDateFallback : cheapestDate;

  return {
    from: selectedCheapestOrDefaultDate,
    to: constructVacationDateTo(vacationLengthInDays, selectedCheapestOrDefaultDate),
  };
};

export const getVPModalProductId = (day: number, productId: string | number = "") =>
  `${day}-${String(productId)}`;

export const findSelectedStayByDay = memoizeOneObj(
  ({
    dayNumber,
    stayProducts,
    selectedHotelsRooms,
  }: {
    dayNumber: number;
    stayProducts: VacationPackageTypes.VacationPackageStayProduct[];
    selectedHotelsRooms: VacationPackageTypes.SelectedVPStaysRoomType[];
  }) => {
    const selectedStayIdByDay = selectedHotelsRooms.find(stay =>
      stay.groupedWithDays.some(day => day === dayNumber)
    );

    return (
      selectedStayIdByDay &&
      stayProducts.find(stay => stay.productId === selectedStayIdByDay.productId)
    );
  }
);

// TODO: add tests
export const findSelectedToursByDay = memoizeOneObj(
  ({
    dayNumber,
    tourProducts,
    selectedTourProductIds,
  }: {
    dayNumber: number;
    tourProducts: SharedTypes.Product[];
    selectedTourProductIds?: VacationPackageTypes.SelectedToursProductIds[];
  }): SharedTypes.Product[] => {
    const selectedToursIdsByDay = selectedTourProductIds?.filter(tour => tour.day === dayNumber);

    return selectedToursIdsByDay?.length
      ? tourProducts.filter(tour =>
          selectedToursIdsByDay.some(selectedTour => selectedTour.productId === String(tour.id))
        )
      : (emptyArray as never as SharedTypes.Product[]);
  }
);

export const constructVPTourResults = (
  days: VacationPackageTypes.VPToursQueryResult["vacationPackageTourSearch"]["days"],
  t: TFunction,
  queryParams?: string,
  isDesktop?: boolean
): VacationPackageTypes.ToursSearchResult => {
  return days.map(({ dayNumber, tours }) => {
    // while re-using existing Tours constructor, we need to adjust types
    const GTESearchToursQuery: GTETourSearchTypes.QueryTour[] = tours.map(tour => {
      const GTESearchTour = {
        ...tour,
        name: tour.name || "",
        linkUrl: tour.linkUrl || "",
        description: tour.description || "",
        image: tour.image || defaultTourSEOImage,
        reviewCount: tour.reviewCount || 0,
        valuePropsList: tour.valuePropsList ?? {
          valueProps: emptyArray as never as GTETourSearchTypes.QueryValueProp[],
        },
        quickFactVariables: tour.quickFactVariables || {},
        quickFactList: {
          quickfacts:
            tour.quickFactList?.quickfacts ??
            (emptyArray as never as GTETourSearchTypes.Quickfact[]),
        },
      };
      // TODO maybe add quickFacts utilizing tour.timeFrom / tour.timeTo
      return GTESearchTour;
    });
    const tourSearchResults = constructGTETourSearchResults(
      GTESearchToursQuery,
      t,
      queryParams,
      isDesktop
    );

    return { dayNumber, tours: tourSearchResults };
  });
};

export const getVacationPackageDatesWithDefault = memoizeOneObj(
  ({
    dateFrom,
    dateTo,
    vacationLength,
    cheapestMonth,
  }: SharedTypes.SelectedDatesQuery & {
    vacationLength: number;
    cheapestMonth?: VacationPackageTypes.QueryVacationPackageContent["cheapestMonth"];
  }) => {
    const nextSevenDaysFromToday = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return addDays(today, 7);
    };
    const cheapestOrDefaultNearestDates = constructCheapestOrNearestDates(
      nextSevenDaysFromToday(),
      vacationLength,
      cheapestMonth
    );
    const lsDates = getAdjustedDatesInLocalStorage();
    const queryDates = constructSelectedDatesFromQuery({
      dateFrom,
      dateTo,
    });
    const existingFrom = queryDates.from ?? lsDates.from ?? cheapestOrDefaultNearestDates.from;
    const existingTo =
      constructVacationDateTo(vacationLength, queryDates.from) ??
      constructVacationDateTo(vacationLength, lsDates.from) ??
      cheapestOrDefaultNearestDates.to;
    return normaliseDates({ from: existingFrom, to: existingTo }, true);
  }
);

export const getMaxMinDate = () => {
  const currentDate = new Date();
  const maxDate = subWeeks(addYears(currentDate, 1), 1);

  return {
    minDate: currentDate,
    maxDate,
  };
};

export const constructStaysSelectedData = (
  products: VacationPackageTypes.VacationPackageStayProduct[]
) => {
  const selectedHotelsRooms = getSelectedHotelsRooms(products);
  return selectedHotelsRooms;
};

export const getCombination = (bag: FlightTypes.Baggage) => {
  const { bagCombination } = bag;
  const combinationArr = bagCombination.map(bagType => {
    return { category: bagType.category, count: bagType.count };
  });

  return combinationArr;
};

export const getPassengerSelectedBaggage = (bags?: FlightTypes.BagTypes) => {
  const fallBackIncludedAndPaid = {
    includedCombination: [] as { category: string; count: number }[],
    paidCombination: [] as { category: string; count: number }[],
  };
  const handBags = bags?.handBags
    ? bags.handBags
        .filter(bag => bag.isSelected)
        .reduce((selectedHandbags, handbag) => {
          if (handbag.isIncluded) {
            return {
              includedCombination: [
                ...selectedHandbags.includedCombination,
                ...getCombination(handbag),
              ],
              paidCombination: selectedHandbags.paidCombination,
            };
          }
          return {
            includedCombination: selectedHandbags.includedCombination,
            paidCombination: [...selectedHandbags.paidCombination, ...getCombination(handbag)],
          };
        }, fallBackIncludedAndPaid)
    : fallBackIncludedAndPaid;

  const holdBags = bags?.holdBags
    ? bags.holdBags
        .filter(bag => bag.isSelected && bag.id !== NO_CHECKED_BAGGAGE_ID)
        .reduce((selectedHoldbags, holdbag) => {
          if (holdbag.isIncluded) {
            return {
              includedCombination: [
                ...selectedHoldbags.includedCombination,
                ...getCombination(holdbag),
              ],
              paidCombination: selectedHoldbags.paidCombination,
            };
          }
          return {
            includedCombination: selectedHoldbags.includedCombination,
            paidCombination: [...selectedHoldbags.paidCombination, ...getCombination(holdbag)],
          };
        }, fallBackIncludedAndPaid)
    : fallBackIncludedAndPaid;
  return {
    includedCombination: [...handBags.includedCombination, ...holdBags.includedCombination],
    paidCombination: [...handBags.paidCombination, ...holdBags.paidCombination],
  };
};

export const getAllSelectedBaggage = (passengers: FlightTypes.PassengerDetails[]) =>
  passengers.reduce(
    (totalbags, passenger) => {
      const passengerBags = getPassengerSelectedBaggage(passenger.bags);
      return {
        includedCombination: [
          ...totalbags.includedCombination,
          ...passengerBags.includedCombination,
        ],
        paidCombination: [...totalbags.paidCombination, ...passengerBags.paidCombination],
      };
    },
    {
      includedCombination: [] as { category: string; count: number }[],
      paidCombination: [] as { category: string; count: number }[],
    }
  );

const getBagTranslations = (bagType: BagType, count: number, t: TFunction) => {
  switch (bagType) {
    case BagType.PERSONAL_ITEM:
      return t("{numberOfBags} personal items", {
        numberOfBags: count,
      });
    case BagType.CABINBAG:
      return t("{numberOfBags} cabin bags", {
        numberOfBags: count,
      });
    case BagType.CARRYON:
      return t("{numberOfBags} checked bags", {
        numberOfBags: count,
      });
    default:
      return "";
  }
};

const constructBagText = (array: { category: BagType; count: number }[], t: TFunction) => {
  const textArray: string[] = array.map(bag => {
    const { category, count } = bag;
    return getBagTranslations(category, count, t);
  });
  if (textArray.length > 0) {
    return textArray.join(" & ");
  }
  return t("Bags");
};

export const getBaggageText = (
  inCludedCombination: VacationPackageTypes.BaggageTextObject,
  t: TFunction
) => {
  const convertedObj = Object.entries({
    ...inCludedCombination,
  });
  const array = convertedObj.map(obj => {
    const [cat, count] = obj;
    return {
      category: cat as BagType,
      count,
    };
  });
  const text = constructBagText(array, t);
  return text;
};

export const countBagTypes = (
  bagTypes: {
    category: string;
    count: number;
  }[]
) => {
  const countedObject = bagTypes.reduce((acc: any, val) => {
    const { category, count } = val;
    return {
      ...acc,
      [category]: count + (acc[category] || 0),
    };
  }, {});
  return countedObject;
};

// TODO: add tests for baggage functions.
export const constructBaggageText = (passengers: FlightTypes.PassengerDetails[], t: TFunction) => {
  const queryBaggage = getAllSelectedBaggage(passengers);
  const { includedCombination, paidCombination } = queryBaggage;
  const combined = includedCombination.concat(paidCombination);

  const allBags = countBagTypes(combined);
  const baggageText = getBaggageText(allBags, t);

  return baggageText ?? t("No bags included");
};

export const getAdminLinks = (
  id: string,
  tripId: string,
  locale: string,
  tripDatabaseId?: string
) => [
  {
    name: "View page in GraphCMS",
    url: `https://app.hygraph.com/98897ab275b1430bab08d8343fa465d4/master/content/c0af3697444242bc8f90ddc36b5619ea/view/44ba8e4a2aa4458da7890999de18a67e/${id}`,
  },
  {
    name: "Open in NLG debug tool",
    url: `https://app.appsmith.com/app/nlg-debug-tool/page1-63fdfceecba7d14432258cc3?tripId=${tripId}&locale=${locale}`,
  },
  ...(tripDatabaseId
    ? [
        {
          name: "Open in Trip Visualizer",
          url: `https://visualizer.travelplan.gcptravelshift.com/?left_trip_database_id=${tripDatabaseId}`,
        },
      ]
    : []),
];

export const getAdminGearInfoText = (
  vpContentResult: VacationPackageTypes.VacationPackageResult
) => [
  `Product ID: ${vpContentResult.id}`,
  `Trip ID: ${vpContentResult.tripId}`,
  `Trip-Database-ID: ${vpContentResult.tripDatabaseId}`,
  `Variation-ID: ${vpContentResult.variationId}`,
  `Envelope-ID: ${vpContentResult.envelopeId}`,
];

export const getVPQueryParamsString = (params: VPQueryParamsType) =>
  `?${stringify(encodeQueryParams(VPQueryParamScheme, params))}`;

const getVPUrlwithActiveLocal = (vpSearchBaseUrl: string, country: string) => {
  const vpSearchUrlSwapLocal = vpSearchBaseUrl.split("/").join(`/${country}/`);
  return `/${vpSearchUrlSwapLocal}`;
};

export const getVPLandingUrl = (
  vpSearchBaseUrl: string,
  marketplaceUrl: string,
  router: NextRouter,
  queryParams = ""
) => {
  const match = routes.match(router.asPath, marketplaceUrl);
  if (!match?.params) return `/${vpSearchBaseUrl}`;
  const { country, section } = match.params;
  return `${
    !vpSearchBaseUrl.includes("/")
      ? `/${country ? `${country}/` : ""}${vpSearchBaseUrl}`
      : getVPUrlwithActiveLocal(vpSearchBaseUrl, country)
  }${section ? `/${section}` : ""}${queryParams}`;
};

export const getMissingDaysString = (
  vacationPackageDays: VacationPackageTypes.VacationPackageDay[],
  selectedHotelsRooms: VacationPackageTypes.SelectedVPStaysRoomType[]
) =>
  vacationPackageDays
    .reduce((acc, _day, i) => {
      const dayNumber = i + 1;
      if (dayNumber === vacationPackageDays.length) return acc;
      if (!selectedHotelsRooms.some(selectedRoom => selectedRoom.day === dayNumber)) {
        return `${acc}, ${dayNumber}`;
      }

      return acc;
    }, "")
    .replace(/^, /, "");
