import lazyCaptureException from "lib/lazyCaptureException";
import CustomNextDynamic from "lib/CustomNextDynamic";
import { PageType } from "types/enums";
import IconLoading from "components/ui/utils/IconLoading";
import { InformationIcon } from "components/ui/utils/informationIcon";

const TypeIcon = CustomNextDynamic(() => import("components/icons/ribbon-one-sided.svg"), {
  loading: IconLoading,
});
const DefaultIcon = InformationIcon;
const RegionIcon = CustomNextDynamic(() => import("components/icons/gps.svg"), {
  loading: IconLoading,
});
const LanguageIcon = CustomNextDynamic(() => import("components/icons/language.svg"), {
  loading: IconLoading,
});
const OpeningHoursIcon = CustomNextDynamic(() => import("components/icons/clock.svg"), {
  loading: IconLoading,
});
const HighSeasonIcon = CustomNextDynamic(() => import("components/icons/traveler.svg"), {
  loading: IconLoading,
});
const DistanceIcon = CustomNextDynamic(() => import("components/icons/road-straight.svg"), {
  loading: IconLoading,
});
const PriceLevelIcon = CustomNextDynamic(() => import("components/icons/money-wallet-open.svg"), {
  loading: IconLoading,
});
const RatingIcon = CustomNextDynamic(() => import("components/icons/star.svg"), {
  loading: IconLoading,
});
const TippingIcon = CustomNextDynamic(() => import("components/icons/bulb-alternate.svg"), {
  loading: IconLoading,
});
const TemperatureIcon = CustomNextDynamic(
  () => import("components/icons/temperature-thermometer.svg"),
  {
    loading: IconLoading,
  }
);
const FamilyFriendlyIcon = CustomNextDynamic(
  () => import("components/icons/family-add-new-member.svg"),
  {
    loading: IconLoading,
  }
);
const UserRatingsTotalIcon = CustomNextDynamic(
  () => import("components/icons/rating-star-add-1-alternate.svg"),
  {
    loading: IconLoading,
  }
);

enum QuickFactType {
  OpeningHours = "opening_hours",
  HighSeason = "high_season",
  AverageTemperature = "average_temperature",
  DistanceFromCityCenter = "distance_from_city",
  Language = "language",
  Type = "type",
  FamilyFriendly = "family_friendly",
  PriceLevel = "price_level",
  Rating = "rating",
  UserRatingsTotal = "user_ratings_total",
  Region = "region",
  Tipping = "tipping",
  Builder = "builder",
  BuildDate = "date",
  Area = "area",
  PopulationTotal = "population_total",
  PopulationDensity = "population_density",
  Length = "length",
  Depth = "depth",
  Thickness = "thickness",
  Outflow = "outflow",
  Height = "height",
  Width = "width",
  NumberDrops = "number_drops",
  LastEruption = "last_eruption",
}

/* Peg parser generator used by i18n for keys could be broken if symbols like } won't
 * be escaped as it treats them as end of input
 * */
const escapeSpecialParserGeneratorSymbols = (stringValue: string) => {
  return stringValue.replace(/[#{}]/g, "\\$&");
};

const kmPattern = /^(\d+.\d*) km$/;
const mPattern = /^(\d+.\d*) m$/;

export const getDistanceTranslationLabelWithValue = (tFunction: TFunction, valueKey: string) => {
  const matchKm = valueKey.match(kmPattern);
  const matchM = valueKey.match(mPattern);

  if (matchKm?.length) {
    return tFunction(`{distance} km`, { distance: matchKm[1] });
  }

  if (matchM?.length) {
    return tFunction(`{distance} m`, { distance: matchM[1] });
  }

  return tFunction(`${valueKey}`, valueKey);
};

const getTranslatedValue = (tFunction: TFunction, valueKey: string, quickFactId?: string) => {
  let translatedString;
  try {
    if (quickFactId === QuickFactType.DistanceFromCityCenter) {
      translatedString = getDistanceTranslationLabelWithValue(tFunction, valueKey);
    } else {
      translatedString = tFunction(`${valueKey}`, valueKey);
    }
    // eslint-disable-next-line prettier/prettier
  } catch (error) {
    if ((error as any).name === "SyntaxError") {
      const syntaxError = new SyntaxError(`
        Quick facts key/value consists of unescaped symbols those breaks the i18n parser generator
        Quick fact value: ${valueKey}
        Parser message: ${(error as any).message}`);
      lazyCaptureException(syntaxError);
    } else {
      throw error;
    }

    const escapedKey = escapeSpecialParserGeneratorSymbols(valueKey);
    translatedString = tFunction(`${escapedKey}`, escapedKey);
  }

  return translatedString;
};

const constructQuickFacts = (
  quickFacts: ArticleWidgetTypes.QuickFact[],
  options: {
    commonNsT: TFunction;
    commonCarNsT: TFunction;
    quickFactsNsT: TFunction;
    pageType?: PageType;
  }
): SharedTypes.ProductSpec[] => {
  const tFunction = options.quickFactsNsT;
  const facts = quickFacts.map(fact => {
    const translatedName = getTranslatedValue(tFunction, fact.name);
    const translatedValue = getTranslatedValue(tFunction, fact.value, fact.quickfactField);

    const defaultQuickFact = {
      name: translatedName,
      value: translatedValue,
      Icon: DefaultIcon,
    };

    switch (fact.quickfactField) {
      case QuickFactType.Language: {
        return {
          ...defaultQuickFact,
          Icon: LanguageIcon,
        };
      }
      case QuickFactType.Type: {
        return {
          ...defaultQuickFact,
          Icon: TypeIcon,
        };
      }
      case QuickFactType.Region: {
        return {
          ...defaultQuickFact,
          Icon: RegionIcon,
        };
      }
      case QuickFactType.AverageTemperature: {
        return {
          ...defaultQuickFact,
          Icon: TemperatureIcon,
        };
      }
      case QuickFactType.OpeningHours: {
        return {
          ...defaultQuickFact,
          Icon: OpeningHoursIcon,
        };
      }
      case QuickFactType.HighSeason: {
        return {
          ...defaultQuickFact,
          Icon: HighSeasonIcon,
        };
      }
      case QuickFactType.DistanceFromCityCenter: {
        return {
          ...defaultQuickFact,
          Icon: DistanceIcon,
        };
      }
      case QuickFactType.FamilyFriendly: {
        return {
          ...defaultQuickFact,
          Icon: FamilyFriendlyIcon,
        };
      }
      case QuickFactType.PriceLevel: {
        return {
          ...defaultQuickFact,
          Icon: PriceLevelIcon,
        };
      }
      case QuickFactType.Rating: {
        return {
          ...defaultQuickFact,
          Icon: RatingIcon,
        };
      }
      case QuickFactType.UserRatingsTotal: {
        return {
          ...defaultQuickFact,
          Icon: UserRatingsTotalIcon,
        };
      }
      case QuickFactType.Tipping: {
        return {
          ...defaultQuickFact,
          Icon: TippingIcon,
        };
      }
      default: {
        return defaultQuickFact;
      }
    }
  });

  return facts;
};

export default constructQuickFacts;
