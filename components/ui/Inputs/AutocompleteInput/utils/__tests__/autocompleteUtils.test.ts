import { getPlaceholderById, replaceSpecialChar } from "../autocompleteUtils";

describe("getPlaceholderById", () => {
  it("should return first name match by id from list of autocompleteItems[]", () => {
    expect(
      getPlaceholderById(
        [
          { id: "2", name: "testName" },
          { id: "3", name: "testName3" },
          { id: "4", name: "testName4" },
          { id: "5", name: "found it!" },
        ],
        "5"
      )
    ).toBe("found it!");
  });

  it("should fallback to empty string", () => {
    expect(getPlaceholderById([], "5")).toBe("");
    expect(getPlaceholderById([{ id: "-1", name: "test" }], "5")).toBe("");
  });
});

describe("replaceSpecialChar", () => {
  it("replace special char from word", () => {
    expect(replaceSpecialChar("Reykjavík")).toBe("Reykjavik");
  });
  it("replace special char from word", () => {
    expect(replaceSpecialChar("Århus")).toBe("Arhus");
  });
  it("replace special char from word", () => {
    expect(replaceSpecialChar("Valdepeñas")).toBe("Valdepenas");
  });
});
