import styled from "@emotion/styled";

import IconLoading from "./IconLoading";
import { InformationIcon } from "./informationIcon";

import CustomNextDynamic from "lib/CustomNextDynamic";
import { mqMax, mqMin } from "styles/base";
import { Marketplace, SupportedLanguages } from "types/enums";
import { getCnSubdomainUrl } from "utils/apiUtils";
import { hreflangLocalesByMarketplace } from "components/ui/LandingPages/utils/hreflangLocalesByMarketplace";

const WifiIcon = CustomNextDynamic(() => import("components/icons/wifi-check.svg"), {
  loading: IconLoading,
});
const AccessibilityIcon = CustomNextDynamic(
  () => import("components/icons/disability-wheelchair-1.svg"),
  {
    loading: IconLoading,
  }
);
const CancellationIcon = CustomNextDynamic(() => import("components/icons/file-text-remove.svg"), {
  loading: IconLoading,
});
const ConfirmationIcon = CustomNextDynamic(
  () => import("components/icons/tags-check-alternate.svg"),
  {
    loading: IconLoading,
  }
);
const CustomerSupportIcon = CustomNextDynamic(() => import("components/icons/phone-support.svg"), {
  loading: IconLoading,
});
const BestPriceIcon = CustomNextDynamic(() => import("components/icons/check-shield.svg"), {
  loading: IconLoading,
});
const ParkingIcon = CustomNextDynamic(() => import("components/icons/discount-parking.svg"), {
  loading: IconLoading,
});
const KitchenFacilitiesIcon = CustomNextDynamic(
  () => import("components/icons/kitchen-facilities.svg"),
  {
    loading: IconLoading,
  }
);
const GymAndSpaIcon = CustomNextDynamic(() => import("components/icons/gym-and-spa.svg"), {
  loading: IconLoading,
});
const SelfCheckInIcon = CustomNextDynamic(() => import("components/icons/self-check-in.svg"), {
  loading: IconLoading,
});
const AirportPickupIcon = CustomNextDynamic(() => import("components/icons/airport-pickup.svg"), {
  loading: IconLoading,
});
const FullyCustomizableIcon = CustomNextDynamic(
  () => import("components/icons/tags-edit-alternative.svg"),
  {
    loading: IconLoading,
  }
);
const FreePickupIcon = CustomNextDynamic(() => import("components/icons/free-pick-up.svg"), {
  loading: IconLoading,
});
const TravelPlanIcon = CustomNextDynamic(() => import("components/icons/travel-plan.svg"), {
  loading: IconLoading,
});
const CarAccommodationIcon = CustomNextDynamic(() => import("components/icons/car-garage.svg"), {
  loading: IconLoading,
});
const BundleAndSaveIcon = CustomNextDynamic(() => import("components/icons/tags.svg"), {
  loading: IconLoading,
});
const TransportIcon = CustomNextDynamic(() => import("components/icons/transport.svg"), {
  loading: IconLoading,
});
const Traveler = CustomNextDynamic(() => import("components/icons/traveler.svg"), {
  loading: IconLoading,
});
const Star = CustomNextDynamic(() => import("components/icons/star.svg"), {
  loading: IconLoading,
});
const Like = CustomNextDynamic(() => import("components/icons/like-2.svg"), {
  loading: IconLoading,
});
const CheckList = CustomNextDynamic(() => import("components/icons/checklist.svg"), {
  loading: IconLoading,
});
const RestaurantIcon = CustomNextDynamic(
  () => import("components/icons/restaurant-fork-knife.svg"),
  {
    loading: IconLoading,
  }
);
const IconCatSitting = CustomNextDynamic(() => import("components/icons/cat-sitting.svg"), {
  loading: IconLoading,
});
const SnowIcon = CustomNextDynamic(() => import("components/icons/temperature-snowflake-1.svg"), {
  loading: IconLoading,
});
const BreakfastIcon = CustomNextDynamic(() => import("components/icons/breakfast.svg"), {
  loading: IconLoading,
});
const HygienIcon = CustomNextDynamic(() => import("components/icons/spa-hand-flower.svg"), {
  loading: IconLoading,
});
// Same icon, different names
const BestCombinationIcon = CheckList;

export enum ProductPropId {
  Cancellation = "cancellation",
  FreeCancellation = "freeCancellation",
  Confirmation = "instantConfirmation",
  CustomerSupport = "customerSupport",
  BestPrice = "bestPrice",
  KitchenFacilities = "kitchenFacilities",
  SelfCheckIn = "selfCheckIn",
  AirportShuttle = "airportShuttle",
  SpaAndGym = "spaAndGym",
  Parking = "parking",
  TransportAndAccommodation = "transportAndAccommodation",
  FreePickup = "freePickup",
  TravelPlan = "travelPlan",
  FullyCustomizable = "fullyCustomizable",
  BundleAndSave = "bundleAndSave",
  BestCombination = "bestCombination",
  CarAndAccommodation = "carAndAccommodation",
  TravelExperts = "travelExperts",
  VerifiedQualityServices = "verifiedQualityServices",
  BestExperiences = "bestExperiences",
  EasyBooking = "easyBooking",
  Wifi = "wifi",
  Accessibility = "accessibility",
  Food = "food",
  Pets = "pets",
  AirCon = "airConditionning",
  Breakfast = "breakfast",
  Hygien = "hygien",
}

