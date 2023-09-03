import React from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import { withTheme } from "emotion-theming";
import Button from "@travelshift/ui/components/Inputs/Button";

import ToggleButton from "components/ui/Inputs/ToggleButton";
import Modal, {
  ModalFooterContainer,
  ModalContentWrapper,
  ModalHeader,
  CloseButton,
} from "components/ui/Modal/Modal";
import { ButtonSize } from "types/enums";
import { typographyBody2 } from "styles/typography";
import { gutters, blackColor } from "styles/variables";
import useToggle from "hooks/useToggle";

const ToggleButtonWrapper = styled.div`
  display: flex;
  margin: ${gutters.large}px 0;
`;

const ToggleButtonLabel = styled.p([
  typographyBody2,
  css`
    margin-left: ${gutters.small}px;
    color: ${rgba(blackColor, 0.7)};
  `,
]);

const IndexingModal = withTheme(
  ({
    isIndexedInitial,
    toggle,
    theme,
    handleSubmit,
    isLoading,
  }: {
    isIndexedInitial: boolean;
    toggle: () => void;
    theme: Theme;
    handleSubmit: (isIndexed: boolean) => void;
    isLoading: boolean;
  }) => {
    const [isIndexed, toggleIsIndexed] = useToggle(isIndexedInitial);

    return (
      <Modal id="adminGearIndexingModal" onClose={toggle} noMinHeight>
        <ModalHeader title="Page Indexation" rightButton={<CloseButton onClick={toggle} />} />
        <ModalContentWrapper>
          <ToggleButtonWrapper>
            <ToggleButton
              id="adminGearIndexingModalToggle"
              checked={isIndexed}
              offValue="No-index"
              onValue="Index"
              onChange={toggleIsIndexed}
            />
            <ToggleButtonLabel>Should this page be visible in search engines?</ToggleButtonLabel>
          </ToggleButtonWrapper>
        </ModalContentWrapper>
        <ModalFooterContainer>
          <Button
            onClick={() => handleSubmit(isIndexed)}
            theme={theme}
            buttonSize={ButtonSize.Medium}
            loading={isLoading}
          >
            Apply changes
          </Button>
        </ModalFooterContainer>
      </Modal>
    );
  }
);

export default IndexingModal;
