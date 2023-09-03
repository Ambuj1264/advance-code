import styled from "@emotion/styled";

import { gutters, borderRadius, lightGreyColor } from "styles/variables";

const LoadingBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${borderRadius} ${borderRadius} 0 0;
  height: 36px;
  padding: ${gutters.large / 2}px 0px;
  background-color: ${lightGreyColor};
`;

export default LoadingBanner;
