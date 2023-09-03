import React from "react";
import styled from "@emotion/styled";

import { mqMin } from "styles/base";

const StyledImg = styled.img`
  width: auto;
  height: 26px !important;
  ${mqMin.large} {
    height: 30px !important;
  }
`;

// GTE logo in svg format is too big, so we are using inline base64 image instead.
const GTEImageLogo = ({ classNames, id }: { classNames?: string; id?: string }) => (
  <StyledImg
    src="data:image/webp;base64,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"
    alt="guidetoeurope logo"
    width={153}
    height={24}
    id={id}
    className={classNames}
  />
);

export default GTEImageLogo;
