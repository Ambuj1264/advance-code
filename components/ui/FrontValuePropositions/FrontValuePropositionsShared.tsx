import styled from "@emotion/styled";

import { gutters } from "styles/variables";
import { mqMin } from "styles/base";

export const ValuePropsWrapper = styled.div`
  margin: ${gutters.small / 2}px -${gutters.small}px 0 -${gutters.small}px;
  ${mqMin.large} {
    margin: ${gutters.small / 2}px 0 0 0;
  }
`;
