import React, { useEffect, useMemo, useState, useContext, useCallback } from "react";
import { useRouter } from "next/router";

import {
  getAdminLinks,
  getVPLandingUrl,
  getVPQueryParamsString,
} from "../utils/vacationPackageUtils";

import {
  SKIP_SAD_PATH_MESSAGE_KEY,
  VPStayCallbackContext,
  VPStayStateContext,
} from "./VPStayStateContext";
import {
  VPCarStateContext,
  STATIC_CAR_LOCATION_INFO,
  VPCarCallbackContext,
} from "./VPCarStateContext";
import { VPFlightCallbackContext, VPFlightStateContext } from "./VPFlightStateContext";
import { VPStateContext, VPCallbackContext } from "./VPStateContext";
import { VPActionStateContextProvider } from "./VPActionStateContext";

import { Namespaces } from "shared/namespaces";
import lazyCaptureException from "lib/lazyCaptureException";
import useDynamicUrl from "hooks/useDynamicUrl";
import CarContextProvider from "components/features/Car/CarBookingWidget/CarBookingWidgetProvider";
import FlightProvider from "components/features/Flight/FlightProvider";
import { constructQueryFromSelectedDates } from "components/ui/DatePicker/utils/datePickerUtils";
import ProductChangedModal from "components/ui/ProductChangedModal";
import { CarProvider, PageType } from "types/enums";
import { isDev } from "utils/globalUtils";
import { useSettings } from "contexts/SettingsContext";
import { useTranslation } from "i18n";
import useVacationSearchQueryParams from "components/features/VacationPackages/utils/useVacationSearchQueryParams";
import { getTravelersFromOccupancies } from "components/ui/RoomAndGuestPicker/utils/roomAndGuestUtils";
import { encodeOccupanciesToArrayString } from "components/features/AccommodationSearchPage/utils/useAccommodationSearchQueryParams";

// eslint-disable-next-line @typescript-eslint/no-empty-function
const doNothing = () => {};

const captureVPException = (
  sentryArgs: {
    componentName: string;
    query: string;
    pathname: string;
  },
  additionalErrorData: {
    selectedDates?: SharedTypes.SelectedDates;
    carLocationId: number;
    tripId?: string;
    id?: string;
  },
  isPreview: boolean,
  error?: Error
) => {
  if (error) {
    const groupedError = new Error(`Vacation package error: some of the products failed loading`);
    const errorContext = {
      ...sentryArgs,
      errorInfo: {
        errorMessage: error.message,
        dateFrom: additionalErrorData.selectedDates?.from,
        dateTo: additionalErrorData.selectedDates?.to,
        carLocationId: additionalErrorData.carLocationId,
        tripId: additionalErrorData.tripId,
        graphCmsLink: additionalErrorData?.id
          ? getAdminLinks(additionalErrorData.id, "", "")[0]?.url
          : undefined,
      },
    };

    if (isPreview || isDev()) {
      // eslint-disable-next-line no-console
      console.error(error);
      return;
    }

    lazyCaptureException(groupedError, errorContext);
  }
};

