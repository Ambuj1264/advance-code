import React from "react";
import { useQuery } from "@apollo/react-hooks";
import Bubbles from "@travelshift/ui/components/Bubbles/Bubbles";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { useTheme } from "emotion-theming";

import CartTermsQuery from "./queries/CartTermsQuery.graphql";
import CartTermsOfServiceQueryNew from "./queries/CartTermsOfServiceQueryNew.graphql";
import { GraphCMSMarketplaces } from "./types/cartEnums";

import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import Modal, {
  ModalHeader,
  CloseButton,
  ModalContentWrapper,
  ModalHeading,
  ModalBodyContainer,
} from "components/ui/Modal/Modal";
import { greyColor, gutters } from "styles/variables";
import { typographyBody1 } from "styles/typography";
import { useSettings } from "contexts/SettingsContext";
import { Marketplace } from "types/enums";

const TermsWrapper = styled.div([
  typographyBody1,
  css`
    padding-bottom: ${gutters.large}px;
    color: ${greyColor};
    strong {
      display: flex;
      justify-content: center;
      margin-top: ${gutters.small}px;
      margin-bottom: ${gutters.small / 2}px;
      width: 100%;
      text-transform: uppercase;
      /* stylelint-disable-next-line selector-max-type */
      & + & {
        margin-top: 0;
      }
    }
  `,
]);

const BubblesWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const StyledModalBodyContainer = styled(ModalBodyContainer)`
  height: 100%;
`;

const TermsModal = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation(Namespaces.cartNs);
  const { marketplace } = useSettings();
  const theme: Theme = useTheme();
  const { data, loading, error } = useQuery<{
    frontCartTerms: {
      page: { content: string };
    };
  }>(CartTermsQuery, {
    skip: marketplace === Marketplace.GUIDE_TO_EUROPE,
  });

  const {
    data: tosData,
    loading: tosLoading,
    error: tosError,
  } = useQuery<
    {
      cartTermsOfService: {
        content: {
          html: string;
        };
      };
    },
    {
      marketplace: GraphCMSMarketplaces;
    }
  >(CartTermsOfServiceQueryNew, {
    variables: {
      marketplace: GraphCMSMarketplaces.GUIDE_TO_EUROPE,
    },
    skip: marketplace !== Marketplace.GUIDE_TO_EUROPE,
  });

  const content = data?.frontCartTerms.page.content || tosData?.cartTermsOfService.content.html;

  if (error || tosError) return null;

  return (
    <Modal id="termsModal" onClose={onClose}>
      <ModalHeader rightButton={<CloseButton onClick={onClose} />} />
      <ModalContentWrapper>
        <ModalHeading>{t("Terms of service")}</ModalHeading>
        <StyledModalBodyContainer>
          {loading || tosLoading ? (
            <BubblesWrapper>
              <Bubbles theme={theme} color="primary" size="large" />
            </BubblesWrapper>
          ) : (
            <TermsWrapper
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: content?.replace(/style="[^"]*"/g, "") ?? "",
              }}
            />
          )}
        </StyledModalBodyContainer>
      </ModalContentWrapper>
    </Modal>
  );
};

export default TermsModal;
