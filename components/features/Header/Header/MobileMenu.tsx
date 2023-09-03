import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { HeaderTypes } from "@travelshift/ui/typings/headerTypes";

import GTEMenuContent from "../../GTEUserMenu/GTEMenuContent";

import GTIMenuContent, {
  LinkButton,
  IconWrapper,
  iconStyles,
} from "./NavigationBar/UserMenu/UserMenuActions";
import { getLinkIcon, getLinkTitle, getLogoutUrl } from "./utils/headerUtils";
import Signout from "./NavigationBar/UserMenu/Signout";
import UserAuthentication from "./NavigationBar/UserMenu/UserAuthentication/UserAuthentication";
import CurrencyPickerMobile from "./NavigationBar/CurrencyPickerMobile";
import LocalePickerMobile from "./NavigationBar/LocalePickerMobile";

import { column } from "styles/base";
import useSession from "hooks/useSession";
import { isInPreviewMode } from "utils/helperUtils";
import Row from "components/ui/Grid/Row";
import { gutters, whiteColor, separatorColor, lightGreyColor } from "styles/variables";
import { useTranslation } from "i18n";
import { typographySubtitle1 } from "styles/typography";
import { useSettings } from "contexts/SettingsContext";
import { Namespaces } from "shared/namespaces";
import { Marketplace } from "types/enums";
import CustomNextDynamic from "lib/CustomNextDynamic";

const LazyGTEMobileMenu = CustomNextDynamic(
  () => import("components/features/GTEUserMenu/GTEAuthenticationWithContext"),
  {
    ssr: false,
    loading: () => null,
  }
);

const Wrapper = styled.div`
  margin-bottom: ${gutters.small / 2}px;
  width: 100%;
  padding: ${gutters.small}px;
  background-color: ${whiteColor};
`;

const SignOutWrapper = styled.div`
  padding: 4px ${gutters.small}px ${gutters.large}px ${gutters.small}px;
  background-color: ${whiteColor};
`;

const UserMenuWrapper = styled.div`
  margin-bottom: ${gutters.small / 2}px;
  padding: ${gutters.small}px;
  background-color: ${whiteColor};
`;

const UserAuthenticationWrapper = styled.div`
  padding: ${gutters.small}px ${gutters.small}px ${gutters.large}px ${gutters.small}px;
  background-color: ${whiteColor};
`;

const UserMenuTitle = styled.div(({ theme }) => [
  typographySubtitle1,
  css`
    display: flex;
    align-items: center;
    margin-bottom: ${gutters.small / 2}px;
    color: ${theme.colors.primary};
  `,
]);

const Menu = styled.div<{ isOpen: boolean }>(({ isOpen }) => [
  css`
    /* Fix iOS problem when content is hidden behind browser navbar */
    @supports (-webkit-touch-callout: none) {
      padding-bottom: 100px;
    }
    position: fixed;
    top: 50px;
    left: 0;
    border-top: 1px solid ${separatorColor};
    width: 100%;
    height: calc(100% - 50px);
    background-color: ${lightGreyColor};
    visibility: hidden;
    transform: translate3d(0, -100%, 0);
    overflow: scroll;
  `,
  isOpen &&
    css`
      visibility: visible;
      transform: translate3d(0, 0, 0);
    `,
]);

const Column = styled.div<{ columns?: SharedTypes.ColumnSizes }>(
  ({ columns = { small: 1 / 3 } }) => [
    column(columns),
    css`
      margin-top: ${gutters.small}px;
    `,
  ]
);

const LocaleCurrencyWrapper = styled.div`
  margin-bottom: ${gutters.small / 2}px;
  padding: ${gutters.small}px;
  background-color: ${whiteColor};
`;

const StyledRow = styled(Row)`
  margin-top: -${gutters.large / 2}px;
`;

const MobileMenu = ({
  isOpen,
  links,
  currencies,
  locales,
  activeLocale,
  localeLinks,
  headerTexts,
  adminUrl,
  forgotPasswordLink,
}: {
  isOpen: boolean;
  links: ReadonlyArray<HeaderTypes.HeaderLink>;
  currencies: ReadonlyArray<Currency>;
  locales: ReadonlyArray<AppLocale>;
  activeLocale: string;
  localeLinks: LocaleLink[];
  headerTexts: HeaderTypes.HeaderTexts;
  adminUrl: string;
  forgotPasswordLink: string;
}) => {
  const gteLogoutUrl = getLogoutUrl();
  const { t } = useTranslation(Namespaces.headerNs);
  const { marketplaceUrl, marketplace, host } = useSettings();
  const { user } = useSession();
  const isGTE = marketplace === Marketplace.GUIDE_TO_EUROPE;
  const isGTTP = marketplace === Marketplace.GUIDE_TO_THE_PHILIPPINES;

  return (
    <Menu isOpen={isOpen}>
      {isGTE && user && (
        <UserMenuWrapper>
          <GTEMenuContent avatarImage={user.avatarImage} isMobile />
        </UserMenuWrapper>
      )}
      {!isGTE && user && (
        <UserMenuWrapper>
          <GTIMenuContent
            isAdmin={user.isAdmin}
            userId={user.id}
            userMenuTexts={headerTexts.userMenu}
            adminUrl={adminUrl}
            showExitPreviewButton={isInPreviewMode()}
            avatarImage={user.avatarImage}
          />
        </UserMenuWrapper>
      )}

      <Wrapper>
        <StyledRow>
          {links.map(({ text, url, linkClass }) => {
            const Icon = getLinkIcon(linkClass);
            const title = isGTTP ? text : getLinkTitle(linkClass, t) || text;
            return (
              <Column columns={{ small: linkClass.includes("package") ? 1 : 1 / 2 }}>
                <LinkButton href={url}>
                  <IconWrapper>
                    <Icon css={iconStyles} />
                  </IconWrapper>
                  {title || text}
                </LinkButton>
              </Column>
            );
          })}
        </StyledRow>
      </Wrapper>
      <LocaleCurrencyWrapper>
        <StyledRow>
          {locales.length > 1 && (
            <Column columns={{ small: 1 / 2 }}>
              <LocalePickerMobile
                locales={locales}
                activeLocale={activeLocale}
                localeLinks={localeLinks}
                defaultUrl={marketplaceUrl}
              />
            </Column>
          )}
          <Column columns={{ small: locales.length > 1 ? 1 / 2 : 1 }}>
            <CurrencyPickerMobile currencies={currencies} />
          </Column>
        </StyledRow>
      </LocaleCurrencyWrapper>
      {user ? (
        <SignOutWrapper>
          <Signout
            signOutText={headerTexts.userMenu.signOut}
            href={isGTE ? gteLogoutUrl : "/logout"}
          />
        </SignOutWrapper>
      ) : (
        <UserAuthenticationWrapper>
          {isGTE ? (
            <LazyGTEMobileMenu host={host} setModalText={() => {}} />
          ) : (
            <>
              <UserMenuTitle>{headerTexts.userMenu.login}</UserMenuTitle>
              <UserAuthentication
                userMenuTexts={headerTexts.userMenu}
                forgotPasswordLink={forgotPasswordLink}
              />
            </>
          )}
        </UserAuthenticationWrapper>
      )}
    </Menu>
  );
};

export default MobileMenu;
