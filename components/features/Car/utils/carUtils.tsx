import React from "react";
import { SerializedStyles } from "@emotion/core";
import { pipe } from "fp-ts/lib/pipeable";
import { map, getOrElse, fromNullable } from "fp-ts/lib/Option";
import { range } from "fp-ts/lib/Array";
import { parse } from "date-fns";
import { encodeQueryParams, stringify, StringParam } from "use-query-params";

import { emptyArray } from "utils/constants";
import {
  constructCarnectImage,
  constructProductSpecs,
  getCarsSubtypeImage,
  getPickupQuickfact,
} from "components/features/CarSearchPage/utils/carSearchUtils";
import { getIcon, ProductPropId } from "components/ui/utils/uiUtils";
import { getPathWithoutSlugAndQueryParams } from "utils/routerUtils";
import BestPriceIcon from "components/icons/check-shield.svg";
import CancellationIcon from "components/icons/file-text-remove.svg";
import CustomerSupportIcon from "components/icons/phone-support.svg";
import CarGPSIcon from "components/icons/car-gps.svg";
import ExtraDriverIcon from "components/icons/extra-driver.svg";
import CarCheckIcon from "components/icons/car-actions-check-1.svg";
import AirportIcon from "components/icons/airport.svg";
import CarProtectionIcon from "components/icons/car-protection.svg";
import MinimumAgeIconRound from "components/ui/Information/MinimumAgeIconRound";
import { constructImages, constructImage } from "utils/globalUtils";
import CarIcon from "components/icons/car.svg";
import TravellersIcon from "components/icons/travellers.svg";
import BagIcon from "components/icons/bag-handle.svg";
import CarGearIcon from "components/icons/car-dashboard-gear.svg";
import CarGasIcon from "components/icons/gas-load.svg";
import RoadIcon from "components/icons/road-straight.svg";
import WalletIcon from "components/icons/money-wallet-open.svg";
import CarSearchIcon from "components/icons/car-actions-search-1.svg";
import RoadWoodsIcon from "components/icons/road-woods.svg";
import SnowIcon from "components/icons/temperature-snowflake-1.svg";
import NotesIcon from "components/icons/notes-checklist-flip.svg";
import CheckShieldIcon from "components/icons/check-shield-alternate.svg";
import GravelProtectionIcon from "components/icons/gravel-protection.svg";
import WifiIcon from "components/icons/wifi.svg";
import ChildSeatIcon from "components/icons/child-seat.svg";
import {
  getFuelPolicyString,
  getCarCategoryValue,
  getTranslationByKey,
  constructCarProductUrl,
  constructHeadline,
  mapCarProviderToId,
  getCarnectKey,
  getCoverageAmount,
} from "utils/sharedCarUtils";
import {
  CarProvider,
  PageType,
  Marketplace,
  SupportedLanguages,
  CarSubTypeId,
  MapPointType,
  SharedFilterQueryParams,
  CarFilterQueryEnum,
} from "types/enums";
import { urlToRelative } from "utils/apiUtils";
import {
  getDriverAgeFromLocalStorage,
  getDriverCountryFromLocalStorage,
} from "utils/localStorageUtils";
import {
  getWeekdays,
  getFormattedDate,
  yearMonthDayFormatWithTime,
  yearMonthDayFormat,
  hourMinuteFormat,
  fromTimestamp,
  toDateWithoutTimezone,
  constructSameDateInUTC,
} from "utils/dateUtils";
import { getClientSideUrl } from "utils/helperUtils";
import { convertImage } from "utils/imageUtils";
import { getMapZoom } from "components/ui/Map/utils/mapUtils";

const MILEAGE_EXTRA_OPTION_ID = "416";

