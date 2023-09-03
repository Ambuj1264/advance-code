import React, { memo } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { Option, isSome, getOrElse } from "fp-ts/lib/Option";

import { whiteColor, gutters, borderRadius, zIndex } from "styles/variables";
import { typographySubtitle2 } from "styles/typography";
import { Namespaces } from "shared/namespaces";
import { Trans } from "i18n";

export const BannerText = styled.span`
  margin-left: ${gutters.small / 2}px;
  color: ${whiteColor};
`;

const Wrapper = styled.div<{ hasDiscount: boolean }>(({ theme, hasDiscount }) => [
  typographySubtitle2,
  css`
    position: relative;
    z-index: ${zIndex.z3};
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: ${borderRadius} ${borderRadius} 0 0;
    height: 36px;
    padding: ${gutters.large / 2}px 0px;
    background-color: ${hasDiscount ? theme.colors.action : theme.colors.primary};
  `,
]);

const getBannerText = (discount: Option<number>, hasSelectedDates: boolean) => {
  const hasDiscount = isSome(discount);
  if (hasDiscount) {
    return (
      <Trans
        ns={Namespaces.commonBookingWidgetNs}
        defaults="{discountPercentage} discount"
        values={{ discountPercentage: `${getOrElse(() => 0)(discount)}%` }}
      />
    );
  }
  if (hasSelectedDates) {
    return <Trans>Travel details</Trans>;
  }
  return <Trans>Select travel details</Trans>;
};

const BookingWidgetTopBanner = ({
  hasSelectedDates,
  discount,
}: {
  hasSelectedDates: boolean;
  discount: Option<number>;
}) => {
  return (
    <Wrapper hasDiscount={isSome(discount)}>
      <BannerText>{getBannerText(discount, hasSelectedDates)}</BannerText>
    </Wrapper>
  );
};

export default memo(BookingWidgetTopBanner);
