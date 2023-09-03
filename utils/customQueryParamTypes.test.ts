import { ValidDateStringParam } from "./customQueryParamTypes";

describe("useQueryParams ValidDateStringParam", () => {
  it("encodes date string only if date is in the valid string format", () => {
    expect(ValidDateStringParam.encode("2020-02-02")).toEqual("2020-02-02");
    expect(ValidDateStringParam.encode("2020-02-02 10:00")).toEqual("2020-02-02%2010%3A00");
  });

  it("encodes date string to empty string if date is in the invalid string format", () => {
    expect(ValidDateStringParam.encode("2020-ZZZ-02")).toEqual("");
    expect(ValidDateStringParam.encode("2020-02__10:00")).toEqual("");
  });

  it("decodes date string only if date is in the valid string format", () => {
    expect(ValidDateStringParam.decode("2020-02-02")).toEqual("2020-02-02");
    expect(ValidDateStringParam.decode("2020-02-02%2010%3A00")).toEqual("2020-02-02 10:00");
  });

  it("decodes date string to empty string if date is in the invalid string format", () => {
    expect(ValidDateStringParam.decode("2020-0202")).toEqual("");
    expect(ValidDateStringParam.decode("2020-02-02+10:00")).toEqual("");
  });
});
