import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import InformationCircle from "components/icons/information-circle.svg";
import { typographyCaptionSemibold } from "styles/typography";
import { whiteColor, gutters } from "styles/variables";
import { mqMin } from "styles/base";

const Wrapper = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px 4px 0 0;
    width: 100%;
    height: 24px;
    background-color: ${rgba(theme.colors.primary, 0.8)};
    color: ${whiteColor};
    ${mqMin.large} {
      border-radius: 0;
    }
  `
);

const InformationCircleIcon = styled(InformationCircle)`
  width: 16px;
  height: 16px;
  fill: ${whiteColor};
`;

const TextWrapper = styled.div`
  ${typographyCaptionSemibold};
  margin-left: ${gutters.small / 2}px;
`;
const InformationBanner = ({ text }: { text: string }) => {
  return (
    <Wrapper>
      <InformationCircleIcon />
      <TextWrapper>{text}</TextWrapper>
    </Wrapper>
  );
};

export default InformationBanner;
