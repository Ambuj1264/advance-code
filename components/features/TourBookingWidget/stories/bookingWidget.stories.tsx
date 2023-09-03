/* eslint-disable import/no-unresolved */
import React from "react";
import { number, text, boolean, object, array } from "@storybook/addon-knobs";
import { MockedProvider } from "@apollo/react-testing";
import { storiesOf } from "@storybook/react";
import WithContainer from "@stories/decorators/WithContainer";
import dateKnob from "@stories/knobs/date";

import BookingWidgetFooterPrice from "../../../ui/BookingWidget/BookingWidgetFooter/BookingWidgetFooterPrice";
import BookingWidgetFooterDate from "../../../ui/BookingWidget/BookingWidgetFooter/BookingWidgetFooterDate";
import BookingWidgetFooterMobile from "../../../ui/BookingWidget/BookingWidgetFooter/BookingWidgetFooterMobile";
import BookingWidgetMobileSectionHeading from "../../../ui/BookingWidget/BookingWidgetMobileSectionHeading";
import BookingWidgetSectionHeading from "../../../ui/BookingWidget/BookingWidgetSectionHeading";
import FixedRangeDatePickerMobile from "../../ProductPage/BookingWidget/DatePicker/FixedRangeDatePickerMobile";
import ProgressBar from "../../../ui/BookingWidget/BookingWidgetHeader/ProgressBar";
import PickupTimeDropdown from "../PickupTime/PickupTimeDropdown";
import DropdownOption from "../../../ui/Inputs/Dropdown/DropdownOption";
import { mockDates0 } from "../utils/mockBookingWidgetData";
import { mockPriceGroups1 } from "../Travelers/utils/mockTravelersData";
import TravelersGroupInput from "../Travelers/TravelersGroupInput";

import { shortMonthDayFormat } from "utils/dateUtils";

const heading = "Booking widget";

storiesOf(`${heading}/BookingWidgetFooterPrice`, module).add("default", () => (
  <BookingWidgetFooterPrice
    price={number("Price", 1499)}
    isPriceLoading={false}
    currency={text("Currency", "USD")}
    isTotalPrice={boolean("isTotalPrice", false)}
  />
));

storiesOf(`${heading}/BookingWidgetFooterDate`, module).add("default", () => (
  <BookingWidgetFooterDate
    startDate={dateKnob("StartDate", new Date("May 17"), shortMonthDayFormat)}
    endDate={dateKnob("EndDate", new Date("May 19"), shortMonthDayFormat)}
  />
));

storiesOf(`${heading}/BookingWidgetFooterMobile`, module).add("default", () => (
  <BookingWidgetFooterMobile
    onButtonClick={() => {}}
    selectedDates={object("selectedDates", {
      from: new Date("17 May 2019"),
      to: new Date("20 May 2019"),
    })}
    isButtonLoading={boolean("isButtonLoading", true)}
    buttonCallToAction={text("buttonCallToAction", "Continue")}
    showDates={boolean("showDates", false)}
    footerLeftContent={
      <BookingWidgetFooterPrice
        price={number("Price", 1499)}
        isPriceLoading={boolean("isPriceLoading", false)}
        currency={text("Currency", "USD")}
        isTotalPrice={boolean("isTotalPrice", false)}
      />
    }
  />
));

storiesOf(`${heading}/FixedRangeDatePickerMobile`, module).add("default", () => (
  <FixedRangeDatePickerMobile
    selectedDates={{
      from: new Date("17 May 2019"),
      to: new Date("20 May 2019"),
    }}
    onDateSelection={() => {}}
    dates={mockDates0}
    lengthOfTour={number("lengthOfTour", 3)}
    activeLocale="en"
    fromPlaceholder="Start date"
    toPlaceholder="End date"
    fromLabel="Start"
    toLabel="End"
  />
));

storiesOf(`${heading}/TravelersGroupInput`, module)
  .addDecorator(WithContainer)
  .add("default", () => (
    <MockedProvider>
      <TravelersGroupInput
        priceGroup={object("priceGroup", mockPriceGroups1[0])}
        numberOfTravelerType={number("numberOfTravelerType", 1)}
        onNumberOfTravelersChange={() => {}}
        pricePerTraveler={1000}
      />
    </MockedProvider>
  ));

storiesOf(`${heading}/PickupTimeDropdown`, module)
  .addDecorator(WithContainer)
  .add("default", () => (
    <PickupTimeDropdown
      onChange={() => {}}
      selectedPickupTime="Flexible"
      options={object("options", [
        {
          value: "Flexible",
          label: <DropdownOption id="" isSelected label="Flexible" />,
        },
        {
          value: "08:00 am",
          label: <DropdownOption id="" isSelected={false} label="09:00 am" />,
        },
        {
          value: "09:00 am",
          label: <DropdownOption id="" isSelected={false} label="10:00 am" />,
        },
        {
          value: "10:00 am",
          label: <DropdownOption id="" isSelected={false} label="11:00 am" />,
        },
      ])}
    />
  ));

storiesOf(`${heading}/ProgressBar`, module).add("default", () => (
  <ProgressBar
    steps={array("steps", ["Dates", "Travelers", "Experiences"])}
    currentStep={number("currentStep", 0)}
  />
));

storiesOf(`${heading}/BookingWidgetMobileSectionHeading`, module).add(
  "default",
  () => (
    <BookingWidgetMobileSectionHeading>
      This is a heading
    </BookingWidgetMobileSectionHeading>
  )
);

storiesOf(`${heading}/BookingWidgetSectionHeading`, module).add(
  "default",
  () => (
    <BookingWidgetSectionHeading>This is a heading</BookingWidgetSectionHeading>
  )
);
