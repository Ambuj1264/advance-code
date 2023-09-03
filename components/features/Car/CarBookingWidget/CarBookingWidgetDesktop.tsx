import React, { useContext, useState, useEffect } from "react";
import styled from "@emotion/styled";
import { fromNullable, none } from "fp-ts/lib/Option";
import rgba from "polished/lib/color/rgba";
import { css } from "@emotion/core";

import CarBookingWidgetStateContext from "./contexts/CarBookingWidgetStateContext";
import CarBookingWidgetConstantContext from "./contexts/CarBookingWidgetConstantContext";
import TravelDetailsContainer from "./TravelDetails/TravelDetailsContainer";
import ExtrasContainer from "./Options/Extras/ExtrasContainer";
import InsurancesContainer from "./Options/Insurances/InsurancesContainer";
import PickupDetailsContainer from "./Options/PickupDetails/PickupDetailsContainer";
import CarBookingWidgetPriceBreakdown from "./CarBookingWidgetPriceBreakdown";
import AirportPickupDetailsContainer from "./Options/PickupDetails/AirportPickupDetailsContainer";

import currencyFormatter, { formatPriceAsInt, roundPrice } from "utils/currencyFormatUtils";
import BookingWidgetDesktopContainer from "components/ui/BookingWidget/BookingWidgetDesktopContainer";
import { useCurrencyWithDefault } from "hooks/useCurrency";
import { Namespaces } from "shared/namespaces";
import { Trans, useTranslation } from "i18n";
import { gutters, blackColor } from "styles/variables";
import { typographySubtitle2 } from "styles/typography";
import { checkShouldFormatPrice } from "utils/helperUtils";

const BookingWidgetBody = styled.div`
  margin: 0 ${gutters.large}px ${gutters.large}px ${gutters.large}px;
`;

const PriceText = styled.div`
  display: block;
`;

const PayNowPrice = styled.span([
  typographySubtitle2,
  css`
    margin-right: ${gutters.small / 4}px;
    color: ${rgba(blackColor, 0.7)};
    font-weight: bold;
  `,
]);

const CarBookingWidgetDesktop = ({
  selectedExtras,
  onSetSelectedExtra,
  extras,
  selectedInsurances,
  onSetSelectedInsurance,
  insurances,
  onSetSelectedExtraQuestionAnswers,
  formError,
}: {
  selectedExtras: CarBookingWidgetTypes.SelectedExtra[];
  onSetSelectedExtra: CarBookingWidgetTypes.OnSetSelectedExtra;
  extras: OptionsTypes.Option[];
  selectedInsurances: CarBookingWidgetTypes.SelectedInsurance[];
  onSetSelectedInsurance: CarBookingWidgetTypes.OnSetSelectedInsurance;
  insurances: OptionsTypes.Option[];
  onSetSelectedExtraQuestionAnswers: CarBookingWidgetTypes.OnSetSelectedExtraQuestionAnswers;
  formError?: string;
}) => {
  const {
    price,
    isFormLoading,
    isPriceLoading,
    fullPrice,
    priceOnArrival,
    payOnArrival,
    priceBreakdown,
  } = useContext(CarBookingWidgetStateContext);
  const { priceSubtext, discount, isCarnect } = useContext(CarBookingWidgetConstantContext);

  const { currencyCode, convertCurrency } = useCurrencyWithDefault();
  const { t } = useTranslation(Namespaces.carBookingWidgetNs);
  const { t: commonT } = useTranslation(Namespaces.commonBookingWidgetNs);
  const loading = isPriceLoading;
  const shouldFormatPrice = checkShouldFormatPrice(isCarnect, currencyCode);
  const [footerAdditionalHeight, setFooterAdditionalHeight] = useState(0);
  useEffect(() => {
    if (payOnArrival.length === 0) {
      setFooterAdditionalHeight(0);
    }
  }, [payOnArrival]);
  const convertedPrice = convertCurrency(price);
  const formattedPrice = formatPriceAsInt(convertedPrice, shouldFormatPrice);
  const convertedFullPrice = fullPrice ? convertCurrency(fullPrice) : undefined;
  const convertedPriceOnArrival = convertCurrency(priceOnArrival);
  return (
    <BookingWidgetDesktopContainer
      footerText={commonT("Continue to book")}
      fullPrice={convertedFullPrice}
      price={formattedPrice}
      discount={discount === 0 ? none : fromNullable(discount)}
      isPriceLoading={loading}
      isFormLoading={isFormLoading}
      isTotalPrice
      currency={currencyCode}
      priceSubtext={priceSubtext}
      shouldFormatPrice={shouldFormatPrice}
      priceOnArrival={convertedPriceOnArrival}
      error={formError}
      footerPriceInfo={
        priceOnArrival > 0 ? (
          <PriceText>
            <Trans
              ns={Namespaces.carBookingWidgetNs}
              i18nKey="Pay now {price}"
              defaults="Pay now <0>{price}</0>"
              components={[<PayNowPrice>price</PayNowPrice>]}
              values={{
                price: shouldFormatPrice
                  ? currencyFormatter(convertedPrice)
                  : roundPrice(convertedPrice),
              }}
            />
            {currencyCode}
          </PriceText>
        ) : undefined
      }
      footerBelowContent={
        payOnArrival.length > 0 ? (
          <CarBookingWidgetPriceBreakdown
            payOnArrivalItems={payOnArrival}
            payNowItems={priceBreakdown}
            currency={currencyCode}
            shouldFormatPrice={shouldFormatPrice}
            setFooterAdditionalHeight={setFooterAdditionalHeight}
            convertCurrency={convertCurrency}
          />
        ) : undefined
      }
      footerAdditionalHeight={footerAdditionalHeight}
    >
      <BookingWidgetBody>
        <TravelDetailsContainer />
        {isCarnect ? <AirportPickupDetailsContainer /> : <PickupDetailsContainer />}
        <InsurancesContainer
          title={t("Choose insurances")}
          selectedInsurances={selectedInsurances}
          onSetSelectedInsurance={onSetSelectedInsurance}
          options={insurances}
          shouldFormatPrice={shouldFormatPrice}
        />
        <ExtrasContainer
          title={t("Choose extras")}
          selectedExtras={selectedExtras}
          onSetSelectedExtra={onSetSelectedExtra}
          options={extras}
          onSetSelectedExtraQuestionAnswers={onSetSelectedExtraQuestionAnswers}
          shouldFormatPrice={shouldFormatPrice}
        />
      </BookingWidgetBody>
    </BookingWidgetDesktopContainer>
  );
};

export default CarBookingWidgetDesktop;
