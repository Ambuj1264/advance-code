import React, { ReactElement } from "react";
import { ThemeProvider } from "emotion-theming";
import { render, fireEvent } from "@testing-library/react";

import TravelerExperiences from "../TravelersExperiences";
import { mockTravelerExperience2, mockSelectedExperience2 } from "../mockData/mockExperienceData";

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

test("it should have increment and decrements buttons as disabled if the experience is required", () => {
  const mockFn = jest.fn();
  const numberOfTravelers = {
    adults: 3,
    teenagers: 2,
    children: 1,
  };
  const { container } = mockRender(
    <TravelerExperiences
      onSetSelectedExperience={mockFn}
      selectedExperiences={[mockSelectedExperience2]}
      experiences={[mockTravelerExperience2]}
      numberOfTravelers={numberOfTravelers}
    />
  );
  const IncrementButton = container.querySelector("[id='Add dinnersIncrement']");
  fireEvent.click(IncrementButton!);
  expect(IncrementButton).not.toBeNull();
  // It should be called the first time to update the price in the provider
  expect(mockFn).toHaveBeenCalledTimes(1);
});
