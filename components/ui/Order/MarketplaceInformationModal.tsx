import React from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";

import MarketplaceInformationContent from "./MarketplaceInformationContent";

import { gutters, greyColor } from "styles/variables";
import { useTranslation } from "i18n";
import Modal, {
  ModalHeader,
  CloseButton,
  ModalContentWrapper,
  ModalBodyContainer,
} from "components/ui/Modal/Modal";
import { typographyH5, typographyBody2 } from "styles/typography";

const StyledModal = styled(Modal)`
  width: 90%;
  height: auto;
`;

const StyledModalContentWrapper = styled(ModalContentWrapper)`
  padding: 0 32px;
`;

const Heading = styled.h3(({ theme }) => [
  typographyH5,
  css`
    margin-bottom: -${gutters.small / 2}px;
    padding-top: ${gutters.large}px;
    color: ${theme.colors.primary};
    letter-spacing: 0.2px;
    text-align: center;
  `,
]);

const Description = styled.div(
  typographyBody2,
  css`
    margin-top: ${gutters.small}px;
    color: ${rgba(greyColor, 0.7)};
    text-align: center;
  `
);

const StyledModalBodyContainer = styled(ModalBodyContainer)`
  padding-bottom: ${gutters.small * 2}px;
`;

const MarketplaceInformationModal = ({
  contactEmail,
  helpCenterTimePeriod,
  phoneNumbers,
  onClose,
}: {
  contactEmail: string;
  helpCenterTimePeriod: string;
  phoneNumbers: OrderTypes.MarketplacePhoneNumber[];
  onClose: () => void;
}) => {
  const { t } = useTranslation();
  return (
    <StyledModal id="MarketplaceInformationModal" onClose={onClose} variant="info">
      <ModalHeader rightButton={<CloseButton onClick={onClose} />} />
      <StyledModalContentWrapper>
        <Heading>{t("Customer support")}</Heading>
        <StyledModalBodyContainer>
          <Description>
            {t("We provide a personal and free travel service throughout your journey")}
          </Description>
          <Heading>{t("Contact us here")}</Heading>
          <MarketplaceInformationContent
            contactEmail={contactEmail}
            helpCenterTimePeriod={helpCenterTimePeriod}
            phoneNumbers={phoneNumbers}
          />
        </StyledModalBodyContainer>
      </StyledModalContentWrapper>
    </StyledModal>
  );
};

export default MarketplaceInformationModal;
