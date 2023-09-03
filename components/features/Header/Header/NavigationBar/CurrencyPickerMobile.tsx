import React, { useState, useCallback, useEffect } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { toUndefined, some } from "fp-ts/lib/Option";

import { CurrencyPopoverContent } from "./CurrencyPickerPopover";
import { Button, IconWrapper } from "./UserMenu/UserMenuActions";

import { useTranslation } from "i18n";
import useCurrency from "hooks/useCurrency";
import { gutters, whiteColor } from "styles/variables";
import Modal, {
  ModalHeader,
  CloseButton,
  ModalContentWrapper,
  ModalBodyContainer,
} from "components/ui/Modal/Modal";
import { typographyCaptionSemibold } from "styles/typography";
import { Namespaces } from "shared/namespaces";

const StyledModalBodyContainer = styled(ModalBodyContainer)`
  margin-top: ${gutters.large}px;
`;

const IconText = styled.div(
  typographyCaptionSemibold,
  css`
    color: ${whiteColor};
  `
);

const CurrencyPickerMobile = ({ currencies }: { currencies: ReadonlyArray<Currency> }) => {
  const { currencyCode, updateActiveCurrency } = useCurrency();
  const activeCurrency = toUndefined(currencyCode);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(
    currencies.find(curr => curr.currencyCode === activeCurrency)
  );
  const { t } = useTranslation(Namespaces.headerNs);
  const onUpdateCurrency = useCallback(
    (currency: string) => {
      updateActiveCurrency(currency);
      setSelectedCurrency(currencies.find(curr => curr.currencyCode === currency));
      setIsModalOpen(false);
    },
    [updateActiveCurrency, currencies]
  );
  useEffect(() => {
    if (!selectedCurrency && some(currencyCode)) {
      setSelectedCurrency(currencies.find(curr => curr.currencyCode === toUndefined(currencyCode)));
    }
  }, [selectedCurrency, currencyCode, setSelectedCurrency, currencies]);
  return (
    <>
      {isModalOpen && (
        <Modal id="mobileCurrencyModal" onClose={() => setIsModalOpen(false)}>
          <ModalHeader
            title={t("Currencies")}
            rightButton={<CloseButton onClick={() => setIsModalOpen(false)} />}
          />
          <ModalContentWrapper>
            <StyledModalBodyContainer>
              <CurrencyPopoverContent
                currencies={currencies}
                activeCurrency={activeCurrency}
                updateActiveCurrency={onUpdateCurrency}
              />
            </StyledModalBodyContainer>
          </ModalContentWrapper>
        </Modal>
      )}
      <Button onClick={() => setIsModalOpen(true)}>
        <IconWrapper>
          <IconText>{selectedCurrency?.currencyCode}</IconText>
        </IconWrapper>
        {selectedCurrency?.name}
      </Button>
    </>
  );
};

export default CurrencyPickerMobile;