export const constructQuickFacts = (
  isGTI: boolean,
  t: TFunction,
  carnectT: TFunction,
  {
    category,
    passengerQuantity,
    bagQuantity,
    manualTransmission,
    fuelPolicy,
    milage,
    depositRequired,
    doors,
    highlandCapabilities,
    airConIncluded,
    minAge,
    model,
  }: SharedCarTypes.QueryQuickFacts,
  included: CarTypes.QueryIncluded[],
  isCarnect: boolean,
  convertCurrency: (value: number) => number,
  currencyCode: string,
  deposit?: CarTypes.Deposit,
  locationType?: string | null
) => {
  const depositString = depositRequired ? "Required" : "Not Required";
  const highlandCapabilitiesString = highlandCapabilities ? "Yes" : "No";
  const airconString = airConIncluded ? "Included" : "Not Included";
  const transmissionType = manualTransmission ? "Manual" : "Automatic";
  const kmInclusive =
    included.find(i => i.includedId === MILEAGE_EXTRA_OPTION_ID)?.name ?? "Limited";
  const milageString = milage.unlimited ? "Unlimited" : kmInclusive;
  const theftProtection = isCarnect
    ? included.find(i => i.includedId === "TP" && i.coverageAmount > 0)
    : undefined;
  const collisionDamageWaiver = isCarnect
    ? included.find(i => i.includedId === "CDW" && i.coverageAmount > 0)
    : undefined;
  const pickup = getPickupQuickfact(t, locationType)[0];

  return [
    {
      id: "category",
      label: "Category",
      value: getCarCategoryValue(category, t),
      Icon: CarIcon,
    },
    {
      id: "numberOfSeats",
      label: "People",
      value: {
        key: "Seats {numberOfSeats} people",
        options: {
          numberOfSeats: passengerQuantity,
        },
      } as SharedTypes.TranslationKey,
      Icon: TravellersIcon,
      translateValue: true,
    },
    {
      id: "numberOfBags",
      label: "Large bags",
      value: {
        key: "{numberOfBags} bags",
        options: {
          numberOfBags: bagQuantity,
        },
      } as SharedTypes.TranslationKey,
      Icon: BagIcon,
      translateValue: true,
    },
    {
      id: "transmission",
      label: "Transmission",
      value: transmissionType,
      Icon: CarGearIcon,
      translateValue: true,
    },
    ...(fuelPolicy !== null
      ? [
          {
            id: "fuelPolicy",
            label: "Fuel policy",
            value: getFuelPolicyString(fuelPolicy),
            Icon: CarGasIcon,
            translateValue: true,
          },
        ]
      : []),
    {
      id: "milage",
      label: "Milage",
      value: milageString,
      Icon: RoadIcon,
      translateValue: true,
    },
    ...(pickup
      ? [
          {
            id: pickup.name,
            label: pickup.name,
            value: pickup.value,
            Icon: pickup.Icon,
            translateValue: false,
          },
        ]
      : emptyArray),
    ...(theftProtection
      ? [
          {
            id: "coverageAmount",
            label: theftProtection.name,
            value: {
              key: "{coverageAmount} {coverageCurrency} Excess",
              options: {
                coverageAmount: getCoverageAmount(
                  isCarnect,
                  currencyCode,
                  convertCurrency,
                  theftProtection.coverageAmount
                ),
                coverageCurrency: currencyCode,
              },
            } as SharedTypes.TranslationKey,
            translateValue: true,
            Icon: CarProtectionIcon,
          },
        ]
      : []),
    ...(collisionDamageWaiver
      ? [
          {
            id: "collisionDamageWaiver",
            label: collisionDamageWaiver.name,
            value: {
              key: "{coverageAmount} {coverageCurrency} Excess",
              options: {
                coverageAmount: getCoverageAmount(
                  isCarnect,
                  currencyCode,
                  convertCurrency,
                  collisionDamageWaiver.coverageAmount
                ),
                coverageCurrency: currencyCode,
              },
            } as SharedTypes.TranslationKey,
            translateValue: true,
            Icon: CarSearchIcon,
          },
        ]
      : []),
    {
      id: depositString,
      label: "Deposit",
      value: depositString,
      Icon: WalletIcon,
      description:
        isCarnect && deposit && deposit.translationKeys.keys[0]
          ? getTranslationByKey(
              deposit.translationKeys.keys[0],
              carnectT,
              convertCurrency,
              currencyCode,
              isCarnect
            )
          : deposit?.description,
      translateValue: true,
    },
    ...(model !== null && model !== 0
      ? [
          {
            id: "year",
            label: "Year",
            value: model.toString(),
            Icon: CarSearchIcon,
          },
        ]
      : []),
    ...(doors !== 0
      ? [
          {
            id: "numberOfDoors",
            label: "Doors",
            value: {
              key: "{numberOfDoors} doors",
              options: {
                numberOfDoors: doors,
              },
            } as SharedTypes.TranslationKey,
            Icon: CarSearchIcon,
            translateValue: true,
          },
        ]
      : []),
    ...(isGTI
      ? [
          {
            id: "highlandCapabilities",
            label: "Highland Capabilities",
            value: highlandCapabilitiesString,
            Icon: RoadWoodsIcon,
            translateValue: true,
          },
        ]
      : []),
    {
      id: "airCon",
      label: "Air con",
      value: airconString,
      Icon: SnowIcon,
      translateValue: true,
    },
    ...(minAge > 0
      ? [
          {
            id: "minAge",
            label: "Minimum age of driver",
            value: {
              key: "{minAge} years",
              options: { minAge: `${minAge}` },
            },
            Icon: (css: SerializedStyles) => <MinimumAgeIconRound value={`${minAge}`} css={css} />,
            translateValue: true,
          },
        ]
      : []),
  ];
};