const VPAggregatedContexts = ({
  destinationName,
  destinationId,
  tripId,
  id,
  isPreview,
  isDeleted,
  children,
}: {
  destinationName?: string;
  destinationId?: string;
  tripId: string;
  id?: string;
  isPreview: boolean;
  isDeleted?: boolean;
  children?: React.ReactNode;
}) => {
  const { selectedDates } = useContext(VPStateContext);
  const { origin, originId, flightsLoadError } = useContext(VPFlightStateContext);
  const { selectedCarId, selectedCarOffer, driverAge, driverCountryCode, carsLoadError } =
    useContext(VPCarStateContext);
  const { occupancies, staysLoadError } = useContext(VPStayStateContext);
  const { onSadPathWithoutParams } = useContext(VPCallbackContext);
  const { onSetStayLoadError } = useContext(VPStayCallbackContext);
  const { onCarResultsError } = useContext(VPCarCallbackContext);
  const { onFlightsResultsError } = useContext(VPFlightCallbackContext);
  const { carLocationId, carLocationName } = STATIC_CAR_LOCATION_INFO;
  const { from, to } = selectedDates;
  const initialBaggage = useMemo(
    () => ({
      adult: { handBags: [], holdBags: [] },
      child: { handBags: [], holdBags: [] },
      infant: { handBags: [], holdBags: [] },
    }),
    []
  );
  const numberOfTravelers = getTravelersFromOccupancies(occupancies);
  const dateOfDeparture = useMemo(
    () => constructQueryFromSelectedDates(selectedDates).dateFrom || "",
    [selectedDates]
  );
  const router = useRouter();
  const vpSearchBaseUrl = useDynamicUrl("vacationPackages" as PageType);
  const { marketplaceUrl } = useSettings();
  const [shouldShowSadPathMessage, setShouldShowSadPathMessage] = useState(false);
  const [actualQueryParams] = useVacationSearchQueryParams();
  const { t } = useTranslation(Namespaces.vacationPackageNs);
  const encodedOccupancies = encodeOccupanciesToArrayString(occupancies);
  const queryParams = useMemo(
    () =>
      getVPQueryParamsString({
        ...constructQueryFromSelectedDates(selectedDates),
        originId,
        originCountryId: driverCountryCode,
        originName: origin,
        destinationId,
        destinationName,
        occupancies: encodedOccupancies,
      }),
    [
      destinationId,
      destinationName,
      driverCountryCode,
      origin,
      originId,
      selectedDates,
      encodedOccupancies,
    ]
  );

  const onVPSadPathWithoutParams = useCallback(
    (isSadPathWithoutParams: boolean) => {
      onSadPathWithoutParams(isSadPathWithoutParams);
      onSetStayLoadError(undefined);
      onCarResultsError(undefined, true);
      onFlightsResultsError(undefined, true);
    },
    [onSadPathWithoutParams, onSetStayLoadError, onCarResultsError, onFlightsResultsError]
  );
  useEffect(() => {
    const vpCriticalProductError = flightsLoadError || carsLoadError || staysLoadError || isDeleted;

    if (vpCriticalProductError) {
      const sentryArgs = {
        componentName: PageType.VACATION_PACKAGE,
        query: queryParams,
        pathname: router.asPath,
      };
      const additionalErrorData = {
        selectedDates,
        tripId,
        id,
        carLocationId,
      };
      const skipSadPath =
        isPreview ||
        window.location.hash.includes("skipSadPathModal") ||
        Boolean(staysLoadError?.message.includes(SKIP_SAD_PATH_MESSAGE_KEY)) ||
        Boolean(flightsLoadError);

      captureVPException(sentryArgs, additionalErrorData, skipSadPath, flightsLoadError);
      captureVPException(sentryArgs, additionalErrorData, skipSadPath, carsLoadError);
      captureVPException(sentryArgs, additionalErrorData, skipSadPath, staysLoadError);

      if (skipSadPath) {
        return;
      }
      if (!actualQueryParams.dateTo && !actualQueryParams.dateFrom) {
        onVPSadPathWithoutParams(true);
        return;
      }
      setShouldShowSadPathMessage(true);
    }
  }, [
    carLocationId,
    carsLoadError,
    flightsLoadError,
    id,
    isDeleted,
    isPreview,
    router,
    selectedDates,
    staysLoadError,
    tripId,
    actualQueryParams.dateTo,
    actualQueryParams.dateFrom,
    onVPSadPathWithoutParams,
    queryParams,
  ]);
  return (
    <FlightProvider
      queryAdults={numberOfTravelers.adults}
      queryChildren={numberOfTravelers.children}
      queryInfants={numberOfTravelers.infants}
      baggage={initialBaggage}
      originId={originId}
      origin={origin}
      destinationId={destinationId || ""}
      destination={destinationName || ""}
      searchPageUrl=""
      passportRequired={false}
      dateOfDeparture={dateOfDeparture}
    >
      <CarContextProvider
        isModalOpen={false}
        provider={CarProvider.CARNECT}
        toggleModal={doNothing}
        cartLink=""
        id={selectedCarId || ""}
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        from={from!}
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        to={to!}
        pickupId={carLocationId}
        dropoffId={carLocationId}
        queryPickupId={carLocationName}
        queryDropoffId={carLocationName}
        searchPageUrl={carLocationName}
        carOffer={selectedCarOffer}
        driverCountryCode={driverCountryCode}
        driverAge={driverAge}
        title=""
        queryPickupLocationName={carLocationName}
        queryDropoffLocationName={carLocationName}
        skipCalculatePrice
      >
        <VPActionStateContextProvider>
          {children}
          {shouldShowSadPathMessage && (
            <ProductChangedModal
              searchUrl={getVPLandingUrl(vpSearchBaseUrl, marketplaceUrl, router, queryParams)}
              title={t("Fully booked!")}
              description={t("Unfortunately, you just missed it.")}
              isInvalid
              namespace={Namespaces.vacationPackageNs}
            />
          )}
        </VPActionStateContextProvider>
      </CarContextProvider>
    </FlightProvider>
  );
};

export default VPAggregatedContexts;
