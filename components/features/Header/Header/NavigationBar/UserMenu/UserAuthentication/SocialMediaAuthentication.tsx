import React from "react";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import { css } from "@emotion/core";
import GoogleIcon from "@travelshift/ui/icons/Social/google.svg";
import Facebook from "@travelshift/ui/icons/Social/facebook.svg";
import WeiboIcon from "@travelshift/ui/icons/Social/weibo.svg";
import AppleIcon from "@travelshift/ui/icons/Social/apple.svg";
import { useQuery } from "@apollo/react-hooks";

import {
  SocialIconStyles,
  SocialMediaButton,
  SocialMediaWhiteButton,
  SocialWrapper,
} from "./SharedUserMenuComponents";

import Link from "components/ui/Link";
import { gutters, whiteColor, borderRadius } from "styles/variables";
import SettingsQuery from "hooks/queries/SettingsQuery.graphql";

const SocialMediaButtonWrapper = styled(Link)<{}>(
  ({ theme }) =>
    css`
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-left: ${gutters.small}px;
      border-radius: ${borderRadius};
      width: 100%;
      height: 72px;
      background-color: ${rgba(theme.colors.primary, 0.05)};
      :first-of-type {
        margin-left: 0;
      }
    `
);

const FacebookIcon = styled(Facebook)`
  width: 50%;
  height: 50%;
  fill: ${whiteColor};
`;

const SocialMediaAuthentication = () => {
  const {
    data: { settings } = {
      settings: {
        has_facebook: false,
        has_google_oauth: false,
        has_weibo: false,
        has_apple: false,
      },
    },
  } = useQuery(SettingsQuery);
  const redir = typeof window !== `undefined` ? encodeURIComponent(window.location.href) : "";
  const googleLink = `/login/google?redir=${redir}`;
  const facebookLink = `/login/facebook?redir=${redir}`;
  const weiboLink = `/login/weibo?redir=${redir}`;
  const appleLink = `/login/apple?redir=${redir}`;
  return (
    <SocialWrapper>
      {settings.has_google_oauth && (
        <SocialMediaButtonWrapper href={googleLink}>
          <SocialMediaWhiteButton>
            <GoogleIcon css={SocialIconStyles} />
          </SocialMediaWhiteButton>
        </SocialMediaButtonWrapper>
      )}
      {settings.has_facebook && (
        <SocialMediaButtonWrapper href={facebookLink}>
          <SocialMediaButton>
            <FacebookIcon />
          </SocialMediaButton>
        </SocialMediaButtonWrapper>
      )}
      {settings.has_weibo && (
        <SocialMediaButtonWrapper href={weiboLink}>
          <SocialMediaWhiteButton>
            <WeiboIcon css={SocialIconStyles} />
          </SocialMediaWhiteButton>
        </SocialMediaButtonWrapper>
      )}
      {settings.has_apple && (
        <SocialMediaButtonWrapper href={appleLink}>
          <SocialMediaWhiteButton>
            <AppleIcon css={SocialIconStyles} />
          </SocialMediaWhiteButton>
        </SocialMediaButtonWrapper>
      )}
    </SocialWrapper>
  );
};

export default SocialMediaAuthentication;
