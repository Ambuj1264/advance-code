import React, { useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { useTheme } from "emotion-theming";

import { ContactDetailsContent } from "./FlightContactDetailsContainer";
import PassengerDetailsSection, {
  PassengerSectionContent,
  PassengerCategoryDropdown,
} from "./PassengerDetailsSection";
import { getPassengerDetailsText } from "./utils/flightUtils";

import useToggle from "hooks/useToggle";
import Modal, { CloseButton, ModalHeader } from "components/ui/Modal/Modal";
import BookingWidgetSectionHeading from "components/ui/BookingWidget/BookingWidgetSectionHeading";
import Button from "components/ui/Inputs/Button";
import PassengerDetailsIcon from "components/icons/messages-people-user-warning-1.svg";
import ContactDetailsIcon from "components/icons/single-man-actions-email.svg";
import { typographySubtitle2 } from "styles/typography";
import { gutters, whiteColor } from "styles/variables";
import { Namespaces } from "shared/namespaces";
import { useTranslation, Trans } from "i18n";

const ContentWrapper = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
`;

const SectionWrapper = styled.div`
  margin-top: ${gutters.large}px;
  margin-right: -${gutters.large}px;
  margin-left: -${gutters.large}px;
`;

const ContactDetailsWrapper = styled.div`
  width: 100%;
`;

const iconStyles = css`
  margin-right: ${gutters.small / 2}px;
  width: 20px;
  height: 20px;
  fill: ${whiteColor};
`;

const ButtonWrapper = styled.div`
  margin: ${gutters.large}px;
`;

const ModalButtonWrapper = styled.div`
  margin: ${gutters.large / 2}px;
`;

const HeaderTitle = styled.div(
  typographySubtitle2,
  css`
    display: flex;
    align-items: center;
  `
);

const StyledModal = styled(Modal)`
  > div:first-of-type {
    justify-content: flex-start;
  }
`;

const PassengerModal = ({
  passenger,
  isPrimaryPassenger,
  toggleModal,
  theme,
  onPassengerDetailsChange,
  onPassengerCategoryChange,
  nrOfAdults,
  nrOfInfants,
}: {
  passenger: FlightTypes.PassengerDetails;
  isPrimaryPassenger: boolean;
  toggleModal: () => void;
  theme: Theme;
  onPassengerDetailsChange: (
    passengerId: number,
    passengerDetails: Partial<FlightTypes.PassengerDetails>
  ) => void;
  onPassengerCategoryChange: (passengerId: number, category: FlightTypes.PassengerCategory) => void;
  nrOfAdults: number;
  nrOfInfants: number;
}) => {
  const { t } = useTranslation(Namespaces.flightNs);
  const headerIcon = isPrimaryPassenger ? (
    <ContactDetailsIcon css={iconStyles} />
  ) : (
    <PassengerDetailsIcon css={iconStyles} />
  );
  return (
    <StyledModal
      id={`passenger${passenger.id}Modal`}
      className={`passenger${passenger.id}Modal`}
      onClose={() => toggleModal()}
      variant="info"
      wide
    >
      <ModalHeader
        title={
          <HeaderTitle>
            {headerIcon}
            {isPrimaryPassenger ? t("Contact details") : t("{id}. passenger", { id: passenger.id })}
          </HeaderTitle>
        }
        rightButton={<CloseButton onClick={() => toggleModal()} />}
        leftButton={
          isPrimaryPassenger ? undefined : (
            <PassengerCategoryDropdown
              passenger={passenger}
              onPassengerCategoryChange={onPassengerCategoryChange}
              nrOfAdults={nrOfAdults}
              nrOfInfants={nrOfInfants}
            />
          )
        }
      />
      <ContentWrapper>
        {isPrimaryPassenger ? (
          <>
            <ContactDetailsWrapper>
              <ContactDetailsContent />
            </ContactDetailsWrapper>
            <PassengerDetailsSection
              id={`passenger${passenger.id}Modal`}
              passenger={passenger}
              onPassengerDetailsChange={onPassengerDetailsChange}
              onPassengerCategoryChange={onPassengerCategoryChange}
              noBorder
              nrOfAdults={nrOfAdults}
              nrOfInfants={nrOfInfants}
            />
          </>
        ) : (
          <PassengerSectionContent
            id={`passenger${passenger.id}Modal`}
            passenger={passenger}
            onPassengerDetailsChange={onPassengerDetailsChange}
            theme={theme}
          />
        )}
        <ModalButtonWrapper>
          <Button color="action" theme={theme} onClick={() => toggleModal()}>
            <Trans>Apply</Trans>
          </Button>
        </ModalButtonWrapper>
      </ContentWrapper>
    </StyledModal>
  );
};
const FlightBookingWidgetPassengerDetails = ({
  passengers,
  onPassengerDetailsChange,
  onPassengerCategoryChange,
  nrOfAdults,
  nrOfInfants,
}: {
  passengers: FlightTypes.PassengerDetails[];
  onPassengerDetailsChange: (
    passengerId: number,
    passengerDetails: Partial<FlightTypes.PassengerDetails>
  ) => void;
  onPassengerCategoryChange: (passengerId: number, category: FlightTypes.PassengerCategory) => void;
  nrOfAdults: number;
  nrOfInfants: number;
}) => {
  const { t } = useTranslation(Namespaces.flightNs);
  const theme: Theme = useTheme();
  const [isModalOpen, toggleIsModalOpen] = useToggle(false);
  const [selectedId, changeSelectedId] = useState(0);
  const openModal = (id: number) => {
    toggleIsModalOpen();
    changeSelectedId(id);
  };
  const selectedPassenger = passengers.find(passenger => passenger.id === selectedId);
  return (
    <>
      {passengers.map(passenger => (
        <SectionWrapper key={passenger.id}>
          <BookingWidgetSectionHeading color="primary">
            {getPassengerDetailsText(passenger.id, t)}
          </BookingWidgetSectionHeading>
          <ButtonWrapper>
            <Button color="action" theme={theme} onClick={() => openModal(passenger.id)}>
              <PassengerDetailsIcon css={iconStyles} />
              <Trans ns={Namespaces.flightNs}>Add your information</Trans>
            </Button>
          </ButtonWrapper>
        </SectionWrapper>
      ))}
      {isModalOpen && selectedPassenger && (
        <PassengerModal
          passenger={selectedPassenger}
          isPrimaryPassenger={selectedPassenger.id === 1}
          toggleModal={toggleIsModalOpen}
          theme={theme}
          onPassengerDetailsChange={onPassengerDetailsChange}
          onPassengerCategoryChange={onPassengerCategoryChange}
          nrOfAdults={nrOfAdults}
          nrOfInfants={nrOfInfants}
        />
      )}
    </>
  );
};

export default FlightBookingWidgetPassengerDetails;
