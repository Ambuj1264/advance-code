import { useState, useEffect, useContext } from "react";

import bookingWidgetStateContext from "../contexts/BookingWidgetStateContext";
import bookingWidgetCallbackContext from "../contexts/BookingWidgetCallbackContext";

import { getFormattedDate, yearMonthDayFormat } from "utils/dateUtils";

let cachedData: any;

const useDateAvailability = ({
  id,
  marketplace,
  currentRequestAuth,
}: {
  id: number;
  marketplace: string;
  currentRequestAuth?: string;
}) => {
  const { selectedDates } = useContext(bookingWidgetStateContext);
  const { setSelectedDates } = useContext(bookingWidgetCallbackContext);
  const [loading, setLoading] = useState(!cachedData);
  const [datesData, setDatesData] = useState<TourBookingWidgetTypes.QueryDates>(cachedData);
  const [error, setError] = useState();
  useEffect(() => {
    if (datesData) return;
    fetch(`/api/v1/tours/availabilities/date_list?id=${id}&marketplace=${marketplace}`, {
      headers: {
        Accept: "application/json",
        ...(currentRequestAuth ? { Authorization: currentRequestAuth } : {}),
      },
    })
      .then(res => res.json())
      .then(data => ({
        ...data,
        availableDates: data.dates,
        unavailableDates: data.inverse_dates,
      }))
      .then(data => {
        cachedData = data;
        setDatesData(data);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        setError(err);
      });
  }, [currentRequestAuth, datesData, id, marketplace]);
  const selectedDateFrom = selectedDates.from;
  const isSelectedDateAvailable =
    selectedDateFrom && datesData
      ? datesData.availableDates.find(
          (date: string) => date === getFormattedDate(selectedDateFrom, yearMonthDayFormat)
        )
      : true;
  if (!isSelectedDateAvailable) {
    setSelectedDates({ from: undefined, to: undefined });
  }
  return { datesData, loading, error };
};

export default useDateAvailability;
