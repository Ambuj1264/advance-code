import React, { useContext } from "react";
import { ApolloError } from "apollo-client";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { useQuery } from "@apollo/react-hooks";

import { VPCarStateContext } from "../contexts/VPCarStateContext";

import { constructCar } from "components/features/Car/utils/carUtils";
import { getFormattedDate, isoFormat } from "utils/dateUtils";
import { useSettings } from "contexts/SettingsContext";
import { CarProvider, Marketplace } from "types/enums";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { useCurrencyWithDefault } from "hooks/useCurrency";
import useActiveLocale from "hooks/useActiveLocale";
import CarContent from "components/features/Car/CarContent";
import { column, mqMax } from "styles/base";
import { gutters } from "styles/variables";
import CarOfferQuery from "components/features/Car/queries/CarOfferQuery.graphql";
import CarBookingWidgetConstantContext from "components/features/Car/CarBookingWidget/contexts/CarBookingWidgetConstantContext";
import ProductContentLoading from "components/ui/ProductPageLoading/ProductContentLoading";

const Wrapper = styled.div`
  margin: -${gutters.small / 2}px;
  margin-top: ${gutters.large}px;

  ${mqMax.large} {
    margin: 0 -${gutters.small + gutters.small / 2}px;
    margin-top: ${gutters.small}px;
  }
`;

const MarginFix = styled.div`
  margin-top: ${gutters.large}px;

  ${mqMax.large} {
    margin-top: ${gutters.small}px;
  }
`;

const StyledCarContent = styled(CarContent)(
  css`
    ${column({ small: 1, large: 1, desktop: 1 })};
  `
);

const VPCarInfoModalContent = ({
  carProvider,
  isLoading = false,
  isError,
  carOfferData,
  carId,
}: {
  carProvider: CarProvider;
  isLoading?: boolean;
  isError?: ApolloError;
  carOfferData?: CarTypes.QueryCarOfferData;
  carId?: string;
}) => {
  const { marketplace } = useSettings();
  const { t } = useTranslation(Namespaces.commonCarNs);
  const { t: carnectT } = useTranslation(Namespaces.carnectNs);
  const { t: carT } = useTranslation(Namespaces.carNs);
  const { currencyCode, convertCurrency } = useCurrencyWithDefault();
  const isCarnect = carProvider === CarProvider.CARNECT;
  const activeLocale = useActiveLocale();

  const {
    pickupId,
    dropoffId,
    from: carFromDate,
    to: carToDate,
  } = useContext(CarBookingWidgetConstantContext);

  const dateFromISO = getFormattedDate(carFromDate, isoFormat);
  const dateToISO = getFormattedDate(carToDate, isoFormat);

  const {
    data: offerData,
    error: offerError,
    loading: offerLoading,
  } = useQuery<CarTypes.QueryCarOfferData>(CarOfferQuery, {
    skip: !carId,
    variables: {
      input: {
        offerReference: carId,
        provider: CarProvider.CARNECT,
        from: dateFromISO,
        to: dateToISO,
        pickupLocationId: String(pickupId),
        returnLocationId: String(dropoffId),
      },
    },
  });
  const { selectedCarOffer } = useContext(VPCarStateContext);

  if (isError || offerError) {
    return null;
  }

  if (isLoading || !selectedCarOffer || offerLoading) {
    return (
      <MarginFix>
        <ProductContentLoading showReviews={false} />
      </MarginFix>
    );
  }
  const { includedItems, availableExtrasItems, availableInsurancesItems, deposit } =
    selectedCarOffer;

  const car = constructCar(
    marketplace === Marketplace.GUIDE_TO_ICELAND,
    t,
    carnectT,
    carT,
    convertCurrency,
    currencyCode,
    carId ? offerData : carOfferData
  );

  return (
    <Wrapper>
      <StyledCarContent
        car={car}
        includedItems={includedItems}
        availableExtrasItems={availableExtrasItems}
        availableInsurancesItems={availableInsurancesItems}
        deposit={deposit}
        isCarnect={isCarnect}
        activeLocale={activeLocale}
        isModalView
        useAlternateStaticImageOnly
      />
    </Wrapper>
  );
};

export default VPCarInfoModalContent;
