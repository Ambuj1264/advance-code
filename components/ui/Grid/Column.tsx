import React from "react";
import styled from "@emotion/styled";

import { column } from "styles/base";

const Column = styled.div<{
  columns?: SharedTypes.Columns;
  skipPadding?: boolean;
}>(({ columns = {}, skipPadding }) => [
  column(
    {
      small: columns.small ? 1 / columns.small : 1,
      medium: columns.medium ? 1 / columns.medium : undefined,
      large: columns.large ? 1 / columns.large : undefined,
      desktop: columns.desktop ? 1 / columns.desktop : undefined,
      print: columns.print ? 1 / columns.print : undefined,
    },
    skipPadding
  ),
]);

export const MaybeColumn = ({
  showColumn,
  skipPadding,
  columns,
  children,
}: {
  showColumn: boolean;
  skipPadding?: boolean;
  columns: SharedTypes.Columns;
  children: React.ReactNode;
}) => {
  if (showColumn) {
    return (
      <Column columns={columns} skipPadding={skipPadding}>
        {children}
      </Column>
    );
  }
  return children as JSX.Element;
};

export default Column;
