import styled from "@emotion/styled";
import React from "react";
import { css } from "@emotion/core";

import LoginIcon from "components/icons/single-neutral.svg";
import { borderRadius, gutters, whiteColor } from "styles/variables";
import { typographyBody2Semibold } from "styles/typography";

const HeaderContainer = styled.div([
  ({ theme }) => css`
    display: flex;
    justify-content: flex-start;
    margin: -${gutters.small}px -${gutters.small}px ${gutters.small}px -${gutters.small}px;
    border-top-left-radius: ${borderRadius};
    border-top-right-radius: ${borderRadius};
    height: 40px;
    padding: 0 ${gutters.small}px;
    background-color: ${theme.colors.primary};
  `,
]);

const TitleWrapper = styled.div([
  typographyBody2Semibold,
  css`
    display: flex;
    align-items: center;
    color: ${whiteColor};
  `,
]);

const StyledIcon = styled(LoginIcon)`
  margin-right: ${gutters.large / 2}px;
  width: 16px;
  height: 16px;
  fill: ${whiteColor};
`;

const AuthenticationFormHeader = ({ title }: { title: string }) => {
  return (
    <HeaderContainer>
      <TitleWrapper>
        <StyledIcon />
        {title}
      </TitleWrapper>
    </HeaderContainer>
  );
};

export default AuthenticationFormHeader;
