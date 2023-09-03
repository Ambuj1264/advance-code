import React from "react";
import styled from "@emotion/styled";

import { DesktopContainer } from "./Grid/Container";

import { column, mqMax } from "styles/base";
import Row from "components/ui/Grid/Row";

type Props = {
  children: React.ReactNode;
};

const Content = styled.div(column({ small: 1, large: 5 / 8, desktop: 2 / 3 }));

const MobileAntiMargin = styled.div`
  > ${Row} {
    flex-wrap: nowrap;
    ${mqMax.large} {
      margin: 0;
    }
    > ${Content} {
      ${mqMax.large} {
        padding: 0;
      }
    }
  }
`;

const PageContentContainer = ({ children }: Props) => (
  <DesktopContainer id="pageContentContainer">
    <MobileAntiMargin>
      <Row>{children}</Row>
    </MobileAntiMargin>
  </DesktopContainer>
);

export { Content };
export default PageContentContainer;
