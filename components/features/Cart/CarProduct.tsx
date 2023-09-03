import React, { SyntheticEvent, useCallback } from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import { useTheme } from "emotion-theming";
import { pipe } from "fp-ts/lib/pipeable";
import Router from "next/router";

import ProductFooter, { CardFooter, StyledButton } from "./ProductFooter";
import ProductOverview from "./CartProductOverview";
import { constructCarProductProps, constructCarQuickFactsCart } from "./utils/cartUtils";
import { CardContainer } from "./sharedCartComponents";

import {
  ImgixStyled,
  ImageWrapperClientLink,
  LeftColumn as ProductLeftColumn,
  RightColumn as ProductRightColumn,
} from "components/ui/ProductCard/ProductCardOverview";
import ExpiryTimer from "components/ui/ExpiryTimer";
import { Wrapper } from "components/ui/Search/Price";
import { useCurrencyWithDefault } from "hooks/useCurrency";
import currencyFormatter from "utils/currencyFormatUtils";
import { mqMax, mqMin } from "styles/base";
import useActiveLocale from "hooks/useActiveLocale";
import CarIcon from "components/icons/car.svg";
import { fontSizeCaption, gutters } from "styles/variables";
import { Trans, useTranslation } from "i18n";
import ProductCardActionHeader from "components/ui/ProductCard/ProductCardActionHeader";
import { Namespaces } from "shared/namespaces";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import InformationIcon from "components/icons/information-circle.svg";
import { getCarSearchClientRoute } from "components/ui/Order/utils/orderUtils";
import { CarProvider } from "types/enums";
import { checkShouldFormatPrice } from "utils/helperUtils";

const infoIconStyles = (theme: Theme) => css`
  margin-right: ${gutters.small / 3}px;
  width: 12px;
  height: 12px;
  vertical-align: middle;
  fill: ${theme.colors.primary};
`;

const ProductOverviewStyled = styled(ProductOverview)<{}>`
  ${ImgixStyled} {
    width: auto;
    height: auto;
    object-fit: unset;
  }

  ${mqMin.large} {
    ${ImageWrapperClientLink} {
      height: auto;
    }

    ${ProductLeftColumn} {
      display: flex;
      align-items: center;
    }
  }
`;

const StyledCardContainer = styled(CardContainer)`
  /* Car product has white bg, so we need to remove extra paddings to make spaces looks like in other products */
  ${mqMax.large} {
    ${ProductRightColumn} {
      padding-top: 0;
    }
  }
`;

const StyledProductFooter = styled(ProductFooter, {
  shouldForwardProp: () => true,
})<{ isExpiredOffer: boolean }>(({ isExpiredOffer }) => [
  isExpiredOffer &&
    css`
      ${CardFooter} {
        min-height: 40px;
      }
    `,
  css`
    ${CardFooter} {
      flex-wrap: nowrap;
    }
    ${Wrapper} {
      display: inline-block;
    }
    ${StyledButton} {
      min-width: 114px;
      max-width: 144px;
    }
  `,
]);

const SubtitleTotal = styled.strong`
  font-size: ${fontSizeCaption};
`;

const SubtitleWrapper = styled(Wrapper)`
  height: auto;
  line-height: normal;
`;

const PriceSubtitle = ({
  value,
  displayValue,
  onInformationClick,
  isExpiredOffer,
}: {
  value: number;
  displayValue?: string;
  onInformationClick?: () => void;
  isExpiredOffer?: boolean;
}) => {
  const { currencyCode, convertCurrency } = useCurrencyWithDefault();
  const formattedPrice = displayValue || pipe(value, convertCurrency, currencyFormatter);
  const theme: Theme = useTheme();

  return (
    <SubtitleWrapper isStrikeThroughPrice={isExpiredOffer}>
      <InformationIcon
        css={infoIconStyles(theme)}
        onClick={(e: SyntheticEvent<HTMLOrSVGElement>) => {
          e.preventDefault();
          e.stopPropagation();
          onInformationClick?.();
        }}
      />
      <Trans ns={Namespaces.cartNs}>Pay on location</Trans>{" "}
      <SubtitleTotal>{formattedPrice}</SubtitleTotal> {currencyCode}
    </SubtitleWrapper>
  );
};

