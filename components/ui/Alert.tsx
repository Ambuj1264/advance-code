import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";

import { borderRadius, gutters, redColor } from "../../styles/variables";

export default styled.div`
  border-radius: ${borderRadius};
  padding: ${gutters.small}px;
  background-color: ${rgba(redColor, 0.15)};
  color: ${redColor};
`;
