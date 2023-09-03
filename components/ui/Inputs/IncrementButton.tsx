import React from "react";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import { css } from "@emotion/core";

import { IncrementType } from "types/enums";
import { boxShadow } from "styles/variables";
import Plus from "components/icons/plus.svg";
import Minus from "components/icons/minus.svg";

type Props = {
  id: string;
  onClick: () => void;
  disabled?: boolean;
  incrementType: IncrementType;
  className?: string;
};

const PlusIcon = styled(Plus)(
  ({ theme }) => css`
    width: 12px;
    height: 12px;
    fill: ${theme.colors.action};
  `
);

const MinusIcon = styled(Minus)(
  ({ theme }) => css`
    width: 12px;
    height: 11px;
    fill: ${theme.colors.action};
  `
);

const Button = styled.button(
  ({ theme }) =>
    css`
      box-shadow: ${boxShadow};
      border: 1px solid ${rgba(theme.colors.action, 0.4)};
      border-radius: 50%;
      width: 32px;
      height: 32px;
      fill: ${theme.colors.action};
      &:disabled {
        opacity: 0.4;
      }
    `
);

const IncrementButton = ({ id, onClick, disabled = false, incrementType, className }: Props) => (
  <Button id={id} type="button" onClick={onClick} disabled={disabled} className={className}>
    {incrementType === IncrementType.Plus ? <PlusIcon /> : <MinusIcon />}
  </Button>
);

export default IncrementButton;
