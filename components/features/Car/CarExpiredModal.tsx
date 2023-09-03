import React from "react";
import styled from "@emotion/styled";
import { useTheme } from "emotion-theming";
import { css } from "@emotion/core";

import FooterImage from "../Footer/FooterImage";

import Modal, { ModalContentWrapper } from "components/ui/Modal/Modal";
import Button from "components/ui/Inputs/Button";
import { gutters } from "styles/variables";
import SectionHeading from "components/ui/Section/SectionHeading";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import { typographyBody1 } from "styles/typography";

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${gutters.large}px;
  button,
  a {
    width: 250px;
  }
`;

const Description = styled.div(
  typographyBody1,
  css`
    margin-top: ${gutters.small / 2}px;
    max-width: 700px;
    text-align: center;
  `
);

const StyledModalContentWrapper = styled(ModalContentWrapper)`
  margin-top: 48px;
`;

const CarExpiredModal = ({ carSearchUrl }: { carSearchUrl: string }) => {
  const { t } = useTranslation(Namespaces.commonNs);
  const { t: carT } = useTranslation(Namespaces.carNs);
  const theme: Theme = useTheme();
  return (
    <Modal id="priceChangedModal" noMinHeight onClose={() => undefined}>
      <StyledModalContentWrapper>
        <SectionHeading>{carT("We're sorry, this offer has expired")}</SectionHeading>
        <Description>
          {carT(
            "The closer you are to your rental date, the more challenging it will be to reserve a specific vehicle. Please continue browsing the alternatives below to reserve your vehicle of choice while it is still available."
          )}
        </Description>
        <ButtonWrapper>
          <Button color="action" theme={theme} href={carSearchUrl}>
            {t("Search again")}
          </Button>
        </ButtonWrapper>
      </StyledModalContentWrapper>
      <FooterImage />
    </Modal>
  );
};

export default CarExpiredModal;
