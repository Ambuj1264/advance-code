import { useQuery } from "@apollo/react-hooks";
import { useCallback, useEffect, useMemo } from "react";
import { OperationVariables } from "apollo-client";

import LandingPageStaySectionsQuery from "../queries/LandingPageStaySectionsQuery.graphql";
import LandingPageTourSectionsQuery from "../queries/LandingPageTourSectionsQuery.graphql";
import LandingPageSectionsQuery from "../queries/LandingPageSectionsQuery.graphql";
import LandingPageSectionsSortedQuery from "../queries/LandingPageSectionsSortedQuery.graphql";
import { getGraphCmsPaginationParams } from "../utils/landingPageUtils";
import LandingPageTGSectionsQuery from "../queries/LandingPageTGSectionsQuery.graphql";

import { useSectionPagination } from "./useSectionPagination";

import { emptyArray } from "utils/constants";
import VacationPackagesSectionSearchQuery from "components/features/VacationPackages/queries/VacationPackagesSectionSearchQuery.graphql";
import useActiveLocale from "hooks/useActiveLocale";
import { getTotalPages, normalizeGraphCMSLocale } from "utils/helperUtils";
import { constructVPSearchLandingQueryVariables } from "components/features/VacationPackages/utils/vacationPackagesUtils";
import lazyCaptureException from "lib/lazyCaptureException";

