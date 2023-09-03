import React, { useRef } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { useTheme } from "emotion-theming";
import Button from "@travelshift/ui/components/Inputs/Button";

import { StyledModal as RemoveFromCartModal } from "../Cart/RemoveCartItemModal";

import { getSaveCartInfoText } from "./utils";
import { InfoText, StyledModalHeading } from "./sharedAdminComponents";

import LinkIcon from "components/icons/link.svg";
import { NavigationContainer } from "components/ui/Modal/Modal";
import { DefaultMarginTop, mqMin } from "styles/base";
import { bittersweetRedColor, gutters } from "styles/variables";
import Input from "components/ui/Inputs/Input";

const ButtonWrapper = styled.div([
  DefaultMarginTop,
  css`
    display: flex;
  `,
]);

const StyledRemoveFromCartModal = styled(RemoveFromCartModal)<{
  isError: boolean;
}>(
  ({ isError, theme }) => css`
    ${NavigationContainer} {
      background-color: ${isError ? bittersweetRedColor : theme.colors.primary};
    }
  `
);

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  margin-top: ${gutters.small}px;
  ${mqMin.large} {
    flex-direction: row;
  }
`;

const StyledInput = styled(Input)`
  width: 100%;
  input {
    width: 100%;
    white-space: unset;
    overflow: auto;
    text-overflow: unset;
  }

  ${mqMin.large} {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    width: 80%;
  }
`;

const CopyButton = styled(Button, {
  shouldForwardProp: () => true,
})`
  margin-top: ${gutters.small / 2}px;
  width: 100%;

  ${mqMin.large} {
    margin-top: 0;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    width: 20%;
    min-height: 45px;
  }
`;

const SaveCartModal = ({
  isCartLinkCopied,
  isSavingCartError,
  cartLink,
  onToggleModal,
}: {
  isCartLinkCopied: boolean;
  isSavingCartError: boolean;
  cartLink?: string;
  onToggleModal: () => void;
}) => {
  const theme: Theme = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const cartModalHeading = !isSavingCartError
    ? "Cart successfully saved"
    : "It's not possible to save the cart";
  const infoText = getSaveCartInfoText({ isSavingCartError, isCartLinkCopied });

  const onCopyClick = () => {
    const { current } = inputRef;
    if (current) {
      current.select();
      document.execCommand("copy");
    }
  };

  return (
    <StyledRemoveFromCartModal
      id="saveCartModal"
      onClose={onToggleModal}
      title="Save cart"
      isError={isSavingCartError}
    >
      <StyledModalHeading theme={theme} isError={isSavingCartError}>
        {cartModalHeading}
      </StyledModalHeading>
      <InfoText>{infoText}</InfoText>
      {!isCartLinkCopied && !isSavingCartError && (
        <InputWrapper>
          <StyledInput
            value={cartLink}
            readOnly
            id="cartLinkInput"
            Icon={LinkIcon}
            ref={inputRef}
          />
          <CopyButton theme={theme} color="action" onClick={onCopyClick}>
            Copy link
          </CopyButton>
        </InputWrapper>
      )}
      <ButtonWrapper>
        <Button theme={theme} color="action" onClick={onToggleModal}>
          Back
        </Button>
      </ButtonWrapper>
    </StyledRemoveFromCartModal>
  );
};

export default SaveCartModal;
