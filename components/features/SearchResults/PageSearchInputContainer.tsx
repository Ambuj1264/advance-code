import React, { useEffect } from "react";
import styled from "@emotion/styled";
import SearchIcon from "@travelshift/ui/icons/search.svg";

import GTEMobileSearch from "../Header/Header/NavigationBar/GTESearch/GTEMobileSearch";
import { ResultItems } from "../Header/Header/NavigationBar/GTESearch/GTESearch";

import SRSearchWidget from "./SRSearchWidget";

import { whiteColor, gutters } from "styles/variables";
import useToggle from "hooks/useToggle";
import MobileStickyFooter from "components/ui/StickyFooter/MobileStickyFooter";
import { MobileFooterButton } from "components/ui/Filters/MobileFooterButton";
import { Trans } from "i18n";
import { Namespaces } from "shared/namespaces";
import { mqMin, mqMax } from "styles/base";

const SearchIconStyled = styled(SearchIcon)`
  margin-right: ${gutters.small / 2}px;
  width: ${gutters.small}px;
  height: ${gutters.small}px;
  vertical-align: middle;
  fill: ${whiteColor};
`;

export const OverallMobileContainer = styled.div`
  ${mqMin.large} {
    display: none;
  }
`;

export const OverallDesktopContainer = styled.div`
  ${mqMax.large} {
    display: none;
  }
`;

const PageSearchInputContainer = ({
  setSearchInput,
  value,
  searchResult,
  clearSearchInput,
  searchParam,
}: {
  setSearchInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  searchResult: ResultItems[];
  clearSearchInput: () => void;
  searchParam?: string;
}) => {
  const [showSearchModal, toggleSearchModal] = useToggle(false);

  useEffect(() => {
    if (!showSearchModal && value) {
      clearSearchInput();
    }
  }, [showSearchModal]);

  return (
    <>
      <OverallMobileContainer>
        {showSearchModal && (
          <GTEMobileSearch
            value={value}
            setSearchInput={setSearchInput}
            onClose={toggleSearchModal}
            searchResult={searchResult}
            toggleSearch={toggleSearchModal}
          />
        )}
        <MobileStickyFooter
          fullWidthContent={
            <MobileFooterButton onClick={toggleSearchModal} color="primary">
              <>
                <SearchIconStyled />
                <Trans ns={Namespaces.commonNs}>Search</Trans>
              </>
            </MobileFooterButton>
          }
        />
      </OverallMobileContainer>
      <OverallDesktopContainer>
        <SRSearchWidget searchParam={searchParam} />
      </OverallDesktopContainer>
    </>
  );
};

export default PageSearchInputContainer;
