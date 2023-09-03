import React, { useContext } from "react";
import { useTheme } from "emotion-theming";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import Button from "@travelshift/ui/components/Inputs/Button";

import { VPStateContext } from "./contexts/VPStateContext";
import { VPModalCallbackContext } from "./contexts/VPModalStateContext";
import VPSearchBookingSteps from "./VPSearchBookingSteps";

import BookingWidgetMobile from "components/ui/BookingWidget/BookingWidgetMobile";
import useActiveLocale from "hooks/useActiveLocale";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { getShortMonthNumbericDateFormat } from "utils/dateUtils";
import { ModalFooterContainer } from "components/ui/Modal/Modal";
import { FooterLeftColumn } from "components/ui/FrontSearchWidget/FrontStepModal";
import BookingWidgetFooterDate from "components/ui/BookingWidget/BookingWidgetFooter/BookingWidgetFooterDate";
import { ButtonSize } from "types/enums";

export const ButtonStyled = styled(Button, { shouldForwardProp: () => true })<{
  fullWidth: boolean;
}>(({ fullWidth }) => [
  !fullWidth &&
    css`
      width: 174px;
    `,
]);

const VPProductContentSearchMobileSteps = () => {
  const { t } = useTranslation(Namespaces.vacationPackageNs);
  const theme: Theme = useTheme();

  const { selectedDates } = useContext(VPStateContext);
  const { onToggleIsClosed } = useContext(VPModalCallbackContext);

  const activeLocale = useActiveLocale();

  const startDate =
    selectedDates.from && getShortMonthNumbericDateFormat(selectedDates.from, activeLocale);
  const endDate =
    selectedDates.to && getShortMonthNumbericDateFormat(selectedDates.to, activeLocale);

  const areSomeDatesSelected = Boolean(endDate && startDate);

  return (
    <BookingWidgetMobile
      onModalClose={onToggleIsClosed}
      footer={
        <ModalFooterContainer>
          <FooterLeftColumn>
            {areSomeDatesSelected && (
              <BookingWidgetFooterDate startDate={startDate!} endDate={endDate!} />
            )}
          </FooterLeftColumn>
          <ButtonStyled
            onClick={onToggleIsClosed}
            theme={theme}
            buttonSize={ButtonSize.Small}
            fullWidth={!areSomeDatesSelected}
          >
            {t("Apply")}
          </ButtonStyled>
        </ModalFooterContainer>
      }
    >
      <VPSearchBookingSteps />
    </BookingWidgetMobile>
  );
};

export default VPProductContentSearchMobileSteps;
