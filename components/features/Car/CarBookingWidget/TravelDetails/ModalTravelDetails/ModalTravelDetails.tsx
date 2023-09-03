import React, { useContext } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { useMediaQuery } from "react-responsive";

import CarBookingWidgetConstantContext from "../../contexts/CarBookingWidgetConstantContext";

import BottomInfo from "./BottomInfo";

import { gutters, borderRadius, breakpointsMin, whiteColor } from "styles/variables";
import { typographyH4 } from "styles/typography";
import { Namespaces } from "shared/namespaces";
import CarSearchWidgetDesktop from "components/ui/CarSearchWidget/CarSearchWidgetDesktop";
import BaseModal from "components/ui/Modal/BaseModal";
import { Trans } from "i18n";
import { mqMin } from "styles/base";
import CarSearchWidgetStateContext from "components/ui/CarSearchWidget/contexts/CarSearchWidgetStateContext";

const Container = styled.div<{ isScrollable: boolean }>(
  ({ theme, isScrollable }) => css`
    position: relative;
    display: flex;
    flex-direction: column;
    margin-top: ${isScrollable ? "2%" : "5%"};
    border-radius: ${borderRadius};
    width: 350px;
    padding: ${gutters.small}px;
    background-color: ${theme.colors.primary};
    overflow: visible;
  `
);

const ModalTitle = styled.div([
  typographyH4,
  css`
    position: absolute;
    top: 40px;
    color: ${whiteColor};
  `,
]);

const Wrapper = styled.div(
  css`
    display: flex;
    flex-direction: column;
    align-items: center;
  `
);

const StyledBaseModal = styled(BaseModal)`
  ${mqMin.large} {
    overflow: visible;
  }
`;

const ModalTravelDetails = ({
  onClose,
  searchPageUrl,
}: {
  onClose: () => void;
  searchPageUrl: string;
}) => {
  const {
    driverAge,
    driverCountry,
    dropoffLocationName,
    dropoffId,
    pickupId,
    pickupLocationName,
    selectedDates,
  } = useContext(CarSearchWidgetStateContext);
  const { editItem, editCarOfferCartId } = useContext(CarBookingWidgetConstantContext);
  const cartEditItemId = editCarOfferCartId?.length ? Number(editCarOfferCartId) : editItem;

  const isSmallHeight = useMediaQuery({
    query: `(max-height: ${breakpointsMin.medium + 50}px)`,
  });
  const isShowBottonInfo = useMediaQuery({
    query: `(min-height: 750px)`,
  });
  return (
    <StyledBaseModal
      id="ModalTravelDetails"
      onClose={onClose}
      position="top"
      isScrollable={!!isSmallHeight}
      bottomContent={isShowBottonInfo ? <BottomInfo /> : undefined}
      topContent={
        <ModalTitle>
          <Trans ns={Namespaces.carBookingWidgetNs}>
            Update your search and see all available cars
          </Trans>
        </ModalTitle>
      }
    >
      <Wrapper>
        <Container isScrollable={!!isSmallHeight}>
          <CarSearchWidgetDesktop
            searchLink={searchPageUrl}
            selectedDates={selectedDates}
            pickupId={pickupId}
            pickupLocationName={pickupLocationName}
            dropoffId={dropoffId}
            dropoffLocationName={dropoffLocationName}
            driverAge={driverAge || 45}
            driverCountry={driverCountry}
            editItem={cartEditItemId}
            variant="modal"
          />
        </Container>
      </Wrapper>
    </StyledBaseModal>
  );
};

export default ModalTravelDetails;