export const constructCarCover = ({
  name,
  queryImages,
  fallBackImgId,
  isCarnect = false,
}: {
  name: string;
  queryImages: QueryImage[];
  fallBackImgId?: CarSubTypeId;
  isCarnect?: boolean;
}): CarTypes.Cover => ({
  name,
  images: isCarnect ? constructCarnectImage(queryImages) : constructImages(queryImages),
  fallBackImg: getCarsSubtypeImage(fallBackImgId),
});

export const getExtraIconFromId = (id: string) => {
  switch (id) {
    case "1":
    case "13":
      return CarGPSIcon;
    case "222":
    case "5":
      return ExtraDriverIcon;
    case "38":
    case "55":
      return WifiIcon;
    case "6":
    case "7":
    case "8":
      return ChildSeatIcon;
    default:
      return CarSearchIcon;
  }
};

const getInsuranceIconFromId = (id: string) => {
  switch (id) {
    case "CDW":
      return CarCheckIcon;
    case "TP":
      return CarProtectionIcon;
    case "UNL":
      return RoadIcon;
    case "SCDW":
      return NotesIcon;
    case "GP":
      return GravelProtectionIcon;
    default:
      return CheckShieldIcon;
  }
};
export const getIconFromId = (id: string, type: string) => {
  switch (type) {
    case "EXTRA":
      return getExtraIconFromId(id);
    default:
      return getInsuranceIconFromId(id);
  }
};

const ALL_WEEK_DAYS_COUNT = 7;

export const constructIncludedItems = (
  includedItems: CarTypes.QueryIncluded[],
  t: TFunction,
  carT: TFunction,
  convertCurrency: (value: number) => number,
  currencyCode: string,
  isCarnect: boolean,
  pickupLocationDetails: CarTypes.QueryLocationsDetails["pickup"],
  dropoffLocationDetails: CarTypes.QueryLocationsDetails["dropoff"]
) => {
  const canPickupDropoffInAirport =
    pickupLocationDetails.isAirportPickup && dropoffLocationDetails.isAirportDropoff;

  const isProviderWorks24hAllWeek =
    [...pickupLocationDetails.openingHours, ...dropoffLocationDetails.openingHours].every(
      openingHour => openingHour.isOpen && openingHour.openFrom === openingHour.openTo
    ) &&
    pickupLocationDetails.openingHours.length === ALL_WEEK_DAYS_COUNT &&
    dropoffLocationDetails.openingHours.length === ALL_WEEK_DAYS_COUNT;

  const canPickupDropoffAnytime = {
    id: "airport-pickup-dropoff",
    Icon: AirportIcon,
    title: carT("Airport pick-up & drop-off"),
    description: carT("You can receive and return this car to the airport at any time."),
    isClickable: false,
    details: undefined,
  };

  const displayedIncludedItems = includedItems.map(
    ({ code, type, name, description, details, translationKeys }, index) => {
      const carnectNameKey = getCarnectKey(translationKeys, "name");
      const carnectDescKey = getCarnectKey(translationKeys, "desc");
      const transDescription =
        carnectDescKey &&
        getTranslationByKey(carnectDescKey, t, convertCurrency, currencyCode, isCarnect);
      return {
        id: index.toString(),
        Icon: getIconFromId(code, type),
        title:
          carnectNameKey && isCarnect
            ? getTranslationByKey(carnectNameKey, t, convertCurrency, currencyCode, isCarnect)
            : carT(name),
        description:
          carnectDescKey && isCarnect && carnectDescKey.key !== transDescription
            ? transDescription
            : description,
        isClickable: Boolean(description) || details !== undefined,
        details: details ? details[0].charge.description : undefined,
      };
    }
  );

  return canPickupDropoffInAirport && isProviderWorks24hAllWeek
    ? [...displayedIncludedItems, canPickupDropoffAnytime]
    : displayedIncludedItems;
};

