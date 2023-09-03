import {
  getHexColor,
  Point,
  pointsToString,
  toRadians,
  toDegrees,
  getCircleCoordinates,
  getStaticCirclePath,
  getStaticMapUrl,
  getGoogleEmbeddedPlaceUrl,
  getGoogleMapStreetViewPageUrl,
  getGoogleMapDirectionPageUrl,
  getEmbeddedStreetViewUrl,
} from "./mapUtils";

describe("getHexColor", () => {
  test("should convert #color to hex format", () => {
    expect(getHexColor("#ffd8d8")).toBe("0xffd8d8");
    expect(getHexColor("#FFFFFF")).toBe("0xFFFFFF");
    expect(getHexColor("#FFFFFFAA")).toBe("0xFFFFFFAA");
  });

  test("should convert #color to hex format and apply opacity", () => {
    expect(getHexColor("#ffd8d8", 0.25)).toBe("0xffd8d840");
    expect(getHexColor("#FFFFFF", 0.5)).toBe("0xFFFFFF80");
    expect(getHexColor("#AABBCCAA", 1)).toBe("0xAABBCCff");
    expect(getHexColor("#AABBCC", 0)).toBe("0xAABBCC00");
  });
});

describe("pointsToString | prepare points to url format", () => {
  test("should return string with joined points coordinates and '|' as separator", () => {
    const points = [
      [91.2, -70.0],
      [30.5, -19.89],
    ] as Point[];
    expect(pointsToString(points)).toMatchInlineSnapshot(`"91.200,-70.000|30.500,-19.890"`);
  });
});

describe("degrees/radians to radians/degrees helpers", () => {
  test("toRadians converts close", () => {
    expect(toRadians(180)).toBeCloseTo(3.14, 2);
    expect(toRadians(360)).toBeCloseTo(6.28, 2);
    expect(toRadians(90)).toBeCloseTo(1.57, 2);
    expect(toRadians(20)).toBeCloseTo(0.349, 2);
  });

  test("toDegrees converts close", () => {
    expect(toDegrees(3.14)).toBeCloseTo(179.9, 1);
    expect(toDegrees(6.28)).toBeCloseTo(359.8, 1);
    expect(toDegrees(1.57)).toBeCloseTo(89.95, 1);
    expect(toDegrees(0.349)).toBeCloseTo(20, 1);
  });
});

const centerOfReykjavík = {
  latitude: 64.1466,
  longitude: 21.9426,
  radius: 400,
  details: 90,
  fillColor: "#ffd8d8",
  fillOpacity: 0.25,
};

describe("getCircleCoordinates", () => {
  test("return correct coordinates of circle", () => {
    expect(
      pointsToString(
        getCircleCoordinates(
          centerOfReykjavík.latitude,
          centerOfReykjavík.longitude,
          centerOfReykjavík.radius,
          90
        )
      )
    ).toStrictEqual("64.150,21.943|64.147,21.951|64.143,21.943|64.147,21.934|64.150,21.943");

    expect(
      JSON.stringify(
        getCircleCoordinates(
          centerOfReykjavík.latitude,
          centerOfReykjavík.longitude,
          centerOfReykjavík.radius,
          90
        )
      )
    ).toBe(
      "[[64.15019728642369,21.9426],[64.14659976695405,21.950849332217192],[64.14300271357634,21.9426],[64.14659976695405,21.9343506677828],[64.15019728642369,21.9426]]"
    );
  });
});

describe("getStaticCirclePath | part of url we use to render circle inside static google map image", () => {
  test("should return valid escaped url string with circle path", () => {
    expect(
      getStaticCirclePath({
        ...centerOfReykjavík,
      })
    ).toBe(
      "fillcolor%3A0xffd8d840%7Cweight%3A0%7C64.150%2C21.943%7C64.147%2C21.951%7C64.143%2C21.943%7C64.147%2C21.934%7C64.150%2C21.943"
    );
  });
});

