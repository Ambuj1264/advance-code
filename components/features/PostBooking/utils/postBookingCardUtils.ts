import styled from "@emotion/styled";

import {
  getAdultsOrChildrenLabel,
  getCarPickupOrDropoffDateLabel,
  getCheckinOrCheckoutLabel,
  getDifficultyLabel,
  getDistanceLabel,
  getFlightArrivalOrDepartureSummaryLabel,
  getFlightBagsSummaryLabel,
  getHeadingLabel,
  getInceptionLabel,
  getOpenCloseLabel,
  getPopulationLabel,
  getRoomTypesLabel,
  getTimeToSpendLabel,
  getTitleLabel,
} from "./pbCardLabelConstructionUtils";
import { filterEmptyQuickFacts } from "./postBookingUtils";

import { PostBookingTypes } from "components/features/PostBooking/types/postBookingTypes";
import {
  ITINERARY_TOUR_DIFFICULTY,
  PB_CARD_TYPE,
  PB_ITINERARY_TRAVELMODE_TYPE,
  PB_TICKET_TYPE,
} from "components/features/PostBooking/types/postBookingEnums";
import TravelplanIcon from "components/icons/vacation-widget-icon.svg";
import ForkKnifeIcon from "components/icons/fork-knife.svg";
import CarIcon from "components/icons/car.svg";
import LocationIcon from "components/icons/gps.svg";
import CocktailGlassIcon from "components/icons/cocktail-glass.svg";
import PlaneIcon from "components/icons/plane-1.svg";
import CameraIcon from "components/icons/camera-1.svg";
import HouseIcon from "components/icons/house-heart.svg";
import FlagTriangleIcon from "components/icons/flag-triangle.svg";
import TimeClockSixIcon from "components/icons/time-clock-six.svg";
import ClockAlternateIcon from "components/icons/clock-alternate.svg";
import WatchIcon from "components/icons/watch.svg";
import ResizeIcon from "components/icons/resize.svg";
import TicketIcon from "components/icons/ticket.svg";
import PlaneTakeOffIcon from "components/icons/plane-take-off.svg";
import PlaneLandIcon from "components/icons/plane-land.svg";
import PlaneCheckInIcon from "components/icons/plane-check-in.svg";
import PersonIcon from "components/icons/single-neutral-actions.svg";
import HotelBedroomIcon from "components/icons/bedroom-hotel-information.svg";
import CoffeeCupIcon from "components/icons/coffee-cup.svg";
import BagHandleIcon from "components/icons/bag-handle.svg";
import CheckInIcon from "components/icons/check-in.svg";
import CheckOutIcon from "components/icons/check-out.svg";
import PinLocationIcon from "components/icons/pin-location-1.svg";
import GlobeIcon from "components/icons/country-origin.svg";
import FamilyHomeIcon from "components/icons/family-home.svg";
import BookingNumberIcon from "components/icons/tags-check.svg";
import BudgetIcon from "components/icons/saving-piggy-dollars.svg";
import VacationEndsIcon from "components/icons/tour-end.svg";
import VacationStartsIcon from "components/icons/tour-start.svg";
import PersonWalkingIcon from "components/icons/traveler.svg";
import DifficultyEasyIcon from "components/icons/difficulty-easy.svg";
import DifficultyMediumIcon from "components/icons/difficulty-medium.svg";
import DifficultyHardIcon from "components/icons/difficulty-hard.svg";
import { formatLocalizedUrl, toDateWithoutTimezone } from "utils/dateUtils";
import { SupportedLanguages } from "types/enums";
import {
  defaultSEOImage,
  defaultVacationPackagesSEOImage,
} from "components/ui/LandingPages/utils/landingPageUtils";
import { gteImgixUrl } from "utils/imageUtils";
import { capitalize } from "utils/globalUtils";

const ReturnFlightIcon = styled(PlaneIcon)`
  transform: rotateY(180deg);
`;

