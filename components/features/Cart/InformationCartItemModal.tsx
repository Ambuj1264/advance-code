import React from "react";
import styled from "@emotion/styled";

import CartOptionModal from "./CartOptionModal";

import { Container } from "components/ui/Modal/Modal";
import { mqMin } from "styles/base";
import {
  VoucherSection,
  SectionContainer,
  SectionSeperator,
} from "components/ui/Order/OrderComponents";

const StyledModal = styled(CartOptionModal)`
  ${Container} {
    ${mqMin.large} {
      height: auto;
    }
  }
`;

const InformationCartItemModal = ({
  onClose,
  title,
  Icon,
  serviceDetails,
  extraSections = [],
  paymentDetails,
}: {
  onClose: () => void;
  title: string;
  Icon: React.ElementType<any>;
  serviceDetails: OrderTypes.VoucherProduct;
  extraSections?: OrderTypes.VoucherProduct[];
  paymentDetails?: OrderTypes.VoucherProduct;
}) => {
  return (
    <StyledModal id="informationCartItemModal" onClose={onClose} title={title} Icon={Icon}>
      <SectionContainer>
        <VoucherSection voucherSection={serviceDetails} />
        {paymentDetails && extraSections.length > 0 && <SectionSeperator />}
        {extraSections?.length > 0 &&
          extraSections.map((section, index) => (
            <React.Fragment key={section.title}>
              <VoucherSection voucherSection={section} />
              {index === extraSections.length - 1 && !paymentDetails ? null : <SectionSeperator />}
            </React.Fragment>
          ))}
        {paymentDetails && <VoucherSection voucherSection={paymentDetails} />}
      </SectionContainer>
    </StyledModal>
  );
};

export default InformationCartItemModal;
