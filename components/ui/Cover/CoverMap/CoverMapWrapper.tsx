import { css } from "@emotion/core";
import styled from "@emotion/styled";

import { DEFAULT_HEIGHT as MOBILE_HEIGHT } from "../Cover";

import { mqMin } from "styles/base";
import { borderRadius } from "styles/variables";

const CoverMapWrapper = styled.div([
  css`
    position: relative;
    height: ${MOBILE_HEIGHT}px;
    cursor: pointer;

    ${mqMin.medium} {
      height: 430px;
      overflow: hidden;
    }

    ${mqMin.large} {
      border-radius: ${borderRadius};
    }
  `,
]);

export default CoverMapWrapper;