export const getPBCardIcon = (cardType: PB_CARD_TYPE): React.ElementType => {
  switch (cardType) {
    case PB_CARD_TYPE.ATTRACTION:
      return CameraIcon;
    case PB_CARD_TYPE.BAR:
      return CocktailGlassIcon;
    case PB_CARD_TYPE.CAR_RENTAL:
      return CarIcon;
    case PB_CARD_TYPE.CITY:
      return LocationIcon;
    case PB_CARD_TYPE.FLIGHT_ARRIVING:
      return PlaneIcon;
    case PB_CARD_TYPE.FLIGHT_RETURN:
      return ReturnFlightIcon;
    case PB_CARD_TYPE.RESTAURANT:
      return ForkKnifeIcon;
    case PB_CARD_TYPE.STAY:
    case PB_CARD_TYPE.STAY_PRODUCT:
      return HouseIcon;
    case PB_CARD_TYPE.TOUR:
      return PersonWalkingIcon;
    default:
      return TravelplanIcon;
  }
};

const getPBProductCardDifficultyIcon = (difficulty?: ITINERARY_TOUR_DIFFICULTY) => {
  switch (difficulty) {
    case ITINERARY_TOUR_DIFFICULTY.EASY:
      return DifficultyEasyIcon;
    case ITINERARY_TOUR_DIFFICULTY.MEDIUM:
      return DifficultyMediumIcon;
    case ITINERARY_TOUR_DIFFICULTY.HARD:
      return DifficultyHardIcon;
    default:
      return DifficultyEasyIcon;
  }
};

