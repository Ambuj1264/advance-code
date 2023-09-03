/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/order */
import React, { useState } from "react";
import { object, boolean, text, select } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";
import { MockedProvider } from "@apollo/react-testing";
import RadioButton from "./RadioButton";
import Checkbox from "./Checkbox";
import ToggleButton from "./ToggleButton";
import Select from "./Select";
import Button from "./Button";
import IncrementButton from "./IncrementButton";
import RoundedButton from "./RoundedButton";

import AffiliateButton from "components/features/AffiliateButton/AffiliateButton";
import WithContainer from "@stories/decorators/WithContainer";
import ReviewStars from "components/ui/ReviewStars";
import { ButtonSize, Direction, IncrementType } from "types/enums";
import ArrowCircle from "components/icons/arrow-circle.svg";
import LocationIcon from "components/icons/location-target.svg";
import SearchIcon from "@travelshift/ui/icons/search.svg";
import Input from "./Input";
import InputHeader from "./InputHeader";

import AutocompleteInput, {
  AutocompleteDoubleWrapper,
  AutocompleteInputHalf,
} from "./AutocompleteInput/AutocompleteInput";
import { shuffleArray } from "../../features/Tour/utils/mockTourData";
import useToggle from "hooks/useToggle";
import DateSelect from "./DateSelect";
import CountryListQuery from "hooks/queries/CountryListQuery.graphql";
import NationalityDropdown from "./Dropdown/NationalityDropdown";
import PhoneNumberInputContainer from "./PhoneNumberInputContainer";

const heading = "Inputs";

storiesOf(`${heading}/Button`, module)
  .addDecorator(WithContainer)
  .add("default", () => (
    <Button
      disabled={boolean("disabled", false)}
      onClick={() => null}
      buttonSize={select(
        "ButtonSize",
        [
          ButtonSize.Small,
          ButtonSize.Medium,
          ButtonSize.Large,
          ButtonSize.Huge,
        ],
        ButtonSize.Small
      )}
      callToActionDirection={select(
        "callToActionDirection",
        [Direction.Right, Direction.Down, Direction.Left, Direction.Up],
        Direction.Up
      )}
      theme={{
        colors: {
          primary: "#336699",
          action: "#33ab63",
        },
      }}
    >
      Continue to book
    </Button>
  ))
  .add("rounded", () => (
    <RoundedButton
      text={text("text", "See more")}
      href={text("href", "#")}
      Icon={ArrowCircle}
      iconFill="#ffffff"
    />
  ));

storiesOf(`${heading}/Select`, module)
  .addDecorator(WithContainer)
  .add("with options label as string", () => (
    <Select
      id=""
      options={object("options", [
        { value: "any", label: "Any" },
        { value: "english", label: "English" },
        { value: "german", label: "German" },
        { value: "francais", label: "Francais" },
      ])}
      onChange={() => {}}
      isSearchable={boolean("isSearchable", false)}
    />
  ))
  .add("with options label as component", () => (
    <Select
      id=""
      options={object("options", [
        { value: "5", label: <span>All rating</span> },
        { value: "5", label: <ReviewStars reviewScore={5} /> },
        { value: "4", label: <ReviewStars reviewScore={4} /> },
        { value: "3", label: <ReviewStars reviewScore={3} /> },
        { value: "2", label: <ReviewStars reviewScore={2} /> },
        { value: "1", label: <ReviewStars reviewScore={1} /> },
      ])}
      onChange={() => {}}
      isSearchable={boolean("isSearchable", false)}
    />
  ));

storiesOf(`${heading}/IncrementButton`, module)
  .addDecorator(WithContainer)
  .add("default", () => (
    <IncrementButton
      id=""
      incrementType={select(
        "Incremenet type",
        [IncrementType.Plus, IncrementType.Minus],
        IncrementType.Plus
      )}
      onClick={() => null}
      disabled={boolean("disabled", false)}
    />
  ));

storiesOf(`${heading}/RadioButton`, module)
  .addDecorator(WithContainer)
  .add("default", () => (
    <RadioButton
      label={text("label", "I am a radio button")}
      checked={boolean("checked", false)}
      onChange={() => null}
      name={text("name", "name")}
      value={text("value", "value")}
      id={text("id", "idForTheLabel")}
      color={select("color", ["action", "primary"], "primary")}
      reverse={boolean("reverse", false)}
    />
  ));

storiesOf(`${heading}/Checkbox`, module).add("default", () => (
  <Checkbox
    label={text("label", "I am a checkbox")}
    checked={boolean("checked", false)}
    onChange={() => {}}
    name={text("name", "name")}
    id={text("id", "idForTheLabel")}
    color={select("color", ["action", "primary"], "primary")}
    reverse={boolean("reverse", false)}
  />
));

storiesOf(`${heading}/ToggleButton`, module)
  .addDecorator(WithContainer)
  .add("default", () => (
    <ToggleButton
      checked={boolean("checked", false)}
      disabled={boolean("disabled", false)}
      id="toggleButton"
      onChange={() => {}}
    />
  ));

storiesOf(`${heading}/AffiliateButton`, module)
  .addDecorator(WithContainer)
  .add("default", () => (
    <AffiliateButton url={text("url", "")} userId={123} />
  ));

const DarkWrapper = ({ children }: { children: React.ReactNode }) => (
  <div css={{ background: "#336699;", padding: "15px" }}>{children}</div>
);

const HeaderWrapper = ({ children }: { children: React.ReactNode }) => (
  <div css={{ margin: "30px 20px" }}>{children}</div>
);

storiesOf(`${heading}/Input`, module)
  .add("with icon", () => (
    <DarkWrapper>
      <Input placeholder="Keflavík Airport" Icon={LocationIcon} />
    </DarkWrapper>
  ))
  .add("without icon", () => (
    <DarkWrapper>
      <Input placeholder="Keflavík Airport" />
    </DarkWrapper>
  ));

