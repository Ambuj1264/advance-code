import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import Button from "@travelshift/ui/components/Inputs/Button";
import { useTheme } from "emotion-theming";
import Bubbles from "@travelshift/ui/components/Bubbles/Bubbles";

import { Container, ModalContentWrapper } from "../Modal/Modal";

import { DefaultMarginTop, mqMin } from "styles/base";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { typographySubtitle1 } from "styles/typography";
import { borderRadius20, borderRadiusBig, gutters } from "styles/variables";
import CartOptionModal from "components/features/Cart/CartOptionModal";

const StyledModal = styled(CartOptionModal)`
  margin-right: ${gutters.small}px;
  margin-left: ${gutters.small}px;
  height: auto;
  ${mqMin.large} {
    max-height: 205px;
  }
  ${Container} {
    border-radius: ${borderRadiusBig};
    width: auto;
    max-width: 100%;
    height: 100%;
    padding-bottom: ${gutters.large}px;
    ${mqMin.large} {
      min-width: 400px;
      max-width: 650px;
      height: auto;
    }
  }
  ${ModalContentWrapper} {
    height: auto;
  }
`;

const StyledButton = styled(Button, {
  shouldForwardProp: () => true,
})(
  () => css`
    border-radius: ${borderRadius20};
  `
);

const ButtonWrapper = styled.div`
  width: 50%;
  & + & {
    margin-left: ${gutters.small}px;
  }
`;

const Wrapper = styled.div([
  DefaultMarginTop,
  css`
    display: flex;
  `,
]);

const ModalHeading = styled.div(({ theme }) => [
  typographySubtitle1,
  css`
    padding: ${gutters.small}px 0;
    color: ${theme.colors.primary};
    text-align: center;
  `,
]);

const ConfirmationModal = ({
  onClose,
  title,
  BodyText,
  Icon,
  loading,
  onConfirmClick,
}: {
  onClose: () => void;
  title: string;
  BodyText: string;
  Icon: React.ElementType<any>;
  loading?: boolean;
  onConfirmClick?: () => void;
}) => {
  const { t } = useTranslation(Namespaces.userProfileNs);
  const theme: Theme = useTheme();
  return (
    <StyledModal id="confirmDeletionModal" onClose={onClose} title={title} Icon={Icon}>
      <ModalHeading theme={theme}>{t(BodyText)}</ModalHeading>
      <Wrapper>
        <ButtonWrapper>
          <StyledButton theme={theme} color="action" onClick={onConfirmClick} disabled={loading}>
            {!loading ? t("Confirm") : <Bubbles />}
          </StyledButton>
        </ButtonWrapper>
        <ButtonWrapper>
          <StyledButton theme={theme} color="error" onClick={onClose}>
            {t("Cancel")}
          </StyledButton>
        </ButtonWrapper>
      </Wrapper>
    </StyledModal>
  );
};
export default ConfirmationModal;
