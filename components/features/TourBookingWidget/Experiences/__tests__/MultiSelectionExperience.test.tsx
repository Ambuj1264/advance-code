import React, { ReactElement } from "react";
import { ThemeProvider } from "emotion-theming";
import { render, fireEvent } from "@testing-library/react";

import MultiSelectionExperience from "../MultiSelectionExperience";
import {
  mockMultiSelectionExperience1,
  mockSelectedExperience1,
} from "../mockData/mockExperienceData";
import { mockNumberOfTravelers1 } from "../../Travelers/utils/mockTravelersData";

import { mockTheme } from "utils/mockData/mockGlobalData";

const mockRender = (children: ReactElement) =>
  render(<ThemeProvider theme={mockTheme}>{children}</ThemeProvider>);

test("it should render both MultiSelectionExperiences", () => {
  const { queryByText } = mockRender(
    <MultiSelectionExperience
      selectedExperience={mockSelectedExperience1}
      onSetSelectedExperience={() => {}}
      numberOfTravelers={mockNumberOfTravelers1}
      experience={mockMultiSelectionExperience1}
      currency="USD"
      convertCurrency={value => value}
    />
  );

  expect(queryByText("Car")).toBeTruthy();
});

test("it should render the selected value for the MultiSelectionExperiences", () => {
  const { container } = mockRender(
    <MultiSelectionExperience
      selectedExperience={mockSelectedExperience1}
      onSetSelectedExperience={() => {}}
      numberOfTravelers={mockNumberOfTravelers1}
      experience={mockMultiSelectionExperience1}
      currency="USD"
      convertCurrency={value => value}
    />
  );

  const selectedValues = container.querySelectorAll("[data-selected='true']");
  expect(selectedValues[0].textContent).toBe("Fiat Panda");
});

test("it should open the dropdown and change the selected value", async () => {
  const fakeOnSetSelectedExperience = jest.fn();
  const { getByDisplayValue } = mockRender(
    <MultiSelectionExperience
      selectedExperience={mockSelectedExperience1}
      onSetSelectedExperience={fakeOnSetSelectedExperience}
      numberOfTravelers={mockNumberOfTravelers1}
      experience={mockMultiSelectionExperience1}
      currency="USD"
      convertCurrency={value => value}
    />
  );

  const select = getByDisplayValue("Fiat Panda");
  expect(select).toBeTruthy();
  fireEvent.change(select, { target: { value: "Id2" } });
  expect(fakeOnSetSelectedExperience).toHaveBeenCalledWith("Id2");
});
