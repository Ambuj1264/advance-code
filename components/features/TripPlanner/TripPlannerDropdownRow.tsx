import React, { useState, useContext } from "react";
import { constructUniqueIdentifier } from "@travelshift/ui/utils/utils";
import Bubbles from "@travelshift/ui/components/Bubbles/Bubbles";

import {
  BubblesWrapper,
  ButtonStyled,
  ButtonWrapper,
  DropdownWrapper,
  iconStyles,
} from "./TripPlannerStyledComponents";
import TripPlannerStateContext from "./contexts/TripPlannerStateContext";
import { constructTrips, generateTrips } from "./utils/tripPlannerUtils";
import { TripPlannerQueryTrip } from "./types/tripPlannerTypes";

import Column from "components/ui/Grid/Column";
import Row from "components/ui/Grid/Row";
import EarthIcon from "components/icons/earth-model-1.svg";
import PinIcon from "components/icons/pin.svg";
import PlaneTakeOffIcon from "components/icons/plane-take-off.svg";
import DropdownOption from "components/ui/Inputs/Dropdown/DropdownOption";
import Dropdown from "components/ui/Inputs/Dropdown/Dropdown";
import { ButtonSize, Direction } from "types/enums";

const TripPlannerDropdownRow = ({
  columns,
  theme,
  countries,
}: {
  columns: SharedTypes.Columns;
  theme: Theme;
  countries: { id: string; name: string; airports: string[] }[];
}) => {
  const { setContextState, isFetchingTrips, selectedCountry, maxDrivingHours, duration } =
    useContext(TripPlannerStateContext);

  const tripParameters = { maxDrivingHours, duration };
  const [selectedAirport, setSelectedAirport] = useState<string>(selectedCountry!.airports[0]);
  const disabledOptions = (nativeLabel: string) => {
    return [
      {
        nativeLabel,
        value: undefined,
        label: undefined,
        isDisabled: true,
      },
    ];
  };

  const onChangeCountry = (newId: string) => {
    const newCountry = countries.find(country => country.id === newId);
    setContextState({ selectedCountry: newCountry });
    setSelectedAirport(newCountry!.airports[0]);
  };

  const countryOptions = countries.map(
    (country: { id: string; name: string; airports: string[] }) => {
      return {
        value: country.id,
        nativeLabel: country.name,
        label: (
          <DropdownOption
            id={`${constructUniqueIdentifier(country.id)}DropdownOption`}
            label={country.name}
            isSelected={country.id === selectedCountry?.id}
          />
        ),
      };
    }
  );
  const airportOptions =
    selectedCountry?.airports.map(airport => {
      return {
        value: airport,
        nativeLabel: airport,
        label: (
          <DropdownOption
            id={`${constructUniqueIdentifier(airport)}AirportDropdownOption`}
            label={airport}
            isSelected={airport === selectedAirport}
          />
        ),
      };
    }) || disabledOptions("No available airports");
  const cityOptions = disabledOptions("Cities not yet available");

  const generateTravelPlan = () => {
    setContextState({
      isFetchingTrips: true,
      selectedTrip: undefined,
      fetchingError: "",
      noDataError: "",
    });
    generateTrips(tripParameters, selectedCountry!.id)
      .then((res: Response) => res.json())
      .then(data => {
        if (data[0].trip && data[0].tripMapHtml) {
          const tripsData = constructTrips(data as TripPlannerQueryTrip[]);
          setContextState({
            selectedTrip: tripsData[0],
            trips: tripsData,
          });
        } else {
          setContextState({
            noDataError: "Looks like we don't have available data for this trip yet!",
          });
        }
      })
      .catch((err: Error) => {
        setContextState({ fetchingError: err.toString() });
      })
      .finally(() => {
        setContextState({
          isFetchingTrips: false,
        });
      });
  };

  return (
    <Row>
      <Column columns={columns}>
        <DropdownWrapper>
          <Dropdown
            id="countryDropdown"
            selectedValue={selectedCountry?.id}
            icon={<EarthIcon css={iconStyles} />}
            onChange={onChangeCountry}
            options={countryOptions}
            shouldLoadWhenVisible
          />
        </DropdownWrapper>
      </Column>
      <Column columns={columns}>
        <DropdownWrapper>
          <Dropdown
            id="cityDropdown"
            onChange={() => undefined}
            isDisabled
            icon={<PinIcon css={iconStyles(true)} />}
            options={cityOptions}
            shouldLoadWhenVisible
          />
        </DropdownWrapper>
      </Column>
      <Column columns={columns}>
        <DropdownWrapper>
          <Dropdown
            id="airportDropdown"
            icon={<PlaneTakeOffIcon css={iconStyles} />}
            onChange={airport => setSelectedAirport(airport)}
            options={airportOptions}
            selectedValue={selectedAirport}
            shouldLoadWhenVisible
          />
        </DropdownWrapper>
      </Column>
      <Column columns={columns}>
        <ButtonWrapper maxWidth="330px">
          <ButtonStyled
            id="getTravelPlan"
            type="submit"
            buttonSize={ButtonSize.Small}
            theme={theme}
            color="action"
            callToActionDirection={!isFetchingTrips ? Direction.Right : undefined}
            onClick={generateTravelPlan}
          >
            {isFetchingTrips ? (
              <BubblesWrapper>
                <Bubbles />
              </BubblesWrapper>
            ) : (
              "Get travel plan"
            )}
          </ButtonStyled>
        </ButtonWrapper>
      </Column>
    </Row>
  );
};

export default TripPlannerDropdownRow;
