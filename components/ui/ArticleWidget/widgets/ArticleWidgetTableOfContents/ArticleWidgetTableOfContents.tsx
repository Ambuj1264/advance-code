import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { useTheme } from "emotion-theming";

import { Namespaces } from "shared/namespaces";
import { Trans } from "i18n";
import FileIcon from "components/icons/common-file-text-alternate.svg";
import { typographySubtitle1, typographySubtitle2, typographyCaption } from "styles/typography";
import { gutters, greyColor } from "styles/variables";

const Header = styled.div([
  typographySubtitle1,
  css`
    color: ${greyColor};
  `,
]);

const IconContainer = styled.div`
  display: inline-block;
  width: ${gutters.large}px;
  vertical-align: middle;
  & svg {
    margin-right: 0.75em;
    height: 18px;
    fill: currentColor;
  }
`;

const Contents = styled.ul`
  margin: 0 0 ${gutters.large}px;
  padding: 0 0 ${gutters.large}px;
`;

const Item = styled.li<{ level: number; theme: Theme }>(({ level, theme }) => [
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
        background: ${theme.colors.primary};
      }
    `,
  css`
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    margin-top: ${level > 0 ? gutters.large / 2 : gutters.small}px;
    padding-left: ${level * gutters.large}px;
    color: ${theme.colors.primary};
    opacity: 0.8;
  `,
]);

const ArticleWidgetTableOfContents = ({
  items,
  className,
}: ArticleWidgetTypes.ArticleWidgetTableOfContents & {
  className?: string;
}) => {
  const theme: Theme = useTheme();

  if (!items.length) return null;

  return (
    <>
      <Header className={className}>
        <IconContainer>
          <FileIcon />
        </IconContainer>
        <Trans ns={Namespaces.articleNs}>Jump to chapter</Trans>
      </Header>
      <Contents>
        {items.map((item, index) => {
          return (
            <Item
              // index is the only way to identify item here
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              level={item.level}
              theme={theme}
              id={item.elementId}
            >
              <a href={item.link}>{item.caption}</a>
            </Item>
          );
        })}
      </Contents>
    </>
  );
};

export default ArticleWidgetTableOfContents;
