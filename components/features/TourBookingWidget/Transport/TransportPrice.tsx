import React, { memo } from "react";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import { css } from "@emotion/core";

import ToggleButton from "components/ui/Inputs/ToggleButton";
import { useCurrencyWithDefault } from "hooks/useCurrency";
import currencyFormatter from "utils/currencyFormatUtils";
import { Trans, useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { greyColor } from "styles/variables";
import { typographyBody2, typographySubtitle1, typographySubtitle2 } from "styles/typography";
import { mqMin } from "styles/base";

const PickupPriceWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px 0;
`;

const PickupPriceContainer = styled.div(({ theme }) => [
  typographySubtitle1,
  css`
    display: flex;
    flex-direction: column;
    color: ${theme.colors.primary};
    ${mqMin.large} {
      color: ${rgba(greyColor, 0.9)};
      ${typographyBody2};
    }
  `,
]);

const Price = styled.div(({ theme }) => [
  typographySubtitle2,
  css`
    color: ${theme.colors.action};
  `,
]);

type Props = {
  setHasPickup: (hasPickup: boolean) => void;
  hasPickup: boolean;
  pickupPrice: number;
};

const TransportPrice = ({ hasPickup, setHasPickup, pickupPrice }: Props) => {
  const { currencyCode, convertCurrency } = useCurrencyWithDefault();
  const { t } = useTranslation();
  return (
    <PickupPriceWrapper>
      <PickupPriceContainer>
        <Trans ns={Namespaces.tourBookingWidgetNs}>Pickup</Trans>
        <Price>
          {pickupPrice === 0
            ? t("Free")
            : `+ ${currencyFormatter(convertCurrency(pickupPrice))} ${currencyCode} `}
        </Price>
      </PickupPriceContainer>
      <ToggleButton
        checked={hasPickup}
        onChange={setHasPickup}
        onValue={t("Yes")}
        offValue={t("No")}
        id="toggleTransportButton"
      />
    </PickupPriceWrapper>
  );
};

export default memo(TransportPrice);
