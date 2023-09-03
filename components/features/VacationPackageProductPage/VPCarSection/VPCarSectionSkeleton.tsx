import React from "react";
import { useQuery } from "@apollo/react-hooks";
import styled from "@emotion/styled";

import VPProductCard from "../VPProductCard";
import { constructVPCarPlaceholderProducts } from "../utils/vacationPackageUtils";
import VPCardBanner from "../VPCardBanner";
import { VPActiveModalTypes } from "../contexts/VPModalStateContext";

import CarSubTypesQuery from "./queries/CarSubTypesQuery.graphql";

import ProductCardRow, { StyledSimilarProductsColumn } from "components/ui/ProductCardRow";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { LazyImageWrapper, LeftBottomContent } from "components/ui/Search/CardHeader";

const StyledVPProductCard = styled(VPProductCard)`
  ${LazyImageWrapper} {
    min-height: 207px;
    overflow: hidden;

    img {
      min-height: 105%;
      object-fit: contain;
    }
  }
  ${LeftBottomContent} {
    bottom: 0;
  }
`;

const doNothing = () => {};

const VPCarSectionSkeleton = ({
  fallbackOffers,
  constructOnSelectCarOffer,
  selectedCarId,
  includedFooterTextContent,
  carOffersLoading,
}: {
  fallbackOffers?: VacationPackageTypes.VPCarSearch[];
  constructOnSelectCarOffer: (productId: string) => void;
  selectedCarId?: string;
  includedFooterTextContent?: string;
  carOffersLoading: boolean;
}) => {
  const { t } = useTranslation(Namespaces.commonCarNs);
  const { data, loading, error } =
    useQuery<VacationPackageTypes.CarSubTypesQueryResult>(CarSubTypesQuery);

  if (loading || error || !data) {
    return null;
  }
  const constructedPlaceholders = constructVPCarPlaceholderProducts(t, data, fallbackOffers);
  return (
    <ProductCardRow>
      {constructedPlaceholders.map(car => {
        const fallbackOffer = fallbackOffers?.find(offer => offer.subtype === car.subtype);
        const fallbackId = String(fallbackOffer?.id);
        const isSelected = fallbackOffers ? fallbackId === selectedCarId : false;

        return (
          <StyledSimilarProductsColumn key={car.id} productsCount={constructedPlaceholders.length}>
            <StyledVPProductCard
              productId={fallbackId || car.id}
              headline={t(car.subtype)}
              image={car.image}
              imgixParams={{ h: 250 }}
              productSpecs={car.carSpecs}
              isCardSelected={isSelected}
              onSelectCard={
                fallbackOffers && !carOffersLoading ? constructOnSelectCarOffer : doNothing
              }
              isCardDisabled={!fallbackId}
              imageHeight={180}
              cssHeight={180}
              isLoading={false}
              imageLeftBottomContent={
                <VPCardBanner
                  isSelected={isSelected}
                  Icon={car.Icon}
                  bannerContent={t(car.subtype)}
                />
              }
              infoModalContent={null}
              editModalContent={null}
              editModalTitle={{ Icon: car.Icon, title: car.subtype }}
              includedFooterTextContent={includedFooterTextContent ?? ""}
              radioButtonValue={car.id}
              price={car.price}
              editModalId={VPActiveModalTypes.EditCar}
              infoModalId={VPActiveModalTypes.InfoCar}
            />
          </StyledSimilarProductsColumn>
        );
      })}
    </ProductCardRow>
  );
};

export default VPCarSectionSkeleton;
