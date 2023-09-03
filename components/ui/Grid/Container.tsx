import styled from "@emotion/styled";

import { container, mqMin, mqMax } from "styles/base";

const Container = styled.div(container);

const DesktopContainer = styled.div`
  ${mqMin.large} {
    ${container}
  }
`;

const MobileContainer = styled.div`
  ${mqMax.large} {
    ${container};
  }
`;

export default Container;
export { DesktopContainer, MobileContainer };
