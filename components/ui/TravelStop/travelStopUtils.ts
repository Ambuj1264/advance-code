import { constructGraphCMSImage } from "../LandingPages/utils/landingPageUtils";

import { TravelStopAttractionQF, TravelStopDestinationQF } from "./travelStopEnums";

import { emptyArray } from "utils/constants";
import { GraphCMSPageType, TravelStopType } from "types/enums";
import CameraIcon from "components/icons/camera-1.svg";
import { capitalize } from "utils/globalUtils";
import { removeTrailingCommas } from "utils/helperUtils";
import Icon from "components/ui/GraphCMSIcon";

export const generateQuickfacts = (
  quickFacts: TravelStopTypes.Quickfact[],
  quickFactsNsT: TFunction,
  translateOptions: { [x: string]: string | number | undefined },
  isDesktop?: boolean
): SharedTypes.ProductSpec[] => {
  return quickFacts
    .map(quickFact => ({
      id: quickFact?.title,
      Icon: Icon(quickFact?.icon?.handle, isDesktop),
      name: quickFactsNsT(quickFact?.title ?? ""),
      value: removeTrailingCommas(quickFactsNsT(quickFact.name.value, translateOptions)),
      information: quickFact?.information,
      quickfactId: quickFact?.quickfactId,
    }))
    .filter(
      quickFact =>
        quickFact.value !== undefined && quickFact.value !== "" && !quickFact.value.match(/{(.*?)}/)
    );
};

export const filterTranslationKeysMulti = (
  unfilteredArray: {
    key: string;
    value?: string | number;
    shouldCapitalize?: boolean;
  }[]
) => {
  const filteredArray = unfilteredArray
    .map(item => {
      if (
        !item.value ||
        (typeof item.value === "string" && (!item.value.length || item.value === "0")) ||
        (typeof item.value === "number" && item.value === 0)
      ) {
        return undefined;
      }
      return {
        [item.key]: item.shouldCapitalize ? capitalize(item.value.toString()) : item.value,
      };
    })
    .filter(Boolean);

  return Object.assign({}, ...filteredArray);
};

export const constructDestinationProductSpecs = (
  quickFactsNsT: TFunction,
  destination?: TravelStopTypes.QueryGraphCMSDestination
): SharedTypes.ProductSpec[] => {
  const unfilteredArray = [
    {
      key: TravelStopDestinationQF.TYPE,
      value: destination?.type,
      shouldCapitalize: true,
    },
    {
      key: TravelStopDestinationQF.COUNTRY,
      value: destination?.country,
    },
    {
      key: TravelStopDestinationQF.REGION,
      value: destination?.region,
    },
    {
      key: TravelStopDestinationQF.TIMEZONE,
      value: destination?.timezone,
    },
    {
      key: TravelStopDestinationQF.SIZE,
      value: destination?.size,
    },
    {
      key: TravelStopDestinationQF.POPULATION,
      value: destination?.population,
    },
    {
      key: TravelStopDestinationQF.LANGUAGE,
      value: destination?.language,
    },
    {
      key: TravelStopDestinationQF.LIFE_EXPECTANCY,
      value: destination?.lifeExpectancy,
    },
    {
      key: TravelStopDestinationQF.YEARLY_VISITORS,
      value: destination?.yearlyVisitors,
    },
    {
      key: TravelStopDestinationQF.WEBSITE,
      value: destination?.website,
    },
    {
      key: TravelStopDestinationQF.ELEVATION_ABOVE_SEA,
      value: destination?.elevationAboveSea,
    },
  ];
  const translateOptions = filterTranslationKeysMulti(unfilteredArray);
  const quickFacts = destination?.quickfactsList?.quickfacts ?? [];

  return generateQuickfacts(quickFacts, quickFactsNsT, translateOptions);
};

