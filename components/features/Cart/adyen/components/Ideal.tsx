import React, { useCallback, useEffect, useState } from "react";
import Core from "@adyen/adyen-web/dist/types/core";
import styled from "@emotion/styled";

import { PaymentMethodContainer } from "../adyenStyles";

import {
  OrderPaymentEnvironment,
  PaymentMethodType,
} from "components/features/Cart/types/cartEnums";
import { getAdyenCheckoutShopperUrl } from "components/features/Cart/utils/cartUtils";
import { OptionWrapper } from "components/ui/Inputs/Dropdown/shared";
import LazyImage from "components/ui/Lazy/LazyImage";
import DropdownLeft from "components/ui/Inputs/Dropdown/DropdownLeft";

const IDEAL_CONTAINER = "ideal-container";

const StyledImage = styled(LazyImage)`
  width: 40px;
`;

const IdealIcon = ({
  iconId,
  adyenEnvironment,
}: {
  iconId: string;
  adyenEnvironment: OrderPaymentEnvironment;
}) => {
  return (
    <StyledImage
      src={`${getAdyenCheckoutShopperUrl(adyenEnvironment)}/images/logos/ideal/${iconId}.svg`}
      width={40}
      backgroundColor="transparent"
    />
  );
};

const Ideal = ({
  checkoutRef,
  adyenRef,
  paymentMethods,
  adyenEnvironment,
}: {
  checkoutRef: React.RefObject<Core>;
  adyenRef: React.MutableRefObject<CartTypes.AdyenRefType | null>;
  paymentMethods: CartTypes.PaymentMethod[];
  adyenEnvironment: OrderPaymentEnvironment;
}) => {
  const iDealPaymentMethod = paymentMethods.find(({ type }) => type === PaymentMethodType.IDEAL);

  const idealIssuers = iDealPaymentMethod?.issuers ?? [];

  const [selectedValue, setSelectedValue] = useState<string | undefined>(idealIssuers[0]?.id);

  const options = idealIssuers?.map(value => {
    return {
      value: value.id,
      nativeLabel: value.name,
      label: (
        <OptionWrapper>
          <IdealIcon iconId={value.id} adyenEnvironment={adyenEnvironment} />
          {value.name}
        </OptionWrapper>
      ),
    };
  });

  useEffect(() => {
    if (checkoutRef.current && selectedValue) {
      // eslint-disable-next-line no-param-reassign
      adyenRef.current = {
        ...adyenRef.current,
        [PaymentMethodType.IDEAL]: checkoutRef.current
          .create(PaymentMethodType.IDEAL, {
            issuer: selectedValue,
          })
          .mount(`#${IDEAL_CONTAINER}`),
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    adyenRef.current?.[PaymentMethodType.IDEAL]?.setState({
      data: {
        issuer: selectedValue,
      },
    });
  }, [adyenRef, selectedValue]);

  const handleChange = useCallback(
    (value: string) => {
      setSelectedValue(value);
    },
    [setSelectedValue]
  );

  return (
    <>
      <PaymentMethodContainer id={IDEAL_CONTAINER} />
      <DropdownLeft
        id="ideal-dropdown"
        onChange={handleChange}
        options={options}
        selectedValue={selectedValue}
        icon={
          <IdealIcon iconId={selectedValue ?? "ideal-issuer"} adyenEnvironment={adyenEnvironment} />
        }
        useRadioOption={false}
        noDefaultValue={false}
        isSearchable
      />
    </>
  );
};

export default Ideal;
