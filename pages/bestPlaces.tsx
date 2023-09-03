import React from "react";
import { useQuery } from "@apollo/react-hooks";

import BestPlacesLandingPageQuery from "../components/features/BestPlaces/queries/BestPlacesLandingPageQuery.graphql";
import { BestPlacesStateContextProvider } from "../components/features/BestPlaces/BestPlacesStateContext";

import Header from "components/features/Header/MainHeader";
import AdminGearLoader from "components/features/AdminGear/AdminGearLoader";
import getInitialProps from "components/features/BestPlaces/utils/getInitialProps";
import QueryParamProvider from "components/ui/Filters/QueryParamProvider";
import BestPlacesSearchContainer, {
  BestPlacesSearchContainerProps,
} from "components/features/BestPlaces/BestPlacesSearchContainer";
import ErrorComponent from "components/ui/Error/ErrorComponent";
import { getGuestsFromLocalStorage } from "utils/localStorageUtils";

const BestPlacesPage = (props: BestPlacesSearchContainerProps) => {
  const { error: landingError, data: landingData } =
    useQuery<BestPlacesTypes.QueryBestPlacesLandingPage>(BestPlacesLandingPageQuery);

  const lsNumberOfGueses = getGuestsFromLocalStorage();
  const { startingLocationId, startingLocationName } = props;

  if (landingError) return <ErrorComponent error={landingError} componentName="BestPlacesPage" />;

  return (
    <>
      <Header />
      <QueryParamProvider skipScroll>
        <BestPlacesStateContextProvider
          selectedLocationId={startingLocationId}
          selectedLocationName={startingLocationName}
          locationPlaceholder={landingData?.settings.searchAnyLocationString}
          {...(lsNumberOfGueses.adults
            ? {
                adultsFilter: lsNumberOfGueses.adults,
              }
            : null)}
          {...(lsNumberOfGueses.children.length
            ? {
                childrenAges: lsNumberOfGueses.children,
              }
            : null)}
        >
          <BestPlacesSearchContainer landingData={landingData} {...props} />
        </BestPlacesStateContextProvider>
      </QueryParamProvider>
      <AdminGearLoader />
    </>
  );
};

BestPlacesPage.getInitialProps = getInitialProps;

export default BestPlacesPage;
