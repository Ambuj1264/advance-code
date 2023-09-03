import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import SignOutIcon from "components/icons/arrow-thick-left.svg";
import { gutters, whiteColor, borderRadius, redCinnabarColor } from "styles/variables";
import { typographySubtitle2 } from "styles/typography";
import { mqMin } from "styles/base";

const SignoutButton = styled.a(({ theme }) => [
  typographySubtitle2,
  css`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: ${gutters.small}px;
    border-radius: ${borderRadius};
    height: 56px;
    background-color: ${rgba(redCinnabarColor, 0.1)};
    color: ${theme.colors.primary};
    ${mqMin.large} {
      height: 48px;
    }
  `,
]);

const LogoutIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${gutters.small / 2}px;
  border: 2px solid ${whiteColor};
  border-radius: 50%;
  width: 28px;
  height: 28px;
  background-color: ${redCinnabarColor};
`;

const logoutIconStyles = css`
  width: 16px;
  height: 16px;
  fill: ${whiteColor};
`;

const UserMenuActions = ({ signOutText, href }: { signOutText: string; href: string }) => {
  return (
    <SignoutButton href={href}>
      <LogoutIconWrapper>
        <SignOutIcon css={logoutIconStyles} />
      </LogoutIconWrapper>
      {signOutText}
    </SignoutButton>
  );
};

export default UserMenuActions;
