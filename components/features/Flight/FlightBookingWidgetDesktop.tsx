import React, { useContext } from "react";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import { css } from "@emotion/core";
import { none } from "fp-ts/lib/Option";

import ModalFlightSearchWidget from "./ModalFlightSearchWidget";
import { getPassengersCount } from "./utils/flightUtils";
import FlightStateContext from "./contexts/FlightStateContext";
import FlightCallbackContext from "./contexts/FlightCallbackContext";
import FlightBookingWidgetPassengerDetails from "./FlightBookingWidgetPassengerDetails";
import HealthDeclaration from "./HealthDeclaration";

import PassengersContainer from "components/ui/FlightSearchWidget/PassengersContainer";
import BookingWidgetDesktopContainer from "components/ui/BookingWidget/BookingWidgetDesktopContainer";
import { useCurrencyWithDefault } from "hooks/useCurrency";
import { Namespaces } from "shared/namespaces";
import { Trans, useTranslation } from "i18n";
import { gutters, separatorColorLight, borderRadiusSmall, blackColor } from "styles/variables";
import { typographyBody2 } from "styles/typography";
import CalendarDropdownDisplay from "components/ui/DatePicker/CalendarDropdownDisplay";
import useToggle from "hooks/useToggle";
import { getShortMonthNumbericDateFormat } from "utils/dateUtils";
import useActiveLocale from "hooks/useActiveLocale";

const BookingWidgetBody = styled.div`
  margin: 0 ${gutters.large}px ${gutters.large}px ${gutters.large}px;
`;

const Wrapper = styled.div`
  margin-top: ${gutters.large}px;
`;

const FieldWrapper = styled.div`
  margin-top: ${gutters.small}px;
`;

const Label = styled.div([
  typographyBody2,
  css`
    color: ${rgba(blackColor, 0.7)};
  `,
]);

const ClickableField = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${gutters.small / 2}px;
  border: 1px solid ${separatorColorLight};
  border-radius: ${borderRadiusSmall};
  padding: ${gutters.small / 2}px ${gutters.small}px;
  cursor: pointer;
`;

const ClickableDateField = styled(ClickableField)`
  padding: ${gutters.small / 4}px 0;
`;

const FlightBookingWidgetDesktop = ({
  departureDate,
  returnDate,
  departureTime,
  returnTime,
  price,
  formError,
  isFormLoading,
  isPriceLoading,
  showHealthDeclaration,
  flightLoading,
}: {
  departureDate: string;
  returnDate?: string;
  departureTime: string;
  returnTime?: string;
  price: number;
  formError?: string;
  isFormLoading: boolean;
  isPriceLoading: boolean;
  showHealthDeclaration: boolean;
  flightLoading?: boolean;
}) => {
  const activeLocale = useActiveLocale();
  const { currencyCode } = useCurrencyWithDefault();
  const { t: commonT } = useTranslation(Namespaces.commonBookingWidgetNs);
  const { t } = useTranslation(Namespaces.flightNs);
  const { passengers } = useContext(FlightStateContext);
  const { onNumberOfPassengersChange, onPassengerDetailsChange, onPassengerCategoryChange } =
    useContext(FlightCallbackContext);
  const nrOfPassengers = getPassengersCount(passengers);
  const [isSearchWidgetToggled, toggleSearchWidget] = useToggle();

  const departureDateAndTime = `${getShortMonthNumbericDateFormat(
    new Date(departureDate),
    activeLocale
  )}, ${departureTime}`;
  const returnDateAndTime = returnDate
    ? `${getShortMonthNumbericDateFormat(new Date(returnDate), activeLocale)}, ${returnTime}`
    : undefined;
  return (
    <>
      {isSearchWidgetToggled && <ModalFlightSearchWidget onClose={toggleSearchWidget} />}
      <BookingWidgetDesktopContainer
        footerText={commonT("Continue")}
        price={price}
        isPriceLoading={isPriceLoading}
        isFormLoading={isFormLoading}
        isTotalPrice
        currency={currencyCode}
        priceSubtext=""
        footerPriceInfo={t("Price for {totalPassengers} passengers", {
          totalPassengers: passengers.length,
        })}
        discount={none}
        error={formError}
        flightLoading={flightLoading}
      >
        <BookingWidgetBody>
          <Wrapper>
            <FieldWrapper>
              <Label>
                <Trans ns={Namespaces.flightSearchNs}>Departure / Return</Trans>
              </Label>
              <ClickableDateField onClick={toggleSearchWidget}>
                <CalendarDropdownDisplay
                  from={departureDateAndTime}
                  to={returnDateAndTime}
                  showDateTo={returnDate !== undefined}
                />
              </ClickableDateField>
            </FieldWrapper>
            <FieldWrapper>
              <Label>
                <Trans ns={Namespaces.flightNs}>Passengers</Trans>
              </Label>
              <PassengersContainer
                id="flightBookingWidgetPassengers"
                passengers={nrOfPassengers}
                onNumberOfPassengersChange={onNumberOfPassengersChange}
              />
            </FieldWrapper>
            <FieldWrapper>{showHealthDeclaration && <HealthDeclaration />}</FieldWrapper>
          </Wrapper>
          <FlightBookingWidgetPassengerDetails
            passengers={passengers}
            onPassengerDetailsChange={onPassengerDetailsChange}
            onPassengerCategoryChange={onPassengerCategoryChange}
            nrOfAdults={nrOfPassengers.adults}
            nrOfInfants={nrOfPassengers.infants}
          />
        </BookingWidgetBody>
      </BookingWidgetDesktopContainer>
    </>
  );
};

export default FlightBookingWidgetDesktop;
