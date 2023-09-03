import React, { useCallback } from "react";
import styled from "@emotion/styled";

import SearchInputAndDropdown from "./SearchInputAndDropdown";
import { ResultItems } from "./GTESearch";

import Modal, { CloseButton, ModalHeader, Container } from "components/ui/Modal/Modal";
import { DropdownContainer } from "components/ui/Inputs/ContentDropdown";
import { BookingWidgetLabel } from "components/ui/MobileSteps/MobileStepLocation";
import { greyColor, gutters } from "styles/variables";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";

const StyledModal = styled(Modal)`
  ${Container} {
    justify-content: start;
    overflow-y: scroll;
  }

  ${DropdownContainer} {
    position: unset;
  }
`;

const StyledBookingWidgetLabel = styled(BookingWidgetLabel)`
  margin: ${gutters.small / 2}px ${gutters.small}px -${gutters.small}px;
  color: ${greyColor};
`;

const Wrapper = styled.div``;

const GTEMobileSearch = ({
  toggleSearch,
  onClose,
  value,
  setSearchInput,
  searchResult,
}: {
  toggleSearch?: () => void;
  onClose?: () => void;
  value: string;
  setSearchInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchResult?: ResultItems[];
}) => {
  const { t } = useTranslation(Namespaces.commonNs);
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const noop = useCallback(() => {}, []);
  return (
    <StyledModal id="gte-search-modal" onClose={onClose || noop}>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      <ModalHeader rightButton={<CloseButton onClick={toggleSearch} />} />
      <Wrapper>
        <StyledBookingWidgetLabel>{t("Search")}</StyledBookingWidgetLabel>
        <SearchInputAndDropdown
          value={value}
          setSearchInput={setSearchInput}
          searchResult={searchResult}
          isOnMobile
          toggleSearch={toggleSearch}
        />
      </Wrapper>
    </StyledModal>
  );
};

export default GTEMobileSearch;
