/* eslint-disable import/order, import/no-unresolved */
import React, { useState } from "react";
import { object, boolean, number, text } from "@storybook/addon-knobs";
import { addDays } from "date-fns";
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from "@storybook/react";

import DatePicker from "./DatePicker";
import CalendarDropdownDisplay from "./CalendarDropdownDisplay";
import DateRangeDropdown from "./DateRangeDropdown";

import WithContainer from "@stories/decorators/WithContainer";
import { getFormattedDate, shortMonthDayFormat } from "utils/dateUtils";
import MobileDateTimePicker from "./MobileDateTimePicker";

const today = new Date();
const heading = "Date picker";
const dates = {
  min: addDays(today, -12),
  max: addDays(today, 12),
  unavailableDates: [addDays(today, -5), addDays(today, -3)],
};

storiesOf(`${heading}/DatePicker`, module)
  .addDecorator(WithContainer)
  .add("default", () => {
    return (
      <DatePicker
        selectedDates={object("selectedDates", {
          from: new Date(),
          to: addDays(today, 5),
        })}
        canChangeMonth={boolean("canChangeMonth", true)}
        showWeekDays={boolean("showWeekDays", true)}
        isLoading={boolean("isLoading", false)}
        numberOfMonths={number("numberOfMonths", 2)}
        onDayClick={() => {}}
        onDayMouseEnter={() => {}}
        onDayMouseLeave={() => {}}
        dates={object("dates", dates)}
        hasNoAvailableDates={false}
        shouldScrollSelectedDateIntoView={boolean(
          "shouldScrollSelectedDateIntoView",
          false
        )}
      />
    );
  });

storiesOf(`${heading}/CalendarDropownDisplay`, module)
  .addDecorator(WithContainer)
  .add("default", () => {
    return (
      <CalendarDropdownDisplay
        fromPlaceholder={text("fromPlaceholder", "Check in")}
        toPlaceholder={text("toPlaceholder", "Check out")}
        from={text("from", getFormattedDate(today, shortMonthDayFormat))}
        to={text(
          "to",
          getFormattedDate(addDays(today, 5), shortMonthDayFormat)
        )}
      />
    );
  });

storiesOf(`${heading}/DateRangeDropdown`, module)
  .addDecorator(WithContainer)
  .add("default", () => {
    const [rangeDates, setRangeDates] = useState({
      from: undefined,
      to: undefined,
    } as SharedTypes.SelectedDates);

    return (
      <DateRangeDropdown
        id="datePicker"
        fromPlaceholder={text("fromPlaceholder", "Check in")}
        toPlaceholder={text("toPlaceholder", "Check out")}
        informationLabel={text("information", "Minimum stay is 4 days")}
        selectedDates={rangeDates}
        onDateSelection={setRangeDates}
        dates={dates}
        minDays={number("minDays", 1)}
        preOpenCalendar={boolean("preOpenCalendar", false)}
      />
    );
  })
  .add("separate date selection", () => {
    const [rangeDates, setRangeDates] = useState({
      from: undefined,
      to: undefined,
    } as SharedTypes.SelectedDates);

    return (
      <DateRangeDropdown
        id="datePicker"
        fromPlaceholder={text("fromPlaceholder", "Arrival")}
        toPlaceholder={text("toPlaceholder", "Departure")}
        informationLabel={text("information", "Minimum stay is 4 days")}
        selectedDates={rangeDates}
        onDateSelection={setRangeDates}
        dates={dates}
        minDays={number("minDays", 1)}
        preOpenCalendar={boolean("preOpenCalendar", false)}
        allowSeparateSelection
      />
    );
  })
  .add("single date selection", () => {
    const [rangeDates, setRangeDates] = useState({
      from: undefined,
      to: undefined,
    } as SharedTypes.SelectedDates);

    return (
      <DateRangeDropdown
        id="datePicker"
        showDateFrom={boolean("showDateFrom", true)}
        showDateTo={boolean("showDateTo", false)}
        fromPlaceholder={text("fromPlaceholder", "Arrival")}
        toPlaceholder={text("toPlaceholder", "Departure")}
        informationLabel={text("information", "Minimum stay is 4 days")}
        selectedDates={rangeDates}
        onDateSelection={setRangeDates}
        dates={dates}
        minDays={number("minDays", 1)}
        preOpenCalendar={boolean("preOpenCalendar", false)}
        allowSeparateSelection
      />
    );
  });

storiesOf(`${heading}/MobileDateTimePicker`, module)
  .addDecorator(WithContainer)
  .add("default", () => {
    const [rangeDates, setRangeDates] = useState({
      from: undefined,
      to: undefined,
    } as SharedTypes.SelectedDates);
    const [time, setTime] = useState<SharedTypes.Time>({ hour: 10, minute: 0 });

    return (
      <>
        <br />
        <MobileDateTimePicker
          name="mobileDateTimePicker"
          selectedDates={rangeDates}
          onDateSelection={setRangeDates}
          fromPlaceholder="Pick up"
          onTimeSelection={setTime}
          displayTime={time}
          showDateTo={false}
          disabled={false}
        />
      </>
    );
  });
