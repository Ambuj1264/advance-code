import React, { ReactElement } from "react";
import { ThemeProvider } from "emotion-theming";
import { render, fireEvent } from "@testing-library/react";

import TravelerExperience from "../TravelerExperience";
import {
  mockTravelerExperience1,
  mockTravelerExperienceWithQuestion1,
  mockTravelerExperienceWithQuestion2,
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

test("it should have a correct label with an empty counter", () => {
  const { queryByText } = mockRender(
    <TravelerExperience
      selectedValue={0}
      max={3}
      min={0}
      onSetSelectedExperience={() => {}}
      experience={mockTravelerExperience1}
    />
  );

  expect(queryByText("0")).toBeTruthy();
  expect(queryByText("Add dinners")).toBeTruthy();
});

test("it should increase the counter when clicking the increment button", () => {
  const mockFn = jest.fn();
  const { container } = mockRender(
    <TravelerExperience
      selectedValue={0}
      max={3}
      min={0}
      onSetSelectedExperience={mockFn}
      experience={mockTravelerExperience1}
    />
  );

  const IncrementButton = container.querySelector("[id='Add dinnersIncrement']");
  expect(IncrementButton).not.toBeNull();
  fireEvent.click(IncrementButton!);
  expect(mockFn).toHaveBeenCalledWith({
    calculatePricePerPerson: true,
    count: 1,
    experienceId: "126",
    price: 1000,
  });
});

test("it should decrease the counter when clicking the decrement button", () => {
  const mockFn = jest.fn();
  const { container } = mockRender(
    <TravelerExperience
      selectedValue={1}
      max={3}
      min={0}
      onSetSelectedExperience={mockFn}
      experience={mockTravelerExperience1}
    />
  );
  fireEvent.click(container.querySelector("[id='Add dinnersDecrement']")!);
  expect(mockFn).toHaveBeenCalledWith({
    calculatePricePerPerson: true,
    count: 0,
    experienceId: "126",
    price: 1000,
  });
});

test("it should not call onSelectedExperience if the counter is 0, the counter should also remain 0", () => {
  const mockOnSelectedExperiences = jest.fn();
  const { container, queryByText } = mockRender(
    <TravelerExperience
      selectedValue={0}
      max={3}
      min={0}
      onSetSelectedExperience={mockOnSelectedExperiences}
      experience={mockTravelerExperience1}
    />
  );

  fireEvent.click(container.querySelector("[id='Add dinnersDecrement']")!);
  expect(queryByText("0")).toBeTruthy();
  expect(mockOnSelectedExperiences).toHaveBeenCalledTimes(0);
});

test("it should call the onSelectedExperience with the correct value", () => {
  const mockOnSelectedExperiences = jest.fn();
  const { container } = mockRender(
    <TravelerExperience
      selectedValue={0}
      max={3}
      min={0}
      onSetSelectedExperience={mockOnSelectedExperiences}
      experience={mockTravelerExperience1}
    />
  );

  fireEvent.click(container.querySelector("[id='Add dinnersIncrement']")!);
  expect(mockOnSelectedExperiences).toHaveBeenCalledWith({
    experienceId: mockTravelerExperience1.id,
    count: 1,
    price: mockTravelerExperience1.price,
    calculatePricePerPerson: mockTravelerExperience1.calculatePricePerPerson,
  });
});

test("Should render an experienceDropdown once the increment button has been clicked", () => {
  const mockOnSelectedExperiences = jest.fn();
  const { getByDisplayValue } = mockRender(
    <TravelerExperience
      selectedValue={1}
      max={3}
      min={0}
      onSetSelectedExperience={mockOnSelectedExperiences}
      experience={mockTravelerExperienceWithQuestion1}
    />
  );

  const select = getByDisplayValue("Select option");
  expect(select).toBeDefined();
});

test("Should show as many dropdowns as the counter suggests", () => {
  const mockOnSelectedExperiences = jest.fn();
  const { getAllByDisplayValue } = mockRender(
    <TravelerExperience
      selectedValue={3}
      max={4}
      min={0}
      onSetSelectedExperience={mockOnSelectedExperiences}
      experience={mockTravelerExperienceWithQuestion1}
    />
  );

  const select3 = getAllByDisplayValue("Select option");
  expect(select3).toHaveLength(3);
});

test("it should render information experience if there are multiple questions in the experience", () => {
  const mockOnSelectedExperiences = jest.fn();
  const { queryByText } = mockRender(
    <TravelerExperience
      selectedValue={1}
      max={3}
      min={0}
      onSetSelectedExperience={mockOnSelectedExperiences}
      experience={mockTravelerExperienceWithQuestion2}
    />
  );

  expect(queryByText("Select details")).toBeTruthy();
});
