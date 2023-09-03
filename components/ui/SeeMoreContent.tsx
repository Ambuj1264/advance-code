import React, { ReactElement } from "react";
import { useTheme } from "emotion-theming";
import styled from "@emotion/styled";

import Row from "components/ui/Grid/Row";
import Button from "components/ui/Inputs/Button";
import { Trans } from "i18n";
import { gutters } from "styles/variables";
import { ButtonSize } from "types/enums";
import { Namespaces } from "shared/namespaces";

const StyledRow = styled(Row)`
  margin-top: ${gutters.large}px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${gutters.small}px;
  button {
    width: 182px;
  }
`;

const SeeMoreContent = ({
  numberOfItemsToShow,
  containerId,
  children,
}: {
  numberOfItemsToShow?: number;
  containerId: string;
  children: ReactElement[] | ReactElement;
}) => {
  const theme: Theme = useTheme();
  const showMoreButtonId = `${containerId}-showMoreButton`;

  return (
    <>
      <StyledRow>{children}</StyledRow>
      {numberOfItemsToShow && (
        <ButtonWrapper>
          <Button
            id={showMoreButtonId}
            on={`tap:${containerId}.show(),${showMoreButtonId}.hide()`}
            buttonSize={ButtonSize.Medium}
            theme={theme}
          >
            <Trans ns={Namespaces.commonNs}>Show more</Trans>
          </Button>
        </ButtonWrapper>
      )}
    </>
  );
};

export default SeeMoreContent;
