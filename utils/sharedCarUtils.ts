import { checkShouldFormatPrice } from "./helperUtils";

import { CarCategory, CarProvider, CarProviderId, SupportedLanguages } from "types/enums";
import { roundPrice, formatPrice } from "utils/currencyFormatUtils";
import { yearMonthDayFormatWithTime, getFormattedDate } from "utils/dateUtils";

export const getFuelPolicyString = (fuelPolicy: CarTypes.QueryFuelPolicy) => {
  switch (fuelPolicy) {
    case "EMPTY_TO_EMPTY":
      return "Empty to empty";
    case "FULL_TO_FULL":
      return "Full to full";
    case "FULL_TO_EMPTY":
      return "Full to empty";
    case "LEVEL_TO_LEVEL":
      return "Level to level";
    default:
      return "";
  }
};

export const getCarCategoryValue = (category: string, t: TFunction) => {
  switch (category.toLowerCase()) {
    case CarCategory.SMALL: {
      return t("Small");
    }
    case CarCategory.MEDIUM: {
      return t("Medium");
    }
    case CarCategory.LARGE: {
      return t("Large");
    }
    case CarCategory.ESTATE: {
      return t("Estate");
    }
    case CarCategory.MINIVAN: {
      return t("Mini Van");
    }
    case CarCategory.JEEPSUV: {
      return t("Jeep / SUV");
    }
    case CarCategory.CONVERTIBLE: {
      return t("Convertible");
    }
    case CarCategory.PREMIUM: {
      return t("Premium");
    }
    case CarCategory.CAMPERVAN: {
      return t("Camper Van");
    }
    case CarCategory.MINICAMPER: {
      return t("Mini Camper");
    }
    case CarCategory.VAN: {
      return t("Van");
    }
    case CarCategory.UNSPECIFIED: {
      return t("Unspecified");
    }
    default: {
      return category;
    }
  }
};

export const mapCarProviderToId = (carProvider: CarProvider) => {
  switch (carProvider) {
    case CarProvider.MONOLITH:
      return CarProviderId.MONOLITH;
    case CarProvider.CARNECT:
      return CarProviderId.CARNECT;
    case CarProvider.CAREN:
      return CarProviderId.CAREN;
    case CarProvider.GUIDE:
      return CarProviderId.GUIDE;
    default:
      return CarProviderId.MONOLITH;
  }
};

export const mapCarProviderIdToCarProvider = (carProviderId: CarProviderId) => {
  switch (carProviderId) {
    case CarProviderId.MONOLITH:
      return CarProvider.MONOLITH;
    case CarProviderId.CARNECT:
      return CarProvider.CARNECT;
    case CarProviderId.CAREN:
      return CarProvider.CAREN;
    case CarProviderId.GUIDE:
      return CarProvider.GUIDE;
    default:
      return CarProvider.MONOLITH;
  }
};

export const getCarnectKey = (translationKeys: CarTypes.TranslationKeys, keyIncludes: string) =>
  translationKeys.keys.find(key => key.key.includes(keyIncludes));

export const getCoverageAmount = (
  isCarnect: boolean,
  currencyCode: string,
  convertCurrency: (coverageAmount: number) => number,
  amount: number
) => {
  const shouldFormatPrice = checkShouldFormatPrice(isCarnect, currencyCode);

  return shouldFormatPrice
    ? formatPrice(convertCurrency(amount), true)
    : roundPrice(convertCurrency(amount));
};

export const getTranslationByKey = (
  translationKey: CarTypes.TranslationKey,
  t: TFunction,
  convertCurrency?: (value: number) => number,
  currencyCode?: string,
  isCarnect?: boolean
) => {
  const translationValues: {
    [key: string]: string;
  } = {};
  translationKey.variables.forEach(variable => {
    const value =
      variable.key.includes("X") &&
      convertCurrency &&
      currencyCode &&
      // TODO: Newly added to hygraph, X variable means that its an amount of money, but we are getting returned percentage from backend in X variable
      translationKey.key !== "coverage_cf_desc"
        ? `${getCoverageAmount(
            isCarnect ?? false,
            currencyCode,
            convertCurrency,
            Number(variable.value.trim().replace(",", ""))
          )} ${currencyCode}`
        : variable.value;
    // eslint-disable-next-line functional/immutable-data, prefer-destructuring
    translationValues[variable.key] = value;
  });
  return t(translationKey.key, translationValues);
};

const addComma = (activeLocale?: SupportedLanguages) => {
  if (
    activeLocale === SupportedLanguages.LegacyChinese ||
    activeLocale === SupportedLanguages.Chinese
  )
    return ",";
  if (activeLocale === SupportedLanguages.Japanese) return "、";
  return "";
};

export const constructHeadline = (
  t: TFunction,
  name: string,
  activeLocale?: SupportedLanguages
) => {
  return name.toLowerCase().includes(t("or similar"))
    ? name
    : `${name}${addComma(activeLocale)} ${t("or similar")}`;
};

export const constructCarProductUrl = (
  carProductUrl: string,
  carId: string | number,
  {
    selectedDates: { from, to },
    pickupId,
    dropoffId,
    pickupLocationName,
    dropoffLocationName,
  }: {
    selectedDates: SharedTypes.SelectedDates;
    pickupId: string;
    dropoffId: string;
    pickupLocationName: string;
    dropoffLocationName: string;
  },
  provider: CarProvider,
  category: string,
  carName: string,
  driverAge?: number,
  countryCode?: string,
  editCartId?: string
) => {
  return `${carProductUrl}${`/${encodeURIComponent(carName)}`}/${carId}?from=${
    from ? getFormattedDate(from, yearMonthDayFormatWithTime) : undefined
  }&to=${
    to ? getFormattedDate(to, yearMonthDayFormatWithTime) : undefined
  }&pickup_id=${pickupId}&dropoff_id=${dropoffId}&provider=${mapCarProviderToId(provider)}${`${
    driverAge ? `&driverAge=${driverAge}` : ""
  }${
    countryCode ? `&driverCountryCode=${countryCode}` : ""
  }`}&category=${category}&pickupLocationName=${encodeURI(
    pickupLocationName
  )}&dropoffLocationName=${encodeURI(dropoffLocationName)}${
    editCartId?.length ? `&editCarOfferCartId=${encodeURI(editCartId)}` : ""
  }`;
};

export const getFormattedPriceValue = (priceObject?: SharedTypes.PriceObject | null) => {
  return priceObject?.currency && priceObject?.priceDisplayValue
    ? `${priceObject.priceDisplayValue} ${priceObject.currency}`
    : "";
};
