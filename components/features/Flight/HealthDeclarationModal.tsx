import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { healthDeclarationList } from "./utils/flightUtils";

import { gutters } from "styles/variables";
import { typographySubtitle2, typographyBody2 } from "styles/typography";
import Modal, { ModalHeader, CloseButton, ModalContentWrapper } from "components/ui/Modal/Modal";
import { mqMin } from "styles/base";

const ListItem = styled.div`
  margin-bottom: ${gutters.small}px;
`;

const StyledModalContentWrapper = styled(ModalContentWrapper)(
  typographyBody2,
  css`
    margin-bottom: ${gutters.large * 2}px;
    padding: ${gutters.small}px;
    ${mqMin.large} {
      margin-bottom: 0;
    }
  `
);

const BottomContent = styled.div(
  typographySubtitle2,
  css`
    margin-bottom: ${gutters.large}px;
  `
);

const TopContent = styled.div`
  margin: ${gutters.small / 2}px 0;
`;

const HealthDeclarationModal = ({
  onClose,
  headerContent,
  footerContent,
}: {
  onClose: () => void;
  headerContent?: React.ReactNode;
  footerContent?: React.ReactNode;
}) => {
  return (
    <Modal id="covidRequirementsModal" onClose={onClose} noMinHeight>
      <ModalHeader
        title="COVID-19 health requirements"
        rightButton={<CloseButton onClick={onClose} />}
      />
      <StyledModalContentWrapper>
        {headerContent}
        <TopContent>I declare that:</TopContent>
        {healthDeclarationList.map((item: string, index) => (
          <ListItem>
            {index + 1}. {item}
          </ListItem>
        ))}
        <BottomContent>
          I declare that all passengers in my booking meet these requirements as of the issuance
          date. I understand that if I am found to be in contravention of any part of this
          statement, that I will be refused permission to travel. I will inform Guide to Europe if
          any of the stated facts change before the date of my departure.
        </BottomContent>
      </StyledModalContentWrapper>
      {footerContent}
    </Modal>
  );
};

export default HealthDeclarationModal;
