import React from "react";

import TripPlannerContainer from "components/features/TripPlanner/TripPlannerContainer";
import { Namespaces } from "shared/namespaces";

const TripPlannerPage = () => {
  return <TripPlannerContainer />;
};

TripPlannerPage.getInitialProps = () => {
  return {
    namespacesRequired: [Namespaces.commonNs],
    isContactUsHidden: true,
    isTopServicesHidden: true,
    isMobileFooterShown: false,
    hidePageFooter: true,
  };
};

export default TripPlannerPage;
