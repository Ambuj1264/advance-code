import React from "react";
import styled from "@emotion/styled";
import { useQuery } from "@apollo/react-hooks";

import GTETourContentContainer from "components/features/GTETourProductPage/GTETourContentContainer";
import { mqMax, column } from "styles/base";
import { gutters } from "styles/variables";
import ProductContentLoading from "components/ui/ProductPageLoading/ProductContentLoading";
import TourContentQuery from "components/features/GTETourProductPage/queries/TourContentQuery.graphql";

const StyledGTETourContentContainer = styled(GTETourContentContainer)`
  ${column({ small: 1, large: 1, desktop: 1 })}
`;

const Wrapper = styled.div`
  margin: 0 -${gutters.small}px;
  margin-top: ${gutters.large}px;

  ${mqMax.large} {
    margin: 0 -${gutters.small + gutters.small / 2}px;
    margin-top: ${gutters.small}px;
  }
`;

const ModalViewLoadingWrapper = styled.div`
  padding: 0 ${gutters.small}px;
  ${mqMax.large} {
    padding: 0 ${gutters.small + gutters.small / 2}px;
  }
`;

const VPToursInfoModalContent = ({
  productId,
  queryCondition,
  ErrorComponent,
}: {
  productId?: string;
  queryCondition: LandingPageTypes.LandingPageQueryCondition;
  ErrorComponent?: React.ElementType;
}) => {
  const { data, loading, error } = useQuery<GTETourTypes.QueryTour>(TourContentQuery, {
    variables: {
      where: queryCondition,
      isDisabled: false,
    },
  });
  if (loading) {
    return (
      <Wrapper>
        <ModalViewLoadingWrapper>
          <ProductContentLoading />
        </ModalViewLoadingWrapper>
      </Wrapper>
    );
  }

  if (!data || !data.tourProductPages[0] || error) {
    return ErrorComponent ? (
      <ErrorComponent error={error ?? new Error("Requested data is null")} />
    ) : null;
  }

  return (
    <Wrapper>
      <StyledGTETourContentContainer
        productId={productId}
        tourData={data.tourProductPages}
        isModalView
      />
    </Wrapper>
  );
};

export default VPToursInfoModalContent;
