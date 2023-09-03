import { pipe } from "fp-ts/lib/pipeable";
import { fromNullable, getOrElse, mapNullable } from "fp-ts/lib/Option";

import { capitalize } from "utils/globalUtils";

export const getAddMoreTravelersButtonText = (
  priceGroups: ReadonlyArray<TravelersTypes.PriceGroup>
) => {
  const containsTeenagers =
    priceGroups.findIndex(
      (priceGroup: TravelersTypes.PriceGroup) => priceGroup.travelerType === "teenagers"
    ) !== -1;
  const containsChildren =
    priceGroups.findIndex(
      (priceGroup: TravelersTypes.PriceGroup) => priceGroup.travelerType === "children"
    ) !== -1;
  if (containsTeenagers && containsChildren) {
    return "Add teenagers/children";
  }
  if (containsTeenagers) {
    return "Add teenagers";
  }
  if (containsChildren) {
    return "Add children";
  }
  return undefined;
};

export const constructPriceGroups = (
  priceGroups: TravelersTypes.QueryPriceGroups
): TravelersTypes.PriceGroup[] =>
  Object.entries(priceGroups).reduce(
    (accumalatedPriceGroup: Array<TravelersTypes.PriceGroup>, [traveler, priceGroup]) => {
      if (priceGroup && typeof priceGroup === "object") {
        return accumalatedPriceGroup.concat([
          {
            id: traveler,
            travelerType: traveler as SharedTypes.TravelerType,
            defaultNumberOfTravelerType: traveler === "adults" ? 1 : 0,
            minAge: priceGroup.minAge,
            maxAge: priceGroup.maxAge,
          },
        ]);
      }
      return accumalatedPriceGroup;
    },
    []
  );

export const getTotalNumberOfGTIVpTravelers = ({
  adults,
  childrenAges = [],
}: {
  adults: number;
  childrenAges?: number[];
}) => adults + childrenAges.length;

export const getTotalNumberOfTravelersWithPriceGroups = (
  numberOfTravelers: SharedTypes.NumberOfTravelers,
  priceGroups: TravelersTypes.PriceGroup[]
) =>
  Object.entries(numberOfTravelers).reduce((sum, [key, value]) => {
    if (priceGroups.find(priceGroup => priceGroup.travelerType === key)) return sum + value;
    return sum;
  }, 0);

export const constructTravelersByPriceGroups = (
  numberOfTravelers: SharedTypes.NumberOfTravelers,
  priceGroups?: TravelersTypes.PriceGroup[],
  childrenAges?: number[]
): TourBookingWidgetTypes.TravelersByPriceGroups => {
  const defaultTravelersToPriceGroups = {
    adults: { count: numberOfTravelers.adults || 0, childrenAges: [] },
    teenagers: { count: numberOfTravelers.teenagers, childrenAges: [] },
    children: { count: numberOfTravelers.children, childrenAges: [] },
  };
  if (!childrenAges || childrenAges.length === 0) return defaultTravelersToPriceGroups;
  if (!priceGroups || priceGroups.length === 0) return defaultTravelersToPriceGroups;

  return childrenAges.reduce(
    (adjustedNumberOfTravelers, childAge) => {
      const priceGroupMatch = priceGroups
        .filter(g => g.minAge !== undefined)
        .find(group => {
          return childAge >= group.minAge && childAge <= (group.maxAge ?? Number.MAX_VALUE);
        });

      if (!priceGroupMatch) return adjustedNumberOfTravelers;

      return {
        ...adjustedNumberOfTravelers,
        [priceGroupMatch.travelerType]: {
          count: adjustedNumberOfTravelers[priceGroupMatch.travelerType].count + 1,
          childrenAges: [
            ...adjustedNumberOfTravelers[priceGroupMatch.travelerType].childrenAges,
            childAge,
          ],
        },
      };
    },
    {
      adults: { count: numberOfTravelers.adults || 0, childrenAges: [] },
      teenagers: { count: 0, childrenAges: [] },
      children: { count: 0, childrenAges: [] },
    }
  );
};

export const getChildrenAgesFromPriceGroups = (
  travelersByPriceGroups: TourBookingWidgetTypes.TravelersByPriceGroups
) => [
  ...travelersByPriceGroups.teenagers.childrenAges,
  ...travelersByPriceGroups.children.childrenAges,
];

export const getTotalNumberOfTravelers = (numberOfTravelers: SharedTypes.NumberOfTravelers) =>
  Object.values(numberOfTravelers).reduce((sum, value) => sum + value);

export const shouldExpandTravelers = (teenagers: number, children: number): boolean =>
  teenagers > 0 || children > 0;

export const getAdultText = (singlePriceGroup: boolean, minAge: number, t: TFunction) => {
  if (singlePriceGroup) {
    if (minAge > 0) {
      return t("Persons {minAge} years+", { minAge });
    }
    return t("Persons");
  }
  return t("Adults");
};

export const getAgeText = (
  singlePriceGroup: boolean,
  travelerType: SharedTypes.TravelerType,
  minAge: number,
  t: TFunction,
  maxAge: number | null
) => {
  if (maxAge !== null) {
    return t("{travelerType} aged {minAge} - {maxAge}", {
      travelerType: t(capitalize(travelerType)),
      minAge,
      maxAge,
    });
  }
  return getAdultText(singlePriceGroup, minAge, t);
};

export const getPriceGroupMaxAge = (priceGroup?: TravelersTypes.QueryPriceGroup): number =>
  pipe(
    priceGroup,
    fromNullable,
    mapNullable(maybeChildren => maybeChildren.maxAge),
    getOrElse(() => 0)
  );

export const getPriceGroupsMaxAge = (priceGroups: TravelersTypes.QueryPriceGroups) => ({
  teenagerMaxAge: getPriceGroupMaxAge(priceGroups.teenagers),
  childrenMaxAge: getPriceGroupMaxAge(priceGroups.children),
});

export const checkIfCanIncrement = ({
  maxTravelers,
  totalTravellers = 0,
}: {
  maxTravelers?: number;
  totalTravellers: number;
}) => maxTravelers === 0 || maxTravelers === undefined || maxTravelers > totalTravellers;
