import React, { ReactElement, useRef } from "react";
import { constructUniqueIdentifier } from "@travelshift/ui/utils/utils";
import Link from "@travelshift/ui/components/Inputs/Link";
import CloseIcon from "@travelshift/ui/icons/close.svg";
import HamburgerIcon from "@travelshift/ui/icons/hamburger.svg";
import { getLocaleIcon, getHomeUrl } from "@travelshift/ui/utils/localeUtils";
import { HeaderTypes } from "@travelshift/ui/typings/headerTypes";
import Search from "@travelshift/ui/components/Header/NavigationBar/Search/Search";
import styles from "@travelshift/ui/components/Header/NavigationBar/NavigationBar.scss";
import useOnOutsideClick from "@travelshift/ui/components/Popover/useOnOutsideClick";
import { useMediaQuery } from "react-responsive";

import CurrencyPickerPopover from "./CurrencyPickerPopover";
import LocalePickerPopover from "./LocalePickerPopover";
import Cart from "./Cart/Cart";
import OldCart from "./Cart/OldCart";
import UserMenu from "./UserMenu/UserMenu";
import GTESearch, { SearchIconContainer, GTESearchIcon } from "./GTESearch/GTESearch";

import { useSettings } from "contexts/SettingsContext";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import { Marketplace } from "types/enums";
import GTEUserMenu from "components/features/GTEUserMenu/GTEUserMenu";
import { CartContextStateProvider } from "components/features/Cart/contexts/CartContextState";

type Props = {
  isMenuOpen: boolean;
  Logo: ReactElement;
  toggleMenu: () => void;
  isSearchOpen: boolean;
  toggleSearch: () => void;
  links: ReadonlyArray<HeaderTypes.HeaderLink>;
  currencies: ReadonlyArray<Currency>;
  locales: ReadonlyArray<AppLocale>;
  activeLocale: string;
  theme: Theme;
  localeLinks: LocaleLink[];
  headerTexts: HeaderTypes.HeaderTexts;
  adminUrl: string;
  searchLink: string;
  cartLink: string;
  forgotPasswordLink: string;
};