storiesOf(`${heading}/InputHeader`, module)
  .add("with tooltip", () => (
    <HeaderWrapper>
      <InputHeader
        title="Input Header"
        price={0}
        description="This is tooltip"
      />
    </HeaderWrapper>
  ))
  .add("without tooltip", () => (
    <HeaderWrapper>
      <InputHeader title="Input Header" price={0} description="" />
    </HeaderWrapper>
  ));

const mockListItems = [
  {
    id: "0",
    name: "Keflavik International Airport",
  },
  {
    id: "1",
    name: "Reykjavík",
  },
  {
    id: "2",
    name: "Jökulsárlón",
  },
  {
    id: "3",
    name: "Skaftafell",
  },
  {
    id: "4",
    name: "Langjökull",
  },
] as SharedTypes.AutocompleteItem[];

storiesOf(`${heading}/Autocomplete`, module)
  .add("default", () => {
    const [listItems, setListItems] = useState(mockListItems);

    return (
      <DarkWrapper>
        <AutocompleteInput
          id="autocomplete"
          placeholder="Keflavík Airport"
          ListIcon={SearchIcon}
          onInputChange={e => {
            // eslint-disable-next-line no-console
            console.log("inputValue", e.target.value);
            setTimeout(() => setListItems(shuffleArray(mockListItems)), 500);
          }}
          listItems={listItems}
          onItemClick={selectedValue => {
            // eslint-disable-next-line no-console
            console.log("selectedValue", selectedValue);
          }}
        />
      </DarkWrapper>
    );
  })
  .add("double", () => {
    const [listItems, setListItems] = useState(mockListItems);
    const [listItems2, setListItems2] = useState(mockListItems);
    const [isDouble, toggle] = useToggle(true);

    return (
      <DarkWrapper>
        <AutocompleteDoubleWrapper>
          <AutocompleteInputHalf
            id="autocomplete"
            placeholder="Reykjavik Airport"
            ListIcon={SearchIcon}
            onInputChange={e => {
              // eslint-disable-next-line no-console
              console.log("inputValue", e.target.value);
              setTimeout(() => setListItems(shuffleArray(mockListItems)), 500);
            }}
            listItems={listItems}
            onItemClick={selectedValue => {
              // eslint-disable-next-line no-console
              console.log("selectedValue", selectedValue);
            }}
          />
          {!isDouble && (
            <AutocompleteInputHalf
              id="autocomplete2"
              placeholder="Keflavík Airport"
              ListIcon={SearchIcon}
              onInputChange={e => {
                // eslint-disable-next-line no-console
                console.log("inputValue", e.target.value);
                setTimeout(
                  () => setListItems2(shuffleArray(mockListItems)),
                  500
                );
              }}
              listItems={listItems2}
              onItemClick={selectedValue => {
                // eslint-disable-next-line no-console
                console.log("selectedValue", selectedValue);
              }}
            />
          )}
        </AutocompleteDoubleWrapper>

        <br />
        <input type="button" onClick={toggle} value="👆toggle single/double" />
      </DarkWrapper>
    );
  });

storiesOf(`${heading}`, module).add("DateSelect", () => {
  return (
    <DateSelect
      date={object("date", {
        month: 1,
        day: 1,
        year: 1994,
      })}
      onDateChange={() => {}}
    />
  );
});

const countryMock = [
  {
    request: {
      query: CountryListQuery,
    },
    result: {
      data: {
        getCountryList: [
          {
            flagSvgUrl: "https://restcountries.eu/data/afg.svg",
            countryCode: "AF",
            callingCode: 93,
            name: "Afghanistan",
          },
          {
            flagSvgUrl: "https://restcountries.eu/data/ala.svg",
            countryCode: "AX",
            callingCode: 358,
            name: "Åland Islands",
          },
          {
            flagSvgUrl: "https://restcountries.eu/data/alb.svg",
            countryCode: "AL",
            callingCode: 355,
            name: "Albania",
          },
          {
            flagSvgUrl: "https://restcountries.eu/data/dza.svg",
            countryCode: "DZ",
            callingCode: 213,
            name: "Algeria",
          },
          {
            flagSvgUrl: "https://restcountries.eu/data/asm.svg",
            countryCode: "AS",
            callingCode: 1684,
            name: "American Samoa",
          },
          {
            flagSvgUrl: "https://restcountries.eu/data/and.svg",
            countryCode: "AD",
            callingCode: 376,
            name: "Andorra",
          },
          {
            flagSvgUrl: "https://restcountries.eu/data/ago.svg",
            countryCode: "AO",
            callingCode: 244,
            name: "Angola",
          },
          {
            flagSvgUrl: "https://restcountries.eu/data/aia.svg",
            countryCode: "AI",
            callingCode: 1264,
            name: "Anguilla",
          },
        ],
      },
    },
  },
];

storiesOf(`${heading}`, module).add("NationalityDropdown", () => (
  <MockedProvider mocks={countryMock} addTypename={false}>
    <NationalityDropdown
      hasError={boolean("hasError", false)}
      nationality={select(
        "nationality",
        ["AF", "AX", "AL", "DZ", "AS", "AD", "AI"],
        "AF"
      )}
      onChange={() => {}}
    />
  </MockedProvider>
));

storiesOf(`${heading}`, module).add("PhoneNumberInputContainer", () => (
  <MockedProvider mocks={countryMock} addTypename={false}>
    <PhoneNumberInputContainer
      hasError={boolean("hasError", false)}
      phoneNumber={text("phoneNumber")}
      onPhoneNumberChange={() => {}}
    />
  </MockedProvider>
));
