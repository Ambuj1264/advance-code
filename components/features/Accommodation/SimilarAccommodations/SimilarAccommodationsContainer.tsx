import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useLazyQuery } from "@apollo/react-hooks";
import styled from "@emotion/styled";
import {
  encodeQueryParams,
  stringify,
  StringParam,
  NumericArrayParam,
  NumberParam,
} from "use-query-params";

import SimilarAccommodationQuery from "./queries/SimilarAccommodationQuery.graphql";
import { constructSimilarAccommodations } from "./utils/similarAccommodationsUtils";

import { Namespaces } from "shared/namespaces";
import SimilarProductsLoading from "components/ui/SimilarProducts/SimilarProductsLoading";
import SimilarProducts from "components/ui/SimilarProducts/SimilarProducts";
import { LeftSectionHeading } from "components/ui/Section/SectionHeading";
import { AccommodationFilterQueryParam, PageType } from "types/enums";
import { Trans } from "i18n";
import { guttersPx } from "styles/variables";
import { constructQueryFromSelectedDates } from "components/ui/DatePicker/utils/datePickerUtils";

const StyledSimilarProducts = styled(SimilarProducts)`
  margin-top: ${guttersPx.large};
`;

const StyledSimilarProductsLoading = styled(SimilarProductsLoading)`
  margin-top: ${guttersPx.large};
`;

const SimilarAccommodationsContainer = ({
  slug,
  categoryName,
  adultsCount,
  childrenCount,
  roomsCount,
  dateFrom,
  dateTo,
  childrenAges,
}: {
  slug: string;
  categoryName: string;
  adultsCount: number;
  childrenCount: number;
  roomsCount: number;
  dateFrom?: Date;
  dateTo?: Date;
  childrenAges?: number[];
}) => {
  const { asPath } = useRouter();

  const [fetchSimilarAccommodation, { error, data, loading }] =
    useLazyQuery<SimilarAccommodationTypes.QuerySimilarAccommodationData>(
      SimilarAccommodationQuery
    );

  const dates = constructQueryFromSelectedDates({ from: dateFrom, to: dateTo, withTime: false });

  const queryString = stringify(
    encodeQueryParams(
      {
        [AccommodationFilterQueryParam.ADULTS]: NumberParam,
        [AccommodationFilterQueryParam.CHILDREN]: NumericArrayParam,
        [AccommodationFilterQueryParam.DATE_FROM]: StringParam,
        [AccommodationFilterQueryParam.DATE_TO]: StringParam,
        [AccommodationFilterQueryParam.ROOMS]: NumberParam,
      },
      {
        [AccommodationFilterQueryParam.ADULTS]: adultsCount,
        [AccommodationFilterQueryParam.CHILDREN]: childrenAges,
        [AccommodationFilterQueryParam.DATE_FROM]: dates.dateFrom,
        [AccommodationFilterQueryParam.DATE_TO]: dates.dateTo,
        [AccommodationFilterQueryParam.ROOMS]: roomsCount,
      }
    )
  );
  useEffect(() => {
    if ((!dateFrom && !dateTo) || (dateFrom && dateTo)) {
      fetchSimilarAccommodation({
        variables: {
          slug,
          adultsCount,
          childrenCount,
          roomsCount,
          dateFrom,
          dateTo,
        },
        context: {
          fetchOptions: {
            method: "POST",
          },
        },
      });
    }
  }, [dateFrom, dateTo, adultsCount, childrenCount, roomsCount, fetchSimilarAccommodation, slug]);

  const similarAccommodationData = data?.similarAccommodation;
  const accommodationsData = similarAccommodationData?.accommodations || [];

  if (error || (!loading && !accommodationsData.length)) {
    return null;
  }

  const similarAccommodations = constructSimilarAccommodations(accommodationsData, asPath);
  const seeMoreLink = `${similarAccommodationData?.seeMoreLink}?${queryString}`;

  return (
    <>
      <LeftSectionHeading>
        <Trans
          ns={Namespaces.accommodationNs}
          i18nKey="Nearby {categoryName}"
          defaults="Nearby {categoryName}"
          values={{ categoryName }}
        />
      </LeftSectionHeading>
      {loading ? (
        <StyledSimilarProductsLoading />
      ) : (
        <StyledSimilarProducts
          similarProducts={similarAccommodations}
          seeMoreLink={seeMoreLink}
          searchPageType={PageType.ACCOMMODATION_SEARCH}
        />
      )}
    </>
  );
};

export default SimilarAccommodationsContainer;
