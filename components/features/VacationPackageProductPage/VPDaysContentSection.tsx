import React, { memo, useContext } from "react";
import { ApolloError } from "apollo-client";

import { findStaysByDay } from "./utils/vacationPackageUtils";
import { getItineraryWeekdays } from "./VPStaysSection/vpStaysUtils";
import VPDay from "./VPStaysSection/VPDay";
import { LeftSectionHeading4, StyledRow, VPStyledSectionContent } from "./vpShared";
import VPDayContent from "./VPStaysSection/VPDayContent";
import { findToursByDay } from "./VPToursSection/utils/vpToursUtils";
import VPDayTours from "./VPToursSection/VPDayTours";
import { VPStateContext } from "./contexts/VPStateContext";
import { VPStayStateContext } from "./contexts/VPStayStateContext";
import { VPTourStateContext } from "./contexts/VPTourStateContext";

import useActiveLocale from "hooks/useActiveLocale";
import { Namespaces } from "shared/namespaces";
import Column from "components/ui/Grid/Column";
import { TravelStopType } from "types/enums";
import { Trans } from "i18n";

const VPDaysContent = ({
  vacationPackageDays,
  vacationLength,
  createHandleTravelStopModalToggle,
  staysResult,
  staysResultLoading,
  staysResultError,
  itineraryWeekDays,
  toursResult,
  toursResultLoading,
  toursResultError,
  vacationIncludesCar,
  vacationIncludesFlight,
}: {
  vacationPackageDays: VacationPackageTypes.VacationPackageDay[];
  vacationLength: number;
  createHandleTravelStopModalToggle: (
    itemInfo: TravelStopTypes.TravelStops[],
    currentDay: TravelStopType
  ) => (travelStopInfo?: SharedTypes.Icon) => void;
  staysResult: VacationPackageTypes.VacationPackageStayProduct[];
  staysResultLoading: boolean;
  staysResultError?: ApolloError;
  itineraryWeekDays: string[];
  toursResult?: VacationPackageTypes.ToursSearchResult;
  toursResultLoading: boolean;
  toursResultError?: ApolloError;
  vacationIncludesCar?: boolean;
  vacationIncludesFlight?: boolean;
}) => {
  return (
    <>
      {vacationPackageDays.map((day: VacationPackageTypes.VacationPackageDay, index: number) => {
        const dayNumber = index + 1;
        const staysData = findStaysByDay({
          staysData: staysResult,
          dayNumber,
        });
        const toursData = toursResult?.length
          ? findToursByDay({
              toursResult,
              dayNumber,
            })
          : undefined;
        const isDepartureDay = dayNumber === vacationLength;
        const shouldShowHotels =
          !isDepartureDay && !staysResultError && (staysResultLoading || staysData?.length > 0);
        const shouldShowTours =
          !toursResultError &&
          // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
          (toursResultLoading || toursData?.length! > 0);
        const shouldOfferTransfers =
          vacationIncludesFlight && !vacationIncludesCar && (dayNumber === 1 || isDepartureDay);

        return (
          <VPDay
            key={day.id}
            itineraryDay={day}
            dayNumber={dayNumber}
            vacationLength={vacationLength}
            createHandleTravelStopModalToggle={createHandleTravelStopModalToggle}
            currentWeekDay={itineraryWeekDays[index]}
          >
            {shouldShowTours && (
              <StyledRow>
                <Column>
                  <LeftSectionHeading4>
                    <Trans ns={Namespaces.vacationPackageNs}>
                      {shouldOfferTransfers ? "Transfers and Experiences" : "Experiences"}
                    </Trans>
                  </LeftSectionHeading4>
                  <VPStyledSectionContent overflowXHidden>
                    <VPDayTours
                      dayNumber={dayNumber}
                      toursData={toursData!}
                      toursLoading={toursResultLoading}
                    />
                  </VPStyledSectionContent>
                </Column>
              </StyledRow>
            )}
            {shouldShowHotels && (
              <StyledRow>
                <Column>
                  <LeftSectionHeading4>
                    <Trans ns={Namespaces.vacationPackageNs}>Hotels</Trans>
                  </LeftSectionHeading4>
                  <VPStyledSectionContent>
                    <VPDayContent loading={staysResultLoading} data={staysData} day={dayNumber} />
                  </VPStyledSectionContent>
                </Column>
              </StyledRow>
            )}
          </VPDay>
        );
      })}
    </>
  );
};

const VPDaysContentMemoized = memo(VPDaysContent);

export const VPDaysContentSection = ({
  vacationPackageDays,
  vacationLength,
  createHandleTravelStopModalToggle,
  vacationIncludesCar,
  vacationIncludesFlight,
}: {
  vacationPackageDays: VacationPackageTypes.VacationPackageDay[];
  vacationLength: number;
  createHandleTravelStopModalToggle: (
    itemInfo: TravelStopTypes.TravelStops[],
    currentDay: TravelStopType
  ) => (travelStopInfo?: SharedTypes.Icon) => void;
  vacationIncludesCar: boolean;
  vacationIncludesFlight: boolean;
}) => {
  const activeLocale = useActiveLocale();
  const { selectedDates } = useContext(VPStateContext);
  const itineraryWeekDays = getItineraryWeekdays(vacationPackageDays, selectedDates, activeLocale);
  const { hotels, staysResultLoading, staysResultError } = useContext(VPStayStateContext);
  const { toursResults, toursResultLoading, toursResultError } = useContext(VPTourStateContext);
  return (
    <VPDaysContentMemoized
      vacationPackageDays={vacationPackageDays}
      vacationLength={vacationLength}
      createHandleTravelStopModalToggle={createHandleTravelStopModalToggle}
      staysResult={hotels}
      staysResultLoading={staysResultLoading}
      staysResultError={staysResultError}
      itineraryWeekDays={itineraryWeekDays}
      toursResult={toursResults}
      toursResultLoading={toursResultLoading}
      toursResultError={toursResultError}
      vacationIncludesCar={vacationIncludesCar}
      vacationIncludesFlight={vacationIncludesFlight}
    />
  );
};