const NavigationBar = ({
  isMenuOpen,
  Logo,
  toggleMenu,
  isSearchOpen,
  toggleSearch,
  links,
  currencies,
  locales,
  activeLocale,
  theme,
  localeLinks,
  adminUrl,
  headerTexts,
  searchLink,
  cartLink,
  forgotPasswordLink,
}: Props) => {
  const ActiveLocaleIcon = getLocaleIcon(activeLocale);
  const { websiteName, marketplace, marketplaceUrl } = useSettings();
  const isMobile = useIsMobile();
  const searchRef = useRef(null);
  useOnOutsideClick(searchRef, toggleSearch);

  const isOnDesktop = useMediaQuery({ minWidth: 1200 });
  const isOnGuideToEurope = marketplace === Marketplace.GUIDE_TO_EUROPE;

  return (
    <div
      className={styles.wrapper}
      styleName="wrapper"
      style={{
        color: theme.colors.primary,
      }}
    >
      <div
        className={styles("leftSide", { isSearchOpen })}
        styleName={`leftSide ${isSearchOpen ? "isSearchOpen" : ""}`}
      >
        <Link
          id="navBarLogo"
          className={styles.logoLink}
          styleName="logoLink"
          href={getHomeUrl(activeLocale, marketplace)}
          title={websiteName}
        >
          {Logo}
        </Link>
      </div>
      <div
        className={styles("rightSide", { isSearchOpen })}
        styleName={`rightSide ${isSearchOpen ? "isSearchOpen" : ""}`}
      >
        {!isSearchOpen && (
          <div className={styles.links} styleName="links">
            {links.map(
              ({ text, url, visible }: HeaderTypes.HeaderLink) =>
                visible === "both" && (
                  <div className={styles.navLink} styleName="navLink monorepoHeaderLink" key={text}>
                    <Link
                      id={`${constructUniqueIdentifier(text)}NavItem`}
                      href={url}
                      style={{
                        color: theme.colors.primary,
                      }}
                    >
                      {text}
                    </Link>
                  </div>
                )
            )}
          </div>
        )}
        <CartContextStateProvider removeMutationLoading={false} noDismissMiniCartPopOver={false}>
          <div
            className={styles("mobileLinks", { isSearchOpen })}
            styleName={`mobileLinks ${isSearchOpen ? "isSearchOpen" : ""}`}
          >
            {marketplace !== Marketplace.GUIDE_TO_EUROPE && (
              <div
                className={styles("iconButtonWrapper", { isSearchOpen })}
                styleName={`iconButtonWrapper ${isSearchOpen ? "isSearchOpen" : ""}`}
              >
                <Search
                  id="mobileSearch"
                  isSearchOpen={isSearchOpen}
                  toggleSearch={toggleSearch}
                  searchBarPlaceholder={headerTexts.searchBarMobile}
                  theme={theme}
                  searchLink={searchLink}
                  ref={isMobile ? searchRef : undefined}
                />
              </div>
            )}
            {isOnGuideToEurope && !isOnDesktop && (
              <div
                className={styles("iconButtonWrapper", { isSearchOpen })}
                styleName={`iconButtonWrapper ${isSearchOpen ? "isSearchOpen" : ""}`}
              >
                <GTESearch isSearchOpen={isSearchOpen} toggleSearch={toggleSearch} />
              </div>
            )}
            <div className={styles.rightMobileLinks} styleName="rightMobileLinks">
              <div className={styles.iconButtonWrapper} styleName="iconButtonWrapper">
                {marketplace === Marketplace.GUIDE_TO_EUROPE ? (
                  <div>
                    <Cart
                      id="mobileGTECart"
                      theme={theme}
                      cartTexts={headerTexts.cart}
                      cartLink={cartLink}
                      links={links}
                    />
                  </div>
                ) : (
                  <OldCart
                    id="mobileCart"
                    theme={theme}
                    cartTexts={headerTexts.cart}
                    cartLink={cartLink}
                  />
                )}
              </div>
              <div className={styles.iconButtonWrapper} styleName="iconButtonWrapper">
                <button
                  id={`navBar${isMenuOpen ? "CloseMenu" : "OpenMenu"}`}
                  type="button"
                  className={styles.iconButton}
                  styleName="iconButton"
                  onClick={toggleMenu}
                  aria-label={headerTexts.userMenu.menu}
                  aria-haspopup="true"
                  aria-expanded={isMenuOpen}
                >
                  {isMenuOpen ? (
                    <CloseIcon className={styles.closeIcon} styleName="closeIcon" />
                  ) : (
                    <HamburgerIcon
                      className={styles.hamburgerIcon}
                      style={{
                        fill: theme.colors.primary,
                      }}
                      styleName="hamburgerIcon"
                    />
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className={styles.desktopLinks} styleName="desktopLinks">
            {isOnGuideToEurope && isOnDesktop ? (
              <GTESearch isSearchOpen={isSearchOpen} toggleSearch={toggleSearch} />
            ) : (
              isOnGuideToEurope && (
                <SearchIconContainer>
                  <GTESearchIcon />
                </SearchIconContainer>
              )
            )}
            {marketplace !== Marketplace.GUIDE_TO_EUROPE && (
              <Search
                id="desktopSearch"
                isSearchOpen={isSearchOpen}
                toggleSearch={toggleSearch}
                searchBarPlaceholder={headerTexts.searchBar}
                theme={theme}
                searchLink={searchLink}
                ref={!isMobile ? searchRef : undefined}
              />
            )}
            {locales.length > 1 && (
              <div className={styles.iconButtonWrapper} styleName="iconButtonWrapper">
                <LocalePickerPopover
                  trigger={
                    <button
                      id="navBarLocalePicker"
                      type="button"
                      className={styles.iconButton}
                      styleName="iconButton"
                    >
                      <ActiveLocaleIcon className={styles.flagIcon} styleName="flagIcon" />
                    </button>
                  }
                  locales={locales}
                  activeLocale={activeLocale}
                  localeLinks={localeLinks}
                  defaultUrl={marketplaceUrl}
                />
              </div>
            )}

            <div className={styles.iconButtonWrapper} styleName="iconButtonWrapper">
              <CurrencyPickerPopover currencies={currencies} />
            </div>

            <div className={styles.iconButtonWrapper} styleName="iconButtonWrapper">
              {marketplace === Marketplace.GUIDE_TO_EUROPE ? (
                <Cart
                  id="desktopGTECart"
                  theme={theme}
                  cartTexts={headerTexts.cart}
                  cartLink={cartLink}
                  links={links}
                />
              ) : (
                <OldCart
                  id="desktopCart"
                  theme={theme}
                  cartTexts={headerTexts.cart}
                  cartLink={cartLink}
                />
              )}
            </div>

            <div className={styles.iconButtonWrapper} styleName="iconButtonWrapper">
              {marketplace === Marketplace.GUIDE_TO_EUROPE ? (
                <GTEUserMenu />
              ) : (
                <UserMenu
                  theme={theme}
                  userMenuTexts={headerTexts.userMenu}
                  adminUrl={adminUrl}
                  forgotPasswordLink={forgotPasswordLink}
                />
              )}
            </div>
          </div>
        </CartContextStateProvider>
      </div>
    </div>
  );
};

export default NavigationBar;
