import React from "react";
import { storiesOf } from "@storybook/react";
import WithContainer from "@stories/decorators/WithContainer";

import CarInsuranceContent from "../CarInsurance/CarInsuranceContent";
import CarInsuranceModal from "../CarInsurance/CarInsuranceModal";
import CarLocationDetailsContainer from "../CarLocationDetails/CarLocationDetailsContainer";

import {
  mockAvailableItemList,
  mockCarIncludedOption,
  mockCarCheckboxOption,
  mockCarMultipleOption,
  mockInsuranceInfo,
  mockLocationDetails,
} from "components/features/Car/utils/mockCarData";
import CheckboxOption from "components/features/Car/CarBookingWidget/Options/CheckboxOption";
import MultipleOption from "components/features/Car/CarBookingWidget/Options/MultipleOption";
import TravelDetailsDesktop from "components/features/Car/CarBookingWidget/TravelDetails/TravelDetailsDesktop";
import TravelDetailsMobile from "components/features/Car/CarBookingWidget/TravelDetails/TravelDetailsMobile";
import ItemsListContainer from "components/features/Car/ItemsList/ItemsListContainer";
import ItemsModal from "components/features/Car/ItemsList/ItemsModal";
import InformationListContainer from "components/ui/InformationListContainer";

const heading = "Car";

storiesOf(`${heading}/ItemsList`, module)
  .addDecorator(WithContainer)
  .add("default", () => (
    <ItemsListContainer
      itemsList={mockAvailableItemList}
      sectionId="availableItems"
      initialTitle="ItemsList"
    />
  ))
  .add("modal", () => (
    <ItemsModal
      onClose={() => {}}
      title="Title"
      items={mockAvailableItemList}
    />
  ));

storiesOf(`${heading}/TravelDetails`, module)
  .addDecorator(WithContainer)
  .add("desktopSkeleton", () => (
    <TravelDetailsDesktop
      searchPageUrl="/iceland-car-rentals"
      loading
      from="Jan 01, 00:00"
      to="Jan 02, 00:00"
    />
  ))
  .add("desktop", () => (
    <TravelDetailsDesktop
      searchPageUrl="/iceland-car-rentals"
      loading={false}
      from="Jan 01, 00:00"
      to="Jan 02, 00:00"
    />
  ))
  .add("mobile", () => (
    <TravelDetailsMobile
      from="Jan 01, 00:00"
      to="Jan 02, 00:00"
    />
  ));

storiesOf(`${heading}/Options`, module)
  .addDecorator(WithContainer)
  .add("includedOption", () => (
    <CheckboxOption
      selectedValue
      option={mockCarIncludedOption}
      onChange={() => {}}
      name={`option[${mockCarIncludedOption.id}]`}
      description=""
      value={1}
      disabled
    />
  ))
  .add("checkboxOption", () => (
    <CheckboxOption
      selectedValue
      option={mockCarCheckboxOption}
      onChange={() => {}}
      name={`option[${mockCarCheckboxOption.id}]`}
      description=""
      value={1}
      disabled={false}
    />
  ))
  .add("multipleOption", () => (
    <MultipleOption
      selectedValue={0}
      option={mockCarMultipleOption}
      onChange={() => {}}
      name={`option[${mockCarMultipleOption.id}]`}
      description=""
    />
  ));

storiesOf(`${heading}/InformationList`, module)
  .addDecorator(WithContainer)
  .add("default", () => (
    <InformationListContainer informationList={mockAvailableItemList} />
  ));

storiesOf(`${heading}/CarInsuranceContent`, module)
  .addDecorator(WithContainer)
  .add("default", () => (
    <CarInsuranceContent insuranceInfo={mockInsuranceInfo} />
  ))
  .add("modal", () => (
    <CarInsuranceModal
      insuranceInfo={mockInsuranceInfo}
      setIsModalOpen={() => {}}
    />
  ));

storiesOf(`${heading}/CarLocationDetails`, module)
  .addDecorator(WithContainer)
  .add("default", () => (
    <CarLocationDetailsContainer
      locationDetails={mockLocationDetails}
      activeLocale="en"
    />
  ));
