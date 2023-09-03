import { flatten } from "fp-ts/lib/Array";

export const hasFlightPriceInputChanged = (
  flightPriceInput: VacationPackageTypes.FlightPriceInput[],
  newFlightPriceInput: VacationPackageTypes.FlightPriceInput[]
) => {
  const oldInput = flightPriceInput[0];
  const newInput = newFlightPriceInput[0];
  const oldPassengers = oldInput?.passengers;
  const newPassengers = newInput?.passengers;
  const oldBaggage = flatten(oldPassengers?.map(passenger => passenger.baggage || []) ?? [[]]);
  const newBaggage = flatten(newPassengers?.map(passenger => passenger.baggage || []) ?? [[]]);
  const isSameBaggage =
    newBaggage.length === oldBaggage.length &&
    newBaggage.every((bag, index) => bag === oldBaggage[index]);
  const isSameFlight = oldInput?.bookingToken === newInput?.bookingToken;
  const isSamePassengers = oldInput?.numberOfPassengers === newInput?.numberOfPassengers;
  return !isSameBaggage || !isSameFlight || !isSamePassengers;
};