export const useStayProductPageSection = ({
  sectionCondition,
}: {
  sectionCondition?: LandingPageTypes.SectionWhereCondition;
}) => {
  const locale = useActiveLocale();
  const variables = useMemo(
    () => ({
      where: sectionCondition?.where,
      sectionWhere: sectionCondition?.sectionWhere,
      locale,
      first: sectionCondition?.itemsPerPage,
    }),
    [locale, sectionCondition]
  );
  const {
    data,
    loading,
    fetchMore: fetchMoreQuery,
  } = useQuery<LandingPageTypes.QueryLandingPageSection>(LandingPageStaySectionsQuery, {
    variables,
    skip: !sectionCondition?.where,
  });

  const fetchMore = useCallback(
    (fetchMoreVariables: OperationVariables) => {
      fetchMoreQuery({
        variables: fetchMoreVariables,
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newEdges = fetchMoreResult?.sectionContent.edges ?? emptyArray;
          const pageInfo = fetchMoreResult?.sectionContent.pageInfo;

          return newEdges.length
            ? {
                ...previousResult,
                sectionContent: {
                  // eslint-disable-next-line no-underscore-dangle
                  __typename: previousResult.sectionContent.__typename,
                  edges: [...previousResult.sectionContent.edges, ...newEdges],
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
      data?.sectionContent.edges.map(({ node }) => node) ??
      (emptyArray as StayTypes.QuerySimilarProduct[]),
    [data]
  );

  const paginationParams = useSectionPagination({
    sectionContent: sectionItems,
    pageInfo: data?.sectionContent?.pageInfo,
    variables,
    fetchMore,
    itemsPerPage: sectionCondition?.itemsPerPage,
  });

  return [
    data?.sections[0],
    sectionItems as StayTypes.QuerySimilarProduct[],
    loading,
    paginationParams,
  ] as const;
};

export const useVpProductPageSection = ({
  sectionCondition,
  flightId,
}: {
  sectionCondition?: LandingPageTypes.SectionWhereCondition;
  flightId?: string;
}) => {
  const locale = useActiveLocale();
  const variables = {
    ...constructVPSearchLandingQueryVariables(
      flightId,
      sectionCondition?.sectionWhere?.subType?.subtype,
      sectionCondition?.itemsPerPage
    ),
    where: sectionCondition?.where,
    locale,
  };
  const skip = !sectionCondition?.where || variables.input.startingPoint === "";
  useEffect(() => {
    if (skip) {
      lazyCaptureException(
        new Error(
          "Skipped calling VacationPackagesSectionSearchQuery because required variable is missing"
        ),
        {
          variables: {
            ...variables,
          },
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip]);

  const {
    data,
    loading,
    fetchMore: fetchMoreQuery,
  } = useQuery<QueryVacationPackagesSearchTypes.VacationPackagesSectionSearch>(
    VacationPackagesSectionSearchQuery,
    {
      variables,
      skip,
    }
  );

  const fetchMore = useCallback(
    (fetchMoreVariables: OperationVariables) => {
      fetchMoreQuery({
        variables: {
          input: {
            ...fetchMoreVariables?.input,
            filter: {
              ...fetchMoreVariables?.input?.filter,
              skip: (fetchMoreVariables.page - 1) * (sectionCondition?.itemsPerPage ?? 4),
            },
          },
          where: fetchMoreVariables.where,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newEdges = fetchMoreResult?.vacationPackages.nodes ?? emptyArray;

          return newEdges.length
            ? {
                ...previousResult,
                vacationPackages: {
                  ...fetchMoreResult?.vacationPackages,
                  nodes: (previousResult.vacationPackages.nodes ?? emptyArray).concat(newEdges),
                  totalCount: fetchMoreResult?.vacationPackages.totalCount || 0,
                },
              }
            : previousResult;
        },
      });
    },
    [fetchMoreQuery, sectionCondition?.itemsPerPage]
  );

  const vpProducts = useMemo(
    () =>
      data?.vacationPackages?.nodes ??
      (emptyArray as QueryVacationPackagesSearchTypes.VacationPackage[]),
    [data]
  );
  const sections = data?.sections ?? emptyArray;
  const totalProducts = data?.vacationPackages?.totalCount ?? 0;
  const itemsPerPage = sectionCondition?.itemsPerPage ?? 4;
  const totalPages = getTotalPages(totalProducts, itemsPerPage);
  const paginationParams = useSectionPagination({
    sectionContent: vpProducts,
    variables,
    fetchMore,
    itemsPerPage,
    totalPages,
  });

  return [vpProducts, sections, loading, paginationParams] as const;
};

export const useTourProductPageSection = ({
  sectionCondition,
}: {
  sectionCondition?: LandingPageTypes.SectionWhereCondition;
}) => {
  const locale = useActiveLocale();
  const variables = {
    where: sectionCondition?.where,
    sectionWhere: sectionCondition?.sectionWhere,
    locale,
    ...getGraphCmsPaginationParams({
      numberOfItems: sectionCondition?.itemsPerPage,
    }),
  };
  const {
    data,
    loading,
    fetchMore: fetchMoreQuery,
  } = useQuery<LandingPageTypes.QueryLandingPageSection>(LandingPageTourSectionsQuery, {
    variables,
    skip: !sectionCondition?.where,
  });

  const fetchMore = useCallback(
    (fetchMoreVariables: OperationVariables) => {
      fetchMoreQuery({
        variables: fetchMoreVariables,
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newEdges = fetchMoreResult?.sectionContent.edges ?? emptyArray;
          const pageInfo = fetchMoreResult?.sectionContent.pageInfo;

          return newEdges.length
            ? {
                ...previousResult,
                sectionContent: {
                  // eslint-disable-next-line no-underscore-dangle
                  __typename: previousResult.sectionContent.__typename,
                  edges: previousResult.sectionContent.edges.concat(newEdges),
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
      data?.sectionContent.edges.map(({ node }) => node) ??
      (emptyArray as GTETourTypes.QueryTourSectionContent[]),
    [data]
  );
  const paginationParams = useSectionPagination({
    sectionContent: sectionItems,
    pageInfo: data?.sectionContent?.pageInfo,
    variables,
    fetchMore,
    itemsPerPage: sectionCondition?.itemsPerPage,
  });

  return [
    data?.sections[0],
    sectionItems as GTETourTypes.QueryTourSectionContent[],
    loading,
    paginationParams,
  ] as const;
};

export const useTGDestinationSection = ({
  sectionCondition,
}: {
  sectionCondition?: LandingPageTypes.SectionWhereCondition;
}) => {
  const locale = useActiveLocale();
  const variables = {
    input: {
      cityId: sectionCondition?.sectionWhere?.cityId,
      countryCode: sectionCondition?.sectionWhere?.countryCode,
    },
    order: sectionCondition?.sectionWhere?.order,
    where: sectionCondition?.where,
    sectionWhere: sectionCondition?.sectionWhere,
    locale: [locale],
    ...getGraphCmsPaginationParams({
      numberOfItems: sectionCondition?.itemsPerPage,
    }),
  };

  const {
    data,
    loading,
    fetchMore: fetchMoreQuery,
  } = useQuery<LandingPageTypes.QueryLandingPageSection>(LandingPageTGSectionsQuery, {
    variables,
    skip: !sectionCondition?.where,
  });

  const fetchMore = useCallback(
    (fetchMoreVariables: OperationVariables) => {
      fetchMoreQuery({
        variables: fetchMoreVariables,
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newEdges = fetchMoreResult?.sectionContent.edges ?? emptyArray;
          const pageInfo = fetchMoreResult?.sectionContent.pageInfo;

          return newEdges.length
            ? {
                ...previousResult,
                sectionContent: {
                  // eslint-disable-next-line no-underscore-dangle
                  __typename: previousResult.sectionContent.__typename,
                  edges: previousResult.sectionContent.edges.concat(newEdges),
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
      data?.sectionContent.edges.map(({ node }) => node) ??
      (emptyArray as TravelGuideTypes.TGDestinationNode[]),
    [data]
  );
  const paginationParams = useSectionPagination({
    sectionContent: sectionItems,
    pageInfo: data?.sectionContent?.pageInfo,
    variables,
    fetchMore,
    itemsPerPage: sectionCondition?.itemsPerPage,
  });

  return [
    data?.sections[0],
    sectionItems as TravelGuideTypes.TGDestinationNode[],
    loading,
    paginationParams,
  ] as const;
};

export const useLandingPageSection = ({
  sectionCondition,
  metadataUri,
  continentGroup,
}: {
  sectionCondition: LandingPageTypes.SectionWhereCondition;
  metadataUri?: string;
  continentGroup: number[];
}) => {
  const locale = useActiveLocale();
  const variables = useMemo(
    () => ({
      where: sectionCondition?.where,
      sectionWhere: { ...sectionCondition?.sectionWhere, isDeleted: false },
      locale: normalizeGraphCMSLocale(locale),
      orderBy: sectionCondition?.orderBy,
      ...getGraphCmsPaginationParams({
        numberOfItems: sectionCondition?.itemsPerPage,
      }),
      ...(sectionCondition?.useSortedQuery ? { metadataUri, continentGroup } : null),
    }),
    [continentGroup, locale, metadataUri, sectionCondition]
  );

  const {
    data,
    loading,
    fetchMore: fetchMoreQuery,
  } = useQuery<LandingPageTypes.QueryLandingPageSection>(
    sectionCondition?.useSortedQuery ? LandingPageSectionsSortedQuery : LandingPageSectionsQuery,
    {
      variables,
      skip: !sectionCondition?.where || !sectionCondition?.sectionWhere,
    }
  );

  const fetchMore = useCallback(
    (fetchMoreVariables: OperationVariables) => {
      fetchMoreQuery({
        variables: fetchMoreVariables,
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newEdges = fetchMoreResult?.sectionContent.edges ?? emptyArray;
          const pageInfo = fetchMoreResult?.sectionContent.pageInfo;

          return newEdges.length
            ? {
                ...previousResult,
                sectionContent: {
                  // eslint-disable-next-line no-underscore-dangle
                  __typename: previousResult.sectionContent.__typename,
                  edges: previousResult.sectionContent.edges.concat(newEdges),
                  pageInfo: pageInfo!,
                },
              }
            : previousResult;
        },
      });
    },
    [fetchMoreQuery]
  );

  const sectionItems = useMemo(() => {
    return (
      data?.sectionContent.edges.map(({ node }) => node) ??
      (emptyArray as LandingPageTypes.SectionContentEdge[])
    );
  }, [data]);

  const paginationParams = useSectionPagination({
    sectionContent: sectionItems,
    pageInfo: data?.sectionContent?.pageInfo,
    variables,
    fetchMore,
    itemsPerPage: sectionCondition?.itemsPerPage,
  });

  return [data?.sections[0], sectionItems, loading, paginationParams] as const;
};
