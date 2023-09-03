import React, { useState, useEffect } from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";

import { Trans } from "i18n";
import { Namespaces } from "shared/namespaces";
import { lightRedColor, gutters } from "styles/variables";
import { typographyCaptionSmall } from "styles/typography";
import HourGlass from "components/icons/hour-glass.svg";

const Text = styled.div([
  typographyCaptionSmall,
  css`
    padding-bottom: ${gutters.small / 4}px;
    color: ${lightRedColor};
    text-align: right;
  `,
]);

const StyledHourGlass = styled(HourGlass)`
  margin-left: ${gutters.small / 4}px;
  width: 8px;
  height: 10px;
  fill: ${lightRedColor};
`;

const ExpiryTimer = ({
  numberOfSecondsUntilExpiry,
  onExpired,
  isExpired,
  shouldDisplayHours = false,
}: {
  numberOfSecondsUntilExpiry: number;
  onExpired?: () => void;
  isExpired?: boolean;
  shouldDisplayHours?: boolean;
}) => {
  const [currentNumberOfSecondsUntilExpiry, setCurrentNumberOfSecondsUntilExpiry] = useState(
    numberOfSecondsUntilExpiry
  );

  useEffect(() => {
    setCurrentNumberOfSecondsUntilExpiry(numberOfSecondsUntilExpiry);
  }, [numberOfSecondsUntilExpiry]);

  useEffect(() => {
    if (!isExpired) {
      if (currentNumberOfSecondsUntilExpiry <= 0) {
        onExpired?.();
      }
      const timer = setTimeout(() => {
        setCurrentNumberOfSecondsUntilExpiry(currentNumberOfSecondsUntilExpiry - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }, [currentNumberOfSecondsUntilExpiry, isExpired, onExpired]);

  const initialIndex = shouldDisplayHours && currentNumberOfSecondsUntilExpiry >= 3600 ? 11 : 14;
  const reservedTime = new Date(currentNumberOfSecondsUntilExpiry * 1000)
    .toISOString()
    .slice(initialIndex, 19);
  return (
    <Text>
      {!isExpired ? (
        <Trans
          ns={Namespaces.cartNs}
          i18nKey="Reserved for {reservedTime}"
          defaults="Reserved for {reservedTime}"
          values={{ reservedTime }}
        />
      ) : (
        <Trans ns={Namespaces.orderNs} i18nKey="Offer expired" defaults="Offer expired" />
      )}

      <StyledHourGlass />
    </Text>
  );
};

export default ExpiryTimer;
