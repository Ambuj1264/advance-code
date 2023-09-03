import React from "react";
import styled from "@emotion/styled";

import LoadingCover from "../Loading/LoadingCover";
import FrontValuePropositionsSkeleton from "../FrontValuePropositions/FrontValuePropositionsSkeleton";

import LandingPageSectionLoading from "./LandingPageSectionLoading";
import LoadingBreadcrumbs from "./LandingPageLoadingBreadcrumbs";

import Container from "components/ui/Grid/Container";

const LP_COVER_SKELETON_MOBILE_HEIGHT = 436;

const StyledLoadingCover = styled(LoadingCover)`
  min-height: ${LP_COVER_SKELETON_MOBILE_HEIGHT}px;
`;

const LandingPageLoadingSkeleton = ({ SectionSkeletons }: { SectionSkeletons: JSX.Element[] }) => {
  return (
    <Container>
      <LoadingBreadcrumbs />
      <StyledLoadingCover />
      <FrontValuePropositionsSkeleton />
      {SectionSkeletons.length ? (
        SectionSkeletons
      ) : (
        <>
          <LandingPageSectionLoading isFirstSection />
          <LandingPageSectionLoading />
          <LandingPageSectionLoading />
        </>
      )}
    </Container>
  );
};

export default LandingPageLoadingSkeleton;
