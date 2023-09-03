import React, { useMemo } from "react";
import { useQuery } from "@apollo/react-hooks";
import { useTranslation } from "react-i18next";

import { constructVPSearchQueryVariables } from "../VacationPackages/utils/vacationPackagesUtils";
import useVacationSearchQueryParams from "../VacationPackages/utils/useVacationSearchQueryParams";
import { encodeOccupanciesToArrayString } from "../AccommodationSearchPage/utils/useAccommodationSearchQueryParams";

import VPSimilarRoadTrips from "./VPSimilarRoadTrips";
import { VPStyledSectionContent } from "./vpShared";

import { cacheOnClient30M } from "utils/apiUtils";
import Section from "components/ui/Section/Section";
import { Namespaces } from "shared/namespaces";
import VacationPackagesSearchQuery from "components/features/VacationPackages/queries/VacationPackagesSearchQuery.graphql";
import { getFormattedDate, yearMonthDayFormat } from "utils/dateUtils";
import { MobileContainer } from "components/ui/Grid/Container";
import { LeftSectionHeading } from "components/ui/Section/SectionHeading";
import { getTravelersFromOccupancies } from "components/ui/RoomAndGuestPicker/utils/roomAndGuestUtils";

export const VPSectionSimilarRoadTrips = ({
  destinationCountryId,
  destinationCountryName,
  selectedDates,
  tripId,
  occupancies,
}: {
  selectedDates: SharedTypes.SelectedDates;
  tripId: string;
  occupancies: StayBookingWidgetTypes.Occupancy[];
  destinationCountryId?: string;
  destinationCountryName?: string;
}) => {
  const { t } = useTranslation(Namespaces.vacationPackageNs);

  const [queryParams] = useVacationSearchQueryParams();
  const queryParamsAvailable = Object.values(queryParams).some(val => val);
  const { dateFrom, dateTo } = queryParams;
  const totalGuests = getTravelersFromOccupancies(occupancies);
  const queryParamOccupancies = encodeOccupanciesToArrayString(occupancies);
  const similarTripsQueryParams = useMemo(() => {
    if (queryParamsAvailable) {
      return constructVPSearchQueryVariables({
        queryParams: {
          destinationId: destinationCountryId,
          destinationName: destinationCountryName,
          occupancies: queryParamOccupancies,
          dateFrom,
          dateTo,
        },
        numberOfItems: 4,
      });
    }

    const dateFromDefault = selectedDates.from
      ? getFormattedDate(selectedDates.from, yearMonthDayFormat)
      : undefined;
    const dateToDefault = selectedDates.to
      ? getFormattedDate(selectedDates.to, yearMonthDayFormat)
      : undefined;

    return constructVPSearchQueryVariables({
      queryParams: {
        destinationId: destinationCountryId,
        destinationName: destinationCountryName,
        ...totalGuests,
        dateFrom: dateFromDefault,
        dateTo: dateToDefault,
        occupancies: queryParamOccupancies,
      },
      numberOfItems: 4,
    });
  }, [
    queryParamOccupancies,
    dateFrom,
    dateTo,
    destinationCountryId,
    destinationCountryName,
    queryParamsAvailable,
    selectedDates,
    totalGuests,
  ]);

  const {
    data: similarRoadTrips,
    loading: similarRoadTripsLoading,
    error: similarRoadTripsError,
  } = useQuery<QueryVacationPackagesSearchTypes.VacationPackagesSearch>(
    VacationPackagesSearchQuery,
    {
      variables: similarTripsQueryParams,
      context: { headers: cacheOnClient30M },
      skip: !destinationCountryId || !destinationCountryName,
    }
  );

  const vpSimilarRoadTrips =
    similarRoadTrips?.vacationPackages.nodes?.filter(node => node.id !== tripId).slice(0, 3) ?? [];

  return (
    <Section id="similarPackages">
      <MobileContainer>
        {(similarRoadTripsLoading || vpSimilarRoadTrips.length > 0) && (
          <LeftSectionHeading>{t("Similar Vacation Packages")}</LeftSectionHeading>
        )}
        <VPStyledSectionContent>
          <VPSimilarRoadTrips
            loading={similarRoadTripsLoading}
            data={vpSimilarRoadTrips}
            error={similarRoadTripsError}
          />
        </VPStyledSectionContent>
      </MobileContainer>
    </Section>
  );
};
