import React, { ReactNode } from "react";

import FrontCover from "../Cover/FrontCover/FrontCover";

import FrontValuePropositions from "components/ui/FrontValuePropositions/FrontValuePropositions";
import LandingHeaderWrapper from "components/ui/Search/LandingHeaderWrapper";

const SearchCoverContainer = ({
  cover,
  showCover,
  children,
}: {
  cover: SharedTypes.SearchCover;
  showCover: boolean;
  children?: ReactNode;
}) => {
  return (
    <LandingHeaderWrapper isShow={showCover}>
      <FrontCover
        images={[cover.image]}
        title={cover.name}
        description={cover?.description}
        hasBreadcrumbs
      >
        {children}
      </FrontCover>
      <FrontValuePropositions />
    </LandingHeaderWrapper>
  );
};

export default SearchCoverContainer;
