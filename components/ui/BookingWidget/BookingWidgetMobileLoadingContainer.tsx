import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { useTheme } from "emotion-theming";

import MobileStickyFooter from "../StickyFooter/MobileStickyFooter";

import { ButtonSize } from "types/enums";
import Button from "components/ui/Inputs/Button";
import { skeletonPulse } from "styles/base";

const PriceLoading = styled.div(() => [
  skeletonPulse,
  css`
    width: 150px;
    height: 32px;
  `,
]);

const BookingWidgetMobileLoadingContainer = () => {
  const theme: Theme = useTheme();
  return (
    <MobileStickyFooter
      leftContent={<PriceLoading />}
      rightContent={<Button color="action" buttonSize={ButtonSize.Small} theme={theme} loading />}
    />
  );
};

export default BookingWidgetMobileLoadingContainer;
