import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { MobileFooterButton } from "components/ui/Filters/MobileFooterButton";
import MobileStickyFooter, {
  MobileFooterContainer,
} from "components/ui/StickyFooter/MobileStickyFooter";
import { Trans } from "i18n";
import { Namespaces } from "shared/namespaces";
import { whiteColor } from "styles/variables";

const StyledMobileFooterButton = styled(MobileFooterButton)(css`
  border: 1px solid ${whiteColor};
`);

const StyledMobileStickyFooter = styled(MobileStickyFooter)<{}>(
  ({ theme }) => css`
    background: ${theme.colors.primary};

    ${MobileFooterContainer} {
      background: ${theme.colors.primary};
    }
  `
);

const ButtonWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FrontMobileSingleServiceFooter = ({ onClick }: { onClick: () => void }) => {
  return (
    <StyledMobileStickyFooter
      fullWidthContent={
        <StyledMobileFooterButton onClick={onClick}>
          <ButtonWrapper>
            <Trans ns={Namespaces.commonSearchNs}>Search Now</Trans>
          </ButtonWrapper>
        </StyledMobileFooterButton>
      }
    />
  );
};

export default FrontMobileSingleServiceFooter;