export const constructAttractionProductSpecs = (
  quickFactsNsT: TFunction,
  attraction?: TravelStopTypes.QueryGraphCMSAttraction
): SharedTypes.ProductSpec[] => {
  const unfilteredArray = [
    {
      key: TravelStopAttractionQF.TYPE,
      value: attraction?.type,
      shouldCapitalize: true,
    },
    {
      key: TravelStopAttractionQF.COUNTRY,
      value: attraction?.country,
    },
    {
      key: TravelStopAttractionQF.CITY,
      value: attraction?.city,
    },
    {
      key: TravelStopAttractionQF.ADDRESS,
      value: attraction?.address,
    },
    {
      key: TravelStopAttractionQF.YEARLY_VISITORS,
      value: attraction?.yearlyVisitors,
    },
    {
      key: TravelStopAttractionQF.REGION,
      value: attraction?.region,
    },
    {
      key: TravelStopAttractionQF.ARCHITECT,
      value: attraction?.architect,
    },
    {
      key: TravelStopAttractionQF.NAMED_AFTER,
      value: attraction?.namedAfter,
    },
    {
      key: TravelStopAttractionQF.SIZE,
      value: attraction?.size,
    },
    {
      key: TravelStopAttractionQF.ELEVATION_ABOVE_SEA,
      value: attraction?.elevationAboveSea,
    },
    {
      key: TravelStopAttractionQF.WIDTH,
      value: attraction?.width,
    },
    {
      key: TravelStopAttractionQF.WEIGHT,
      value: attraction?.weight,
    },
    {
      key: TravelStopAttractionQF.HEIGHT,
      value: attraction?.height,
    },
    {
      key: TravelStopAttractionQF.INCEPTION,
      value: attraction?.inception,
    },
  ];
  const translateOptions = filterTranslationKeysMulti(unfilteredArray);
  const quickFacts = attraction?.quickfactsList?.quickfacts ?? [];

  return generateQuickfacts(quickFacts, quickFactsNsT, translateOptions);
};

export const constructTravelStopAttractions = (
  // eslint-disable-next-line default-param-last
  queryAttractions: TravelStopTypes.QueryGraphCMSAttraction[] = emptyArray as unknown as never[],
  t: TFunction,
  loading?: boolean
): TravelStopTypes.TravelStops[] => {
  if (loading) {
    return [
      {
        isLoading: true,
        info: { id: "", title: "" },
        type: "",
        productSpecs: [],
      },
    ];
  }

  return queryAttractions.map(attraction => ({
    info: {
      id: attraction.id,
      title: attraction.title,
      description: attraction.description,
      isClickable: Boolean(attraction.mainImage),
      image:
        attraction.mainImage &&
        constructGraphCMSImage(GraphCMSPageType.VacationPackages, attraction.mainImage),
      Icon: CameraIcon,
      isLargeIcon: true,
    } as SharedTypes.Icon,
    type: TravelStopType.ATTRACTION,
    productSpecs: constructAttractionProductSpecs(t, attraction),
  }));
};

export const constructTravelStopDestinations = (
  queryDestinations: TravelStopTypes.QueryGraphCMSDestination[],
  t: TFunction,
  destinationInfo?: VacationPackageTypes.VPDestinationInfo[]
): TravelStopTypes.TravelStops[] =>
  queryDestinations?.map(destination => {
    const info = destinationInfo?.filter(dest => dest.id === destination.uniqueId);
    const numberOfNights = info?.reduce(
      (totalNights, currentInfo) => totalNights + currentInfo.numberOfNights,
      0 as number
    );
    const title = destination?.name?.value ?? destination.title;
    return {
      info: {
        id: destination.id,
        title: numberOfNights
          ? `${title} / ${t("{numberOfNights} nights", { numberOfNights })}`
          : title,
        description: destination.description,
        isClickable: Boolean(destination.mainImage),
        image:
          destination.mainImage && destination.mainImage.handle
            ? constructGraphCMSImage(GraphCMSPageType.VacationPackages, destination.mainImage)
            : undefined,
        Icon: CameraIcon,
        isLargeIcon: true,
      } as SharedTypes.Icon,
      type: TravelStopType.DESTINATION,
      productSpecs: constructDestinationProductSpecs(t, destination),
    };
  });
