import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import Link from "components/ui/Link";
import { resetButton } from "styles/reset";
import { gutters, whiteColor, greyColor, separatorColor } from "styles/variables";
import { typographyCaption } from "styles/typography";
import { mqMin } from "styles/base";

const RadioButton = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${separatorColor};
  border-radius: 50%;
  width: 18px;
  min-width: 18px;
  height: 18px;
  background-color: ${whiteColor};
`;

const RadioButtonSelected = styled.div<{ selected: boolean }>(
  ({ selected, theme }) => css`
    border-radius: 50%;
    width: 8px;
    height: 8px;
    background-color: ${selected ? theme.colors.action : whiteColor};
  `
);

const buttonStyles = [
  resetButton,
  css`
    display: flex;
    align-items: center;
    margin-top: ${gutters.large / 2}px;
    width: 100%;
    text-decoration: none;
    ${mqMin.large} {
      margin-top: 0px;
      &:nth-of-type(n + 3) {
        margin-top: ${gutters.large / 2}px;
      }
    }
  `,
];

const Text = styled.div(
  typographyCaption,
  css`
    margin-left: ${gutters.small}px;
    color: ${greyColor};
    text-align: left;
  `
);

const Button = styled.button(buttonStyles);
const ButtonLink = styled(Link)(buttonStyles);
const ButtonRegularLink = styled.a(buttonStyles);

const InnerContent = ({
  text,
  selected,
  children,
}: {
  text: string;
  selected: boolean;
  children: React.ReactElement;
}) => (
  <>
    <RadioButton>
      <RadioButtonSelected selected={selected} />
    </RadioButton>
    {children}
    <Text>{text}</Text>
  </>
);

const PopoverButton = ({
  id,
  href,
  text,
  selected,
  onClick,
  children,
  useRegularLink,
}: {
  id: string;
  href?: string;
  onClick?: () => void;
  text: string;
  selected: boolean;
  children: React.ReactElement;
  useRegularLink?: boolean;
}) => {
  const LinkComponent = useRegularLink ? ButtonRegularLink : ButtonLink;

  return href ? (
    <LinkComponent href={href}>
      <InnerContent text={text} selected={selected}>
        {children}
      </InnerContent>
    </LinkComponent>
  ) : (
    <Button id={id} type="button" onClick={onClick}>
      <InnerContent text={text} selected={selected}>
        {children}
      </InnerContent>
    </Button>
  );
};

export default PopoverButton;