export const getIcon = (iconId: string) => {
  switch (iconId) {
    case ProductPropId.Cancellation:
      return CancellationIcon;
    case ProductPropId.FreeCancellation:
      return CancellationIcon;
    case ProductPropId.Confirmation:
      return ConfirmationIcon;
    case ProductPropId.CustomerSupport:
      return CustomerSupportIcon;
    case ProductPropId.BestPrice:
      return BestPriceIcon;
    case ProductPropId.KitchenFacilities:
      return KitchenFacilitiesIcon;
    case ProductPropId.SelfCheckIn:
      return SelfCheckInIcon;
    case ProductPropId.AirportShuttle:
      return AirportPickupIcon;
    case ProductPropId.SpaAndGym:
      return GymAndSpaIcon;
    case ProductPropId.Parking:
      return ParkingIcon;
    case ProductPropId.FullyCustomizable:
      return FullyCustomizableIcon;
    case ProductPropId.FreePickup:
      return FreePickupIcon;
    case ProductPropId.TravelPlan:
      return TravelPlanIcon;
    case ProductPropId.CarAndAccommodation:
      return CarAccommodationIcon;
    case ProductPropId.BestCombination:
      return BestCombinationIcon;
    case ProductPropId.BundleAndSave:
      return BundleAndSaveIcon;
    case ProductPropId.TransportAndAccommodation:
      return TransportIcon;
    case ProductPropId.TravelExperts:
      return Traveler;
    case ProductPropId.VerifiedQualityServices:
      return Star;
    case ProductPropId.BestExperiences:
      return Like;
    case ProductPropId.EasyBooking:
      return CheckList;
    case ProductPropId.Wifi:
      return WifiIcon;
    case ProductPropId.Accessibility:
      return AccessibilityIcon;
    case ProductPropId.Food:
      return RestaurantIcon;
    case ProductPropId.Pets:
      return IconCatSitting;
    case ProductPropId.AirCon:
      return SnowIcon;
    case ProductPropId.Breakfast:
      return BreakfastIcon;
    case ProductPropId.Hygien:
      return HygienIcon;
    default:
      return InformationIcon;
  }
};

export const constructProductProps = (queryProductProps: SharedTypes.QueryProductProp[]) =>
  queryProductProps.map((prop: SharedTypes.QueryProductProp) => ({
    Icon: getIcon(prop.iconId),
    title: prop.title,
    description: prop.description,
  }));

export const getExpandableTextInformation = ({
  charLimit,
  text,
}: {
  charLimit: number;
  text: string;
}) => ({
  restText: text.substring(charLimit),
  displayedText: text.length <= charLimit ? text : text.substring(0, charLimit),
});

// eslint-disable-next-line default-param-last
export const checkIsPhoneNumberValid = (key: string, currentValue = "", maxLength?: number) => {
  const phonePattern = /^(\+)?[\d]*$/;
  const newInputValue = currentValue + key;

  return phonePattern.test(newInputValue) && (maxLength ? newInputValue.length <= maxLength : true);
};

export const normalisePhoneNumber = (phoneNumber: string) => {
  if (!phoneNumber.length) return phoneNumber;

  return /^\+/.test(phoneNumber) ? phoneNumber : `+${phoneNumber}`;
};

const DEFAULT_DPR = 2;

export const getDeviceDpr = (isClientNavigation?: boolean) =>
  isClientNavigation ? Math.ceil(window.devicePixelRatio) : DEFAULT_DPR;

export const MobileContentWrapper = styled.div`
  ${mqMin.desktop} {
    display: none;
  }
`;

export const DesktopContentWrapper = styled.div`
  ${mqMax.desktop} {
    display: none;
  }
`;

export const isGTELanguageIndexed = (locale: SupportedLanguages, isIndexed: boolean) =>
  Boolean(
    hreflangLocalesByMarketplace[Marketplace.GUIDE_TO_EUROPE]?.some(
      enabledLocale => locale === enabledLocale
    )
  ) && isIndexed;

export const getMetadataTitle = (title: string, websiteName: string) => {
  if (title && title.includes(websiteName)) {
    return title;
  }
  if (!title) {
    return websiteName;
  }
  return `${title} | ${websiteName}`;
};

export const constructHreflangs = (hreflangs: Hreflang[], websiteUrl: string) =>
  hreflangs
    .filter(hreflang => hreflang.uri)
    .map(({ uri, locale }) => ({
      uri: uri === "/" ? websiteUrl : `${websiteUrl}${uri}`,
      locale,
    }));

type LocaleToReplace = {
  old: SupportedLanguages;
  new: SupportedLanguages;
};

export const getReplacedLocale = (
  locale: SupportedLanguages,
  localesToReplace?: LocaleToReplace[]
) => {
  if (localesToReplace?.length) {
    const replacedLocale = localesToReplace.find(newLocale => newLocale.old === locale)?.new;
    return replacedLocale || locale;
  }

  return locale;
};

export const constructCommonLandingHreflangs = (
  hreflangs: Hreflang[],
  websiteUrl: string,
  marketPlace: Marketplace,
  localesToReplace?: LocaleToReplace[]
) => {
  if (marketPlace === Marketplace.GUIDE_TO_EUROPE) {
    return constructHreflangs(hreflangs, websiteUrl);
  }

  return hreflangs
    .filter(hreflang => hreflang.uri)
    .map(({ uri, locale }) => ({
      uri: getCnSubdomainUrl(uri, websiteUrl, locale as SupportedLanguages),
      locale: getReplacedLocale(locale as SupportedLanguages, localesToReplace),
    }));
};

export const isDomNodeValueTruncated = (node: HTMLElement) => {
  return node.offsetWidth < node.scrollWidth;
};

export const isValueTruncated = (ref: React.RefObject<HTMLDivElement>) => {
  if (!ref.current) return false;
  return isDomNodeValueTruncated(ref.current);
};

export const getTruncatedValues = (refs: React.RefObject<HTMLDivElement>[]) =>
  refs.map(ref => {
    return isValueTruncated(ref) ? ref?.current?.textContent || "" : false;
  });

export const imageLoadingPixel =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
