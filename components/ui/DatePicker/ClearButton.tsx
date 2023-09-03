import styled from "@emotion/styled";

import { typographyCaption } from "styles/typography";
import { gutters } from "styles/variables";

const ClearButton = styled.div`
  ${typographyCaption};
  position: absolute;
  top: 0;
  left: 0;
  height: 24px;
  padding: 0 ${gutters.large / 2}px;
  line-height: 24px;
`;

export default ClearButton;
