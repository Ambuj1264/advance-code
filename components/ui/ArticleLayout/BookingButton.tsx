import React from "react";
import styled from "@emotion/styled";
import { useTheme } from "emotion-theming";

import { ButtonSize } from "types/enums";
import Button from "components/ui/Inputs/Button";
import ArrowRight from "components/icons/arrow-right.svg";
import { gutters, whiteColor } from "styles/variables";

const ICON_SIZE = 14;

const Wrapper = styled.div`
  & a {
    padding-right: ${gutters.small * 2 + gutters.small / 4}px;
  }
`;

const ArrowIcon = styled(ArrowRight)`
  position: absolute;
  top: 50%;
  right: ${gutters.small}px;
  width: ${ICON_SIZE}px;
  height: ${ICON_SIZE}px;
  transform: translateY(-50%);
  fill: ${whiteColor};
`;

const BookingWidgetFooterMobile = ({
  bookUrl,
  children,
}: {
  bookUrl: string;
  children: React.ReactElement;
}) => {
  const theme: Theme = useTheme();

  return (
    <Wrapper>
      <Button href={bookUrl} buttonSize={ButtonSize.Small} theme={theme} color="action">
        {children}
        <ArrowIcon>
          <ArrowRight />
        </ArrowIcon>
      </Button>
    </Wrapper>
  );
};

export default BookingWidgetFooterMobile;
