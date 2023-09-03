import styled from "@emotion/styled";

import { gutters } from "styles/variables";
import { mqMin } from "styles/base";

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: ${gutters.small / 2}px auto 0;
  text-align: center;
  ${mqMin.medium} {
    display: block;
    justify-content: unset;
  }
`;

export const PaginationContent = styled.div``;
