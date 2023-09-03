import React from "react";
import { useTheme } from "emotion-theming";

import HeaderWrapper from "./Header/HeaderWrapper";
import NewHeaderWrapper from "./Header/NewHeaderWrapper";
import { HeaderContextProvider } from "./Header/HeaderContext";

import { useSettings } from "contexts/SettingsContext";
import { Marketplace } from "types/enums";
import ErrorBoundary from "components/ui/ErrorBoundary";

const MainHeader = ({
  gteLocaleLinks,
  skipHeaderContextSetup = false,
}: {
  gteLocaleLinks?: LocaleLink[];
  skipHeaderContextSetup?: boolean;
}) => {
  const theme: Theme = useTheme();
  const { marketplace } = useSettings();
  const MaybeWithHeaderContextProvider = skipHeaderContextSetup
    ? React.Fragment
    : HeaderContextProvider;

  if (marketplace === Marketplace.GUIDE_TO_EUROPE) {
    return (
      <ErrorBoundary>
        <MaybeWithHeaderContextProvider>
          <NewHeaderWrapper theme={theme} localeLinks={gteLocaleLinks!} />
        </MaybeWithHeaderContextProvider>
      </ErrorBoundary>
    );
  }
  return (
    <ErrorBoundary>
      <MaybeWithHeaderContextProvider>
        <HeaderWrapper theme={theme} overideLocaleLinks={gteLocaleLinks} />
      </MaybeWithHeaderContextProvider>
    </ErrorBoundary>
  );
};

export default MainHeader;
