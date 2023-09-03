import React, { useMemo, useContext } from "react";
import { useTranslation } from "react-i18next";
import { range } from "fp-ts/lib/Array";
import styled from "@emotion/styled";
import { ApolloError } from "apollo-client";

import { constructVacationPackageProduct } from "../VacationPackages/utils/vacationPackagesUtils";
import useVacationSearchQueryParams, {
  encodeVPSearchQueryParams,
} from "../VacationPackages/utils/useVacationSearchQueryParams";
import { encodeOccupanciesToArrayString } from "../AccommodationSearchPage/utils/useAccommodationSearchQueryParams";

import { VPStayStateContext } from "./contexts/VPStayStateContext";

import Row from "components/ui/Grid/Row";
import TileProductCard from "components/ui/Search/TileProductCard";
import { Namespaces } from "shared/namespaces";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import TileProductCardSkeleton from "components/ui/Search/TileProductCardSkeleton";
import { useCurrencyWithSSR } from "hooks/useLocaleCurrency";
import ProductCardRow, { StyledSimilarProductsColumn } from "components/ui/ProductCardRow";
import { getTotalNumberOfGuests } from "components/ui/RoomAndGuestPicker/utils/roomAndGuestUtils";

const TileProductCardSkeletonStyled = styled(TileProductCardSkeleton)`
  height: auto;
`;
const StyledSimilarProductsColumnMaxHeight = styled(StyledSimilarProductsColumn)`
  max-height: 460px;
`;
const StyledVPProductCardRow = styled(ProductCardRow)`
  ${Row} {
    min-height: 465px;
  }
`;
const VPSimilarRoadTrips = ({
  loading,
  data,
  error,
}: {
  loading: boolean;
  data: QueryVacationPackagesSearchTypes.VacationPackage[];
  error?: ApolloError;
}) => {
  const { occupancies } = useContext(VPStayStateContext);
  const { currencyCode, convertCurrency } = useCurrencyWithSSR();
  const { t: vacationPackageT } = useTranslation(Namespaces.vacationPackageNs);
  const isMobile = useIsMobile();
  const [queryParams] = useVacationSearchQueryParams();
  const vacationPackagesProducts = useMemo(() => {
    if (data.length) {
      return data.map(vacationPackage =>
        constructVacationPackageProduct({
          vacationPackageT,
          vacationProduct: vacationPackage,
          encodedQueryParamsString: encodeVPSearchQueryParams({
            ...queryParams,
            occupancies: encodeOccupanciesToArrayString(occupancies),
          }),
        })
      );
    }
    return [];
  }, [data, vacationPackageT]);
  const totalTravelers = getTotalNumberOfGuests(occupancies);
  if (error) return null;
  if (loading) {
    return (
      <ProductCardRow className="vp-similarRoadTrips">
        {range(0, 2).map(key => {
          return (
            <StyledSimilarProductsColumnMaxHeight key={key} productsCount={3}>
              <TileProductCardSkeletonStyled className="VPSimilarRoadTrips" />
            </StyledSimilarProductsColumnMaxHeight>
          );
        })}
      </ProductCardRow>
    );
  }
  if (!vacationPackagesProducts.length) {
    return null;
  }
  return (
    <StyledVPProductCardRow className="vp-similarRoadTrips">
      {vacationPackagesProducts.map(product => {
        return (
          <StyledSimilarProductsColumnMaxHeight
            key={`similarvp-${product.id}`}
            productsCount={vacationPackagesProducts.length}
          >
            <TileProductCard
              image={product.image}
              headline={product.headline}
              productSpecs={product.specs}
              productProps={product.props}
              currency={currencyCode}
              isMobile={isMobile}
              linkUrl={product.linkUrl}
              price={convertCurrency(product.price ?? 0)}
              reviewsCount={product.reviewsCount}
              averageRating={product.averageRating}
              priceSubtitle={
                totalTravelers
                  ? vacationPackageT("Price for {numberOfTravelers} travelers", {
                      numberOfTravelers: totalTravelers,
                    })
                  : undefined
              }
            />
          </StyledSimilarProductsColumnMaxHeight>
        );
      })}
    </StyledVPProductCardRow>
  );
};
export default VPSimilarRoadTrips;
