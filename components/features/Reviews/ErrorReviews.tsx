import React from "react";
import styled from "@emotion/styled";

import { greyColor, boxShadow, borderRadiusSmall, gutters, whiteColor } from "styles/variables";
import { mqMin } from "styles/base";
import { Trans } from "i18n";
import { Namespaces } from "shared/namespaces";

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

const ErrorReviews = () => (
  <Wrapper>
    <Text>
      <Trans ns={Namespaces.reviewsNs}>
        Whoops! We are terribly sorry. It seems our review section is not working at the moment
      </Trans>
    </Text>
  </Wrapper>
);

export default ErrorReviews;
