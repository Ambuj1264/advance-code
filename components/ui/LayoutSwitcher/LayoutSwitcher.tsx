import React, { SyntheticEvent, useCallback, useEffect } from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";

import { PageLayout, PageType } from "types/enums";
import { borderRadiusSmall, whiteColor, gutters } from "styles/variables";
import LayoutGrid from "components/icons/layout-grid.svg";
import LayoutList from "components/icons/layout-list.svg";
import { mqMin } from "styles/base";
import {
  getListLayoutFromLocalStorage,
  lsKeyListLayout,
  setListLayoutInLocalStorage,
} from "utils/localStorageUtils";

// Button size is Icon plus doubled Padding plus doubled Button Border
const buttonSizeInPx = 40;
const buttonBorderSizeInPx = 1;
const iconSizeInPx = 22;
const paddingInPx = (buttonSizeInPx - iconSizeInPx - buttonBorderSizeInPx * 2) / 2;

export const Tab = styled.button<{
  active?: boolean;
}>(({ active, theme }) => [
  css`
    margin-right: ${gutters.large / 2}px;
    border: ${theme.colors.primary} ${buttonBorderSizeInPx}px solid;
    border-radius: ${borderRadiusSmall};
    box-sizing: border-box;
    padding: ${paddingInPx}px;
    background-color: ${active ? theme.colors.primary : "transparent"};
    text-align: center;
    fill: ${active ? whiteColor : theme.colors.primary};
    outline: none;
  `,
]);

export const IconWrapper = styled.span`
  display: block;
  width: ${iconSizeInPx}px;
  height: ${iconSizeInPx}px;
`;

export const TabsWrapper = styled.div`
  display: none;
  justify-content: space-between;
  padding: 0 ${gutters.small / 2}px;
  border-width: 0;
  ${mqMin.large} {
    padding: 0;
  }
  ${mqMin.desktop} {
    display: flex;
  }
`;

const layoutIcons = {
  [PageLayout.GRID]: LayoutGrid,
  [PageLayout.LIST]: LayoutList,
};

const LayoutSwitcher = ({
  layouts,
  currentLayout,
  onChange,
  lsKey = lsKeyListLayout,
  disableLSLayout = false,
  pageType,
}: {
  layouts: PageLayout[];
  currentLayout: PageLayout;
  onChange: (layout: PageLayout) => void;
  lsKey?: string;
  disableLSLayout?: boolean;
  pageType?: PageType;
}) => {
  const listLayoutFromLocalStorage = !disableLSLayout
    ? getListLayoutFromLocalStorage(lsKey)
    : undefined;

  const handleClick = useCallback(
    (e: SyntheticEvent<HTMLButtonElement>) => {
      const selectedLayout = e.currentTarget.dataset.layout as PageLayout;

      onChange(selectedLayout);
      setListLayoutInLocalStorage(lsKey, selectedLayout);
    },
    [lsKey, onChange]
  );

  useEffect(() => {
    if (
      pageType !== PageType.FLIGHT &&
      listLayoutFromLocalStorage &&
      listLayoutFromLocalStorage !== currentLayout
    ) {
      onChange(listLayoutFromLocalStorage as PageLayout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <TabsWrapper>
      {layouts.map(layout => {
        const Icon = layoutIcons[layout];
        return (
          <Tab
            key={layout}
            active={currentLayout === layout}
            onClick={handleClick}
            data-layout={layout}
          >
            <IconWrapper>
              <Icon width="22px" height="22px" />
            </IconWrapper>
          </Tab>
        );
      })}
    </TabsWrapper>
  );
};

export default LayoutSwitcher;