export const constructAvailableExtrasItems = (
  availableInsurancesExtrasItems: CarTypes.QueryExtra[],
  t: TFunction,
  carT: TFunction,
  convertCurrency: (value: number) => number,
  currencyCode: string,
  isCarnect: boolean
) =>
  availableInsurancesExtrasItems.map(({ id, name, type, description, translationKeys }) => {
    const carnectNameKey = getCarnectKey(translationKeys, "name");
    const carnectDescKey = getCarnectKey(translationKeys, "desc");
    return {
      id: id.toString(),
      Icon: getIconFromId(id.toString(), type),
      title:
        carnectNameKey && isCarnect
          ? getTranslationByKey(carnectNameKey, t, convertCurrency, currencyCode, isCarnect)
          : carT(name),
      description:
        carnectDescKey && isCarnect
          ? getTranslationByKey(carnectDescKey, t, convertCurrency, currencyCode, isCarnect)
          : carT(description),
      isClickable: Boolean(description),
    };
  });

export const mergeOverlappingTimes = (dates: CarTypes.QueryOpeningHour[]) => {
  const adjustedSortedDates = dates.reduce((accumulator: CarTypes.QueryOpeningHour[], curr) => {
    if (accumulator.length === 0) {
      return [curr];
    }
    const prev = accumulator[accumulator.length - 1];
    if (prev && curr.openTo <= prev.openTo) {
      return accumulator;
    }
    if (prev && curr.openFrom <= prev.openTo) {
      return [{ ...prev, openFrom: prev.openFrom, openTo: curr.openTo }];
    }
    return [...accumulator, curr];
  }, [] as CarTypes.QueryOpeningHour[]);

  return adjustedSortedDates;
};

export const constructOpeningHours = (
  openingHours: CarTypes.QueryOpeningHour[],
  activeLocale: string,
  t: TFunction
): CarTypes.OpeningHoursOfDay[] => {
  const weekdays = getWeekdays("long", activeLocale);
  const dailyOpeningHours = range(0, 6).map(i => {
    const openingHoursOfDay = openingHours
      .filter(date => date.dayOfWeek === i)
      .sort((a, b) => (a.openFrom <= b.openFrom ? -1 : 1));
    if (openingHoursOfDay.length === 0) {
      return {
        day: weekdays[i],
        dayOfWeek: i,
        isOpen: false,
        openingHours: [t("Closed")],
      };
    }
    const openingHoursOfDayAdjusted = mergeOverlappingTimes(openingHoursOfDay);
    // eslint-disable-next-line functional/immutable-data
    return {
      day: weekdays[i],
      isOpen: true,
      dayOfWeek: i,
      openingHours: openingHoursOfDayAdjusted.map((day: CarTypes.QueryOpeningHour) => {
        return `${day.openFrom} - ${day.openTo}`;
      }),
    };
  });

  return [...dailyOpeningHours.slice(1), dailyOpeningHours[0]];
};

const constructInclusionsItem = (
  carnectT: TFunction,
  item: CarTypes.QueryInsuranceInclusion,
  isCarnect: boolean
): CarTypes.InsuranceInclusion => {
  const titleKey = getCarnectKey(item.translationKeys, "title");
  const contentKey = getCarnectKey(item.translationKeys, "content");
  return {
    title: titleKey && isCarnect ? getTranslationByKey(titleKey, carnectT) : item.title,
    content: contentKey && isCarnect ? getTranslationByKey(contentKey, carnectT) : item.content,
  };
};

export const constructInsuranceInfo = (
  carnectT: TFunction,
  isCarnect: boolean,
  insuranceInfo?: CarTypes.QueryInsuranceInfo
) => {
  if (!insuranceInfo) return undefined;
  const policyNameKey = getCarnectKey(insuranceInfo.translationKeys, "policyname");
  const descriptionKey = getCarnectKey(insuranceInfo.translationKeys, "description");
  return {
    policyName:
      policyNameKey && isCarnect
        ? getTranslationByKey(policyNameKey, carnectT)
        : insuranceInfo.policyName,
    description:
      descriptionKey && isCarnect
        ? getTranslationByKey(descriptionKey, carnectT)
        : insuranceInfo.description,
    disclaimer: insuranceInfo.disclaimer,
    inclusionsList: insuranceInfo.inclusionsList.map(item =>
      constructInclusionsItem(carnectT, item, isCarnect)
    ),
  };
};

export const constructCarMapData = (
  latitude: number,
  longitude: number,
  locationId: number,
  establishment: CarTypes.CarEstablishment,
  image: QueryImage
) => {
  return {
    id: locationId,
    latitude,
    longitude,
    orm_name: MapPointType.CAR,
    type: MapPointType.CAR,
    title: establishment.name,
    image: convertImage(image),
    reviewTotalCount: establishment.reviewCount,
    reviewTotalScore: Number(establishment.reviewTotalScore),
    isGoogleReview: false,
  };
};

