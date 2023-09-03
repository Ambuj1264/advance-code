import { useState, useEffect } from "react";

import lazyCaptureException from "lib/lazyCaptureException";

const useTimeAvailability = ({
  date,
  id,
  marketplace,
  skip,
  currentRequestAuth,
  onCompletedTimeAvailability,
}: {
  date: string;
  id: number;
  marketplace: string;
  skip: boolean;
  currentRequestAuth?: string;
  onCompletedTimeAvailability: (
    data: ReadonlyArray<TourBookingWidgetTypes.TimeWithPricesData>
  ) => void;
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    if (skip) {
      return;
    }
    setLoading(true);
    fetch(
      `/api/v1/tours/availabilities/time_list?date=${date}&id=${id}&marketplace=${marketplace}`,
      {
        headers: {
          Accept: "application/json",
          ...(currentRequestAuth ? { Authorization: currentRequestAuth } : {}),
        },
      }
    )
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          return data.map((time: TourBookingWidgetTypes.QueryTimeWithPrices) => ({
            ...time,
            isFlexible: time.departure_flex,
            pickupTime: time.pickup_time,
            departureTime: time.time_plus_pickup_duration,
            minNumberOfTravelers: time.min,
            maxNumberOfTravelers: time.max,
            pickupPrices: time.pickup_prices,
            isPickupAvailable: time.pickup_available,
            // prices for regular tour.
            priceAdult: time.price_adult,
            priceAdult2: time.price_adult_2,
            priceAdult3: time.price_adult_3,
            priceAdult4: time.price_adult_4,
            priceAdult5: time.price_adult_5,
            priceChild: time.price_child,
            priceChild2: time.price_child_2,
            priceChild3: time.price_child_3,
            priceChild4: time.price_child_4,
            priceChild5: time.price_child_5,
            priceTeenager: time.price_teenager,
            priceTeenager2: time.price_teenager_2,
            priceTeenager3: time.price_teenager_3,
            priceTeenager4: time.price_teenager_4,
            priceTeenager5: time.price_teenager_5,
          }));
        }
        lazyCaptureException(
          new Error(`Error on marketplace tour page while fetching availability query`),
          {
            errorInfo: data,
          }
        );
        throw new Error("Availabilty query is not responding with a properly structured json");
      })
      .then(data => {
        if (data) {
          onCompletedTimeAvailability(
            data as ReadonlyArray<TourBookingWidgetTypes.TimeWithPricesData>
          );
        }
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        setError(err);
      });
  }, [currentRequestAuth, date, id, marketplace, onCompletedTimeAvailability, skip]);

  return { isLoadingAvailableTimes: loading, error };
};

export default useTimeAvailability;
