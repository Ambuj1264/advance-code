import styled from "@emotion/styled";

import { gutters } from "styles/variables";
import { mqMin } from "styles/base";

const SectionContent = styled.div`
  margin-top: ${gutters.small}px;
  ${mqMin.large} {
    margin-top: ${gutters.large}px;
  }
`;

export default SectionContent;