const constructPBProductCardQuickFacts = (
  card: PostBookingTypes.ItineraryCard,
  activeLocale: SupportedLanguages,
  tFunc: TFunction
): SharedTypes.QuickFact[] => {
  switch (card.cardType) {
    case PB_CARD_TYPE.ATTRACTION:
      return [
        {
          Icon: CameraIcon,
          id: "icon-1",
          label: "Type",
          value: card.type ?? "",
        },
        {
          Icon: FlagTriangleIcon,
          id: "icon-2",
          label: "Founded",
          value: getInceptionLabel(card, activeLocale),
        },
        {
          Icon: ClockAlternateIcon,
          id: "icon-3",
          label: "Open",
          value: getOpenCloseLabel(card),
        },
        {
          Icon: TicketIcon,
          id: "icon-4",
          label: "Entrance",
          value: card.entrance ?? "",
        },
        {
          Icon: TimeClockSixIcon,
          id: "icon-5",
          label: "Spend",
          value: getTimeToSpendLabel(card, tFunc),
        },
        {
          Icon: LocationIcon,
          id: "icon-6",
          label: "Address",
          value: card.address ?? "",
        },
      ];

    case PB_CARD_TYPE.STAY:
    case PB_CARD_TYPE.STAY_PRODUCT:
      return [
        {
          Icon: CheckInIcon,
          id: "icon-1",
          label: "Check-in date",
          value: getCheckinOrCheckoutLabel(
            {
              date: card.dateOfCheckin ?? "",
              timeString: card.timeOfCheckin ?? "",
              isCheckin: true,
            },
            activeLocale,
            tFunc
          ),
        },
        {
          Icon: CheckOutIcon,
          id: "icon-2",
          label: "Check-out date",
          value: getCheckinOrCheckoutLabel(
            {
              date: card.dateOfCheckout ?? "",
              timeString: card.timeOfCheckout ?? "",
              isCheckin: false,
            },
            activeLocale,
            tFunc
          ),
        },
        {
          Icon: BookingNumberIcon,
          id: "icon-3",
          label: "Booking number",
          value: card.bookingNumber ?? "",
        },
        {
          Icon: PersonIcon,
          id: "icon-4",
          label: "Guests",
          value: getAdultsOrChildrenLabel(card, tFunc),
        },
        {
          Icon: HotelBedroomIcon,
          id: "icon-5",
          label: "Room",
          value: getRoomTypesLabel(card),
        },
        {
          Icon: CoffeeCupIcon,
          id: "icon-6",
          label: "Breakfast",
          value: tFunc(card.isBreakfastIncluded ? "included" : ""),
        },
      ];

    case PB_CARD_TYPE.RESTAURANT:
    case PB_CARD_TYPE.BAR:
      return [
        {
          Icon: ForkKnifeIcon,
          id: "icon-1",
          label: "Type",
          value: card.type ?? "",
        },
        {
          Icon: ClockAlternateIcon,
          id: "icon-2",
          label: "Open",
          value: getOpenCloseLabel(card),
        },
        {
          Icon: BudgetIcon,
          id: "icon-3",
          label: "Budget",
          value: card.budget ?? "",
        },
        {
          Icon: LocationIcon,
          id: "icon-4",
          label: "Distance",
          value: getDistanceLabel(card, tFunc),
        },
      ];

    case PB_CARD_TYPE.CAR_RENTAL:
      return [
        {
          Icon: CheckInIcon,
          id: "icon-1",
          label: "Pick-up date",
          value: getCarPickupOrDropoffDateLabel(
            card.dateOfPickupFrom ?? "",
            card.dateOfPickupTo ?? "",
            activeLocale
          ),
        },
        {
          Icon: LocationIcon,
          id: "icon-2",
          label: "Pick-up location",
          value: card.pickUpLocation ?? "",
        },
        {
          Icon: CarIcon,
          id: "icon-3",
          label: "Car rental",
          value: card.name ?? "",
        },
        {
          Icon: BookingNumberIcon,
          id: "icon-4",
          label: "Booking number",
          value: card.bookingNumber ?? "",
        },
        {
          Icon: CheckOutIcon,
          id: "icon-5",
          label: "Drop-off date",
          value: getCarPickupOrDropoffDateLabel(
            card.dateOfDropoffFrom ?? "",
            card.dateOfDropoffTo ?? "",
            activeLocale
          ),
        },
        {
          Icon: LocationIcon,
          id: "icon-6",
          label: "Drop-off location",
          value: card.dropOffLocation ?? "",
        },
      ];

    case PB_CARD_TYPE.FLIGHT_ARRIVING:
    case PB_CARD_TYPE.FLIGHT_RETURN:
      return [
        {
          Icon: PlaneTakeOffIcon,
          id: "icon-1",
          label: "Departure",
          value: getFlightArrivalOrDepartureSummaryLabel(
            {
              airportCode: card.departureAirportCode,
              airportCityName: card.departureCityName,
              airportName: card.departureAirportName,
              date: card.departureDate,
            },
            activeLocale
          ),
        },
        {
          Icon: PlaneLandIcon,
          id: "icon-2",
          label: "Arrival",
          value: getFlightArrivalOrDepartureSummaryLabel(
            {
              airportCode: card.arrivalAirportCode,
              airportName: card.arrivalAirportName,
              airportCityName: card.arrivalCityName,
              date: card.arrivalDate,
            },
            activeLocale
          ),
        },
        {
          Icon: TicketIcon,
          id: "icon-3",
          label: "Flight number",
          value: card.flightNumber ?? "",
        },
        {
          Icon: PlaneCheckInIcon,
          id: "icon-4",
          label: "Airline",
          value: card.airlineName ?? "",
        },
        {
          Icon: PersonIcon,
          id: "icon-5",
          label: "Passengers",
          value: getAdultsOrChildrenLabel(card, tFunc),
        },
        {
          Icon: BagHandleIcon,
          id: "icon-6",
          label: "Bags",
          value: getFlightBagsSummaryLabel(card, tFunc),
        },
      ];

    case PB_CARD_TYPE.CITY:
      return [
        {
          Icon: LocationIcon,
          id: "icon-1",
          label: "Type",
          value: capitalize(card.type ?? ""),
        },
        {
          Icon: GlobeIcon,
          id: "icon-2",
          label: "Country",
          value: card.countryName ?? "",
        },
        {
          Icon: PinLocationIcon,
          id: "icon-3",
          label: "Region Name",
          value: card.region ?? "",
        },
        {
          Icon: WatchIcon,
          id: "icon-4",
          label: "Timezone",
          value: card.timezone ?? "",
        },
        {
          Icon: ResizeIcon,
          id: "icon-5",
          label: "Size",
          value: card.size ? `${card.size} km²` : "",
        },
        {
          Icon: FamilyHomeIcon,
          id: "icon-6",
          label: "Population",
          value: getPopulationLabel(card),
        },
      ];
    case PB_CARD_TYPE.TOUR:
      return [
        {
          Icon: ClockAlternateIcon,
          id: "icon-1",
          label: "Starts",
          value: getOpenCloseLabel(card),
        },
        {
          Icon: TimeClockSixIcon,
          id: "icon-2",
          label: "Duration",
          value: getTimeToSpendLabel(card, tFunc),
        },
        {
          Icon: PersonIcon,
          id: "icon-3",
          label: "Travelers",
          value: getAdultsOrChildrenLabel(card, tFunc),
        },
        {
          Icon: getPBProductCardDifficultyIcon(card.difficulty),
          id: "icon-4",
          label: "Difficulty",
          value: getDifficultyLabel(card, tFunc),
        },
        {
          Icon: LocationIcon,
          id: "icon-5",
          label: "Starting location",
          value: card.startingLocation ?? "",
        },
        {
          Icon: BookingNumberIcon,
          id: "icon-6",
          label: "Booking number",
          value: card.bookingNumber ?? "",
        },
      ];
    default:
      return [];
  }
};

