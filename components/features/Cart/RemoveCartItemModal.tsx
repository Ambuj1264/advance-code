import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import Button from "@travelshift/ui/components/Inputs/Button";
import { useTheme } from "emotion-theming";

import CartOptionModal from "./CartOptionModal";

import { Container, ModalContentWrapper } from "components/ui/Modal/Modal";
import { mqMin, DefaultMarginTop } from "styles/base";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { typographySubtitle2 } from "styles/typography";
import { gutters } from "styles/variables";

const Wrapper = styled.div([
  DefaultMarginTop,
  css`
    display: flex;
  `,
]);

const ModalHeading = styled.div(({ theme }) => [
  typographySubtitle2,
  css`
    padding: ${gutters.small}px 0;
    color: ${theme.colors.primary};
    text-align: center;
  `,
]);

export const StyledModal = styled(CartOptionModal)`
  width: auto;
  max-width: 100%;
  height: auto;
  ${mqMin.large} {
    max-width: unset;
  }
  ${Container} {
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

const ButtonWrapper = styled.div`
  width: 50%;
  & + & {
    margin-left: ${gutters.small}px;
  }
`;

const RemoveCartItemModal = ({
  onClose,
  title,
  Icon,
  onRemoveClick,
}: {
  onClose: () => void;
  title: string;
  Icon: React.ElementType<any>;
  onRemoveClick: () => void;
}) => {
  const { t } = useTranslation(Namespaces.cartNs);
  const theme: Theme = useTheme();
  return (
    <StyledModal id="removeItemModal" onClose={onClose} title={title} Icon={Icon}>
      <ModalHeading>{t("Do you want to remove this service?")}</ModalHeading>
      {t("You can also update, contact us or change your booking later.")}
      <Wrapper>
        <ButtonWrapper>
          <Button theme={theme} color="error" onClick={onRemoveClick}>
            {t("Remove")}
          </Button>
        </ButtonWrapper>
        <ButtonWrapper>
          <Button theme={theme} color="action" onClick={onClose}>
            {t("Back")}
          </Button>
        </ButtonWrapper>
      </Wrapper>
    </StyledModal>
  );
};
export default RemoveCartItemModal;
