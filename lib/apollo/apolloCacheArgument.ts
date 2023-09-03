/* eslint-disable no-underscore-dangle */
import {
  IntrospectionFragmentMatcher,
  defaultDataIdFromObject,
  InMemoryCacheConfig,
} from "apollo-cache-inmemory";

import introspectionQueryResultData from "../fragmentTypes.json";

import { appStringCachePrefix, namespaceCachePrefix } from "utils/globalUtils";

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
});

export const apolloCacheArgument: InMemoryCacheConfig = {
  fragmentMatcher,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataIdFromObject: (object: any) => {
    if (object.__typename.startsWith("GraphCMS")) {
      switch (object.__typename) {
        case "GraphCMSLandingPage":
        case "GraphCMSStaysProductPage":
        case "GraphCMSVacationPackagesProductPage":
          return `${object.__typename}:${object.id}:${
            object.metadataUri ? object.metadataUri : ""
          }:${object.locale ? object.locale : ""}`;

        case "GraphCMSApplicationString" && !!object.stringId: {
          return `${appStringCachePrefix}:${object.id}`;
        }
        case "GraphCMSApplicationNamespace": {
          return `${namespaceCachePrefix}:${object.id}`;
        }
        default:
          return object.id;
      }
    }

    switch (object.__typename) {
      case "MapPoints":
        return `${object.id}:${object.type}`;
      case "Teaser":
        return `${object.__typename}:${object.id}:${object.variant}`;
      case "Blog":
      case "Attraction":
      case "Article": {
        return `${object.__typename}:${object.id}:isMobile:${object.isMobile}`;
      }
      case "TourInclude":
        return `${object.__typename}:${object.id}:${object.included}`;
      case "OrderFlightCartInfo":
        return `${object.__typename}:${object.id}:${object.bookingToken}:${object.price}`;
      case "OrderStayCartInfo":
      case "OrderTourCartInfo":
      case "OrderCarCartInfo":
      case "OrderCustomCartInfo":
        return `${object.__typename}:${object.cartItemId}:${object.createdTime}:${object.totalPrice}`;
      case "FlightPickupLocation":
        return `${object.__typename}:${object.id}:${object.metadataUri ? object.metadataUri : ""}:${
          object.locale ? object.locale : ""
        }`;
      case "ToursTourNameIntIdFilter": {
        return `${object.__typename}:${object.id}:${object.name}`;
      }
      case "TravelGuideCountryFilter":
      case "TravelGuideCityFilter": {
        return `${object.__typename}:${object.id}:${object.available}`;
      }

      default:
        return defaultDataIdFromObject(object);
    }
  },
};