const intlFormatOptionsVacationCard: Intl.DateTimeFormatOptions = {
  weekday: "short",
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  hourCycle: "h23",
  minute: "numeric",
};

const constructPBVacationProductCardQuickFacts = (
  card: PostBookingTypes.ItineraryCard,
  activeLocale: SupportedLanguages,
  t: TFunction
): SharedTypes.QuickFact[] => {
  return [
    {
      Icon: VacationStartsIcon,
      id: "icon-1",
      label: "Vacation starts",
      value: card.dateOfVacationStart
        ? formatLocalizedUrl(
            toDateWithoutTimezone(new Date(card.dateOfVacationStart)),
            activeLocale,
            intlFormatOptionsVacationCard,
            "EEE MMM dd hh:mm"
          )
        : "",
    },
    {
      Icon: VacationEndsIcon,
      id: "icon-2",
      label: "Vacation ends",
      value: card.dateOfVacationEnd
        ? formatLocalizedUrl(
            toDateWithoutTimezone(new Date(card.dateOfVacationEnd)),
            activeLocale,
            intlFormatOptionsVacationCard,
            "EEE MMM dd hh:mm"
          )
        : "",
    },
    {
      Icon: PersonIcon,
      id: "icon-3",
      label: "Travelers",
      value: getAdultsOrChildrenLabel(card, t),
    },
    {
      Icon: HouseIcon,
      id: "icon-4",
      label: "Hotel",
      value: card.numberOfStayNights
        ? t("{nrOfNights} nights", {
            nrOfNights: card.numberOfStayNights,
          })
        : "",
    },
    {
      Icon: PlaneIcon,
      id: "icon-5",
      label: "Flights",
      value: t(card.hasFlights ? "Yes" : "No"),
    },
    {
      Icon: CarIcon,
      id: "icon-6",
      label: "Car rental",
      value: t(card.hasCarRentals ? "Yes" : "No"),
    },
  ];
};

export const getCardImageUrlOrDefault = (
  type: PB_CARD_TYPE,
  imageUrl?: string,
  imageHandle?: string
) => {
  if (imageHandle) {
    return `${gteImgixUrl}/${imageHandle}`;
  }

  if (imageUrl) {
    return imageUrl;
  }

  switch (type) {
    case PB_CARD_TYPE.CAR_RENTAL:
      return `${gteImgixUrl}/5nwFQgQ9ilWL2ZfDjdrQ`;
    case PB_CARD_TYPE.STAY:
    case PB_CARD_TYPE.STAY_PRODUCT:
      return `${gteImgixUrl}/nopEjsEdQuGX0RqBUxZm`;
    case PB_CARD_TYPE.TOUR:
      return `${gteImgixUrl}/bAvL6ZqtQyWtpZg2JgQJ`;
    case PB_CARD_TYPE.FLIGHT_ARRIVING:
    case PB_CARD_TYPE.FLIGHT_RETURN:
      return `${gteImgixUrl}/ieTAEspR7qNXDt3bqjFJ`;

    case PB_CARD_TYPE.ATTRACTION:
      return `${gteImgixUrl}/3wioAyjRa6CBJUOzzOU1`;
    case PB_CARD_TYPE.BAR:
      return `${gteImgixUrl}/HrvlXxTMS3KONUx6iR3v`;
    case PB_CARD_TYPE.RESTAURANT:
      return `${gteImgixUrl}/onf4zgrOQlGH6HIcVDkC`;
    case PB_CARD_TYPE.CITY:
      return `${gteImgixUrl}/uKYDlcViTwW974ze7Psl`;

    case PB_CARD_TYPE.TRAVELPLAN:
      return defaultVacationPackagesSEOImage.url;

    default:
      return defaultSEOImage.url;
  }
};

