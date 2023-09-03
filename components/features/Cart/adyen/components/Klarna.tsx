import React, { useCallback, useEffect, useState } from "react";
import Core from "@adyen/adyen-web/dist/types/core";

import { PaymentMethodType } from "../../types/cartEnums";
import { PaymentMethodContainer } from "../adyenStyles";

import DropdownLeft from "components/ui/Inputs/Dropdown/DropdownLeft";
import DropdownOption from "components/ui/Inputs/Dropdown/DropdownOption";

const KLARNA_PAY_CONTAINER = "klarna-container";

const Klarna = ({
  checkoutRef,
  adyenRef,
  paymentMethods,
  activePaymentMethod,
}: {
  checkoutRef: React.RefObject<Core>;
  adyenRef: React.MutableRefObject<CartTypes.AdyenRefType | null>;
  paymentMethods: CartTypes.PaymentMethod[];
  activePaymentMethod: CartTypes.PaymentMethod;
}) => {
  const klarnaPaymentMethods = paymentMethods.filter(
    paymentMethod =>
      paymentMethod.type === PaymentMethodType.KLARNA_PAY_NOW ||
      paymentMethod.type === PaymentMethodType.KLARNA_PAY_LATER ||
      paymentMethod.type === PaymentMethodType.KLARNA_PAY_OVER
  );
  const [selectedValue, setSelectedValue] = useState<PaymentMethodType>(
    klarnaPaymentMethods[0].type
  );
  const options = klarnaPaymentMethods.map(value => {
    return {
      value: value.type,
      nativeLabel: value.name,
      label: (
        <DropdownOption
          id={value.type}
          isSelected={selectedValue === value.type}
          label={value.name}
        />
      ),
    };
  });

  useEffect(() => {
    if (checkoutRef.current && selectedValue) {
      // eslint-disable-next-line no-param-reassign
      adyenRef.current = {
        ...adyenRef.current,
        [activePaymentMethod.type]: checkoutRef.current
          .create(selectedValue)
          .mount(`#${KLARNA_PAY_CONTAINER}`),
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedValue, checkoutRef]);

  const handleChange = useCallback(
    activePaymentMethodType => {
      const activeKlarnaPaymentMethod = paymentMethods.find(
        paymentMethod => paymentMethod.type === activePaymentMethodType
      );

      if (activeKlarnaPaymentMethod) {
        setSelectedValue(activePaymentMethodType);
      }
    },
    [paymentMethods]
  );

  return (
    <>
      <PaymentMethodContainer id={KLARNA_PAY_CONTAINER} />
      <DropdownLeft
        id="klarna-dropdown"
        onChange={handleChange}
        options={options}
        selectedValue={selectedValue}
        useRadioOption={false}
        noDefaultValue={false}
        isSearchable
      />
    </>
  );
};

export default Klarna;
