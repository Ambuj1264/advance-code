import React from "react";
import styled from "@emotion/styled";
import { map, getOrElse, fromNullable } from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
import UserIcon from "@travelshift/ui/icons/user.svg";
import { HeaderTypes } from "@travelshift/ui/typings/headerTypes";
import UserAvatar from "@travelshift/ui/components/Header/NavigationBar/UserMenu/UserAvatar";
import { css } from "@emotion/core";

import GTIMenuContent from "./UserMenuActions";
import UserAuthentication from "./UserAuthentication/UserAuthentication";

import Popover from "components/ui/Popover/Popover";
import LoginIcon from "components/icons/single-neutral.svg";
import useSession from "hooks/useSession";
import { isInPreviewMode } from "utils/helperUtils";
import { resetButton } from "styles/reset";

type Props = {
  theme: Theme;
  userMenuTexts: HeaderTypes.UserMenuTexts;
  adminUrl: string;
  forgotPasswordLink: string;
};

const Wrapper = styled.div`
  width: 360px;
`;

const Button = styled.button(
  resetButton,
  css`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 100%;
  `
);

const StyledUserIcon = styled(UserIcon)(
  ({ theme }) => css`
    width: 20px;
    height: 20px;
    fill: ${theme.colors.primary};
  `
);

const UserMenu = ({ theme, userMenuTexts, adminUrl, forgotPasswordLink }: Props) => {
  const { user } = useSession();
  return pipe(
    user,
    fromNullable,
    map(({ id, name, avatarImage, isAdmin }) => (
      <Popover
        title={name}
        Icon={LoginIcon}
        trigger={
          <Button suppressHydrationWarning id="userAvatar" type="button">
            <UserAvatar avatarImage={avatarImage} theme={theme} />
          </Button>
        }
      >
        <GTIMenuContent
          isAdmin={isAdmin}
          userId={id}
          userMenuTexts={userMenuTexts}
          adminUrl={adminUrl}
          avatarImage={avatarImage}
          showExitPreviewButton={isInPreviewMode()}
        />
      </Popover>
    )),
    getOrElse(() => (
      <Popover
        title={userMenuTexts.login}
        Icon={LoginIcon}
        trigger={
          <Button id="navBarUserMenu" type="button">
            <StyledUserIcon />
          </Button>
        }
      >
        <Wrapper>
          <UserAuthentication
            userMenuTexts={userMenuTexts}
            forgotPasswordLink={forgotPasswordLink}
          />
        </Wrapper>
      </Popover>
    ))
  );
};

export default UserMenu;
