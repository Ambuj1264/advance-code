import React, { useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { getLocaleIcon } from "@travelshift/ui/utils/localeUtils";

import { Button } from "./UserMenu/UserMenuActions";
import { LocaleList } from "./LocalePickerPopover";

import { gutters, whiteColor } from "styles/variables";
import Modal, {
  ModalHeader,
  CloseButton,
  ModalContentWrapper,
  ModalBodyContainer,
} from "components/ui/Modal/Modal";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";

const StyledModalBodyContainer = styled(ModalBodyContainer)`
  margin-top: ${gutters.large}px;
`;

const IconWrapper = styled.div`
  position: relative;
  margin-bottom: 4px;
  border: 2px solid ${whiteColor};
  border-radius: 50%;
  width: 36px;
  height: 36px;
  overflow: hidden;
`;

const IconContainer = styled.div`
  position: absolute;
  right: -50%;
  left: -50%;
  margin: auto;
`;
const iconStyles = css`
  height: 32px;
`;

const LocalePickerMobile = ({
  locales,
  activeLocale,
  localeLinks,
  defaultUrl,
}: {
  locales: ReadonlyArray<AppLocale>;
  activeLocale: string;
  localeLinks: LocaleLink[];
  defaultUrl: string;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const Icon = getLocaleIcon(activeLocale);
  const { t } = useTranslation(Namespaces.headerNs);
  const language = useState(locales.find(locale => locale.code === activeLocale)?.name);
  return (
    <>
      {isModalOpen && (
        <Modal id="mobileLanguageModal" onClose={() => setIsModalOpen(false)}>
          <ModalHeader
            title={t("Languages")}
            rightButton={<CloseButton onClick={() => setIsModalOpen(false)} />}
          />
          <ModalContentWrapper>
            <StyledModalBodyContainer>
              <LocaleList
                locales={locales}
                activeLocale={activeLocale}
                localeLinks={localeLinks}
                defaultUrl={defaultUrl}
              />
            </StyledModalBodyContainer>
          </ModalContentWrapper>
        </Modal>
      )}
      <Button onClick={() => setIsModalOpen(true)}>
        <IconWrapper>
          <IconContainer>
            <Icon css={iconStyles} />
          </IconContainer>
        </IconWrapper>
        {language}
      </Button>
    </>
  );
};

export default LocalePickerMobile;
