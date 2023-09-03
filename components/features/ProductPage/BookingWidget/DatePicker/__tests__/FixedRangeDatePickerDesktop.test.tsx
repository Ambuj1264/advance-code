import React from "react";
import { ThemeProvider } from "emotion-theming";
import { getByTestId, fireEvent, queryByTestId, render } from "@testing-library/react";
import preloadAll from "jest-next-dynamic";

import FixedRangeDatePickerDesktop from "../FixedRangeDatePickerDesktop";

import { mockTheme } from "utils/mockData/mockGlobalData";

const renderWithTheme = (children: React.ReactElement) =>
  render(<ThemeProvider theme={mockTheme}>{children}</ThemeProvider>);

beforeAll(async () => {
  await preloadAll();
});

test("it should render the Desktop date picker open when there are no selected dates", () => {
  const { container } = renderWithTheme(
    <FixedRangeDatePickerDesktop
      selectedDates={{
        from: undefined,
        to: undefined,
      }}
      onDateSelection={() => {}}
      dates={{
        unavailableDates: [],
        min: new Date("2019-05-05"),
        max: new Date("2019-08-05"),
      }}
      lengthOfTour={1}
    />
  );
  expect(getByTestId(container, "calendarWrapper")).toBeTruthy();
});

test("it should render the Desktop date picker closed when there are selected dates", () => {
  const { container } = renderWithTheme(
    <FixedRangeDatePickerDesktop
      selectedDates={{
        from: new Date("2019-05-06"),
        to: new Date("2019-05-08"),
      }}
      onDateSelection={() => {}}
      dates={{
        unavailableDates: [],
        min: new Date("2019-05-05"),
        max: new Date("2019-08-05"),
      }}
      lengthOfTour={1}
    />
  );
  expect(queryByTestId(container, "calendarWrapper")).toBeNull();
});

test("it should render open the Desktop date picker when the toggle is clicked", () => {
  const { container } = renderWithTheme(
    <FixedRangeDatePickerDesktop
      selectedDates={{
        from: new Date("2019-05-06"),
        to: new Date("2019-05-08"),
      }}
      onDateSelection={() => {}}
      dates={{
        unavailableDates: [],
        min: new Date("2019-05-05"),
        max: new Date("2019-08-05"),
      }}
      lengthOfTour={1}
    />
  );
  const toggleCalendar = getByTestId(container, "toggleCalendar");
  fireEvent.click(toggleCalendar);
  expect(getByTestId(container, "calendarWrapper")).toBeTruthy();
});

test("it should show length of tour by highlighting start day", () => {
  const { getAllByText } = renderWithTheme(
    <FixedRangeDatePickerDesktop
      selectedDates={{
        from: undefined,
        to: undefined,
      }}
      onDateSelection={() => {}}
      dates={{
        unavailableDates: [],
        min: new Date("2019-05-05"),
        max: new Date("2019-12-06"),
      }}
      lengthOfTour={3}
      initialMonth={new Date("2019-05-05")}
    />
  );
  const dayToBeHovered = getAllByText("5")[0];
  const nextDay = getAllByText("6")[0];
  const thirdDay = getAllByText("7")[0];
  fireEvent.mouseEnter(dayToBeHovered);

  expect(dayToBeHovered.classList.contains("DayPicker-Day--hoverRange")).toBeTruthy();
  expect(dayToBeHovered.classList.contains("DayPicker-Day--hoverRangeStart")).toBeTruthy();
  expect(nextDay.classList.contains("DayPicker-Day--hoverRange")).toBeTruthy();
  expect(thirdDay.classList.contains("DayPicker-Day--hoverRange")).toBeTruthy();
  expect(thirdDay.classList.contains("DayPicker-Day--hoverRangeEnd")).toBeTruthy();
});
