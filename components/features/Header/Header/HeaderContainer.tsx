import React, { useContext } from "react";
import withStyles from "isomorphic-style-loader/withStyles";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { HeaderTypes } from "@travelshift/ui/typings/headerTypes";
import GoogleOneTap from "@travelshift/ui/components/Header/GoogleOneTap";
import styles from "@travelshift/ui/components/Header/styles";
import { ApolloError } from "apollo-client";

import Header from "./Header";
import LoadingNavigationBar from "./LoadingNavigationBar";

import useToggle from "hooks/useToggle";
import { useEffectOnScroll } from "hooks/useEffectOnScrollMobile";
import { useSettings } from "contexts/SettingsContext";
import useSession from "hooks/useSession";
import LocaleContext from "contexts/LocaleContext";
import MobileFooterContext from "contexts/MobileFooterContext";
import { zIndex, whiteColor, headerHeight, boxShadowTileRegular } from "styles/variables";
import { mqIE, hideDuringPrint } from "styles/base";
import Container from "components/ui/Grid/Container";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { addLeadingSlashIfNotPresent, isBrowser } from "utils/helperUtils";
import MarketplaceLogo from "components/ui/Logo/MarketplaceLogo";
import { Marketplace } from "types/enums";

const Wrapper = styled.div([
  hideDuringPrint,
  css`
    position: sticky;
    top: 0;
    z-index: ${zIndex.max};
    box-shadow: ${boxShadowTileRegular};
    background: ${whiteColor};

    ${mqIE} {
      position: fixed;
      width: 100%;
    }
  `,
]);

const StyledContainer = styled(Container)`
  position: relative;
  height: ${headerHeight};
`;

const HeaderContainer = ({
  theme,
  localeLinks,
  headerData,
  headerError,
}: {
  theme: Theme;
  localeLinks: LocaleLink[];
  headerData?: HeaderTypes.QueryHeaderData;
  headerError?: ApolloError;
}) => {
  const { t } = useTranslation(Namespaces.headerNs);
  const headerTexts = {
    searchBarMobile: t("front_topbar_search"),
    searchBar: t("front_topbar_search"),
    changeLanguage: t("front_topbar_change_language"),
    updateCurrency: t("front_topbar_update_currency"),
    cart: {
      cartTitle: t("front_topbar_cart"),
      cartEmptyText: t("front_topbar_cart_empty"),
    },
    userMenu: {
      orSignInWith: t("front_topbar_sign_in_with"),
      orSignUpWith: t("front_topbar_sign_up_with"),
      noAccount: t("front_topbar_no_account"),
      existingAccount: t("front_topbar_have_account"),
      registerHere: t("front_topbar_register_here"),
      loginHere: t("front_topbar_log_in_here"),
      email: t("front_topbar_email"),
      password: t("front_topbar_password"),
      signIn: t("front_topbar_sign_in"),
      forgotPassword: t("front_topbar_forgot_password"),
      signInError: t("front_topbar_sign_in_error"),
      signUpError: t("front_topbar_sign_up_error"),
      fullName: t("front_topbar_name"),
      confirmPassword: t("front_topbar_confirm_password"),
      signUp: t("front_topbar_sign_up"),
      login: t("front_topbar_your_login"),
      messages: t("front_topbar_messages"),
      bookings: t("front_topbar_your_bookings"),
      packages: t("front_topbar_your_packages"),
      blogs: t("front_topbar_your_blogs"),
      reviews: t("front_topbar_your_reviews"),
      signOut: t("front_topbar_your_signout"),
      createBlog: t("front_topbar_create_blog"),
      vouchers: t("front_topbar_vouchers"),
      menu: t("front_topbar_menu"),
    },
    homeLink: t("front_topbar_home_link"),
  };

  const activeLocale = useContext(LocaleContext);
  const { adminUrl, marketplaceUrl, googleClientId, isGoogleOneTapLoginEnabled, marketplace } =
    useSettings();
  const { user, queryCompleted: userQueryCompleted } = useSession();
  const { isMobileFooterShown } = useContext(MobileFooterContext);
  const [isInteracted, toggleIsInteracted] = useToggle();

  useEffectOnScroll(toggleIsInteracted, 500);

  if (headerError || !headerData) return <LoadingNavigationBar headerTexts={headerTexts} />;

  const cartLink = headerData.cartLink ? addLeadingSlashIfNotPresent(headerData.cartLink) : "/cart";

  const forgotPasswordLink = headerData.forgotPasswordLink
    ? addLeadingSlashIfNotPresent(headerData.forgotPasswordLink)
    : "/login/forgot";

  const shouldShowGoogleOneTap = Boolean(
    isBrowser &&
      isGoogleOneTapLoginEnabled &&
      googleClientId &&
      userQueryCompleted &&
      isInteracted &&
      !user
  );

  return (
    <Wrapper>
      <StyledContainer>
        <Header
          Logo={<MarketplaceLogo />}
          links={headerData.links}
          currencies={headerData.currencies}
          locales={headerData.locales}
          activeLocale={activeLocale}
          theme={theme}
          localeLinks={localeLinks}
          adminUrl={adminUrl}
          headerTexts={headerTexts}
          searchLink={headerData.searchLink}
          cartLink={cartLink}
          forgotPasswordLink={forgotPasswordLink}
        />
      </StyledContainer>
      <GoogleOneTap
        marketplaceUrl={marketplaceUrl}
        clientId={googleClientId!}
        isShow={shouldShowGoogleOneTap}
        mobileOffsetFromBottom="63px"
        isMobileFooterShown={isMobileFooterShown}
        isGTE={marketplace === Marketplace.GUIDE_TO_EUROPE}
      />
    </Wrapper>
  );
};

export default withStyles(...styles)(HeaderContainer);
