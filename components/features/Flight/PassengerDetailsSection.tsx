import React from "react";
import { useTheme } from "emotion-theming";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { Banner } from "../../ui/FlightsShared/flightShared";

import { getPassengerCategoryOptions, shouldShowPassengerRemoveButton } from "./utils/flightUtils";
import BagInformation from "./BagInformation";
import PassengerDetailsForm from "./PassengerDetailsForm";

import { useIsMobile } from "hooks/useMediaQueryCustom";
import { mqMax } from "styles/base";
import { CloseButton } from "components/ui/Modal/Modal";
import { Trans, useTranslation } from "i18n";
import SectionWithTitle from "components/ui/Section/SectionWithTitle";
import { gutters, whiteColor } from "styles/variables";
import Row from "components/ui/Grid/Row";
import RadioSelectionDropdown from "components/ui/Inputs/RadioSelectionDropdown";
import InformationIcon from "components/icons/information-circle.svg";
import PassengerDetailsIcon from "components/icons/messages-people-user-warning-1.svg";
import BaggageSectionIcon from "components/icons/baggage-plane.svg";
import { Namespaces } from "shared/namespaces";
import { typographyBody2 } from "styles/typography";

export const StyledBanner = styled(Banner)([
  typographyBody2,
  css`
    justify-content: center;
  `,
]);

const InformationBanner = styled(Banner)`
  ${mqMax.large} {
    padding: ${gutters.small * 2}px ${gutters.small}px;
  }
`;

const informationStyles = (theme: Theme) => css`
  margin-right: ${gutters.small / 2}px;
  width: 20px;
  height: 20px;
  fill: ${theme.colors.primary};
`;

const iconStyles = css`
  margin-right: ${gutters.small / 2}px;
  width: 20px;
  height: 20px;
  fill: ${whiteColor};
`;

const CloseButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 35px;
`;

export const PassengerSectionContent = ({
  id,
  theme,
  passenger,
  onPassengerDetailsChange,
}: {
  id: string;
  theme: Theme;
  passenger: FlightTypes.PassengerDetails;
  onPassengerDetailsChange: (
    passengerId: number,
    passengerDetails: Partial<FlightTypes.PassengerDetails>
  ) => void;
}) => {
  return (
    <>
      <Row>
        <InformationBanner>
          <InformationIcon css={informationStyles(theme)} />
          <Trans ns={Namespaces.flightNs}>
            Use all given names and surnames exactly as they appear in your passport/ID to avoid
            boarding complications
          </Trans>
        </InformationBanner>
        <PassengerDetailsForm
          passenger={passenger}
          onPassengerDetailsChange={onPassengerDetailsChange}
        />
      </Row>
      <Row>
        <StyledBanner>
          <BaggageSectionIcon css={informationStyles(theme)} />
          <Trans ns={Namespaces.flightNs}>Baggage details and addons</Trans>
        </StyledBanner>
        <BagInformation passenger={passenger} id={id} />
      </Row>
    </>
  );
};

export const PassengerCategoryDropdown = ({
  passenger,
  onPassengerCategoryChange,
  nrOfAdults,
  nrOfInfants,
}: {
  passenger: FlightTypes.PassengerDetails;
  onPassengerCategoryChange: (passengerId: number, category: FlightTypes.PassengerCategory) => void;
  nrOfAdults: number;
  nrOfInfants: number;
}) => {
  const { t } = useTranslation(Namespaces.flightNs);
  const { id, category } = passenger;
  const passengerCategoryOptions = getPassengerCategoryOptions(
    id,
    t,
    nrOfAdults,
    nrOfInfants,
    category
  );
  const selectedPassengerCategory = passengerCategoryOptions.find(option => option.id === category);
  return (
    <RadioSelectionDropdown
      id="passengerCategory"
      selectedValue={selectedPassengerCategory}
      options={passengerCategoryOptions}
      onChange={categoryId =>
        onPassengerCategoryChange(passenger.id, categoryId as FlightTypes.PassengerCategory)
      }
      dropdownWidth={200}
      directionOverflow="right"
    />
  );
};
const PassengerDetailsSection = ({
  id,
  passenger,
  onPassengerDetailsChange,
  onPassengerCategoryChange,
  onPassengerRemove,
  noBorder,
  nrOfAdults,
  nrOfInfants,
}: {
  id: string;
  passenger: FlightTypes.PassengerDetails;
  onPassengerDetailsChange: (
    passengerId: number,
    passengerDetails: Partial<FlightTypes.PassengerDetails>
  ) => void;
  onPassengerCategoryChange: (passengerId: number, category: FlightTypes.PassengerCategory) => void;
  onPassengerRemove?: (id: number) => void;
  noBorder?: boolean;
  nrOfAdults: number;
  nrOfInfants: number;
}) => {
  const isMobile = useIsMobile();
  const theme: Theme = useTheme();
  const { id: passengerId, category } = passenger;
  const { t } = useTranslation(Namespaces.flightNs);
  const title =
    passengerId === 1
      ? t("Primary passenger")
      : t("{id}. Passenger", {
          id: passengerId,
        });
  const shouldShowCloseButton = shouldShowPassengerRemoveButton(
    passengerId,
    category,
    nrOfAdults,
    nrOfInfants
  );
  return (
    <SectionWithTitle
      color={theme.colors.primary}
      title={!isMobile ? title : undefined}
      noBorder={noBorder}
      headerLeftContent={
        <PassengerCategoryDropdown
          passenger={passenger}
          onPassengerCategoryChange={onPassengerCategoryChange}
          nrOfAdults={nrOfAdults}
          nrOfInfants={nrOfInfants}
        />
      }
      headerRightContent={
        shouldShowCloseButton &&
        onPassengerRemove && (
          <CloseButtonWrapper>
            <CloseButton onClick={() => onPassengerRemove(passengerId)} />
          </CloseButtonWrapper>
        )
      }
      icon={!isMobile && <PassengerDetailsIcon css={iconStyles} />}
      dataTestid={
        passenger.id === 1
          ? `primary-passenger-details-section-${passenger.id}`
          : `additional-passenger-details-section-${passenger.id}`
      }
    >
      <PassengerSectionContent
        id={id}
        theme={theme}
        passenger={passenger}
        onPassengerDetailsChange={onPassengerDetailsChange}
      />
    </SectionWithTitle>
  );
};

export default PassengerDetailsSection;
