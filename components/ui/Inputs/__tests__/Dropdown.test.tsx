import React from "react";
import { ThemeProvider } from "emotion-theming";
import { render as testRender, fireEvent } from "@testing-library/react";

import BaseDropdown from "../Dropdown/BaseDropdown";

import { mockTheme } from "utils/mockData/mockGlobalData";
import { mockReviewsLocaleOptions } from "components/features/Reviews/utils/mockData/mockReviewData";

const render = (children: React.ReactElement) =>
  testRender(<ThemeProvider theme={mockTheme}>{children}</ThemeProvider>);

test("it should render the Dropdown with the correct number of options", () => {
  const { container } = render(
    <BaseDropdown id="" onChange={() => {}} options={mockReviewsLocaleOptions} />
  );
  expect(container.querySelectorAll("option").length).toEqual(12);
});

test("it should render the Dropdown with the correct options", () => {
  const { container } = render(
    <BaseDropdown id="" onChange={() => {}} options={mockReviewsLocaleOptions} />
  );
  const optionsAsText = Array.from(container.querySelectorAll("option")).map(
    node => node.innerHTML
  );
  expect(optionsAsText).toEqual([
    "All languages",
    "Chinese",
    "French",
    "German",
    "Italian",
    "Japanese",
    "Korean",
    "Polish",
    "Russian",
    "Spanish",
    "Thai",
    "English",
  ]);
});

test("it should have the first option default selected, open the dropdown and select the second option", async () => {
  const { container, getByText } = render(
    <BaseDropdown id="" onChange={() => {}} options={mockReviewsLocaleOptions} />
  );

  const select = container.querySelector("select");
  if (select) {
    expect(select.value).toEqual(mockReviewsLocaleOptions[0].nativeLabel);
    const chineseOption = getByText(
      mockReviewsLocaleOptions[1].nativeLabel as string
    ) as HTMLOptionElement;
    fireEvent.change(select, { target: { value: chineseOption.value } });
    expect(select.value).toEqual(chineseOption.value);
  } else {
    expect(true).toBe(false);
  }
});
