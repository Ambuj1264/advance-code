import React, { memo } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import IncrementPickerInput from "./IncrementPickerInput";

import { useCurrencyWithDefault } from "hooks/useCurrency";
import { Trans } from "i18n";
import { blackColor, greyColor, gutters } from "styles/variables";
import currencyFormatter from "utils/currencyFormatUtils";
import { typographyBody2, typographySubtitle2 } from "styles/typography";
import { Namespaces } from "shared/namespaces";

type Props = {
  id: string;
  title: string;
  count: number;
  price?: number;
  onChange: (value: number) => void;
  canIncrement: boolean;
  canDecrement: boolean;
  className?: string;
  perPerson?: boolean;
  customPrice?: string;
  additionalInformation?: React.ReactNode;
  Icon?: React.ElementType;
  dataTestid?: string;
};

const Price = styled.span(
  typographySubtitle2,
  ({ theme }) =>
    css`
      color: ${theme.colors.action};
    `
);

export const Header = styled.div`
  display: flex;
  align-items: center;
  padding-right: 5px;
  color: ${rgba(blackColor, 0.7)};
  :first-letter {
    text-transform: uppercase;
  }
`;

const HeaderWrapper = styled.div([
  typographyBody2,
  css`
    display: flex;
    flex-direction: column;
    color: ${greyColor};
  `,
]);

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const iconStyles = css`
  margin-right: ${gutters.small / 2}px;
  width: 16px;
  fill: ${greyColor};
`;

const IncrementPickerPrice = ({
  price,
  customPrice,
  convertCurrency,
  currencyCode,
  perPerson,
}: {
  price?: number;
  customPrice?: string;
  convertCurrency: (price: number) => number;
  currencyCode: string;
  perPerson?: boolean;
}) => {
  if (price === undefined) {
    return null;
  }

  if (price === 0) {
    return (
      <Price>
        <Trans>Free</Trans>
      </Price>
    );
  }

  if (customPrice) {
    return (
      <div>
        <Price>{customPrice}</Price>
      </div>
    );
  }

  return (
    <div>
      <Trans
        ns={Namespaces.tourBookingWidgetNs}
        i18nKey="perPerson"
        values={{
          price: `${currencyFormatter(convertCurrency(price))} ${currencyCode} `,
          perPerson,
        }}
        components={[<Price />]}
      />
    </div>
  );
};

const IncrementPicker = ({
  id,
  title,
  count,
  onChange,
  price,
  canIncrement,
  canDecrement,
  className,
  perPerson = true,
  customPrice,
  additionalInformation,
  Icon,
  dataTestid,
}: Props) => {
  const { currencyCode, convertCurrency } = useCurrencyWithDefault();
  return (
    <Wrapper className={className} data-testid={dataTestid}>
      <HeaderWrapper>
        <Header>
          {Icon && <Icon css={iconStyles} />}
          {title}
        </Header>
        {additionalInformation}
        <IncrementPickerPrice
          price={price}
          customPrice={customPrice}
          convertCurrency={convertCurrency}
          currencyCode={currencyCode}
          perPerson={perPerson}
        />
      </HeaderWrapper>
      <IncrementPickerInput
        id={id}
        canIncrement={canIncrement}
        canDecrement={canDecrement}
        count={count}
        onChange={onChange}
      />
    </Wrapper>
  );
};

export default memo(IncrementPicker);
