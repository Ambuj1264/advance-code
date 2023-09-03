import React from "react";
import { useRouter } from "next/router";

import HeaderContainer from "./HeaderContainer";
import { useHeaderQuery } from "./useHeaderQueries";
import useLocaleLinks from "./useLocaleLinksQuery";

import { getStrippedUrlPath } from "utils/apiUtils";

const HeaderWrapper = ({
  theme,
  overideLocaleLinks,
}: {
  theme: Theme;
  overideLocaleLinks?: LocaleLink[];
}) => {
  const { headerData, headerError } = useHeaderQuery();
  const { asPath } = useRouter();
  const localeLinks = useLocaleLinks(getStrippedUrlPath(asPath));

  return (
    <HeaderContainer
      theme={theme}
      localeLinks={overideLocaleLinks || localeLinks}
      headerData={headerData}
      headerError={headerError}
    />
  );
};

export default HeaderWrapper;
