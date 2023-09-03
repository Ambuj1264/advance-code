import React from "react";
import styled from "@emotion/styled";

import BookingButton from "./BookingButton";

import { mqMin } from "styles/base";

const Wrapper = styled.div`
  display: none;

  & a {
    display: inline-flex;
    width: auto;
  }

  ${mqMin.large} {
    display: block;
  }
`;

const BookingHeadingWidget = ({
  bookUrl,
  children,
}: {
  bookUrl: string;
  children: React.ReactElement;
}) => (
  <Wrapper>
    <BookingButton bookUrl={bookUrl}>{children}</BookingButton>
  </Wrapper>
);

export default BookingHeadingWidget;
