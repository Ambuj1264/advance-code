import React, { useCallback } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { useTranslation } from "react-i18next";

import TermsOfServiceCheckbox from "./TermsOfServiceCheckbox";
import TermsModal from "./TermsModal";

import { column, mqMin } from "styles/base";
import useToggle from "hooks/useToggle";
import { gutters } from "styles/variables";
import Checkbox from "components/ui/Inputs/Checkbox";
import { Namespaces } from "shared/namespaces";

const LastCheckboxWrapper = styled.div<{ disableTopMargin: boolean }>(({ disableTopMargin }) => [
  column({ small: 1 }),
  css`
    display: flex;
    flex-direction: column-reverse;
    flex-wrap: wrap;
    justify-content: flex-start;
    margin-top: ${disableTopMargin ? 0 : gutters.small / 2}px;

    ${mqMin.large} {
      flex-direction: row;
    }
  `,
]);

const StyledTermsOfServiceCheckbox = styled(TermsOfServiceCheckbox)`
  margin-right: ${gutters.large}px;
`;

const StyledCheckbox = styled(Checkbox)`
  margin-bottom: ${gutters.small}px;

  ${mqMin.large} {
    margin-bottom: 0;
  }
`;

const PaymentFooterCheckboxes = ({
  termsAgreed,
  handleChange,
  hasError,
  saveCard,
  canShowSaveCard = false,
  disableTopMargin,
}: {
  termsAgreed: boolean;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  hasError: boolean;
  saveCard: boolean;
  canShowSaveCard: boolean;
  disableTopMargin: boolean;
}) => {
  const [showTermsModal, toggleShowTermsModal] = useToggle();
  const { t } = useTranslation(Namespaces.cartNs);

  const handleStoreCard = useCallback(
    (checked: boolean) => {
      handleChange({
        target: {
          value: "",
          checked,
          type: "checkbox",
          name: "saveCard",
        },
      } as React.ChangeEvent<HTMLInputElement>);
    },
    [handleChange]
  );
  return (
    <>
      <LastCheckboxWrapper disableTopMargin={disableTopMargin}>
        <StyledTermsOfServiceCheckbox
          termsAgreed={termsAgreed}
          handleChange={handleChange}
          hasError={hasError}
          onTermsClick={toggleShowTermsModal}
        />
        {canShowSaveCard && (
          <StyledCheckbox
            id="saveCard"
            name="saveCard"
            label={t("Save for next time")}
            checked={saveCard}
            onChange={handleStoreCard}
          />
        )}
      </LastCheckboxWrapper>
      {showTermsModal && <TermsModal onClose={toggleShowTermsModal} />}
    </>
  );
};

export default PaymentFooterCheckboxes;
