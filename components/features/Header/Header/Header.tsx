import React, { useRef, ReactElement } from "react";
import { Provider as PopoverContextProvider } from "@travelshift/ui/components/Popover/PopoverContext";
import { HeaderTypes } from "@travelshift/ui/typings/headerTypes";
import styles from "@travelshift/ui/components/Header/Header.scss";

import NavigationBar from "./NavigationBar/NavigationBar";
import MobileMenu from "./MobileMenu";
import { useHeaderContext, useOnToggleMenu, useOnToggleSearch } from "./HeaderContext";

import useHTMLScrollLock from "hooks/useHTMLScrollLock";
import LazyHydrateWrapper from "components/ui/LazyHydrateWrapper";

type Props = {
  links: ReadonlyArray<HeaderTypes.HeaderLink>;
  Logo: ReactElement;
  currencies: ReadonlyArray<Currency>;
  locales: ReadonlyArray<AppLocale>;
  activeLocale: string;
  theme: Theme;
  localeLinks: LocaleLink[];
  adminUrl: string;
  headerTexts: HeaderTypes.HeaderTexts;
  searchLink: string;
  cartLink: string;
  forgotPasswordLink: string;
};

const Header = ({
  links,
  Logo,
  currencies,
  locales,
  activeLocale,
  localeLinks,
  adminUrl,
  theme,
  headerTexts,
  searchLink,
  cartLink,
  forgotPasswordLink,
}: Props) => {
  const { menuOpen, searchOpen } = useHeaderContext();

  const popoverFrameRef = useRef(null);

  const toggleMenu = useOnToggleMenu();
  const toggleSearch = useOnToggleSearch();

  useHTMLScrollLock(!menuOpen);

  return (
    <>
      <div ref={popoverFrameRef} className={styles.popoverFrame} styleName="popoverFrame" />
      <PopoverContextProvider value={popoverFrameRef}>
        <NavigationBar
          Logo={Logo}
          isMenuOpen={menuOpen}
          toggleMenu={toggleMenu}
          isSearchOpen={searchOpen}
          toggleSearch={toggleSearch}
          links={links}
          currencies={currencies}
          locales={locales}
          activeLocale={activeLocale}
          theme={theme}
          localeLinks={localeLinks}
          headerTexts={headerTexts}
          adminUrl={adminUrl}
          searchLink={searchLink}
          cartLink={cartLink}
          forgotPasswordLink={forgotPasswordLink}
        />
      </PopoverContextProvider>
      {menuOpen && (
        <LazyHydrateWrapper whenVisible key="mobileMenu">
          <MobileMenu
            isOpen={menuOpen}
            links={links}
            currencies={currencies}
            locales={locales}
            activeLocale={activeLocale}
            localeLinks={localeLinks}
            headerTexts={headerTexts}
            adminUrl={adminUrl}
            forgotPasswordLink={forgotPasswordLink}
          />
        </LazyHydrateWrapper>
      )}
    </>
  );
};

export default Header;
