import React, { ReactElement } from "react";
import { ThemeProvider } from "emotion-theming";
import { render, fireEvent } from "@testing-library/react";

import ToggleExperience from "../ToggleExperience";
import {
  mockToggleExperience1,
  mockToggleExperienceWithPricePerPerson,
  mockToggleExperienceWithoutPricePerPerson,
  mockTravelerExperience3,
} from "../mockData/mockExperienceData";

import { useCurrencyWithDefault as useCurrencyWithDefaultImport } from "hooks/useCurrency";
import { mockTheme } from "utils/mockData/mockGlobalData";

jest.mock("hooks/useCurrency");

const useCurrencyWithDefault: jest.MockedFunction<typeof useCurrencyWithDefaultImport> =
  useCurrencyWithDefaultImport as any;

useCurrencyWithDefault.mockReturnValue({
  currencyCode: "USD",
  convertCurrency: value => value,
  updateActiveCurrency: () => {},
  convertFromSelectedCurrencyToBaseCurrency: value => value,
});

const mockRender = (children: ReactElement) =>
  render(<ThemeProvider theme={mockTheme}>{children}</ThemeProvider>);

test("it should be unchecked by default", () => {
  const { container } = mockRender(
    <ToggleExperience
      isDefaultToggled={false}
      onSetSelectedExperience={() => {}}
      experience={mockToggleExperience1}
      totalNumberOfTravelers={1}
    />
  );
  const toggle: HTMLInputElement | null = container.querySelector("[id='126']");
  expect(toggle).toBeTruthy();
  expect(toggle!.checked).toEqual(false);
});

test("it should be checked when isDefaultToggled is set to true", () => {
  const { container } = mockRender(
    <ToggleExperience
      isDefaultToggled
      onSetSelectedExperience={() => {}}
      experience={mockToggleExperience1}
      totalNumberOfTravelers={1}
    />
  );
  const toggle: HTMLInputElement | null = container.querySelector("[id='126']");
  expect(toggle).toBeTruthy();
  expect(toggle!.checked).toEqual(true);
});

test("it should render toggler without switcher when the experience is free ($0 price ) and required", () => {
  const { container, getAllByText } = mockRender(
    <ToggleExperience
      isDefaultToggled
      onSetSelectedExperience={() => {}}
      experience={mockTravelerExperience3}
      totalNumberOfTravelers={1}
    />
  );
  const toggle: HTMLInputElement | null = container.querySelector(
    `[id='${mockTravelerExperience3.id}']`
  );
  expect(toggle).toBeNull();
  expect(getAllByText(mockTravelerExperience3.name)).toHaveLength(1);
  expect(getAllByText(mockTravelerExperience3.questions[0].question)).toHaveLength(1);
});

test("it should change the toggle to true when clicked and call onSetSelectedExperience with the correct parameters", () => {
  const mockOnSetSelectedExperiencees = jest.fn();
  const { container } = mockRender(
    <ToggleExperience
      isDefaultToggled={false}
      onSetSelectedExperience={mockOnSetSelectedExperiencees}
      experience={mockToggleExperience1}
      totalNumberOfTravelers={1}
    />
  );
  const toggle: HTMLInputElement | null = container.querySelector("[id='126']");
  fireEvent.click(toggle!);
  expect(toggle!.checked).toEqual(true);
  expect(mockOnSetSelectedExperiencees).toHaveBeenCalledWith({
    experienceId: "126",
    price: 1000,
    count: 1,
    calculatePricePerPerson: false,
  });
});

test("once checked it should render option for each traveler if calculatePricePerPerson is true", () => {
  const mockOnSetSelectedExperiencees = jest.fn();
  const { container, queryAllByDisplayValue } = mockRender(
    <ToggleExperience
      isDefaultToggled={false}
      onSetSelectedExperience={mockOnSetSelectedExperiencees}
      experience={mockToggleExperienceWithPricePerPerson}
      totalNumberOfTravelers={3}
    />
  );
  const toggle: HTMLInputElement | null = container.querySelector("[id='126']");
  fireEvent.click(toggle!);
  expect(queryAllByDisplayValue("Select option")).toHaveLength(3);
});

test("once checked it should render option for each traveler if calculatePricePerPerson is false", () => {
  const mockOnSetSelectedExperiencees = jest.fn();
  const { container, queryAllByDisplayValue } = mockRender(
    <ToggleExperience
      isDefaultToggled={false}
      onSetSelectedExperience={mockOnSetSelectedExperiencees}
      experience={mockToggleExperienceWithoutPricePerPerson}
      totalNumberOfTravelers={3}
    />
  );
  const toggle: HTMLInputElement | null = container.querySelector("[id='126']");
  fireEvent.click(toggle!);
  expect(queryAllByDisplayValue("Select option")).toHaveLength(1);
});
