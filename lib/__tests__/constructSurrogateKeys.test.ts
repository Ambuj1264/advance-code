import { prepareSurrogateKeyStr } from "lib/constructSurrogateKeys";

describe("prepareSurrogateKeyStr", () => {
  it("removes extra spaces", () => {
    expect(
      prepareSurrogateKeyStr(
        " clientapi   tour     /book-holiday-trips/iceland-winter-adventure-ice-cave en https://guidetoiceland.is f9bc2a43cd870c16a254db4615b697e33f1e373f tourPrivateOptions-slug%3Aiceland-winter-adventure-ice-cave   tourPrivateOptions  "
      )
    ).toEqual(
      "clientapi tour /book-holiday-trips/iceland-winter-adventure-ice-cave en -guidetoiceland-is f9bc2a43cd870c16a254db4615b697e33f1e373f tourPrivateOptions-slug-3Aiceland-winter-adventure-ice-cave tourPrivateOptions"
    );
  });

  it("replaces special chars with dash", () => {
    expect(
      prepareSurrogateKeyStr(
        "%%tourPrivateOptions-slug%3Aiceland-win&^#%$@)(ter-adventure-ice-cave%%"
      )
    ).toEqual("--tourPrivateOptions-slug-3Aiceland-win--------ter-adventure-ice-cave--");
  });
});
