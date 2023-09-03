/**
 * @jest-environment node
 */
import { convertImgixImageToBase64 } from "../globalUtils";

// @ts-ignore
const windowTmp = global.window;

beforeAll(() => {
  // @ts-ignore
  // eslint-disable-next-line functional/immutable-data
  global.window = undefined;
});

afterAll(() => {
  // @ts-ignore
  // eslint-disable-next-line functional/immutable-data
  global.window = windowTmp;
});
/* eslint-enable functional/immutable-data */

jest.mock("../getBase64ForImage", () => () => Promise.resolve("data:image/jpg;base64,imagevalue"));

describe("convertImgixImageToBase64 SSR", () => {
  it("should convert image to base64", async () => {
    const base64ImgSrc = await convertImgixImageToBase64({
      imageUrl: "https://guidetoiceland.is/mockImage.jpg",
    });

    expect(base64ImgSrc).toBe("data:image/jpg;base64,imagevalue");
  });

  it("should return empty result for relative image URL", async () => {
    const base64ImgSrc = await convertImgixImageToBase64({
      imageUrl: "/mockImage.jpg",
    });

    expect(base64ImgSrc).toBe("");
  });

  it("should return empty result for empty image URL", async () => {
    const base64ImgSrc = await convertImgixImageToBase64({
      imageUrl: "",
    });

    expect(base64ImgSrc).toBe("");
  });

  it("should return empty result for incorrect image URL", async () => {
    const base64ImgSrc = await convertImgixImageToBase64({
      imageUrl: "asgasg",
    });

    expect(base64ImgSrc).toBe("");
  });
});
