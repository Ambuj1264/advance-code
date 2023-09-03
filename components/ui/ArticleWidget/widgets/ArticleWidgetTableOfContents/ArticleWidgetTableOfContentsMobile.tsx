import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import { Trans } from "i18n";
import FileIcon from "components/icons/common-file-text-alternate.svg";
import PlusIcon from "components/icons/plus.svg";
import {
  boxShadowIcon,
  fontWeightSemibold,
  gutters,
  whiteColor,
  zIndex,
  headerHeight,
} from "styles/variables";
import { mediaQuery } from "styles/base";
import { typographyBody1, typographyCaption, typographySubtitle2 } from "styles/typography";
import { Namespaces } from "shared/namespaces";

const Item = styled.a<{ level: number }>(({ level }) => [
  level > 0 ? typographyCaption : typographySubtitle2,
  level > 0 &&
    css`
      position: relative;

      &::before {
        content: "";
        position: absolute;
        top: 5px;
        left: ${(gutters.large / 2) * level}px;
        border-radius: 50%;
        width: 4px;
        height: 4px;
        background: ${whiteColor};
      }
    `,
  css`
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    margin-top: ${level > 0 ? gutters.large / 2 : gutters.small}px;
    padding-left: ${level * gutters.large}px;
    color: ${whiteColor};
  `,
]);

export const Wrapper = styled.div([
  mediaQuery({
    display: ["block", "block", "none"],
  }),
]);

const Header = styled.div([
  typographyBody1,
  css`
    display: flex;
    justify-content: space-between;
    color: ${whiteColor};
    font-weight: ${fontWeightSemibold};
  `,
]);

const IconContainer = styled.div`
  display: inline-block;
  width: ${gutters.large}px;
  vertical-align: middle;
  & svg {
    height: 18px;
  }
`;

const MenuHolder = styled.div`
  position: fixed;
  top: 50px;
  right: 0;
  z-index: ${zIndex.max};
  width: 320px;
  height: calc(100% - ${headerHeight});
  transform: translateX(320px);
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
`;

const Menu = styled.div(
  ({ theme }) => css`
    height: 100%;
    padding: ${gutters.large}px;
    background: ${rgba(theme.colors.primary, 0.98)};
    overflow: auto;
  `
);

const ToggleButton = styled.button(
  ({ theme }) => css`
    position: fixed;
    right: 0;
    bottom: 81px;
    z-index: ${zIndex.z1};
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: ${boxShadowIcon};
    border-radius: 50% 0 0 50%;
    width: 55px;
    height: 48px;
    background: ${rgba(whiteColor, 0.95)};
    cursor: pointer;

    svg {
      margin-left: ${gutters.small / 2}px;
      width: ${gutters.large}px;
      fill: ${theme.colors.primary};
    }

    &:focus,
    &:hover {
      & + .menu {
        transform: translateX(0);
      }
    }
  `
);

const CloseButton = styled.div`
  svg {
    width: ${gutters.small}px;
    transform: rotate(45deg);
    fill: ${whiteColor};
  }
`;

const ArticleWidgetTableOfContentsMobile = ({
  items,
}: ArticleWidgetTypes.ArticleWidgetTableOfContents) => {
  return (
    <Wrapper>
      <ToggleButton>
        <FileIcon />
      </ToggleButton>

      <MenuHolder className="menu">
        <Menu>
          <Header>
            <div>
              <IconContainer>
                <FileIcon fill={whiteColor} />
              </IconContainer>
              <Trans ns={Namespaces.articleNs}>Jump to chapter</Trans>
            </div>
            <CloseButton>
              <PlusIcon />
            </CloseButton>
          </Header>
          {items.map((item, index) => (
            <Item
              // index is the only way to identify item here
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              level={item.level}
              href={item.link}
              id={item.elementId}
            >
              {item.caption}
            </Item>
          ))}
        </Menu>
      </MenuHolder>
    </Wrapper>
  );
};

export default ArticleWidgetTableOfContentsMobile;
