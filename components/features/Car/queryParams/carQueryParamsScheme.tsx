import { StringParam } from "use-query-params";

const CarQueryParamsScheme = {
  carId: StringParam,
  f: StringParam,
  from: StringParam,
  t: StringParam,
  to: StringParam,
  provider: StringParam,
  pickup_id: StringParam,
  dropoff_id: StringParam,
  driverAge: StringParam,
  driverCountryCode: StringParam,
  category: StringParam,
  pickupLocationName: StringParam,
  dropoffLocationName: StringParam,
  secondOfferId: StringParam,
  editCarOfferCartId: StringParam,
};

export default CarQueryParamsScheme;
