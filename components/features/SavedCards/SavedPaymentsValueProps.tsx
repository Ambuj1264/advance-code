import React from "react";
import styled from "@emotion/styled";

import LockIcon from "components/icons/lock-2.svg";
import CreditCardIcon from "components/icons/credit-card-check.svg";
import CreditCardNo from "components/icons/credit-card-cross.svg";
import ErrorBoundary from "components/ui/ErrorBoundary";
import ProductPropositions from "components/ui/ProductPropositions";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";

const StyledProductPropositions = styled(ProductPropositions)`
  margin: auto;
  max-width: 700px;
  background-color: transparent;
`;

const SavedPaymentsValueProps = () => {
  const { t } = useTranslation(Namespaces.userProfileNs);
  const props = [
    {
      title: t("Secure payments"),
      Icon: LockIcon,
    },
    {
      title: t("No credit card fees"),
      Icon: CreditCardIcon,
    },
    {
      title: t("No booking fees"),
      Icon: CreditCardNo,
    },
  ];
  return (
    <ErrorBoundary>
      <StyledProductPropositions
        productProps={props}
        maxDesktopColumns={3}
        useTruncationIcon={false}
      />
    </ErrorBoundary>
  );
};

export default SavedPaymentsValueProps;
