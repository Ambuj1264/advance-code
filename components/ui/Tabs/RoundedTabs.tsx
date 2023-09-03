import React, {
  ElementType,
  SyntheticEvent,
  useCallback,
  ReactNode,
  Fragment,
  useEffect,
} from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { useTheme } from "emotion-theming";

import {
  gutters,
  whiteColor,
  zIndex,
  borderRadiusSmall,
  boxShadow,
  fontWeightBold,
} from "styles/variables";
import { mqMin, mqMax } from "styles/base";
import {
  typographySubtitle2,
  typographyCaption,
  typographyBody2,
  typographySubtitle1,
} from "styles/typography";

const TabsWrapper = styled.div(
  () =>
    css`
      text-align: left;
      white-space: nowrap;
    `
);

export const LabelTextDesktop = styled.span`
  display: none;
  ${mqMin.large} {
    display: inline;
  }
`;

export const LabelTextMobile = styled.span`
  display: inline;
  ${typographySubtitle1};
  color: ${whiteColor};
  font-size: 18px;
  font-weight: ${fontWeightBold};

  ${mqMin.large} {
    display: none;
  }
`;

const HiddenRadioButton = styled.input`
  display: none;
`;

const iconStyles = (theme: Theme) => css`
  display: inline-block;
  margin-top: -4px;
  width: 20px;
  height: 15px;
  pointer-events: none;
  vertical-align: middle;
  fill: ${theme.colors.primary};

  ${mqMin.large} {
    margin-right: ${gutters.small / 2}px;
    max-height: 18.5px;
  }
`;

export const ContentWrapper = styled.div<{
  noTabs?: boolean;
}>(
  ({ theme, noTabs }) => css`
    position: relative;
    ${typographyCaption};
    z-index: ${zIndex.z1};
    box-shadow: ${boxShadow};
    border-radius: ${borderRadiusSmall};
    border-top-left-radius: ${noTabs ? borderRadiusSmall : "unset"};
    height: ${noTabs ? "auto" : "352px"};
    padding: ${gutters.small}px;
    background-color: ${theme.colors.primary};
    color: ${whiteColor};

    ${mqMin.large} {
      ${typographyBody2};
      height: auto;
      padding: ${gutters.small / 2}px ${gutters.large}px ${gutters.small * 2}px ${gutters.large}px;
    }
  `
);

export const TabLabel = styled.label<{ index?: number; isHidden?: boolean }>(
  ({ theme, index, isHidden }) => [
    css`
      ${typographySubtitle2};
      z-index: ${zIndex.z1};
      display: inline-block;
      margin-right: 9px;
      border-top-left-radius: ${borderRadiusSmall};
      border-top-right-radius: ${borderRadiusSmall};
      padding: 0 ${gutters.large / 2}px;
      background-color: ${whiteColor};
      cursor: pointer;
      color: ${theme.colors.primary};
      line-height: 32px;
      text-align: center;
      vertical-align: bottom;
      white-space: nowrap;

      ${mqMax.medium} {
        svg {
          margin-right: 0;
        }
      }
      ${mqMin.large} {
        ${typographySubtitle1};
        margin-right: ${gutters.small}px;
        min-width: 168px;
        height: 40px;
        padding: 0 ${gutters.large / 2}px;
        line-height: 40px;
      }

      ${HiddenRadioButton}:checked + & {
        position: relative;
        z-index: ${zIndex.z1};
        box-shadow: none;
        background-color: ${theme.colors.primary};
        color: ${whiteColor};
        svg {
          fill: ${whiteColor};
          ${mqMin.large} {
            margin-right: ${gutters.small / 2}px;
          }
        }
      }
    `,
    index &&
      css`
        padding: 0 ${gutters.small / 2}px;
        ${HiddenRadioButton}:checked + & {
          ${`& ~ ${ContentWrapper}:nth-of-type(${index})`} {
            display: block;
          }
        }
      `,
    isHidden &&
      css`
        display: none;
      `,
  ]
);

export type TabItem = {
  id: number;
  text: string;
  Icon?: ElementType;
  href?: string;
  dataTestid?: string;
};

const RoundedTabs = ({
  className,
  items,
  selectedTab,
  onTabChange,
  runTabChangeOnMount = true,
  hideTabs,
  children,
}: {
  className?: string;
  items: TabItem[];
  selectedTab?: number;
  onTabChange?: ({
    current,
    previous,
  }: {
    current: number;
    previous?: number;
  }) => void | Promise<void>;
  runTabChangeOnMount?: boolean;
  hideTabs?: boolean;
  children: ReactNode;
}) => {
  const theme: Theme = useTheme();
  const onTabClick = useCallback(
    (e: SyntheticEvent<HTMLLabelElement>) => {
      e.preventDefault();
      const tabId = Number(e.currentTarget.dataset.id);

      onTabChange?.({ current: tabId });
    },
    [onTabChange]
  );

  useEffect(() => {
    if (runTabChangeOnMount && selectedTab)
      onTabChange?.({ current: selectedTab, previous: undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <TabsWrapper className={className} data-testid="search-widget">
      {items.map(({ id, text, Icon, dataTestid }) => {
        const isSelected = id === selectedTab;
        const radioId = `hiddenRadio${id}`;

        return (
          <Fragment key={text}>
            <HiddenRadioButton
              checked={isSelected}
              type="radio"
              id={radioId}
              name="roundedTabsRadio"
              onChange={() => {}}
            />
            <TabLabel
              key={text}
              isHidden={hideTabs}
              data-id={id}
              onClick={onTabClick}
              htmlFor={radioId}
              data-testid={dataTestid}
            >
              {Icon && <Icon css={iconStyles(theme)} />}
              <LabelTextDesktop>{text}</LabelTextDesktop>
            </TabLabel>
          </Fragment>
        );
      })}

      <ContentWrapper noTabs={hideTabs}>
        {React.Children.map(children, (tabContent, index) => {
          return selectedTab === index ? (
            <>
              {!hideTabs && (
                <LabelTextMobile>
                  {items.find(item => item.id === selectedTab)?.text ?? ""}
                </LabelTextMobile>
              )}
              {tabContent}
            </>
          ) : null;
        })}
      </ContentWrapper>
    </TabsWrapper>
  );
};

export default RoundedTabs;
