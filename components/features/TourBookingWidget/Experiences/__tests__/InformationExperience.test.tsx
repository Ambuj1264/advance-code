import "@testing-library/jest-dom/extend-expect";
import React, { ReactElement } from "react";
import { ThemeProvider } from "emotion-theming";
import { render, fireEvent, act } from "@testing-library/react";
import StyleContext from "isomorphic-style-loader/StyleContext";

import InformationExperience from "../InformationExperience";
import { mockInformationExperience1 } from "../mockData/mockExperienceData";

import { useCurrencyWithDefault as useCurrencyWithDefaultImport } from "hooks/useCurrency";
import { mockTheme } from "utils/mockData/mockGlobalData";

jest.mock("hooks/useCurrency");

beforeAll(() => {
  // @ts-ignore
  // eslint-disable-next-line functional/immutable-data, @typescript-eslint/no-unused-vars
  window.scrollTo = options => undefined;
});

afterAll(() => {
  // @ts-ignore
  // eslint-disable-next-line functional/immutable-data
  window.scrollTo = undefined;
});

const useCurrencyWithDefault: jest.MockedFunction<typeof useCurrencyWithDefaultImport> =
  useCurrencyWithDefaultImport as any;

useCurrencyWithDefault.mockReturnValue({
  currencyCode: "USD",
  convertCurrency: value => value,
  updateActiveCurrency: () => {},
  convertFromSelectedCurrencyToBaseCurrency: value => value,
});

const mockRender = (children: ReactElement) =>
  render(
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <StyleContext.Provider value={{ insertCss: () => {} }}>
      <ThemeProvider theme={mockTheme}>{children}</ThemeProvider>
    </StyleContext.Provider>
  );
test("it should render 3 information experiences", () => {
  const { getAllByText } = mockRender(
    <InformationExperience experience={mockInformationExperience1} numberOfTravelers={3} />
  );
  expect(getAllByText("Add dinners - Traveler {travelerNumber}")).toHaveLength(3);
});

test("it should open a model when clicked", () => {
  const { container } = mockRender(
    <InformationExperience experience={mockInformationExperience1} numberOfTravelers={1} />
  );

  const question = container.querySelector("#experience126");
  expect(question).toBeDefined();
  expect(document.querySelector("#informationExperienceModal")).not.toBeInTheDocument();
  act(() => {
    fireEvent.click(question!);
  });

  expect(document.querySelector("#informationExperienceModal")).toBeInTheDocument();
});

test("it should show 2 questions in the modal, 1 dropdown and 1 input. It should allow the user to change both", () => {
  const { container, queryByPlaceholderText, queryByDisplayValue } = mockRender(
    <InformationExperience experience={mockInformationExperience1} numberOfTravelers={1} />
  );
  const question = container.querySelector("#experience126");
  act(() => {
    fireEvent.click(question!);
  });
  expect(queryByPlaceholderText("Riding style")).toBeInTheDocument();
  expect(queryByDisplayValue("43")).toBeInTheDocument();
});

test("it should allow you to change the dropdown, close the modal and when you open it again the value should stay the same", () => {
  const { container, queryByPlaceholderText, queryByDisplayValue, getByTestId } = mockRender(
    <InformationExperience experience={mockInformationExperience1} numberOfTravelers={1} />
  );
  const question = container.querySelector("#experience126");
  act(() => {
    fireEvent.click(question!);
  });
  const select = queryByDisplayValue("43");
  fireEvent.change(select!, { target: { value: "44" } });
  expect(queryByPlaceholderText("Riding style")).toBeInTheDocument();
  expect(queryByDisplayValue("Select option")).not.toBeInTheDocument();
  expect(queryByDisplayValue("44")).toBeInTheDocument();
  act(() => {
    fireEvent.click(getByTestId("modal-close-button"));
  });
  act(() => {
    fireEvent.click(question!);
  });
  expect(queryByDisplayValue("43")).not.toBeInTheDocument();
  expect(queryByDisplayValue("44")).toBeInTheDocument();
});
