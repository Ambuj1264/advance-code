import React, { useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";
import CopyToClipboard from "react-copy-to-clipboard";
import Checkmark from "@travelshift/ui/icons/checkmark.svg";

import DollarIcon from "components/icons/currency-dollar.svg";
import {
  whiteColor,
  blackColor,
  gutters,
  greyColor,
  borderRadius,
  borderRadiusSmall,
} from "styles/variables";
import { mqMin } from "styles/base";
import useToggle from "hooks/useToggle";
import Modal, { ModalContentWrapper, ModalHeader, CloseButton } from "components/ui/Modal/Modal";
import { useTranslation, Trans } from "i18n";
import { typographySubtitle1 } from "styles/typography";

const Button = styled.button`
  border-bottom-left-radius: ${borderRadiusSmall};
  width: 30px;
  height: 30px;
  padding: 5px;
  background-color: ${rgba(blackColor, 0.2)};
  path {
    fill: ${whiteColor};
  }
`;

const InfoText = styled.div(
  typographySubtitle1,
  css`
    margin-top: ${gutters.small}px;
    color: ${rgba(greyColor, 0.7)};
    text-align: center;
    ${mqMin.large} {
      margin-top: ${gutters.large}px;
    }
  `
);

const LinkWrapper = styled.span(
  ({ theme }) => css`
    display: block;
    margin: ${gutters.small}px 0;
    border-radius: ${borderRadius};
    padding: 30px;
    background-color: ${rgba(theme.colors.primary, 0.05)};
    text-align: center;
  `
);

const CopyButton = styled.button`
  margin-bottom: ${gutters.small}px;
`;

const CheckmarkWrapper = styled.div(
  ({ theme }) => css`
    position: absolute;
    bottom: 100px;
    left: 50%;
    margin-left: -20px;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    padding: 10px;
    background-color: ${theme.colors.action};
    opacity: 0;
    transition: transform 0.5s ease, opacity 0.5s ease;
    path {
      fill: ${whiteColor};
    }
    &.show {
      opacity: 1;
      transform: translate3d(0, 60px, 0);
    }
  `
);

type Props = {
  userId: number;
  url: string;
};

const ModalContent = ({ userId, url, onClose }: { onClose: () => void } & Props) => {
  const { t } = useTranslation();
  const affiliateLink = `${url}?a=${userId}`;
  const [isCopied, setCopied] = useState(false);
  const onCopy = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  return (
    <>
      <ModalHeader
        title={t("Your commision link")}
        rightButton={<CloseButton onClick={onClose} />}
      />
      <ModalContentWrapper>
        <InfoText>{t("affiliateLinkInfoText")}</InfoText>
        <CopyToClipboard text={affiliateLink} onCopy={onCopy}>
          <CopyButton type="button">
            <LinkWrapper>{affiliateLink}</LinkWrapper>
            <span>
              (<Trans>Click to copy</Trans>)
            </span>
          </CopyButton>
        </CopyToClipboard>

        <CheckmarkWrapper className={isCopied ? "show" : undefined}>
          <Checkmark />
        </CheckmarkWrapper>
      </ModalContentWrapper>
    </>
  );
};

const AffiliateButton = ({ url, userId }: Props) => {
  const [showModal, toggleModal] = useToggle();
  return (
    <>
      <Button onClick={toggleModal}>
        <DollarIcon />
      </Button>
      {showModal && (
        <Modal id="affiliateLinkModal" noMinHeight onClose={toggleModal}>
          <ModalContent url={url} onClose={toggleModal} userId={userId} />
        </Modal>
      )}
    </>
  );
};

export default AffiliateButton;
