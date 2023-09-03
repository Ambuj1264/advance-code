import React from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import { getLocaleIcon } from "@travelshift/ui/utils/localeUtils";

import { gutters } from "styles/variables";
import { mqIE } from "styles/base";

type Props = {
  localeCode: string;
  name: string;
};

const flagStyles = css`
  width: 24px;
  min-width: 24px;
  height: auto;

  ${mqIE} {
    height: 16px;
  }
`;

const Text = styled.span`
  margin-left: ${gutters.small}px;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Locale = ({ localeCode, name }: Props) => {
  const Icon = getLocaleIcon(localeCode);

  return (
    <Wrapper id={`reviewsLocaleOption${localeCode}`}>
      {Icon && <Icon css={flagStyles} />}
      <Text>{name}</Text>
    </Wrapper>
  );
};

export default Locale;
