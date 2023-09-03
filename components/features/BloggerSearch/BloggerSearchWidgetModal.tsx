import React, { useContext, SyntheticEvent } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";
import { useTheme } from "emotion-theming";

import {
  BloggerSearchPageStateContext,
  BloggerSearchPageCallbackContext,
} from "./BloggerSearchPageStateContext";

import Input from "components/ui/Inputs/Input";
import SearchIcon from "components/icons/search.svg";
import { greyColor, gutters } from "styles/variables";
import Modal, {
  ModalHeader,
  CloseButton,
  ModalContentWrapper,
  ModalFooterContainer,
} from "components/ui/Modal/Modal";
import MobileSectionHeading from "components/ui/BookingWidget/MobileSectionHeading";
import { useTranslation, Trans } from "i18n";
import { Namespaces } from "shared/namespaces";
import { ButtonSize } from "types/enums";
import Button from "components/ui/Inputs/Button";

export const InputStyled = styled(Input, { shouldForwardProp: () => true })<{
  noBorder?: boolean;
}>(({ noBorder }) => [
  css`
    margin: 0 -16px;
    width: 109%;
    input {
      z-index: 0;
      width: 100%;
      padding-top: 9px;
      padding-left: ${gutters.small * 3 + 4.57}px;
      font-size: 16px;
      transform: scale(0.875);
      transform-origin: top left;
    }
  `,
  noBorder &&
    css`
      border-bottom: 4px solid ${rgba(greyColor, 0.1)};
    `,
]);

const BloggerSearchWidgetModal = () => {
  const theme: Theme = useTheme();
  const { text } = useContext(BloggerSearchPageStateContext);
  const { t } = useTranslation(Namespaces.commonSearchNs);
  const { onInputChange, onSearchClick, onSearchWidgetModalToggle } = useContext(
    BloggerSearchPageCallbackContext
  );
  const onSearchButtonClick = (e: SyntheticEvent) => {
    onSearchClick(e);
    onSearchWidgetModalToggle();
  };
  return (
    <Modal id="bloggerSearchWidgetModal" onClose={onSearchWidgetModalToggle}>
      <ModalHeader rightButton={<CloseButton onClick={onSearchWidgetModalToggle} />} />

      <ModalContentWrapper>
        <MobileSectionHeading>
          <Trans>Search</Trans>
        </MobileSectionHeading>
        <InputStyled
          Icon={SearchIcon}
          placeholder={t("Search destinations, attractions or any keywords...")}
          value={text}
          onChange={e => onInputChange(e.target.value)}
          useDebounce={false}
          noBorder
        />
      </ModalContentWrapper>
      <ModalFooterContainer>
        <Button
          onClick={onSearchButtonClick}
          buttonSize={ButtonSize.Small}
          theme={theme}
          color="action"
        >
          <Trans>Search</Trans>
        </Button>
      </ModalFooterContainer>
    </Modal>
  );
};

export default BloggerSearchWidgetModal;
