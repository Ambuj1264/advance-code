import React from "react";

import { useOnStaysSearchLocationInputChange } from "./utils/staysSearchHooks";
import GTEStaysSearchContentContainer from "./GTEStaysSearchContentContainer";

import LandingPageSEOContainer from "components/ui/LandingPages/LandingPageSEOContainer";
import { getUUID } from "utils/helperUtils";
import { AccommodationSearchPageStateContextProvider } from "components/features/AccommodationSearchPage/AccommodationSearchPageStateContext";
import { defaultStaySEOImage } from "components/ui/LandingPages/utils/landingPageUtils";
import { GraphCMSPageType } from "types/enums";

const StaysSearchContainer = ({
  queryCondition,
}: {
  queryCondition: LandingPageTypes.LandingPageQueryCondition;
}) => {
  return (
    <AccommodationSearchPageStateContextProvider
      slug=""
      useNewGuestPicker
      onLocationInputChangeOverride={useOnStaysSearchLocationInputChange}
      additionalParams={{
        searchId: getUUID(),
        price: undefined,
      }}
    >
      <LandingPageSEOContainer
        isIndexed={false}
        queryCondition={queryCondition}
        ogImages={[defaultStaySEOImage]}
        funnelType={GraphCMSPageType.Stays}
      />
      <GTEStaysSearchContentContainer queryCondition={queryCondition} />
    </AccommodationSearchPageStateContextProvider>
  );
};

export default StaysSearchContainer;
