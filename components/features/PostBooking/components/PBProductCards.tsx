import React from "react";
import styled from "@emotion/styled";

import { PB_CARD_TYPE } from "../types/postBookingEnums";

import { PBProductTileCard } from "./PBProductTileCard";
import { PBProductListCard } from "./PBProductListCard";
import { StyledPBProductCardsWrapper } from "./PBSharedComponents";
import usePlacePhoto from "./hooks/usePlacePhoto";

import { PostBookingTypes } from "components/features/PostBooking/types/postBookingTypes";
import { getPBCardIcon } from "components/features/PostBooking/utils/postBookingCardUtils";
import ScrollSnapCarousel, { StyledScrollSnapRow } from "components/ui/ScrollSnapCarousel";
import { gutters } from "styles/variables";

export const PBProductCard = ({ product }: { product: PostBookingTypes.ProductCard }) => {
  const isBarOrRestaurant = PB_CARD_TYPE.BAR || PB_CARD_TYPE.RESTAURANT;
  const { image } = usePlacePhoto({
    photoReference: product.photoReference,
    skip: !isBarOrRestaurant,
  });
  const { type, ...rest } = product;
  switch (type) {
    case PB_CARD_TYPE.BAR:
    case PB_CARD_TYPE.RESTAURANT:
      return (
        <PBProductTileCard
          type={type || product.type}
          HeadingIcon={getPBCardIcon(product.type)}
          image={image}
          placeImage={image}
          {...rest}
        />
      );
    case PB_CARD_TYPE.ATTRACTION:
      return (
        <PBProductListCard
          type={type || product.type}
          HeadingIcon={getPBCardIcon(product.type)}
          {...rest}
        />
      );
    case PB_CARD_TYPE.CAR_RENTAL:
      return (
        <PBProductListCard
          type={type || product.type}
          HeadingIcon={getPBCardIcon(product.type)}
          {...rest}
        />
      );
    case PB_CARD_TYPE.CITY:
      return (
        <PBProductListCard
          type={type || product.type}
          HeadingIcon={getPBCardIcon(product.type)}
          {...rest}
        />
      );
    case PB_CARD_TYPE.FLIGHT_ARRIVING:
      return (
        <PBProductListCard
          type={type || product.type}
          HeadingIcon={getPBCardIcon(product.type)}
          {...rest}
        />
      );
    case PB_CARD_TYPE.FLIGHT_RETURN:
      return (
        <PBProductListCard
          type={type || product.type}
          HeadingIcon={getPBCardIcon(product.type)}
          {...rest}
        />
      );
    case PB_CARD_TYPE.STAY:
    case PB_CARD_TYPE.STAY_PRODUCT:
      return (
        <PBProductListCard
          type={type || product.type}
          HeadingIcon={getPBCardIcon(product.type)}
          {...rest}
        />
      );
    case PB_CARD_TYPE.TOUR:
      return (
        <PBProductListCard
          type={type || product.type}
          HeadingIcon={getPBCardIcon(product.type)}
          {...rest}
        />
      );
    default:
      return null;
  }
};

const StyledScrollSnapCarousel = styled(ScrollSnapCarousel)`
  max-width: 100%;
  padding-right: ${gutters.small}px;
  ${StyledScrollSnapRow} {
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

export const PBProductCards = ({ products }: { products?: PostBookingTypes.ProductCard[] }) => {
  if (products?.length) {
    const withCarousel = products.some(
      p => p.type === PB_CARD_TYPE.BAR || p.type === PB_CARD_TYPE.RESTAURANT
    );

    const renderedProducts = products.map(product => {
      return <PBProductCard product={product} key={product.id} />;
    });

    if (withCarousel) {
      return (
        <StyledPBProductCardsWrapper noMaxWidthOnMobile>
          <StyledScrollSnapCarousel
            itemsPerPage={3}
            mobileRows={1}
            mobileCardWidth={292}
            columnSizes={{
              small: 1 / 3,
              large: 1 / 3,
              desktop: 1 / 3,
            }}
          >
            {renderedProducts}
          </StyledScrollSnapCarousel>
        </StyledPBProductCardsWrapper>
      );
    }

    return <StyledPBProductCardsWrapper>{renderedProducts}</StyledPBProductCardsWrapper>;
  }

  return null;
};
