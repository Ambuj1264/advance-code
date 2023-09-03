import React from "react";
import styled from "@emotion/styled";

import CarInsuranceContent from "./CarInsuranceContent";

import Modal, { ModalHeader, CloseButton, ModalContentWrapper } from "components/ui/Modal/Modal";
import { gutters } from "styles/variables";

const StyledModalContentWrapper = styled(ModalContentWrapper)`
  margin-top: ${gutters.large}px;
`;

const CarInsuranceModal = ({
  insuranceInfo,
  setIsModalOpen,
}: {
  insuranceInfo: CarTypes.InsuranceInfo;
  setIsModalOpen: (isOpen: boolean) => void;
}) => {
  return (
    <Modal id="CarInsuranceModal" onClose={() => setIsModalOpen(false)} noMinHeight>
      <ModalHeader
        title={insuranceInfo.policyName}
        rightButton={<CloseButton onClick={() => setIsModalOpen(false)} />}
      />
      <StyledModalContentWrapper>
        <CarInsuranceContent insuranceInfo={insuranceInfo} />
      </StyledModalContentWrapper>
    </Modal>
  );
};

export default CarInsuranceModal;
