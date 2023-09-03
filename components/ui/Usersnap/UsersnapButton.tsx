import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { whiteColor, gutters, borderRadius, zIndex } from "styles/variables";
import { typographyBody2 } from "styles/typography";
import { hideDuringPrint, mqMin } from "styles/base";

const Button = styled.button(({ theme }) => [
  typographyBody2,
  hideDuringPrint,
  css`
    position: fixed;
    top: 50%;
    left: 0;
    z-index: ${zIndex.z2};
    border-radius: 0 0 ${borderRadius} ${borderRadius};
    padding: 0 ${gutters.small / 2}px ${gutters.small / 2}px;
    background: ${theme.colors.primary};
    color: ${whiteColor};
    transform: rotate(-90deg) translateX(-50%);
    transform-origin: top left;
    ${mqMin.large} {
      left: -${gutters.large}px;
      transition: left 0.2s ease;

      &:hover {
        left: 0;
      }
    }
  `,
]);

const UsersnapButton = ({ onClick }: { onClick: (event: React.SyntheticEvent) => void }) => (
  <Button type="button" onClick={onClick}>
    Found a problem?
  </Button>
);

export default UsersnapButton;
