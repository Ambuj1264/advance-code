import React from "react";

import HeaderContainer from "./HeaderContainer";
import { useNewHeaderQuery } from "./useHeaderQueries";

const NewHeaderWrapper = ({ theme, localeLinks }: { theme: Theme; localeLinks?: LocaleLink[] }) => {
  const { headerData, headerError } = useNewHeaderQuery();

  return (
    <HeaderContainer
      theme={theme}
      localeLinks={localeLinks ?? []}
      headerData={headerData}
      headerError={headerError}
    />
  );
};

export default NewHeaderWrapper;