export const getTicket = (
  card: Pick<PostBookingTypes.ItineraryCard, "voucherUrl" | "eTicketUrl" | "boardingPassButtonUrl">
): PostBookingTypes.PB_TICKET | undefined => {
  if (card.voucherUrl) {
    return {
      url: card.voucherUrl,
      type: PB_TICKET_TYPE.VOUCHER,
    };
  }

  if (card.boardingPassButtonUrl) {
    return {
      url: card.boardingPassButtonUrl,
      type: PB_TICKET_TYPE.FLIGHT_BOARDING_PASS,
    };
  }

  if (card.eTicketUrl) {
    return {
      url: card.eTicketUrl,
      type: PB_TICKET_TYPE.FLIGHT_ETICKET,
    };
  }

  return undefined;
};

const getCoords = (card: PostBookingTypes.ItineraryCard) => {
  return card?.googlePlace
    ? {
        coords: {
          lat: card.googlePlace.latitude,
          lon: card.googlePlace.longitude,
        },
        googlePlaceId: card.googlePlace.googlePlaceId,
      }
    : {
        coords: {
          lat: card.latitude,
          lon: card.longitude,
        },
      };
};

export const constructPBProductCard = (
  card: PostBookingTypes.ItineraryCard,
  activeLocale: SupportedLanguages,
  // eslint-disable-next-line default-param-last
  streetViewEnabled = false,
  t: TFunction
): PostBookingTypes.ProductCard => {
  const ticket = getTicket(card);
  return {
    id: card.id,
    orderId: card.orderId,
    type: card.cardType,
    isExpired: card.isExpired ?? false,
    rating: card.googlePlace?.userRatingAverage ?? 0,
    reviewsCount: card.googlePlace?.userRatingCount ?? 0,
    photoReference: card.googlePlace?.photoReference,
    heading: getHeadingLabel(card, t),
    title: getTitleLabel(card, t),
    image: getCardImageUrlOrDefault(card.cardType, card.imageUrl, card.imageHandle),
    bookingReference: card.bookingNumber,
    quickfacts: filterEmptyQuickFacts(constructPBProductCardQuickFacts(card, activeLocale, t)),
    bookingId: card.bookingId,
    ...(card.tourId && { tourId: card.tourId }),
    ...(card.phoneNumber && { phoneno: card.phoneNumber }),
    ...getCoords(card),
    ...(ticket ? { ticket } : {}),
    streetViewEnabled,
    ...(card.travelMode && { travelMode: card.travelMode }),
  };
};

export const constructPBProductVacationCard = (
  card: PostBookingTypes.ItineraryCard,
  activeLocale: SupportedLanguages,
  t: TFunction
): PostBookingTypes.ProductCard => {
  return {
    id: card.id,
    isExpired: card.isExpired ?? false,
    type: PB_CARD_TYPE.TRAVELPLAN,
    rating: 0,
    reviewsCount: 0,
    orderId: card.orderId,
    bookingId: card.bookingId,
    heading: t("Vacation Package"),
    title: card.name ?? "",
    image: getCardImageUrlOrDefault(PB_CARD_TYPE.TRAVELPLAN, card.imageUrl),
    quickfacts: filterEmptyQuickFacts(
      constructPBVacationProductCardQuickFacts(card, activeLocale, t)
    ),
  };
};

export const castTravelModeType = (
  travelMode?: PB_ITINERARY_TRAVELMODE_TYPE
): PostBookingTypes.TravelModeForGoogleApi => {
  switch (travelMode) {
    case PB_ITINERARY_TRAVELMODE_TYPE.DRIVING:
      return "driving";
    case PB_ITINERARY_TRAVELMODE_TYPE.WALK:
      return "walking";
    default:
      return "transit";
  }
};
