import React, { useState } from "react";
import UserAvatar from "@travelshift/ui/components/Header/NavigationBar/UserMenu/UserAvatar";
import { useTheme } from "emotion-theming";

import {
  PopoverButton,
  StyledUserIcon,
} from "../Header/Header/NavigationBar/UserMenu/UserAuthentication/SharedUserMenuComponents";

import GTEMenuContent from "./GTEMenuContent";
import LazyGTEMenu from "./LazyGTEMenu";

import Popover from "components/ui/Popover/Popover";
import LoginIcon from "components/icons/single-neutral.svg";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import useSession from "hooks/useSession";

const GTEUserMenu = () => {
  const theme: Theme = useTheme();
  const { t } = useTranslation(Namespaces.userProfileNs);

  const { user } = useSession();

  const [modalText, setModalText] = useState("Log in");

  if (user) {
    const { name, avatarImage } = user;
    return (
      <Popover
        title={name}
        Icon={LoginIcon}
        trigger={
          <PopoverButton suppressHydrationWarning id="userAvatar" type="button">
            <UserAvatar avatarImage={avatarImage} theme={theme} />
          </PopoverButton>
        }
      >
        <GTEMenuContent avatarImage={avatarImage} />
      </Popover>
    );
  }
  return (
    <Popover
      title={t(modalText)}
      Icon={LoginIcon}
      trigger={
        <PopoverButton id="navBarUserMenu" type="button">
          <StyledUserIcon />
        </PopoverButton>
      }
    >
      <LazyGTEMenu setModalText={setModalText} />
    </Popover>
  );
};

export default GTEUserMenu;
