import React, { ReactNode } from "react";
import { useTheme } from "emotion-theming";
import styled from "@emotion/styled";

import { useScrollTopOnUnmount } from "./utils/filtersUtils";

import Modal, {
  ModalHeader,
  CloseButton,
  ModalContentWrapper,
  ModalFooterContainer,
  ModalBodyContainer,
} from "components/ui/Modal/Modal";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import Button from "components/ui/Inputs/Button";
import { ButtonSize } from "types/enums";
import { guttersPx } from "styles/variables";

const StyledModalContainer = styled(ModalBodyContainer)`
  padding-top: ${guttersPx.large};
`;

const FilterModal = ({
  children,
  onClose,
  totalResults,
  isLoading,
}: {
  children: ReactNode;
  onClose: () => void;
  totalResults?: number;
  isLoading: boolean;
}) => {
  const { t } = useTranslation(Namespaces.commonSearchNs);
  const filterByText = t("Filter by");
  const id = "filter-modal";
  const theme: Theme = useTheme();
  const seeNumberOfResults = totalResults
    ? t(`See {totalResults} results`, {
        totalResults,
      })
    : t("See results");

  useScrollTopOnUnmount(isLoading, totalResults);

  const modalFooter = (
    <ModalFooterContainer>
      <Button
        id="filterModalButton"
        disabled={false}
        color="action"
        buttonSize={ButtonSize.Small}
        theme={theme}
        type="button"
        onClick={onClose}
        loading={isLoading}
      >
        {seeNumberOfResults}
      </Button>
    </ModalFooterContainer>
  );

  return (
    <Modal id={id} onClose={onClose}>
      <ModalHeader title={filterByText} rightButton={<CloseButton onClick={onClose} />} />
      <ModalContentWrapper>
        <StyledModalContainer>{children}</StyledModalContainer>
      </ModalContentWrapper>
      {modalFooter}
    </Modal>
  );
};

export default FilterModal;
