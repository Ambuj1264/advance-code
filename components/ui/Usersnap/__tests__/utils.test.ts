import { getBugReportLabels, getFeatureRequestLabels } from "../utils";

describe("getBugReportLabels", () => {
  test("contains 'Bug Report' label", () => {
    expect(
      getBugReportLabels({
        isSevere: false,
        areWeLosingCustomers: false,
        expectedBehavior: "",
        additionalInformation: "",
      })
    ).toContain("Bug");
  });

  test("isSevere === true should apply 'Priority' label", () => {
    expect(
      getBugReportLabels({
        isSevere: true,
        areWeLosingCustomers: false,
        expectedBehavior: "",
        additionalInformation: "",
      })
    ).toContain("Priority");
  });

  test("areWeLosingCustomers === true should apply 'High Priority' label", () => {
    expect(
      getBugReportLabels({
        isSevere: true,
        areWeLosingCustomers: true,
        expectedBehavior: "",
        additionalInformation: "",
      })
    ).toContain("High Priority");
  });
});

describe("getfeatureRequestLabels", () => {
  test("contains 'Feature Request' label", () => {
    expect(
      getFeatureRequestLabels({
        shouldGenerateMoney: false,
        shouldSaveTime: false,
        additionalNotes: "",
        benefits: "",
        desiredEffect: "",
        functionalDescription: "",
      })
    ).toContain("Feature Request");
  });

  test("shouldGenerateMoney === true should apply 'Priority' label", () => {
    expect(
      getFeatureRequestLabels({
        shouldGenerateMoney: true,
        shouldSaveTime: false,
        additionalNotes: "",
        benefits: "",
        desiredEffect: "",
        functionalDescription: "",
      })
    ).toContain("Priority");
  });

  test("shouldSaveTime === true should apply 'Priority' label", () => {
    expect(
      getFeatureRequestLabels({
        shouldGenerateMoney: false,
        shouldSaveTime: true,
        additionalNotes: "",
        benefits: "",
        desiredEffect: "",
        functionalDescription: "",
      })
    ).toContain("Priority");
  });
});