const constructMapData = (
  locationDetails: CarTypes.LocationDetails,
  establishment: CarTypes.CarEstablishment,
  image: QueryImage
) => {
  const { lat, lng, locationId } = locationDetails;
  return {
    latitude: Number(lat),
    longitude: Number(lng),
    location: locationDetails.address,
    zoom: getMapZoom(false, false),
    points: [constructCarMapData(Number(lat), Number(lng), locationId, establishment, image)],
    options: {
      fullscreenControl: false,
      mapTypeControl: false,
      streetViewControl: false,
    },
    isCountryMap: true,
  };
};

export const constructCar = (
  isGTI: boolean,
  t: TFunction,
  carnectT: TFunction,
  carT: TFunction,
  convertCurrency: (value: number) => number,
  currencyCode: string,
  carData?: CarTypes.QueryCarOfferData
): CarTypes.Car => {
  return pipe(
    fromNullable(carData),
    map(({ carOffer }) => {
      const { offer, locationDetails } = carOffer;
      const {
        carInfo,
        included,
        establishment,
        rentalRate,
        provider,
        documents,
        extras,
        quickFacts,
      } = offer;
      const { name, images, orSimilar, vehicleCategory } = carInfo;
      const { discount, deposit } = rentalRate.vehicleCharges;
      const productInformation = documents?.find(
        document => document.type === "ProductInformation"
      );
      const isCarnect = provider === CarProvider.CARNECT;
      const insuranceInformation = constructInsuranceInfo(
        carnectT,
        isCarnect,
        extras.find(item => item.insuranceInfo !== null)?.insuranceInfo ?? undefined
      );

      return {
        establishment: {
          id: establishment.id ?? establishment.vendorId,
          name: establishment.name,
          image: constructImage(establishment.image),
        },
        orSimilar,
        cover: constructCarCover({
          name,
          queryImages: images,
          fallBackImgId: vehicleCategory as CarSubTypeId,
          isCarnect,
        }),
        valuePropositions: isGTI
          ? [
              { Icon: CancellationIcon, title: carT("Free cancellation") },
              {
                Icon: CustomerSupportIcon,
                title: carT("24/7 customer support"),
              },
              { Icon: BestPriceIcon, title: carT("Best price guarantee") },
            ]
          : [
              { Icon: CancellationIcon, title: carT("Free cancellation") },
              { Icon: BestPriceIcon, title: carT("Best price guarantee") },
              {
                Icon: CustomerSupportIcon,
                title: carT("24/7 customer support"),
              },
              {
                Icon: getIcon(ProductPropId.Confirmation),
                title: carT("Instant confirmation"),
              },
            ],
        quickFacts: constructQuickFacts(
          isGTI,
          t,
          carnectT,
          quickFacts,
          included,
          provider.toUpperCase() === CarProvider.CARNECT,
          convertCurrency,
          currencyCode,
          deposit,
          offer.establishment?.pickupLocation?.locationType
        ),
        reviewTotalCount: establishment.reviewCount,
        reviewTotalScore: Number(establishment.reviewTotalScore),
        discountPercent: discount ? Number(discount.percent) : undefined,
        productInformation,
        locationDetails: {
          pickup: {
            ...locationDetails.pickup,
            mapData: constructMapData(locationDetails.pickup, establishment, carInfo.images[0]),
          },
          dropoff: {
            ...locationDetails.dropoff,
            mapData: constructMapData(locationDetails.dropoff, establishment, carInfo.images[0]),
          },
        },
        insuranceInformation,
      } as CarTypes.Car;
    }),
    getOrElse(
      () =>
        ({
          establishment: {
            name: "",
            image: { id: "", url: "" },
          },
          orSimilar: false as boolean,
          cover: { name: "", images: [] as Image[] } as CarTypes.Cover,

          valuePropositions: [] as SharedTypes.ProductProp[],
          quickFacts: [] as SharedTypes.QuickFact[],
          reviewTotalCount: 0,
          reviewTotalScore: 0,
          discountPercent: undefined,
        } as CarTypes.Car)
    )
  );
};

const constructOfferExtras = (
  extras: CarTypes.QueryExtra[],
  carnectT: TFunction,
  isCarnect: boolean
) =>
  extras.map(extra => {
    const nameKey = getCarnectKey(extra.translationKeys, "name");
    const descKey = getCarnectKey(extra.translationKeys, "desc");
    return {
      ...extra,
      name: nameKey && isCarnect ? getTranslationByKey(nameKey, carnectT) : extra.name,
      description:
        descKey && isCarnect ? getTranslationByKey(descKey, carnectT) : extra.description,
    };
  });

