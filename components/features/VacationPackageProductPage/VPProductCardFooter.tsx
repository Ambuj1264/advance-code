import React, { useCallback } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import PriceWithoutTotal, { StyledPriceWrapper } from "./PriceWithoutTotal";
import VPProductCardModal from "./VPProductCardModal";
import { VPActiveModalTypes } from "./contexts/VPModalStateContext";
import { useOnToggleModal } from "./contexts/VPStateHooks";

import { borderRadiusTiny, boxShadowTileRegular, gutters, whiteColor } from "styles/variables";
import RadioButton, { RadioButtonLabel } from "components/ui/Inputs/RadioButton";
import EditIcon from "components/icons/pencil-1.svg";
import { typographyBody2Semibold } from "styles/typography";
import { skeletonPulse } from "styles/base";
import { Currency } from "components/ui/Search/Price";

export const Wrapper = styled.div<{ isSelected: boolean }>(
  ({ theme, isSelected }) => css`
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    margin-top: ${gutters.small}px;
    width: 100%;
    height: 40px;
    padding: 0 ${gutters.small}px;
    background-color: ${isSelected
      ? rgba(theme.colors.action, 0.05)
      : rgba(theme.colors.primary, 0.05)};
    ${StyledPriceWrapper}, ${Currency} {
      color: ${isSelected ? theme.colors.action : theme.colors.primary};
    }
  `
);

export const StyledEditIcon = styled(EditIcon)`
  width: 10px;
  height: 10px;
  fill: ${whiteColor};
`;

export const EditButtonWrapper = styled.div(
  ({ theme }) =>
    css`
      display: flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      margin-left: ${gutters.small / 2}px;
      box-shadow: ${boxShadowTileRegular};
      border: solid ${borderRadiusTiny} ${whiteColor};
      border-radius: 50%;
      width: 24px;
      height: 24px;
      background-color: ${theme.colors.action};
    `
);

export const TextWrapper = styled.div(({ theme }) => [
  typographyBody2Semibold,
  css`
    display: flex;
    color: ${theme.colors.action};
  `,
]);

export const LoadingFooterContent = styled.span([
  skeletonPulse,
  css`
    display: inline-block;
    width: 150px;
    height: 24px;
  `,
]);

const StyledRadioButton = styled(RadioButton)`
  ${RadioButtonLabel} {
    &:before {
      background: ${whiteColor};
    }
  }
`;

const VPProductCardFooter = ({
  productId,
  editModalId,
  price,
  className,
  radioButtonValue,
  isSelected,
  includedFooterTextContent,
  editModalContent,
  isCardDisabled,
  editModalTitle,
  isFormEditModal = false,
  formError,
  onModalClose,
}: {
  productId: number | string;
  editModalId: VPActiveModalTypes;
  price?: number;
  className?: string;
  radioButtonValue: string | number;
  isSelected: boolean;
  includedFooterTextContent: string | React.ReactNode;
  editModalContent: React.ReactNode;
  isCardDisabled: boolean;
  editModalTitle?: { Icon: React.ElementType; title: string };
  isFormEditModal?: boolean;
  formError?: string;
  onModalClose?: () => void;
}) => {
  const [isEditModalActive, toggleEditModal] = useOnToggleModal(editModalId, productId);

  const onToggleEditModal = useCallback(() => {
    onModalClose?.();
    toggleEditModal();
  }, [onModalClose, toggleEditModal]);

  const value = radioButtonValue.toString();
  return (
    <>
      {isCardDisabled || price === undefined ? (
        <Wrapper className={className} isSelected={isSelected}>
          <LoadingFooterContent />
        </Wrapper>
      ) : (
        <Wrapper className={className} isSelected={isSelected}>
          {isSelected ? (
            <TextWrapper>
              {includedFooterTextContent}
              {editModalContent && (
                <EditButtonWrapper onClick={toggleEditModal}>
                  <StyledEditIcon />
                </EditButtonWrapper>
              )}
            </TextWrapper>
          ) : (
            <StyledRadioButton
              readonly
              id={`${value}-radio-button`}
              name={`${value}-radio-button`}
              checked={isSelected}
              value={value}
              reverse
              label={<PriceWithoutTotal value={price!} />}
            />
          )}
        </Wrapper>
      )}
      {isEditModalActive && (
        <VPProductCardModal
          modalContent={editModalContent}
          modalId="editVPCardModal"
          onToggleModal={onToggleEditModal}
          modalTitle={editModalTitle}
          isForm={isFormEditModal}
          error={formError}
        />
      )}
    </>
  );
};

export default VPProductCardFooter;
