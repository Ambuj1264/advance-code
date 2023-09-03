import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { mqMin } from "styles/base";
import { gutters, greyColor } from "styles/variables";
import SearchWidgetButton from "components/ui/SearchWidget/SearchWidgetButton";

export const DesktopColumn = styled.div<{
  baseWidth: number;
  flexOrder?: number;
  flexOrderMobile?: number;
  mobileMarginBottom?: number;
  mobileFlexGrow?: number;
  useDesktopStyle?: boolean;
}>(
  ({
    baseWidth,
    flexOrderMobile = 0,
    flexOrder = 0,
    mobileMarginBottom,
    mobileFlexGrow = 0,
    useDesktopStyle = true,
  }) => [
    mobileFlexGrow !== undefined &&
      css`
        flex-grow: ${mobileFlexGrow};
      `,
    mobileMarginBottom !== undefined &&
      css`
        margin-bottom: ${mobileMarginBottom}px;
      `,
    css`
      order: ${flexOrderMobile};
      &:last-of-type {
        margin-right: 0;
      }
    `,
    useDesktopStyle &&
      css`
        ${mqMin.large} {
          flex-basis: ${baseWidth}%;
          flex-grow: 1;
          align-self: flex-end;
          order: ${flexOrder};
          margin: 0;
          margin-right: ${gutters.small / 2}px;
        }

        ${mqMin.desktop} {
          margin-right: ${gutters.large}px;
        }
      `,
  ]
);

export const TAB_CONTENT_HEIGHT = 296;

export const TabContent = styled.div<{ useDesktopStyle?: boolean }>(
  ({ useDesktopStyle = true }) => [
    css`
      display: flex;
      flex-flow: column;
      height: ${TAB_CONTENT_HEIGHT}px;
      color: ${greyColor};
      ${DesktopColumn} {
        width: 100%;
      }
    `,
    useDesktopStyle &&
      css`
        ${mqMin.large} {
          flex-flow: row;
          height: auto;
          ${DesktopColumn} {
            width: auto;
          }
        }
      `,
  ]
);

export const SearchWidgetButtonStyled = styled(SearchWidgetButton, {
  shouldForwardProp: () => true,
})`
  ${mqMin.large} {
    margin: 0 auto;
  }
`;
