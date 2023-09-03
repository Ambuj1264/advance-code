import { useState } from "react";

import useStayContinentAdminFunctionalItems from "./useStayContinentAdminFunctionalItems";
import useStayCountryAdminFunctionalItems from "./useStayCountryAdminFunctionalItems";
import useStayCityAdminFunctionalItems from "./useStayCityAdminFunctionalItems";
import { getProductType } from "./utils/staysSearchPageUtils";

import { GraphCMSPageVariation, GraphCMSSubType } from "types/enums";

const useStayLandingAdminFunctionalItems = ({
  subType,
  pageVariation,
  stayId,
}: {
  subType?: GraphCMSSubType;
  pageVariation?: GraphCMSPageVariation;
  stayId?: string;
}) => {
  const [shouldPublishPage, setShouldPublishPage] = useState(false);
  const productType = getProductType(subType);
  const isContinentPage = pageVariation?.includes("Continent");
  const isCountryPage = pageVariation?.includes("Country");
  const isCityPage = pageVariation?.includes("City");
  const osmId = stayId ? Number(stayId) : undefined;
  const { getContinentFunctionalItems } = useStayContinentAdminFunctionalItems({
    productType,
    shouldSkip: !shouldPublishPage || !isContinentPage,
    setShouldPublishPage,
  });
  const { getCountryFunctionalItems } = useStayCountryAdminFunctionalItems({
    productType,
    shouldSkip: !shouldPublishPage || !isCountryPage || !osmId,
    setShouldPublishPage,
    countryOsmId: osmId,
  });
  const { getCityFunctionalItems } = useStayCityAdminFunctionalItems({
    productType,
    shouldSkip: !shouldPublishPage || !isCityPage || !osmId,
    setShouldPublishPage,
    cityOsmId: osmId,
  });

  if (isContinentPage) {
    return getContinentFunctionalItems();
  }
  if (isCountryPage) {
    return getCountryFunctionalItems();
  }
  if (isCityPage) {
    return getCityFunctionalItems();
  }
  return undefined;
};

export default useStayLandingAdminFunctionalItems;
