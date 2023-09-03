import React from "react";

import { NotificationContextProvider } from "../../ProductPageNotification/contexts/NotificationStateContext";
import ProductNotification from "../../ProductPageNotification/ProductNotification";

import { VPStayStateContextProvider } from "./VPStayStateContext";
import { VPTourStateContextProvider } from "./VPTourStateContext";
import { VPPriceStateContextProvider } from "./VPPriceStateContext";
import { VPFlightStateContextProvider } from "./VPFlightStateContext";
import {
  useGetInitialContextValues,
  useGetInitialFlightContextValues,
  useGetInitialCarContextValues,
  useGetInitialStayContextValues,
} from "./VPStateContextHooks";
import { VPCarStateContextProvider } from "./VPCarStateContext";
import { VPStateContextProvider } from "./VPStateContext";
import { VPModalStateContextProvider } from "./VPModalStateContext";

const VPContexts = ({
  tripId,
  vacationPackageDays,
  destinationId,
  subType,
  fromPrice,
  vpCountryCode,
  cheapestMonth,
  vacationLength,
  children,
}: {
  tripId: string;
  vacationPackageDays: VacationPackageTypes.VacationPackageDay[];
  destinationId?: string;
  subType?: VacationPackageTypes.VacationPackageResult["subType"];
  fromPrice?: number;
  vpCountryCode: string;
  cheapestMonth?: string;
  vacationLength: number;
  children?: React.ReactNode;
}) => {
  const initialContext = useGetInitialContextValues({
    vpCountryCode,
    cheapestMonth,
    vacationLength,
  });
  const initialFlightContext = useGetInitialFlightContextValues();
  const initialCarContext = useGetInitialCarContextValues({
    destinationId,
    subType,
  });
  const initialStayOccupancies = useGetInitialStayContextValues();
  return (
    <VPStateContextProvider tripId={tripId} {...initialContext}>
      <VPModalStateContextProvider>
        <NotificationContextProvider>
          <VPPriceStateContextProvider fromPrice={fromPrice}>
            <VPStayStateContextProvider
              vacationPackageDays={vacationPackageDays}
              defaultOccupancies={initialStayOccupancies}
            >
              <VPFlightStateContextProvider {...initialFlightContext}>
                <VPCarStateContextProvider
                  {...initialCarContext}
                  flightIncluded={initialFlightContext?.vacationIncludesFlight}
                >
                  <VPTourStateContextProvider>{children}</VPTourStateContextProvider>
                </VPCarStateContextProvider>
              </VPFlightStateContextProvider>
            </VPStayStateContextProvider>
          </VPPriceStateContextProvider>
          <ProductNotification id="vp-notifications" />
        </NotificationContextProvider>
      </VPModalStateContextProvider>
    </VPStateContextProvider>
  );
};

export default VPContexts;
