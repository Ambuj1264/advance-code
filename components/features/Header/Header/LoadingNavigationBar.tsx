import React, { useContext } from "react";
import withStyles from "isomorphic-style-loader/withStyles";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { HeaderTypes } from "@travelshift/ui/typings/headerTypes";
import styles from "@travelshift/ui/components/Header/styles";
import { useTheme } from "emotion-theming";

import Header from "./Header";

import { useSettings } from "contexts/SettingsContext";
import LocaleContext from "contexts/LocaleContext";
import { zIndex, whiteColor, headerHeight, boxShadowTileRegular } from "styles/variables";
import { mqIE, hideDuringPrint } from "styles/base";
import Container from "components/ui/Grid/Container";
import MarketplaceLogo from "components/ui/Logo/MarketplaceLogo";

const Wrapper = styled.div([
  hideDuringPrint,
  css`
    position: sticky;
    top: 0;
    z-index: ${zIndex.max};
    box-shadow: ${boxShadowTileRegular};
    background: ${whiteColor};

    ${mqIE} {
      position: fixed;
      width: 100%;
    }
  `,
]);

const StyledContainer = styled(Container)`
  position: relative;
  height: ${headerHeight};
`;

const LoadingNavigationBar = ({ headerTexts }: { headerTexts: HeaderTypes.HeaderTexts }) => {
  const theme: Theme = useTheme();
  const activeLocale = useContext(LocaleContext);
  const { adminUrl } = useSettings();

  return (
    <Wrapper>
      <StyledContainer>
        <Header
          Logo={<MarketplaceLogo />}
          links={[]}
          currencies={[]}
          locales={[]}
          activeLocale={activeLocale}
          theme={theme}
          localeLinks={[]}
          adminUrl={adminUrl}
          headerTexts={headerTexts}
          searchLink="/search"
          cartLink="/cart"
          forgotPasswordLink="/login/forgot"
        />
      </StyledContainer>
    </Wrapper>
  );
};

export default withStyles(...styles)(LoadingNavigationBar);
