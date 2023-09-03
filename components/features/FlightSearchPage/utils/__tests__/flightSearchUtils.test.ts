import { constructFlightProductUrl } from "../flightSearchUtils";

describe("constructFlightProductUrl", () => {
  const productUrl = "flights";
  const bookingToken = "BsjdiogrweffwijeosasdfBsedfifDfuaDgasjgRasRTTF";
  const adults = 2;
  const children = 1;
  const infants = 1;
  const originId = "CPH";
  const origin = "Copenhagen";
  const destinationId = "KEF";
  const destination = "Iceland";
  const dateFrom = "22-02-24";
  const returnDateFrom = "24-02-24";

  const cabinType = "M";
  test("flight product url with only adults", () => {
    expect(
      constructFlightProductUrl({
        productUrl,
        bookingToken,
        adults,
        originId,
        origin,
        destinationId,
        destination,
        dateFrom,
        returnDateFrom,
        cabinType,
      })
    ).toEqual(
      "flights/details?adults=2&bookingToken=BsjdiogrweffwijeosasdfBsedfifDfuaDgasjgRasRTTF&originId=CPH&origin=Copenhagen&destinationId=KEF&destination=Iceland&dateFrom=22-02-24&returnDateFrom=24-02-24&flightType=round&cabinType=M"
    );
  });
  test("flight product url with adults and children", () => {
    expect(
      constructFlightProductUrl({
        productUrl,
        bookingToken,
        adults,
        children,
        originId,
        origin,
        destinationId,
        destination,
        dateFrom,
        returnDateFrom,
        cabinType,
      })
    ).toEqual(
      "flights/details?adults=2&children=1&bookingToken=BsjdiogrweffwijeosasdfBsedfifDfuaDgasjgRasRTTF&originId=CPH&origin=Copenhagen&destinationId=KEF&destination=Iceland&dateFrom=22-02-24&returnDateFrom=24-02-24&flightType=round&cabinType=M"
    );
  });
  test("flight product url with adults and infants", () => {
    expect(
      constructFlightProductUrl({
        productUrl,
        bookingToken,
        adults,
        infants,
        originId,
        origin,
        destinationId,
        destination,
        dateFrom,
        returnDateFrom,
        cabinType,
      })
    ).toEqual(
      "flights/details?adults=2&infants=1&bookingToken=BsjdiogrweffwijeosasdfBsedfifDfuaDgasjgRasRTTF&originId=CPH&origin=Copenhagen&destinationId=KEF&destination=Iceland&dateFrom=22-02-24&returnDateFrom=24-02-24&flightType=round&cabinType=M"
    );
  });
  test("flight product url with all passenger types", () => {
    expect(
      constructFlightProductUrl({
        productUrl,
        bookingToken,
        adults,
        children,
        infants,
        originId,
        origin,
        destinationId,
        destination,
        dateFrom,
        returnDateFrom,
        cabinType,
      })
    ).toEqual(
      "flights/details?adults=2&children=1&infants=1&bookingToken=BsjdiogrweffwijeosasdfBsedfifDfuaDgasjgRasRTTF&originId=CPH&origin=Copenhagen&destinationId=KEF&destination=Iceland&dateFrom=22-02-24&returnDateFrom=24-02-24&flightType=round&cabinType=M"
    );
  });
  test("flight product url with all passenger types", () => {
    expect(
      constructFlightProductUrl({
        productUrl,
        bookingToken,
        children,
        infants,
        originId,
        origin,
        destinationId,
        destination,
        dateFrom,
        returnDateFrom,
        cabinType,
      })
    ).toEqual(
      "flights/details?adults=1&children=1&infants=1&bookingToken=BsjdiogrweffwijeosasdfBsedfifDfuaDgasjgRasRTTF&originId=CPH&origin=Copenhagen&destinationId=KEF&destination=Iceland&dateFrom=22-02-24&returnDateFrom=24-02-24&flightType=round&cabinType=M"
    );
  });
  test("flight product url with no return date", () => {
    expect(
      constructFlightProductUrl({
        productUrl,
        bookingToken,
        originId,
        origin,
        destinationId,
        destination,
        dateFrom,
        cabinType,
      })
    ).toEqual(
      "flights/details?adults=1&bookingToken=BsjdiogrweffwijeosasdfBsedfifDfuaDgasjgRasRTTF&originId=CPH&origin=Copenhagen&destinationId=KEF&destination=Iceland&dateFrom=22-02-24&flightType=oneway&cabinType=M"
    );
  });
});
