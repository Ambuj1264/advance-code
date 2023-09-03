import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import GoogleIcon from "@travelshift/ui/icons/Social/google.svg";
import FacebookIcon from "@travelshift/ui/icons/Social/facebook.svg";
import AppleIcon from "@travelshift/ui/icons/Social/apple.svg";
import rgba from "polished/lib/color/rgba";

import {
  SocialMediaButton,
  SocialWrapper,
} from "../Header/Header/NavigationBar/UserMenu/UserAuthentication/SharedUserMenuComponents";

import { borderRadius, gutters, whiteColor } from "styles/variables";

const socialIconStyles = css`
  width: 50%;
  height: 50%;
`;

const StyledSocialMediaButton = styled(SocialMediaButton)`
  width: 40px;
  height: 40px;
`;

const StyledWhiteSocialMediaButton = styled(StyledSocialMediaButton)`
  background-color: ${whiteColor};
`;

const StyledButton = styled.button<{}>(
  ({ theme }) =>
    css`
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-right: ${gutters.small}px;
      border-radius: ${borderRadius};
      width: 100%;
      height: 72px;
      background-color: ${rgba(theme.colors.primary, 0.05)};
      &:last-of-type {
        margin-right: 0;
      }
    `
);

const StyledGoogleIcon = styled(GoogleIcon)([socialIconStyles]);

const StyledFacebookIcon = styled(FacebookIcon)([
  socialIconStyles,
  css`
    fill: ${whiteColor};
  `,
]);

const StyledAppleIcon = styled(AppleIcon)([socialIconStyles]);

const Auth0SocialLogin = ({
  handleGoogleClick,
  handleFacebookClick,
  handleAppleClick,
}: {
  handleGoogleClick: () => void;
  handleFacebookClick: () => void;
  handleAppleClick: () => void;
}) => {
  return (
    <SocialWrapper>
      <StyledButton id="googleAuthentication" onClick={handleGoogleClick}>
        <StyledWhiteSocialMediaButton>
          <StyledGoogleIcon />
        </StyledWhiteSocialMediaButton>
      </StyledButton>
      <StyledButton id="facebookAuthentication" onClick={handleFacebookClick}>
        <StyledSocialMediaButton>
          <StyledFacebookIcon />
        </StyledSocialMediaButton>
      </StyledButton>
      <StyledButton id="appleAuthentication" onClick={handleAppleClick}>
        <StyledWhiteSocialMediaButton>
          <StyledAppleIcon />
        </StyledWhiteSocialMediaButton>
      </StyledButton>
    </SocialWrapper>
  );
};

export default Auth0SocialLogin;