const constructOfferIncluded = (
  included: CarTypes.QueryIncluded[],
  carnectT: TFunction,
  isCarnect: boolean
) =>
  included.map(item => {
    const nameKey = getCarnectKey(item.translationKeys, "name");
    const descKey = getCarnectKey(item.translationKeys, "desc");
    return {
      ...item,
      name: nameKey && isCarnect ? getTranslationByKey(nameKey, carnectT) : item.name,
      description: descKey && isCarnect ? getTranslationByKey(descKey, carnectT) : item.description,
    };
  });

export const constructOffer = (
  carnectT: TFunction,
  carT: TFunction,
  convertCurrency: (value: number) => number,
  currencyCode: string,
  carSearchPageUrl: string,
  offerData?: CarTypes.QueryCarOfferData
): { cartLink: string; searchPageUrl: string; carOffer: CarTypes.CarOffer } =>
  pipe(
    fromNullable(offerData),
    map(
      ({
        cartLink,
        carOffer: {
          offer,
          locationDetails: { pickup, dropoff },
          pickupId,
          dropoffId,
          availableLocations,
          title,
        },
      }) => {
        const { included, extras, rentalRate, provider } = offer;
        const { deposit } = rentalRate.vehicleCharges;
        const depositKey = deposit ? getCarnectKey(deposit.translationKeys, "desc") : undefined;
        const isCarnect = provider === CarProvider.CARNECT;
        return {
          cartLink,
          searchPageUrl: carSearchPageUrl,
          carOffer: {
            pickupId,
            availableLocations,
            pickupLocation: pickup.address,
            isAirportPickup: pickup.isAirportPickup,
            isHotelPickup: pickup.isHotelPickup,
            dropoffId,
            dropoffLocation: dropoff.address,
            isAirportDropoff: dropoff.isAirportDropoff,
            isHotelDropoff: dropoff.isHotelDropoff,
            includedItems: constructIncludedItems(
              included,
              carnectT,
              carT,
              convertCurrency,
              currencyCode,
              isCarnect,
              pickup,
              dropoff
            ),
            availableInsurancesItems: constructAvailableExtrasItems(
              extras.filter(({ type }) => type === "INSURANCE"),
              carnectT,
              carT,
              convertCurrency,
              currencyCode,
              isCarnect
            ),
            availableExtrasItems: constructAvailableExtrasItems(
              extras.filter(({ type }) => type === "EXTRA"),
              carnectT,
              carT,
              convertCurrency,
              currencyCode,
              isCarnect
            ),
            extras: constructOfferExtras(extras, carnectT, isCarnect),
            included: constructOfferIncluded(included, carnectT, isCarnect),
            deposit: depositKey
              ? getTranslationByKey(depositKey, carnectT, convertCurrency, currencyCode, isCarnect)
              : carT(deposit?.description ?? ""),
            title,
            pickupName: pickup?.name,
            dropoffName: dropoff?.name,
          },
        };
      }
    ),
    getOrElse(() => ({
      cartLink: "",
      searchPageUrl: "",
      carOffer: {
        pickupId: 0,
        pickupLocation: "",
        isAirportPickup: false as boolean,
        isHotelPickup: false as boolean,
        dropoffId: 0,
        dropoffLocation: "",
        isAirportDropoff: false as boolean,
        isHotelDropoff: false as boolean,
        availableInsurancesItems: [] as SharedTypes.Icon[],
        availableExtrasItems: [] as SharedTypes.Icon[],
        includedItems: [] as SharedTypes.Icon[],
        extras: [] as CarTypes.QueryExtra[],
        included: [] as CarTypes.QueryIncluded[],
      },
    }))
  );

