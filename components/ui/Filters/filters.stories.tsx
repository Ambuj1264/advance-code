/* eslint-disable import/order, import/no-unresolved, import/no-extraneous-dependencies */
import React from "react";
import { text, number, boolean } from "@storybook/addon-knobs";
import { replicate } from "fp-ts/lib/Array";
import { storiesOf } from "@storybook/react";
import RangeFilterSection from "./RangePriceFilterSection";
import DepositAmountIcon from "components/icons/cash-payment-coin.svg";
import FilterGeneralDetailsForm from "../../features/SearchPage/FilterGeneralDetailsForm";
import TravelerIcon from "components/icons/traveler.svg";
import WithContainer from "@stories/decorators/WithContainer";
import FilterButton from "components/ui/Filters/FilterButton";
import FilterHeading from "components/ui/Filters/FilterHeading";
import ExpandableFilters from "components/ui/Filters/ExpandableFilters";
import Checkbox from "components/ui/Inputs/Checkbox";
import RadioButton from "components/ui/Inputs/RadioButton";
import SearchFilterModal from "components/features/SearchPage/Search/SearchFilterModal";
import { MockedProvider } from "@apollo/react-testing";
import { mockFilters0 } from "components/features/SearchPage/utils/mockSearchPageData";
import SearchPageStateContext from "components/features/SearchPage/SearchPageStateContext";

const heading = "Filters";

storiesOf(`${heading}/FilterButton`, module).add("default", () => (
  <FilterButton
    id="1"
    onClick={() => {}}
    defaultChecked={boolean("defaultChecked", false)}
  >
    {text("children", "12 days")}
  </FilterButton>
));

storiesOf(`${heading}/FilterHeading`, module)
  .addDecorator(WithContainer)
  .add("default", () => (
    <FilterHeading
      title={text("title", "Attractions")}
      numberOfSelectedFilters={number("numberOfSelectedFilters", 3)}
      Icon={TravelerIcon}
      onClearFilterClick={() => {}}
    />
  ));

const FakeCheckbox = (
  <Checkbox
    id="fakeCheckbox"
    label="This is an awesome filter"
    name="Awesome filter"
    checked={false}
    onChange={() => {}}
  />
);

const FakeRadioButton = (
  <RadioButton
    id="fakeRadioButton"
    label="This is an awesome filter"
    name="Awesome filter"
    checked={false}
    onChange={() => {}}
    value={text("value", "value")}
  />
);

storiesOf(`${heading}/ExpandableFilters`, module)
  .addDecorator(WithContainer)
  .add("default", () => (
    <ExpandableFilters
      id="storybook"
      first={replicate(5, FakeCheckbox)}
      rest={replicate(10, FakeCheckbox)}
    />
  ))
  .add("Radio button", () => (
    <ExpandableFilters
      id="storybook"
      first={replicate(5, FakeRadioButton)}
      rest={replicate(10, FakeRadioButton)}
    />
  ));

storiesOf(`${heading}/FilterModal`, module).add("default", () => (
  <SearchFilterModal
    onClose={() => {}}
    filters={mockFilters0}
    isLoading={boolean("isLoading", false)}
  />
));

storiesOf(`${heading}/FilterGeneralDetailsForm`, module)
  .addDecorator(WithContainer)
  .add("Tour search", () => (
    <MockedProvider>
      <FilterGeneralDetailsForm
        locationLabel="Starting location"
        context={SearchPageStateContext}
      />
    </MockedProvider>
  ));

storiesOf(`${heading}/RangeFilterSection`, module)
  .addDecorator(WithContainer)
  .add("default", () => (
    <RangeFilterSection
      sectionId="depositAmount"
      Icon={DepositAmountIcon}
      title="Deposit Amount"
      filters={[
        {
          id: "10",
          count: 10,
        },
        {
          id: "1000",
          count: 20,
        },
        {
          id: "15",
          count: 5,
        },
        {
          id: "500",
          count: 2,
        },
        {
          id: "700",
          count: 13,
        },
      ]}
      min={0}
      max={1000}
    />
  ));
