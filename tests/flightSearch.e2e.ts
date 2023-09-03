import {
  testStatusCode,
  testBasicSEOHeadTags,
  testValidHeadingStructure,
  testRequiredSEOMetaTags,
} from "../utils/testcafe/seoHelpers";
import { baseUrl } from "../utils/testcafe/testcafeConstants";
import { fixtureDesktop } from "../utils/testcafe/utils";

// TODO - set up GTE tests
// https://github.com/DevExpress/testcafe-examples/blob/master/examples/set-a-custom-referrer/index.js
const flightSearchSEOValidation = (uri: string) => {
  const url = `${baseUrl}${uri}`;
  fixtureDesktop(`Flight landing page: ${url}`, url).skip("Flight landing page");

  testStatusCode(url);

  testBasicSEOHeadTags();

  testValidHeadingStructure();

  testRequiredSEOMetaTags({ descriptionLimit: 300 });
};

flightSearchSEOValidation("/iceland/best-flights");

flightSearchSEOValidation("/denmark/best-flights");
