import React from "react";
import styled from "@emotion/styled";

import { InputSkeleton, LabelSkeleton, PaymentMethodsContainer } from "./sharedCartComponents";
import { StyledColumn } from "./CreditCardForm";

import { mqMax, skeletonPulse } from "styles/base";
import { gutters, guttersPx } from "styles/variables";
import Row from "components/ui/Grid/Row";
import Column from "components/ui/Grid/Column";

const PaymentMethodItemSkeleton = styled.div`
  ${skeletonPulse}
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: ${guttersPx.smallHalf};
  width: 90px;
  min-width: 70px;
  height: 48px;
  padding: ${guttersPx.smallHalf} 18px 0;
`;

const StyledLabelSkeleton = styled(LabelSkeleton)`
  width: 25%;
  ${mqMax.large} {
    margin-top: ${gutters.large / 2}px;
  }
`;

const PaymentMethodsSkeleton = ({ hasTitle = false }: { hasTitle?: boolean }) => {
  return (
    <>
      {hasTitle && <StyledLabelSkeleton />}
      <PaymentMethodsContainer>
        <PaymentMethodItemSkeleton />
        <PaymentMethodItemSkeleton />
        <PaymentMethodItemSkeleton />
        <PaymentMethodItemSkeleton />
      </PaymentMethodsContainer>
      <Row>
        <StyledColumn columns={{ small: 1, large: 2 }}>
          <LabelSkeleton />
          <InputSkeleton />
        </StyledColumn>
        <StyledColumn columns={{ small: 1, large: 2 }}>
          <Row>
            <Column columns={{ small: 2 }}>
              <LabelSkeleton />
              <InputSkeleton />
            </Column>
            <Column columns={{ small: 2 }}>
              <LabelSkeleton />
              <InputSkeleton />
            </Column>
          </Row>
        </StyledColumn>
      </Row>
    </>
  );
};

export default PaymentMethodsSkeleton;
