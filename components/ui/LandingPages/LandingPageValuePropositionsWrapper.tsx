import React, { memo } from "react";
import { useQuery } from "@apollo/react-hooks";

import FrontValuePropositionsSkeleton from "../FrontValuePropositions/FrontValuePropositionsSkeleton";

import LandingPageValuePropsQuery from "./queries/LandingPageValuePropsQuery.graphql";
import LandingPageValuePropositions from "./LandingPageValuePropositions";
import { getMaybeValuePropsPageType } from "./utils/landingPageQueryUtils";

import { GraphCMSPageType } from "types/enums";
import { normalizeGraphCMSLocale } from "utils/helperUtils";
import useActiveLocale from "hooks/useActiveLocale";

const LandingPageValuePropositionsWrapper = ({
  pageType = GraphCMSPageType.FrontPage,
}: {
  pageType?: GraphCMSPageType;
}) => {
  const locale = useActiveLocale();
  const { data, error, loading } = useQuery<{
    landingValueProps: {
      valueProps: LandingPageTypes.LandingPageValueProposition[];
    }[];
  }>(LandingPageValuePropsQuery, {
    variables: {
      pageType: getMaybeValuePropsPageType(pageType),
      locale: normalizeGraphCMSLocale(locale),
    },
  });
  if (loading) return <FrontValuePropositionsSkeleton />;
  if (!data?.landingValueProps || error) return null;

  return <LandingPageValuePropositions valueProps={data!.landingValueProps[0].valueProps} />;
};

export default memo(LandingPageValuePropositionsWrapper);
