import React from "react";
import styled from "@emotion/styled";

import { row } from "styles/base";

const Row = styled.div(row);

export const MaybeRow = ({
  showRow,
  children,
}: {
  showRow: boolean;
  children: React.ReactNode;
}) => {
  if (showRow) {
    return <Row>{children}</Row>;
  }
  return children as JSX.Element;
};

export default Row;
