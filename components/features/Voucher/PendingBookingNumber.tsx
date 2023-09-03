import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import HourGlassIcon from "components/icons/hour-glass.svg";
import { gutters } from "styles/variables";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";

const StyledHourGlassIcon = styled(HourGlassIcon)(
  ({ theme }) => css`
    margin-right: ${gutters.small / 2}px;
    width: 18px;
    height: 18px;
    fill: ${theme.colors.primary};
  `
);

const Wrapper = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    color: ${theme.colors.primary};
  `
);

const PendingBookingNumber = ({ paymentMethod }: { paymentMethod: string }) => {
  const { t } = useTranslation(Namespaces.orderNs);
  return (
    <Wrapper>
      <StyledHourGlassIcon />
      {t("Waiting on confirmation from {paymentMethod}", { paymentMethod })}
    </Wrapper>
  );
};

export default PendingBookingNumber;
