import React from "react";
import styled from "@emotion/styled";

import { useIsMobile } from "hooks/useMediaQueryCustom";
import { gutters, guttersPx } from "styles/variables";
import { mqMax, mqMin } from "styles/base";
import GTETourBookingWidgetSharedBody from "components/features/GTETourProductPage/GTETourBookingWidget/GTETourBookingWidgetSharedBody";
import { BookingWidgetRow } from "components/ui/BookingWidget/BookingWidgetControlRow";
import ProductHeader from "components/ui/ProductHeader";

export const Wrapper = styled.div`
  padding-bottom: ${gutters.large * 6}px;
  ${mqMax.large} {
    padding-bottom: 0;
  }
  ${BookingWidgetRow} {
    ${mqMin.large} {
      padding: ${guttersPx.small} ${guttersPx.small} 0 ${guttersPx.small};
    }
  }
`;

const StyledProductHeader = styled(ProductHeader)`
  margin: ${gutters.small}px 0;
`;

const VPTourEditModalContent = ({
  productId,
  editModalTitle,
}: {
  productId: string;
  editModalTitle?: string;
}) => {
  const isMobile = useIsMobile();
  return (
    <Wrapper>
      {isMobile && editModalTitle && <StyledProductHeader title={editModalTitle} />}
      <GTETourBookingWidgetSharedBody
        productId={productId}
        hideContent={false}
        columns={{ small: 1, large: 2 }}
        isInModal={!isMobile}
      />
    </Wrapper>
  );
};

export default VPTourEditModalContent;
