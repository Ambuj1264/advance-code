import styled from "@emotion/styled";

import { gutters } from "styles/variables";
import { mqMin } from "styles/base";

const BreadcrumbsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: auto;
  min-height: ${gutters.large}px;
  padding: 5px 0;

  ${mqMin.large} {
    padding: 0;
  }
`;

export default BreadcrumbsWrapper;
