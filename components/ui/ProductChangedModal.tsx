import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { useTheme } from "emotion-theming";
import Close from "@travelshift/ui/icons/close.svg";

import FooterImage from "components/features/Footer/FooterImage";
import Modal, { ModalContentWrapper, ModalBodyContainer } from "components/ui/Modal/Modal";
import Button from "components/ui/Inputs/Button";
import { gutters, greyColor } from "styles/variables";
import SectionHeading from "components/ui/Section/SectionHeading";
import { typographyBody1 } from "styles/typography";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${gutters.large}px;
  button,
  a {
    width: 250px;
  }
`;

const CloseIcon = styled(Close)`
  width: 16px;
  height: 16px;
  fill: ${greyColor};
`;

const CloseButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  height: 43px;
  padding: ${gutters.small}px;
`;

const Description = styled.div(
  typographyBody1,
  css`
    margin-top: ${gutters.small / 2}px;
    max-width: 700px;
    text-align: center;
  `
);

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${greyColor};
`;

export const ProductChangedContent = ({
  isInvalid,
  title,
  description,
  onButtonClick,
  searchUrl,
  namespace = Namespaces.flightNs,
}: {
  isInvalid: boolean;
  title: string;
  description: string;
  onButtonClick?: () => void;
  searchUrl: string;
  namespace?: Namespaces;
}) => {
  const { t } = useTranslation(namespace);
  const theme: Theme = useTheme();
  const buttonText = isInvalid ? t("Search again") : t("Accept and continue");
  const actionButton = (
    <Button
      color="action"
      theme={theme}
      onClick={onButtonClick}
      href={isInvalid ? searchUrl : undefined}
    >
      {buttonText}
    </Button>
  );
  return (
    <ContentWrapper>
      <SectionHeading>{title}</SectionHeading>
      <Description>{description}</Description>
      <ButtonWrapper>{actionButton}</ButtonWrapper>
    </ContentWrapper>
  );
};

const ProductChangedModal = ({
  isInvalid,
  title,
  description,
  searchUrl,
  onModalClose,
  namespace,
}: {
  isInvalid: boolean;
  title: string;
  description: string;
  searchUrl: string;
  onModalClose?: () => void;
  namespace?: Namespaces;
}) => {
  return (
    <Modal
      id="productChangedModal"
      onClose={() => (!isInvalid && onModalClose ? onModalClose() : undefined)}
      disableCloseOnOutsideClick={isInvalid}
      noMinHeight
    >
      <CloseButtonWrapper>
        {!isInvalid && (
          <button id="productChangedModalClose" type="button" onClick={onModalClose}>
            <CloseIcon />
          </button>
        )}
      </CloseButtonWrapper>

      <ModalContentWrapper>
        <ModalBodyContainer>
          <ProductChangedContent
            isInvalid={isInvalid}
            title={title}
            description={description}
            onButtonClick={isInvalid ? undefined : onModalClose}
            searchUrl={searchUrl}
            namespace={namespace}
          />
        </ModalBodyContainer>
      </ModalContentWrapper>
      <FooterImage />
    </Modal>
  );
};

export default ProductChangedModal;
