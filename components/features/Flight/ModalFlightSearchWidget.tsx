import React, { useContext } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import FlightSearchPageProvider from "../FlightSearchPage/FlightSearchPageProvider";

import FlightConstantContext from "./contexts/FlightConstantContext";
import ModalFlightSearchWidgetContent from "./ModalFlightSearchWidgetContent";

import { gutters, borderRadius, whiteColor } from "styles/variables";
import { typographyH4 } from "styles/typography";
import { Namespaces } from "shared/namespaces";
import BaseModal from "components/ui/Modal/BaseModal";
import { Trans } from "i18n";
import { mqMin } from "styles/base";

const Container = styled.div(
  ({ theme }) => css`
    position: relative;
    display: flex;
    flex-direction: column;
    margin-top: 5%;
    border-radius: ${borderRadius};
    width: 500px;
    min-height: 334px;
    padding: ${gutters.small}px;
    background-color: ${theme.colors.primary};
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

const ModalFlightSearchWidget = ({ onClose }: { onClose: () => void }) => {
  const { originId, origin, destinationId, destination, searchPageUrl } =
    useContext(FlightConstantContext);
  return (
    <StyledBaseModal
      id="ModalFlightSearchWidget"
      onClose={onClose}
      position="top"
      topContent={
        <ModalTitle>
          <Trans ns={Namespaces.flightNs}>Update your search and see all available flights</Trans>
        </ModalTitle>
      }
    >
      <Wrapper>
        <Container>
          <FlightSearchPageProvider>
            <ModalFlightSearchWidgetContent
              searchLink={searchPageUrl}
              defaultOriginId={originId}
              defaultOrigin={origin}
              defaultDestinationId={destinationId}
              defaultDestination={destination}
            />
          </FlightSearchPageProvider>
        </Container>
      </Wrapper>
    </StyledBaseModal>
  );
};

export default ModalFlightSearchWidget;
