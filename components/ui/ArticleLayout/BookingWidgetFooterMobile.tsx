import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import BookingButton from "./BookingButton";

import { mediaQuery } from "styles/base";
import { gutters, whiteColor, zIndex, boxShadowTop } from "styles/variables";
import { Trans } from "i18n";
import { Namespaces } from "shared/namespaces";

const Wrapper = styled.div([
  mediaQuery({
    display: ["block", "block", "none"],
  }),
  css`
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: ${zIndex.z1};
    box-shadow: ${boxShadowTop};
    padding: ${gutters.large / 2}px;
    background: ${whiteColor};
  `,
]);

const BookingWidgetFooterMobile = ({
  tourLandingUrl,
  children,
}: {
  tourLandingUrl: string;
  children?: React.ReactElement;
}) => {
  return (
    <Wrapper>
      <BookingButton bookUrl={tourLandingUrl}>
        {children || <Trans ns={Namespaces.commonNs}>Book your trip now</Trans>}
      </BookingButton>
    </Wrapper>
  );
};

export default BookingWidgetFooterMobile;