export const constructSimilarCars = (
  selectedInfo: {
    selectedDates: SharedTypes.SelectedDates;
    pickupId: string;
    dropoffId: string;
    dropoffLocationName: string;
    pickupLocationName: string;
  },
  t: TFunction,
  marketplace: Marketplace,
  carProductUrl: string,
  convertCurrency: (value: number) => number,
  currencyCode: string,
  activeLocale: SupportedLanguages,
  cars?: CarSearchTypes.QueryCarSearch[]
): SharedTypes.SimilarProduct[] => {
  return cars
    ? cars.map((car: CarSearchTypes.QueryCarSearch) => {
        const { from } = selectedInfo.selectedDates;
        const { to } = selectedInfo.selectedDates;
        const linkUrl = constructCarProductUrl(
          carProductUrl,
          car.idContext,
          selectedInfo,
          car.provider.toUpperCase() as CarProvider,
          car.quickFacts.category,
          car.carInfo.name,
          getDriverAgeFromLocalStorage() || 45,
          getDriverCountryFromLocalStorage() || undefined
        );
        const carName = constructHeadline(t, car.carInfo.name, activeLocale);

        return {
          id: String(car.idContext),
          fallBackImg: getCarsSubtypeImage(car.carInfo.vehicleCategory as CarSubTypeId, true),
          name: carName,
          lowestPrice: car.rentalRate.vehicleCharges.basePrice.amount,
          image: constructImages(
            car.carInfo.images.map(image => ({
              ...image,
              id: image.imageId,
            }))
          )[0],
          clientRoute: {
            query: {
              carId: String(car.idContext),
              from: from ? getFormattedDate(from, yearMonthDayFormatWithTime) : undefined,
              to: to ? getFormattedDate(to, yearMonthDayFormatWithTime) : undefined,
              pickup_id: selectedInfo.pickupId,
              dropoff_id: selectedInfo.dropoffId,
              title: carName,
              provider: String(mapCarProviderToId(car.provider.toUpperCase() as CarProvider)),
            },
            route: `/${PageType.CAR}`,
            as: urlToRelative(linkUrl),
          },
          linkUrl,
          productProps: [],
          productSpecs: constructProductSpecs(
            marketplace === Marketplace.GUIDE_TO_ICELAND,
            t,
            car.quickFacts,
            car.provider === CarProvider.CARNECT ? car.included : [],
            convertCurrency,
            currencyCode,
            car.vendor?.pickupLocation?.locationType
          ).slice(0, 4),
          ribbonText: car.rentalRate?.vehicleCharges?.discount
            ? t("{discountPercentage}% discount", {
                discountPercentage: car.rentalRate?.vehicleCharges?.discount.percent,
              })
            : undefined,
        };
      })
    : [];
};

export const getCarProductUrl = (
  marketplace: Marketplace,
  activeLocale: SupportedLanguages,
  carProductBaseUrl?: string
) => {
  const gteCarProductUrl = getClientSideUrl(PageType.GTE_CAR_SEARCH, activeLocale, marketplace);
  const productUrl = carProductBaseUrl || "car-rental";
  return marketplace === Marketplace.GUIDE_TO_EUROPE
    ? `/${gteCarProductUrl}/details`
    : `/${productUrl}/search-results/book`;
};

export const getCarMetadataUri = (path: string) =>
  getPathWithoutSlugAndQueryParams(path).split("/").slice(0, -2).join("/");

export const getCarSearchUrl = (
  marketplace: Marketplace,
  activeLocale: SupportedLanguages,
  carSearchBaseUrl?: string
) => {
  const gteCarSearchUrl = getClientSideUrl(PageType.GTE_CAR_SEARCH, activeLocale, marketplace);
  const carSearchUrl = carSearchBaseUrl || "car-rentals";
  return marketplace === Marketplace.GUIDE_TO_EUROPE ? `/${gteCarSearchUrl}` : `/${carSearchUrl}`;
};

export const constructCarRentalCartInput = ({
  id,
  from,
  to,
  pickupId,
  dropoffId,
  queryPickupId,
  queryDropoffId,
  driverAge,
  driverCountryCode,
  pickupSpecify,
  dropoffSpecify,
  extras,
  selectedExtras,
  insurances,
  selectedInsurances,
  provider,
  cartId,
}: CarTypes.AddCarToCartData): CarTypes.MutationAddCarToCarInput => ({
  id: provider !== CarProvider.CARNECT ? Number(id) : null,
  carnectOfferId: provider === CarProvider.CARNECT ? id : null,
  carPickupDate: getFormattedDate(from, yearMonthDayFormat),
  carPickupTime: getFormattedDate(from, hourMinuteFormat),
  carPickupId: pickupId,
  carPickupSpecificValue: pickupSpecify,
  carDropoffDate: getFormattedDate(to, yearMonthDayFormat),
  carDropoffTime: getFormattedDate(to, hourMinuteFormat),
  carDropoffId: dropoffId,
  carDropoffSpecificValue: dropoffSpecify,
  driverAge,
  driverCountryCode,
  externalPickupId: queryPickupId,
  externalDropoffId: queryDropoffId,
  cartId,
  extras: [
    ...extras
      .filter(extraOption => extraOption.included)
      .map(extraOption => ({
        id: Number(extraOption.id),
        selected_value: extraOption.max.toString(),
        questionAnswers: [],
      })),
    ...selectedExtras
      .filter(extra => extra.count > 0)
      .map(extra => ({
        id: Number(extra.id),
        selected_value: extra.count.toString(),
        questionAnswers: extra.questionAnswers,
      })),
  ],
  insurances: [
    ...insurances.filter(insurance => insurance.included).map(insurance => insurance.id),
    ...selectedInsurances.filter(insurance => insurance.selected).map(insurance => insurance.id),
  ],
});

