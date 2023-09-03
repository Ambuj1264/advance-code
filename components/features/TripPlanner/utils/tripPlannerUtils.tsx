import {
  TripPlannerAttraction,
  TripPlannerDay,
  TripPlannerQueryDay,
  TripPlannerTrip,
  TripPlannerFeedbackType,
  TripPlannerQueryTrip,
  TripPlannerParameters,
} from "../types/tripPlannerTypes";

import CameraIcon from "components/icons/camera-1.svg";
import PlaneTakeOffIcon from "components/icons/plane-take-off.svg";
import PlaneLandIcon from "components/icons/plane-land.svg";
import HotelIcon from "components/icons/hotel-bedroom.svg";
import PinIcon from "components/icons/pin.svg";

export const sendFeedbackToEndpoint = async (
  feedbackType: TripPlannerFeedbackType,
  tripParams: TripPlannerParameters,
  trip: string,
  countryCode: string,
  message?: string
) => {
  const parsedTrip = JSON.parse(trip);
  const feedbackURL =
    "https://europe-central2-travel-plan-303614.cloudfunctions.net/travelplan-feedback-test-1";
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      country_code: countryCode,
      log: feedbackType.type,
      message,
      input: tripParams,
      trip: parsedTrip,
    }),
  };
  // eslint-disable-next-line no-return-await
  return await fetch(feedbackURL, requestOptions);
};

export const generateTrips = async (tripParams: TripPlannerParameters, countryCode: string) => {
  const feedbackURL =
    "https://europe-central2-travel-plan-303614.cloudfunctions.net/travelplan-trips-demo";
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "lkrnk31oi1h2115",
    },
    body: JSON.stringify({
      countryCode,
      tripDays: tripParams.duration,
      maxDrivingADay: tripParams.maxDrivingHours,
    }),
  };

  return fetch(feedbackURL, requestOptions);
};

const constructAttractionsArray = (
  attractions: TripPlannerAttraction[],
  tripId: string,
  dayIndex: string
) => {
  return attractions.map((attraction: TripPlannerAttraction, index: number) => {
    return {
      id: `attraction-${`${attraction.placeId + tripId + dayIndex}-${index}`}`,
      name: attraction.name,
      Icon: CameraIcon,
    };
  });
};

const constructTripItinerary = (travelPlanTrip: TripPlannerQueryTrip) => {
  const { trip } = travelPlanTrip;
  const { days, arrivalAirport, departureAirport } = trip;
  const itinerary = days.map((day: TripPlannerQueryDay, i: number) => {
    const id = i + 1;
    const currItinerary = [
      ...(i === 0
        ? [
            {
              id: `arrivalAirport-${arrivalAirport.placeId + id.toString()}`,
              name: arrivalAirport.airportName,
              Icon: PlaneLandIcon,
            },
          ]
        : []),
      ...constructAttractionsArray(day.attractions, trip.id, id.toString()),
      {
        id: `hotel-${day.hotel.placeId + trip.id}`,
        name: day.hotel.name,
        Icon: HotelIcon,
      },
      {
        id: `region-${trip.id}`,
        name: day.regions[0],
        Icon: PinIcon,
      },
      ...(i === days.length - 1
        ? [
            {
              id: `departureAirport-${departureAirport.placeId + id.toString()}`,
              name: departureAirport.airportName,
              Icon: PlaneTakeOffIcon,
            },
          ]
        : []),
    ];
    return {
      id,
      itinerary: currItinerary,
    } as TripPlannerDay;
  });

  return itinerary;
};

export const constructTrips = (travelPlanTrips: TripPlannerQueryTrip[]) => {
  return travelPlanTrips.map((travelPlanTrip: TripPlannerQueryTrip) => {
    const { trip, tripMapHtml } = travelPlanTrip;
    return {
      id: trip.id,
      days: constructTripItinerary(travelPlanTrip),
      mapUrl: tripMapHtml,
      tripJSON: JSON.stringify(travelPlanTrip, null, 4),
    } as TripPlannerTrip;
  });
};
