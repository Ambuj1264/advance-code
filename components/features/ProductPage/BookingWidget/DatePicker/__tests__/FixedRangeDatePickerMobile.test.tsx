import React from "react";
import { ThemeProvider } from "emotion-theming";
import { render as testRender, fireEvent, waitFor } from "@testing-library/react";
import { advanceTo, clear } from "jest-date-mock";
import preloadAll from "jest-next-dynamic";
import { startOfDay } from "date-fns";

import FixedRangeDatePickerMobile from "../FixedRangeDatePickerMobile";
import {
  mockDates0,
  mockDates1,
  mockDates2,
  mockDate0,
  mockDate1,
  mockDate2,
} from "../../../../TourBookingWidget/utils/mockBookingWidgetData";

import { mockTheme } from "utils/mockData/mockGlobalData";

const render = (children: React.ReactElement) =>
  testRender(<ThemeProvider theme={mockTheme}>{children}</ThemeProvider>);

const makeSureThatDatepickerIsReady = async (container: HTMLElement) =>
  waitFor(() => expect(container.getElementsByClassName("DayPicker-wrapper").length).toBe(1));

beforeEach(async () => {
  // eslint-disable-next-line functional/immutable-data
  Element.prototype.scrollIntoView = jest.fn();

  clear();
});

afterEach(() => {
  clear();
});

beforeAll(async () => {
  await preloadAll();
});