export const constructGTECarRentalCartInput = ({
  id,
  selectedExtras,
  selectedInsurances,
  driverAge,
  driverCountryCode,
}: CarTypes.AddCarGTEToCartData) => ({
  offerId: id,
  extras: selectedExtras
    .filter(extra => extra.count > 0)
    .map(extra => ({
      id: Number(extra.id),
      count: extra.count,
      questionAnswers: extra.questionAnswers,
    })),
  insurances: selectedInsurances
    .filter(insurance => insurance.selected)
    .map(insurance => insurance.id),
  driverAge: driverAge ? Number(driverAge) : 45,
  driverCountryCode: driverCountryCode || "DE",
});

export const getCarOfferDate = ({
  queryDate,
  queryTimestamp,
  fallbackISODate,
}: {
  queryDate?: string;
  queryTimestamp?: string;
  fallbackISODate?: SharedTypes.iso8601DateTime;
}): {
  clientDate?: Date;
  adjustedISODate?: SharedTypes.iso8601DateTime;
} => {
  let clientDate;
  if (queryDate) {
    clientDate = parse(queryDate, yearMonthDayFormatWithTime, new Date());
    return {
      clientDate,
      // on front we receive a date like "2023-02-20 10:00"
      // this is then parsed in local date, considering 10:00 will still be 10:00 in the user's timezone
      // we have to simulate the UTC ISOString date to contain the same timing as the original
      // so we always send the correct time to the backend within similar cars
      adjustedISODate: constructSameDateInUTC(clientDate).toISOString(),
    };
  }

  if (queryTimestamp) {
    clientDate = fromTimestamp(Number(queryTimestamp));
    return {
      clientDate,
      adjustedISODate: clientDate.toISOString(),
    };
  }

  if (fallbackISODate) {
    clientDate = toDateWithoutTimezone(new Date(fallbackISODate as string));
    return {
      clientDate,
      adjustedISODate: fallbackISODate,
    };
  }

  return {
    clientDate: undefined,
    adjustedISODate: undefined,
  };
};

export const constructCarSearchParams = (similarCarsProps: CarTypes.SimilarCarsProps) => {
  const {
    from,
    to,
    pickupId,
    dropoffId,
    driverCountry,
    driverAge,
    pickupLocationName,
    dropoffLocationName,
  } = similarCarsProps;

  const carSearchParams = `?${stringify(
    encodeQueryParams(
      {
        [SharedFilterQueryParams.DATE_FROM]: StringParam,
        [SharedFilterQueryParams.DATE_TO]: StringParam,
        [CarFilterQueryEnum.DRIVER_AGE]: StringParam,
        [CarFilterQueryEnum.DRIVER_COUNTRY]: StringParam,
        [CarFilterQueryEnum.DROPOFF_LOCATION_ID]: StringParam,
        [CarFilterQueryEnum.DROPOFF_LOCATION_NAME]: StringParam,
        [CarFilterQueryEnum.PICKUP_LOCATION_NAME]: StringParam,
        [CarFilterQueryEnum.PICKUP_LOCATION_ID]: StringParam,
      },
      {
        [SharedFilterQueryParams.DATE_FROM]: from,
        [SharedFilterQueryParams.DATE_TO]: to,
        [CarFilterQueryEnum.DRIVER_AGE]: driverAge,
        [CarFilterQueryEnum.DRIVER_COUNTRY]: driverCountry,
        [CarFilterQueryEnum.DROPOFF_LOCATION_ID]: dropoffId,
        [CarFilterQueryEnum.DROPOFF_LOCATION_NAME]: dropoffLocationName,
        [CarFilterQueryEnum.PICKUP_LOCATION_NAME]: pickupLocationName,
        [CarFilterQueryEnum.PICKUP_LOCATION_ID]: pickupId,
      }
    )
  )}`;

  return carSearchParams;
};
