import React, { useState, useCallback } from "react";
import styled from "@emotion/styled";
import { useQuery } from "@apollo/react-hooks";

import TopCarRentalsQuery from "../queries/TopCarRentalsQuery.graphql";
import { constructTopCarRentals } from "../utils/carSearchUtils";

import CarRentalSkeleton from "./CarRentalSkeleton";
import CarRental from "./CarRental";

import GridRow from "components/ui/Grid/Row";
import { gutters } from "styles/variables";
import PaginatedContent from "components/ui/PaginatedContent/PaginatedContent";
import { getTotalPages } from "utils/helperUtils";
import SectionRow from "components/ui/Section/SectionRow";

const Row = styled(GridRow)`
  margin-top: ${gutters.large}px;
`;

const RowWrapper = styled(GridRow)`
  justify-content: center;
`;

const StyledPaginatedContent = styled(PaginatedContent)`
  width: 100%;
`;

const CAR_RENTALS_ON_PAGE = 9;

const TopCarRentals = () => {
  const { data } = useQuery<{
    topCarRentals: CarSearchTypes.QueryTopCarRentals;
  }>(TopCarRentalsQuery);
  const [carRentalPage, setCarRentalPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const onPageChange = useCallback(({ current }) => {
    setIsLoading(true);
    setTimeout(() => {
      setCarRentalPage(current);
      setIsLoading(false);
    }, 250);
  }, []);
  if (!data) return null;
  const carRentals = constructTopCarRentals(data.topCarRentals.establishments);
  const totalPages = getTotalPages(carRentals.length, CAR_RENTALS_ON_PAGE);

  const slicedCarRentals = [...carRentals].slice(
    (carRentalPage - 1) * CAR_RENTALS_ON_PAGE,
    carRentalPage * CAR_RENTALS_ON_PAGE
  );
  return (
    <SectionRow
      title={data.topCarRentals.metadata.title}
      subtitle={data.topCarRentals.metadata.subtitle}
      CustomRowWrapper={RowWrapper}
    >
      <StyledPaginatedContent
        name="topCarRentals"
        isLoading={false}
        initialPage={carRentalPage}
        totalPages={totalPages}
        pagesToShow={3}
        onPageChange={onPageChange}
        runPageChangeOnMount={false}
      >
        <Row>
          {slicedCarRentals.map(carRental =>
            isLoading ? (
              <CarRentalSkeleton key={carRental.url} />
            ) : (
              <CarRental key={carRental.url} {...carRental} />
            )
          )}
        </Row>
      </StyledPaginatedContent>
    </SectionRow>
  );
};

export default TopCarRentals;
