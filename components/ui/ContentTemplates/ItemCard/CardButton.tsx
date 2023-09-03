import React from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";

import CheckMark from "components/ui/CheckMark";
import { IconSize } from "types/enums";
import { typographyCaption } from "styles/typography";
import { greyColor, whiteColor, borderRadiusBig, gutters } from "styles/variables";

type Props = {
  onClick: () => void;
  children: string;
  className?: string;
};

const CheckMarkContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  background-color: ${rgba(greyColor, 0.5)};
`;

const ButtonIcon = styled.div`
  margin-right: ${-gutters.small / 4}px;
  border-radius: 50%;
  padding: ${gutters.small / 4}px;
  background-color: ${whiteColor};
`;

const ButtonText = styled.div`
  border-radius: 0 ${borderRadiusBig} ${borderRadiusBig} 0;
  padding: ${gutters.small / 4}px;
  background-color: ${whiteColor};
  color: ${rgba(greyColor, 0.5)};
`;

const Button = styled.button([
  typographyCaption,
  css`
    display: flex;
    align-items: center;
  `,
]);

const CardButton = ({ onClick, children, className }: Props) => (
  <Button onClick={onClick} className={className}>
    <ButtonIcon>
      <CheckMarkContainer>
        <CheckMark color={whiteColor} iconSize={IconSize.Medium} />
      </CheckMarkContainer>
    </ButtonIcon>
    <ButtonText>{children}</ButtonText>
  </Button>
);

export default CardButton;
