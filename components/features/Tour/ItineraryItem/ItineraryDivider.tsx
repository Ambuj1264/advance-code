import React from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";

import { typographyOverline } from "styles/typography";
import { gutters } from "styles/variables";

type Props = {
  title: string;
};

const Title = styled.span(typographyOverline);

const Divider = styled.div`
  flex-grow: 1;
  margin-left: ${gutters.small / 2}px;
  border-top-style: solid;
  border-top-width: 2px;
`;

const Wrapper = styled.div<{}>(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    ${Title} {
      color: ${theme.colors.primary};
    }
    ${Divider} {
      color: ${rgba(theme.colors.primary, 0.2)};
    }
  `
);

const ItineraryDivider = ({ title }: Props) => (
  <Wrapper>
    <Title>{title}</Title>
    <Divider />
  </Wrapper>
);

export default ItineraryDivider;
