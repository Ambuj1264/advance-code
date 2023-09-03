import React from "react";
import rgba from "polished/lib/color/rgba";
import styled from "@emotion/styled";

import { getSortParametersByIndex, SectionContainer } from "./sortUtils";

import { gutters, greyColor, whiteColor } from "styles/variables";
import Modal, { ModalHeader, CloseButton } from "components/ui/Modal/Modal";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";

export const SectionLink = styled.a`
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${rgba(greyColor, 0.2)};
  width: 100%;
  padding: ${gutters.small}px 0 ${gutters.small}px ${gutters.small}px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: ${whiteColor};
`;

const SortOptionsModal = ({
  onChange,
  options,
  onClose,
  customSortParams,
}: {
  onChange?: SearchPageTypes.SortOnChangeFn;
  options: JSX.Element[];
  onClose: () => void;
  customSortParams?: SearchPageTypes.SortParameter[];
}) => {
  const { t } = useTranslation(Namespaces.tourSearchNs);
  return (
    <Modal id="sort-options-modal" onClose={onClose}>
      <ModalHeader title={t("Sort by")} rightButton={<CloseButton onClick={onClose} />} />
      <Container>
        {options.map((option, index) => (
          <SectionContainer
            key={index.toString()}
            onClick={() => {
              onChange?.(getSortParametersByIndex(index, customSortParams));
              onClose();
            }}
          >
            {option}
          </SectionContainer>
        ))}
      </Container>
    </Modal>
  );
};

export default SortOptionsModal;
