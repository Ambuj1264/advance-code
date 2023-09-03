import { useQuery } from "@apollo/react-hooks";
import { useCallback, useMemo } from "react";
import { OperationVariables } from "apollo-client";

import useActiveLocale from "hooks/useActiveLocale";
import TGLandingSectionQuery from "components/features/TravelGuides/queries/TGLandingSectionQuery.graphql";
import { useSectionPagination } from "components/ui/LandingPages/hooks/useSectionPagination";
import { emptyArray } from "utils/constants";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { GraphCMSPageType } from "types/enums";

export const useTGLandingPageSection = ({
  sectionCondition,
}: {
  sectionCondition?: LandingPageTypes.SectionWhereCondition;
}) => {
  const { t } = useTranslation(Namespaces.travelGuidesNs);
  const locale = useActiveLocale();
  const variables = useMemo(
    () => ({
      where: sectionCondition?.where,
      sectionWhere: sectionCondition?.sectionWhere,
      locale: [locale],
      first: sectionCondition?.itemsPerPage,
    }),
    [locale, sectionCondition]
  );
  const {
    data,
    loading,
    fetchMore: fetchMoreQuery,
  } = useQuery<TravelGuideTypes.TGLandingPageSection>(TGLandingSectionQuery, {
    variables,
  });

  const fetchMore = useCallback(
    (fetchMoreVariables: OperationVariables) => {
      fetchMoreQuery({
        variables: fetchMoreVariables,
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newEdges = fetchMoreResult?.landingPages.edges ?? emptyArray;
          const pageInfo = fetchMoreResult?.landingPages.pageInfo;

          return newEdges.length
            ? {
                ...previousResult,
                landingPages: {
                  // eslint-disable-next-line no-underscore-dangle
                  __typename: previousResult.landingPages.__typename,
                  edges: previousResult.landingPages.edges.concat(newEdges),
                  pageInfo: pageInfo!,
                },
              }
            : previousResult;
        },
      });
    },
    [fetchMoreQuery]
  );

  const sectionItems = useMemo(
    () =>
      data?.landingPages.edges.map(({ node }) => {
        const inDestinationCountry = node.destination.inNameNew?.value;
        return {
          ...node,
          title: t("destinations {inDestinationCountry}", { inDestinationCountry }),
          pageType: GraphCMSPageType.TravelGuidesLanding,
        };
      }) ?? (emptyArray as TravelGuideTypes.TGLandingNode[]),
    [data?.landingPages.edges, t]
  );
  const paginationParams = useSectionPagination({
    sectionContent: sectionItems,
    pageInfo: data?.landingPages?.pageInfo,
    variables,
    fetchMore,
    itemsPerPage: sectionCondition?.itemsPerPage,
  });
  return [data?.sections[0], sectionItems, loading, paginationParams] as const;
};
