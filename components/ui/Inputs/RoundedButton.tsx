import React, { ElementType } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { gutters, whiteColor } from "styles/variables";
import { typographySubtitle2 } from "styles/typography";
import Link from "components/ui/Link";

const buttonCss = css`
  ${typographySubtitle2};
  display: inline-block;
  border-radius: 20px;
  height: 26px;
  padding-right: 5px;
  padding-left: 14px;
  color: ${whiteColor};
  line-height: 18px;
  text-align: center;
  white-space: nowrap;

  &:hover {
    opacity: 0.8;
  }
`;

const Button = styled.button<{ backgroundColor: string }>(
  ({ backgroundColor, theme }) => css`
    ${buttonCss};
    background-color: ${backgroundColor || theme.colors.action};
  `
);

const LinkStyled = styled(Link)<{ backgroundColor: string }>(
  ({ backgroundColor, theme }) => css`
    ${buttonCss};
    background-color: ${backgroundColor || theme.colors.action};
  `
);

const Text = styled.span`
  display: inline-block;
  vertical-align: middle;
`;

const iconCss = (fill: string) => css`
  display: inline-block;
  margin-left: ${gutters.small / 2}px;
  height: 20px;
  vertical-align: middle;
  fill: ${fill};
`;

const RoundedButton = ({
  className,
  backgroundColor,
  text,
  Icon,
  iconFill = whiteColor,
  href,
  onClick,
}: {
  className?: string;
  backgroundColor?: string;
  text: string;
  Icon: ElementType;
  iconFill?: string;
  href?: string;
  onClick?: () => void;
}) => {
  const Tag = href ? LinkStyled : Button;

  return (
    <Tag className={className} backgroundColor={backgroundColor!} onClick={onClick} href={href!}>
      <Text>{text}</Text>
      <Icon css={iconCss(iconFill)} />
    </Tag>
  );
};

export default RoundedButton;
