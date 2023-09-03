import React from "react";
import styled from "@emotion/styled";
import { withTheme } from "emotion-theming";

import Button from "components/ui/Inputs/Button";
import { ButtonSize } from "types/enums";
import { whiteColor, borderRadiusSmall, boxShadow, gutters, greyColor } from "styles/variables";
import { mqMin } from "styles/base";
import { Trans } from "i18n";
import { Namespaces } from "shared/namespaces";

const ButtonWrapper = styled.div`
  margin-top: ${gutters.small / 2}px;
  ${mqMin.medium} {
    margin-top: 0;
  }
`;

const Text = styled.div`
  color: ${greyColor};
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: ${boxShadow};
  border-radius: ${borderRadiusSmall};
  padding: ${gutters.small}px;
  background-color: ${whiteColor};
  text-align: center;
  ${mqMin.medium} {
    flex-direction: row;
    align-items: left;
    justify-content: space-between;
  }
`;

const EmptyReviews = ({
  clearFilters,
  theme,
  href,
}: {
  clearFilters: () => void;
  theme: Theme;
  href?: string;
}) => (
  <Wrapper>
    <Text>
      <Trans ns={Namespaces.reviewsNs}>No reviews in this language / of this rating</Trans>
    </Text>
    <ButtonWrapper>
      <Button
        id="reviewsClearFilters"
        onClick={clearFilters}
        buttonSize={ButtonSize.Small}
        theme={theme}
        href={href}
      >
        <Trans ns={Namespaces.reviewsNs}>See all reviews</Trans>
      </Button>
    </ButtonWrapper>
  </Wrapper>
);

export default withTheme(EmptyReviews);
