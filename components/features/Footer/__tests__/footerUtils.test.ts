import { getSocialMediaItems } from "../footerUtils";

describe("getSocialMediaItems", () => {
  test("finds social media items", () => {
    expect(
      getSocialMediaItems([
        {
          sections: [
            {
              title: "Foo",
              items: [
                {
                  type: "text",
                  text: "foo",
                },
              ],
            },
            {
              title: "Bar",
              items: [
                {
                  type: "socialmedia",
                  text: "bar",
                },
              ],
            },
          ],
        },
      ])
    ).toEqual([
      {
        type: "socialmedia",
        text: "bar",
      },
    ]);
  });

  test("handles empty items", () => {
    expect(
      getSocialMediaItems([
        {
          sections: [
            {
              title: "Foo",
            },
            {
              title: "Bar",
              items: [
                {
                  type: "socialmedia",
                  text: "bar",
                },
              ],
            },
          ],
        },
      ])
    ).toEqual([
      {
        type: "socialmedia",
        text: "bar",
      },
    ]);
  });

  test("returns undefined if no social media items are availabel", () => {
    expect(
      getSocialMediaItems([
        {
          sections: [
            {
              title: "Foo",
            },
          ],
        },
      ])
    ).toBeUndefined();
  });
});
