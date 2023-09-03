import { css } from "@emotion/core";
import styled from "@emotion/styled";
import React, { useMemo } from "react";

import {
  AvatarImage,
  iconStyles,
  IconWrapper,
  LinkButtonClientLink,
  StyledRow,
  Wrapper,
} from "../Header/Header/NavigationBar/UserMenu/UserMenuActions";
import Signout from "../Header/Header/NavigationBar/UserMenu/Signout";
import { useOnCloseMenu } from "../Header/Header/HeaderContext";
import { getLogoutUrl } from "../Header/Header/utils/headerUtils";

import { column } from "styles/base";
import { gutters } from "styles/variables";
import CustomNextDynamic from "lib/CustomNextDynamic";
import IconLoading from "components/ui/utils/IconLoading";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { getClientSideUrl } from "utils/helperUtils";
import { PageType } from "types/enums";
import useActiveLocale from "hooks/useActiveLocale";
import { useSettings } from "contexts/SettingsContext";

const PaymentsIcon = CustomNextDynamic(() => import("components/icons/credit-card-check.svg"), {
  loading: IconLoading,
});
const TravelPlanIcon = CustomNextDynamic(() => import("components/icons/distance.svg"), {
  loading: IconLoading,
});

const ReservationIcon = CustomNextDynamic(() => import("components/icons/tags.svg"), {
  loading: IconLoading,
});

const Column = styled.div<{ columns?: SharedTypes.ColumnSizes }>(
  ({ columns = { small: 1 / 2 } }) => [
    column(columns),
    css`
      margin-top: ${gutters.small}px;
    `,
  ]
);

// TODO: add admin specific routes and make user

const GTEMenuContent = ({
  avatarImage,
  isMobile = false,
}: {
  avatarImage: any;
  isMobile?: boolean;
}) => {
  const { t } = useTranslation(Namespaces.userProfileNs);
  const closeMenu = useOnCloseMenu();

  const activeLocale = useActiveLocale();
  const { marketplace } = useSettings();

  const userClientRoute = {
    route: `/${PageType.GTE_USER_SYSTEM}`,
    as: getClientSideUrl(PageType.GTE_USER_SYSTEM, activeLocale, marketplace),
  };

  const gteLogoutUrl = getLogoutUrl();

  const menuOptions = useMemo(() => {
    return [
      {
        itemName: "travel-plan",
        clientRoute: {
          route: `/${PageType.GTE_POST_BOOKING}`,
          as: getClientSideUrl(PageType.GTE_POST_BOOKING, activeLocale, marketplace),
        },
        menuText: "Travel plan",
        Icon: TravelPlanIcon,
        isHidden: false,
      },
      {
        itemName: "payments",
        clientRoute: {
          route: `/${PageType.GTE_USER_SYSTEM}`,
          as: `${getClientSideUrl(
            PageType.GTE_USER_SYSTEM,
            activeLocale,
            marketplace
          )}/payment-methods`,
        },
        menuText: "Payments",
        Icon: PaymentsIcon,
        isHidden: false,
      },
      {
        itemName: "reservations",
        clientRoute: {
          route: `/${PageType.GTE_POST_BOOKING}`,
          as: `${getClientSideUrl(
            PageType.GTE_POST_BOOKING,
            activeLocale,
            marketplace
          )}?nav=reservations`,
        },
        menuText: "Reservations",
        Icon: ReservationIcon,
        isHidden: false,
      },
    ];
  }, [activeLocale, marketplace]);

  return (
    <Wrapper>
      <StyledRow>
        <Column>
          <LinkButtonClientLink clientRoute={userClientRoute} onClick={closeMenu}>
            <AvatarImage src={avatarImage.url} alt={avatarImage.name} />
            {t("Profile")}
          </LinkButtonClientLink>
        </Column>
        {menuOptions &&
          menuOptions.map(
            (item, i) =>
              !item.isHidden && (
                // eslint-disable-next-line react/no-array-index-key
                <Column key={`user-menu-item${i}`}>
                  <LinkButtonClientLink clientRoute={item.clientRoute} onClick={closeMenu}>
                    <IconWrapper>
                      <item.Icon css={iconStyles} />
                    </IconWrapper>
                    {t(item.menuText)}
                  </LinkButtonClientLink>
                </Column>
              )
          )}
      </StyledRow>
      {!isMobile && <Signout signOutText={t("Sign out")} href={gteLogoutUrl} />}
    </Wrapper>
  );
};

export default GTEMenuContent;