describe("FixedRangeDatePickerMobile tests", () => {
  test("it should render the FixedRangeDatePickerMobile with the correct number of months", async () => {
    const { container } = render(
      <FixedRangeDatePickerMobile
        selectedDates={{
          from: mockDate0,
          to: mockDate1,
        }}
        onDateSelection={() => {}}
        dates={{
          unavailableDates: [],
          min: new Date("2019-05-05"),
          max: new Date("2019-08-05"),
        }}
        lengthOfTour={1}
        activeLocale="en"
        fromPlaceholder="Start date"
        toPlaceholder="End date"
        fromLabel="Start"
        toLabel="End"
      />
    );

    await makeSureThatDatepickerIsReady(container);

    // Should render 4 months (May, June, July, August)
    expect(container.getElementsByClassName("DayPicker-Month").length).toEqual(4);
  });

  test("it should render the FixedRangeDatePickerMobile with the correct number of months when min is undefined", async () => {
    advanceTo(new Date("2019-10-15"));

    const { container } = render(
      <FixedRangeDatePickerMobile
        selectedDates={{
          from: mockDate0,
          to: mockDate1,
        }}
        onDateSelection={() => {}}
        dates={{
          unavailableDates: [],
          min: undefined,
          max: new Date("2019-11-15"),
        }}
        lengthOfTour={1}
        activeLocale="en"
        fromPlaceholder="Start date"
        toPlaceholder="End date"
        fromLabel="Start"
        toLabel="End"
      />
    );

    await makeSureThatDatepickerIsReady(container);

    // Should render Oct and Nov
    expect(container.getElementsByClassName("DayPicker-Month").length).toEqual(2);
  });

  test("it should render the FixedRangeDatePickerMobile with the correct number of months when max is undefined", async () => {
    advanceTo(new Date("2019-10-15"));
    const { container } = render(
      <FixedRangeDatePickerMobile
        selectedDates={{
          from: mockDate0,
          to: mockDate1,
        }}
        onDateSelection={() => {}}
        dates={{
          unavailableDates: [],
          min: new Date("2019-10-15"),
          max: undefined,
        }}
        lengthOfTour={1}
        activeLocale="en"
        fromPlaceholder="Start date"
        toPlaceholder="End date"
        fromLabel="Start"
        toLabel="End"
      />
    );

    await makeSureThatDatepickerIsReady(container);

    // Should render Oct
    expect(container.getElementsByClassName("DayPicker-Month").length).toEqual(1);
  });

  test("it should apply the aria-selected attribute on the selected dates", async () => {
    const { container } = render(
      <FixedRangeDatePickerMobile
        selectedDates={{
          from: mockDate0,
          to: mockDate1,
        }}
        onDateSelection={() => {}}
        dates={mockDates0}
        lengthOfTour={3}
        activeLocale="en"
        fromPlaceholder="Start date"
        toPlaceholder="End date"
        fromLabel="Start"
        toLabel="End"
      />
    );

    await makeSureThatDatepickerIsReady(container);

    const selectedDates = container.querySelectorAll("[aria-selected='true']");
    expect(selectedDates.length).toEqual(2);
    expect(selectedDates[0].textContent).toContain("5");
    expect(selectedDates[1].textContent).toContain("6");
  });

  test("it should apply the aria-disabled attribute on the disabled dates and include the selected attribute if within the selected range", async () => {
    const { container } = render(
      <FixedRangeDatePickerMobile
        selectedDates={{
          from: mockDate1,
          to: mockDate2,
        }}
        onDateSelection={() => {}}
        dates={mockDates1}
        lengthOfTour={3}
        activeLocale="en"
        fromPlaceholder="Start date"
        toPlaceholder="End date"
        fromLabel="Start"
        toLabel="End"
      />
    );

    await makeSureThatDatepickerIsReady(container);

    const selectedDates = container.querySelectorAll("[aria-selected='true']");
    expect(selectedDates[0].textContent).toContain("6");
    expect(selectedDates[1].textContent).toContain("7");
    expect(selectedDates[1].getAttribute("aria-disabled")).toEqual("true");
  });

  test("it should apply aria-disabled attribute on the disabled dates", async () => {
    const { container, getAllByText } = render(
      <FixedRangeDatePickerMobile
        selectedDates={{ from: new Date(2019, 4, 1) }}
        onDateSelection={() => {}}
        dates={mockDates1}
        lengthOfTour={1}
        activeLocale="en"
        fromPlaceholder="Start date"
        toPlaceholder="End date"
        fromLabel="Start"
        toLabel="End"
      />
    );

    await makeSureThatDatepickerIsReady(container);

    const disabledDates = getAllByText("5");
    expect(disabledDates[0].getAttribute("aria-disabled")).toEqual("true");
  });

  test("it should call onDateSelection with the correct range", async () => {
    const onDateSelection = jest.fn();

    const { container, getByText } = render(
      <FixedRangeDatePickerMobile
        selectedDates={{ from: startOfDay(new Date(2019, 4, 1)) }}
        onDateSelection={onDateSelection}
        dates={mockDates2}
        lengthOfTour={2}
        activeLocale="en"
        fromPlaceholder="Start date"
        toPlaceholder="End date"
        fromLabel="Start"
        toLabel="End"
      />
    );

    await makeSureThatDatepickerIsReady(container);

    await waitFor(() => getByText("5"));
    const dayToBeSelected = getByText("5");
    fireEvent.click(dayToBeSelected);
    expect(onDateSelection).toHaveBeenCalled();
    expect(onDateSelection).toHaveBeenCalledWith({
      // date picker provides 12:00 hours for the selected dates
      from: new Date(new Date(mockDate0).setHours(0)),
      to: new Date(new Date(mockDate1).setHours(0)),
    });
  });

  test("it should not allow onDateSelection if allowSelectDisabledPeriodsInDatesRange disabled and there are unavailable dates in between", async () => {
    const onDateSelection = jest.fn();

    const { container, getByText } = render(
      <FixedRangeDatePickerMobile
        selectedDates={{ from: new Date(2019, 5, 5) }} // June 5, disabled date in calendar
        onDateSelection={onDateSelection}
        dates={mockDates2} // May, 5, 2019 is disabled, min 05 May, 2019, max is 31 May, 2019, 06 May is unavailable date
        lengthOfTour={2}
        activeLocale="en"
        allowSelectDisabledPeriodsInDatesRange={false}
        fromPlaceholder="Start date"
        toPlaceholder="End date"
        fromLabel="Start"
        toLabel="End"
      />
    );

    await makeSureThatDatepickerIsReady(container);

    await waitFor(() => getByText("5")); // 05 May
    let dayToBeSelected = getByText("5");
    fireEvent.click(dayToBeSelected);
    expect(onDateSelection).toHaveBeenCalledTimes(0);

    await waitFor(() => getByText("6")); // 06 May
    dayToBeSelected = getByText("6");
    fireEvent.click(dayToBeSelected);
    expect(onDateSelection).toHaveBeenCalledTimes(0);
  });

  test("it should not call onDateSelection when clicking disabled dates", async () => {
    const onDateSelection = jest.fn();

    const { container, getByText } = render(
      <FixedRangeDatePickerMobile
        selectedDates={{}}
        onDateSelection={onDateSelection}
        dates={mockDates2}
        lengthOfTour={2}
        activeLocale="en"
        fromPlaceholder="Start date"
        toPlaceholder="End date"
        fromLabel="Start"
        toLabel="End"
      />
    );

    await makeSureThatDatepickerIsReady(container);

    await waitFor(() => getByText("6"));
    const dayToBeSelected = getByText("6");
    fireEvent.click(dayToBeSelected);
    expect(onDateSelection).not.toHaveBeenCalled();
  });

  test("it should call onDateSelection when clicking a day to be selected with the correct range despite that range including disabled days", async () => {
    const onDateSelection = jest.fn();

    const { container, getByText } = render(
      <FixedRangeDatePickerMobile
        selectedDates={{ from: startOfDay(new Date(2019, 4, 1)) }}
        onDateSelection={onDateSelection}
        dates={mockDates2}
        lengthOfTour={1}
        activeLocale="en"
        fromPlaceholder="Start date"
        toPlaceholder="End date"
        fromLabel="Start"
        toLabel="End"
      />
    );

    await makeSureThatDatepickerIsReady(container);

    await waitFor(() => getByText("5"));
    const dayToBeSelected = getByText("5");
    fireEvent.click(dayToBeSelected);
    expect(onDateSelection).toBeCalledTimes(1);

    const mockDate0WithHours = new Date(new Date(mockDate0.getTime()).setHours(0));
    expect(onDateSelection).toHaveBeenCalledWith({
      from: mockDate0WithHours,
      to: mockDate0WithHours,
    });
  });
});