describe("getStaticMapUrl | full google map static API image url", () => {
  test("should return valid escaped url string with circle path", () => {
    const mapObjectOfReykjavik = {
      location: "",
      latitude: centerOfReykjavík.latitude,
      longitude: centerOfReykjavík.longitude,
      zoom: 10,
    };
    const googleMapAPI = "someApi";
    expect(getStaticMapUrl(mapObjectOfReykjavik, googleMapAPI)).toBe(
      "https://maps.googleapis.com/maps/api/staticmap?zoom=9&size=1392x430&scale=2&key=someApi&path=fillcolor%3A0xffd8d840%7Cweight%3A0%7C64.192%2C21.943%7C64.191%2C21.957%7C64.190%2C21.971%7C64.188%2C21.985%7C64.185%2C21.997%7C64.181%2C22.009%7C64.177%2C22.019%7C64.172%2C22.028%7C64.166%2C22.035%7C64.160%2C22.041%7C64.154%2C22.044%7C64.148%2C22.046%7C64.142%2C22.045%7C64.136%2C22.043%7C64.130%2C22.038%7C64.124%2C22.032%7C64.119%2C22.024%7C64.114%2C22.014%7C64.110%2C22.003%7C64.107%2C21.991%7C64.104%2C21.978%7C64.103%2C21.964%7C64.102%2C21.950%7C64.102%2C21.935%7C64.103%2C21.921%7C64.104%2C21.907%7C64.107%2C21.894%7C64.110%2C21.882%7C64.114%2C21.871%7C64.119%2C21.861%7C64.124%2C21.853%7C64.130%2C21.847%7C64.136%2C21.843%7C64.142%2C21.840%7C64.148%2C21.840%7C64.154%2C21.841%7C64.160%2C21.844%7C64.166%2C21.850%7C64.172%2C21.857%7C64.177%2C21.866%7C64.181%2C21.876%7C64.185%2C21.888%7C64.188%2C21.901%7C64.190%2C21.914%7C64.191%2C21.928%7C64.192%2C21.943"
    );
  });
});

describe("getGoogleEmbeddedPlaceUrl", () => {
  test("when placeId provided - should return valid escaped google embed url with place id", () => {
    expect(
      getGoogleEmbeddedPlaceUrl(centerOfReykjavík, "google-api-key", "google-lace-ID")
    ).toEqual("//www.google.com/maps/embed/v1/place?key=google-api-key&q=place_id:google-lace-ID");
  });

  test("when placeId is not provided - should return valid escaped google embed url with coords", () => {
    expect(getGoogleEmbeddedPlaceUrl(centerOfReykjavík, "google-api-key")).toEqual(
      "//www.google.com/maps/embed/v1/place?key=google-api-key&q=64.1466%2C21.9426"
    );
  });
});

describe("getGoogleMapStreetViewPageUrl", () => {
  test("should return valid escaped google embed url with streetview", () => {
    expect(getGoogleMapStreetViewPageUrl(centerOfReykjavík as unknown as SharedTypes.Map)).toEqual(
      "https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=64.1466%2C21.9426"
    );
  });
});

describe("getGoogleMapDirectionPageUrl", () => {
  test("returns direction with coords", () => {
    expect(getGoogleMapDirectionPageUrl({ coords: centerOfReykjavík })).toEqual(
      "https://www.google.com/maps/dir/?api=1&destination=64.1466%2C21.9426"
    );
  });
  test("when travelMode specified - returns direction with travelMode", () => {
    expect(
      getGoogleMapDirectionPageUrl({
        coords: centerOfReykjavík,
        travelMode: "driving",
      })
    ).toEqual(
      "https://www.google.com/maps/dir/?api=1&destination=64.1466%2C21.9426&travelmode=driving"
    );
  });

  test("when placeId specified - returns direction with placeId", () => {
    expect(
      getGoogleMapDirectionPageUrl({
        coords: centerOfReykjavík,
        googlePlaceId: "ChIJISz8NjyuEmsRFTQ9Iw7Ear8",
      })
    ).toEqual(
      "https://www.google.com/maps/dir/?api=1&destination=64.1466%2C21.9426&destination_place_id=ChIJISz8NjyuEmsRFTQ9Iw7Ear8"
    );
  });

  test("when placeId and travelMode specified - returns direction with placeId and travelMode", () => {
    expect(
      getGoogleMapDirectionPageUrl({
        coords: centerOfReykjavík,
        travelMode: "walking",
        googlePlaceId: "ChIJISz8NjyuEmsRFTQ9Iw7Ear8",
      })
    ).toEqual(
      "https://www.google.com/maps/dir/?api=1&destination=64.1466%2C21.9426&destination_place_id=ChIJISz8NjyuEmsRFTQ9Iw7Ear8&travelmode=walking"
    );
  });
});

describe("getEmbeddedStreetViewUrl", () => {
  test("returns embedded street view URL", () => {
    expect(getEmbeddedStreetViewUrl({ latitude: 39.450702, longitude: -0.370948 }, "API-KEY")).toBe(
      "//www.google.com/maps/embed/v1/streetview?key=API-KEY&location=39.450702%2C-0.370948"
    );
  });
  test("returns embedded street view URL with specific outdoor sources only", () => {
    expect(
      getEmbeddedStreetViewUrl({ latitude: 39.450702, longitude: -0.370948 }, "API-KEY", true)
    ).toBe(
      "//www.google.com/maps/embed/v1/streetview?key=API-KEY&location=39.450702%2C-0.370948&source=outdoor"
    );
  });
});
