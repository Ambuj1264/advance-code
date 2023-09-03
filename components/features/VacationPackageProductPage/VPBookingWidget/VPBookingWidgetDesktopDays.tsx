import React, { Fragment, useContext } from "react";

import { findStaysByDay } from "../utils/vacationPackageUtils";
import { findToursByDay } from "../VPToursSection/utils/vpToursUtils";
import { VPStayStateContext } from "../contexts/VPStayStateContext";
import { VPTourStateContext } from "../contexts/VPTourStateContext";
import { VPFlightStateContext } from "../contexts/VPFlightStateContext";
import { VPCarStateContext } from "../contexts/VPCarStateContext";

import VPBookingWidgetDaySectionHeader from "./VPBookingWidgetDaySectionHeader";
import VPBookingWidgetStayDropdownContent from "./VPBookingWidgetStayDropdownContent";
import VPBookingWidgetStaysDayDropdown from "./VPBookingWidgetStaysDayDropdown";
import VPBookingWidgetToursDayDropdown from "./VPBookingWidgetToursDayDropdown";
import VPBookingWidgetTourDropdownContent from "./VPBookingWidgetTourDropdownContent";
import { getExperiencesLabel } from "./utils/vpBookingWidgetUtils";

export type createOpenStateHandlerType = (dayNumber: number) => (isOpen: boolean) => void;

export const VPBookingWidgetDesktopDays = ({
  vacationPackageDays,
  selectedDates,
  selectedToursProductIds,
  activeDropdown,
  createOnStayOpenStateChangeHandler,
  createOnTourOpenStateChangeHandler,
}: {
  selectedDates: SharedTypes.SelectedDates;
  selectedToursProductIds?: VacationPackageTypes.SelectedToursProductIds[];
  vacationPackageDays: VacationPackageTypes.VacationPackageDay[];
  activeDropdown: VPSearchWidgetTypes.activeDropdownType;
  createOnStayOpenStateChangeHandler: createOpenStateHandlerType;
  createOnTourOpenStateChangeHandler: createOpenStateHandlerType;
}) => {
  const { hotels, staysResultLoading, staysResultError, selectedHotelsRooms } =
    useContext(VPStayStateContext);

  const { toursResults, toursResultLoading, toursResultError } = useContext(VPTourStateContext);
  const { vacationIncludesFlight } = useContext(VPFlightStateContext);
  const { vacationIncludesCar } = useContext(VPCarStateContext);
  const isStaysDataReady = Boolean(!staysResultLoading && !staysResultError);
  const isToursDataReady = Boolean(!toursResultLoading && !toursResultError);
  const shouldShowTours =
    !toursResultError &&
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    (toursResultLoading || toursResults?.length! > 0);

  return (
    <>
      {vacationPackageDays.map((day: VacationPackageTypes.VacationPackageDay, index: number) => {
        const dayNumber = index + 1;
        const stayProductsByDay = findStaysByDay({
          staysData: hotels,
          dayNumber,
        });
        const tourProductsByDay = shouldShowTours
          ? findToursByDay({
              toursResult: toursResults,
              dayNumber,
            })
          : undefined;

        const onStayOpenStateChange = createOnStayOpenStateChangeHandler(dayNumber);
        const onTourOpenStateChange = createOnTourOpenStateChangeHandler(dayNumber);
        const isArrivalDay = dayNumber === 1;
        const isDepartureDay = dayNumber === vacationPackageDays.length;
        const shouldShowStaysSection = staysResultLoading || stayProductsByDay.length > 0;
        const experiencesLabel = getExperiencesLabel(
          vacationIncludesFlight,
          vacationIncludesCar,
          isArrivalDay,
          isDepartureDay
        );
        const hasTours = Boolean(tourProductsByDay?.length);
        return (
          <Fragment key={`${day.id}${dayNumber}`}>
            <VPBookingWidgetDaySectionHeader
              dayNumber={dayNumber}
              vpDay={day}
              selectedDates={selectedDates}
            />
            {(toursResultLoading || hasTours) && (
              <VPBookingWidgetToursDayDropdown
                dayNumber={dayNumber}
                tourProducts={tourProductsByDay}
                selectedTourProductIds={selectedToursProductIds}
                isToursDataReady={isToursDataReady}
                isLoading={toursResultLoading}
                activeDropdown={activeDropdown}
                onOpenStateChange={onTourOpenStateChange}
                experiencesLabel={experiencesLabel}
              >
                <VPBookingWidgetTourDropdownContent
                  dayNumber={dayNumber}
                  tourProducts={tourProductsByDay}
                  selectedTourProductIds={selectedToursProductIds}
                  isLoading={toursResultLoading}
                  experiencesLabel={experiencesLabel}
                />
              </VPBookingWidgetToursDayDropdown>
            )}
            {!isDepartureDay && shouldShowStaysSection ? (
              <VPBookingWidgetStaysDayDropdown
                stayProducts={stayProductsByDay}
                selectedHotelsRooms={selectedHotelsRooms}
                isStaysDataReady={isStaysDataReady && stayProductsByDay.length > 0}
                isLoading={staysResultLoading}
                activeDropdown={activeDropdown}
                onOpenStateChange={onStayOpenStateChange}
                dayNumber={dayNumber}
                hasTours={toursResultLoading || hasTours}
              >
                <VPBookingWidgetStayDropdownContent
                  dayNumber={dayNumber}
                  stayProducts={stayProductsByDay}
                  onOpenStateChange={onStayOpenStateChange}
                />
              </VPBookingWidgetStaysDayDropdown>
            ) : null}
          </Fragment>
        );
      })}
    </>
  );
};
