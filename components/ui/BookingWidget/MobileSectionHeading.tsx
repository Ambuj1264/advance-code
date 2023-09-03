import React, { Ref } from "react";
import styled from "@emotion/styled";

import BookingWidgetMobileSectionHeading from "components/ui/BookingWidget/BookingWidgetMobileSectionHeading";
import { gutters } from "styles/variables";

export const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 32px;
  padding: ${gutters.small / 4}px 0;
`;

const MobileSectionHeading = ({
  isDark = false,
  children,
  innerRef,
  className,
}: {
  isDark?: boolean;
  children: React.ReactNode;
  innerRef?: Ref<HTMLDivElement>;
  className?: string;
}) => (
  <BookingWidgetMobileSectionHeading isDark={isDark} className={className}>
    <Wrapper ref={innerRef}>{children}</Wrapper>
  </BookingWidgetMobileSectionHeading>
);

export default MobileSectionHeading;