const CarProduct = ({
  carRental,
  className,
  onRemoveClick,
  onInformationClick,
  carSearchBaseUrl,
  onExpired,
  isExpiredOffer,
  expiredTimeDifference,
  isRemovingFromCart,
  isPriceLoading = false,
  isPaymentLink,
}: {
  carRental: OrderTypes.CarRental;
  className?: string;
  onRemoveClick?: () => void;
  onInformationClick?: () => void;
  carSearchBaseUrl: string;
  onExpired: () => void;
  isExpiredOffer: boolean;
  expiredTimeDifference?: number;
  isRemovingFromCart?: boolean;
  isPriceLoading?: boolean;
  isPaymentLink: boolean;
}) => {
  const theme: Theme = useTheme();
  const activeLocale = useActiveLocale();
  const { t } = useTranslation();
  const { t: cartT } = useTranslation(Namespaces.cartNs);
  const { t: orderT } = useTranslation(Namespaces.orderNs);
  const isMobile = useIsMobile();

  const quickFacts = constructCarQuickFactsCart(carRental, activeLocale);
  const productPropsDesktop = constructCarProductProps(cartT);
  const productPropsMobile = productPropsDesktop.slice(0, 1);

  const { currencyCode } = useCurrencyWithDefault();
  const shouldFormatPrice = checkShouldFormatPrice(
    carRental.provider === CarProvider.CARNECT,
    currencyCode
  );

  const onEdit = useCallback(() => {
    Router.push(
      {
        pathname: carRental.clientRoute.route,
        query: {
          ...carRental.clientRoute.query,
          cart_item: carRental.cartItemIdParsed,
        },
      },
      carRental.editLinkUrl,
      { shallow: true }
    );
  }, [
    carRental.cartItemIdParsed,
    carRental.clientRoute.query,
    carRental.clientRoute.route,
    carRental.editLinkUrl,
  ]);

  return (
    <StyledCardContainer
      className={className}
      isExpiredOffer={isExpiredOffer}
      data-testid="itemContainerCar"
      isRemovingAnotherItem={isRemovingFromCart}
    >
      <ProductCardActionHeader
        isExpiredOffer={isExpiredOffer}
        title={isExpiredOffer ? t("Offer expired") : orderT("Car rental")}
        Icon={CarIcon}
        onInformationClick={onInformationClick}
        onEditClick={carRental.editable && !isPaymentLink ? onEdit : undefined}
        onRemoveClick={onRemoveClick}
        disableActions={isRemovingFromCart}
      />
      <ProductOverviewStyled
        title={carRental.title}
        imageUrl={carRental.imageUrl}
        clientRoute={!isExpiredOffer ? carRental.clientRoute : undefined}
        quickFacts={quickFacts}
        iconColor={theme.colors.primary}
        namespace={Namespaces.cartNs}
        // add padding for car images, because most of them have white background
        imgixParams={{
          pad: isMobile ? gutters.small : gutters.small / 2,
          fit: "clamp",
        }}
        discountAmount={carRental.discountAmount}
        priceDiscountAmountValue={carRental.discountAmountPriceObject?.priceDisplayValue}
        priceDiscountAmountCurrency={carRental.discountAmountPriceObject?.currency}
        discountPercentage={carRental.discountPercentage}
        imageBackgroundColor="transparent"
        expiryTimer={
          expiredTimeDifference && (
            <ExpiryTimer
              numberOfSecondsUntilExpiry={expiredTimeDifference}
              onExpired={onExpired}
              isExpired={isExpiredOffer}
            />
          )
        }
      />
      <StyledProductFooter
        isExpiredOffer={isExpiredOffer}
        isPriceLoading={isPriceLoading}
        price={carRental.totalPrice}
        priceDisplayValue={carRental.priceObject?.priceDisplayValue}
        priceDisplayCurrency={carRental.priceObject?.currency}
        isPayNowPrice={!!carRental.priceOnArrival}
        clientRoute={
          !isExpiredOffer
            ? carRental.clientRoute
            : getCarSearchClientRoute(carSearchBaseUrl, carRental)
        }
        productProps={isMobile ? productPropsMobile : productPropsDesktop}
        priceSubtitle={
          carRental.priceOnArrival ? (
            <PriceSubtitle
              isExpiredOffer={isExpiredOffer}
              value={carRental.priceOnArrival}
              displayValue={carRental.priceOnArrivalPriceObject?.priceDisplayValue}
              onInformationClick={onInformationClick}
            />
          ) : undefined
        }
        shouldFormatPrice={shouldFormatPrice}
        isCarProduct
        shouldHideLoadingPrice={isPaymentLink}
      />
    </StyledCardContainer>
  );
};

export default CarProduct;
