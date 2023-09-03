import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import Trophy from "components/icons/rank-trophy.svg";
import { borderRadius, whiteColor } from "styles/variables";
import { typographyOverline } from "styles/typography";

const RankWrapper = styled.div<{}>(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid ${whiteColor};
    border-radius: ${borderRadius};
    width: 32px;
    height: 32px;
    background-color: ${theme.colors.primary};
  `
);

const TrophyIcon = styled(Trophy)`
  margin: auto;
  width: 20px;
  height: 20px;
  fill: ${whiteColor};
`;

const TrophyWrapper = styled.div`
  position: relative;
  width: 20px;
  height: 20px;
`;

const RankNumber = styled.div<{}>(
  ({ theme }) => css`
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    color: ${theme.colors.primary};
    ${typographyOverline}
    letter-spacing: 0;
    line-height: 10px;
    text-align: center;
    vertical-align: middle;
  `
);

const RankingTrophy = ({ rank }: { rank?: number }) => {
  return (
    <RankWrapper>
      <TrophyWrapper>
        {rank && <RankNumber>{rank}</RankNumber>}
        <TrophyIcon />
      </TrophyWrapper>
    </RankWrapper>
  );
};

export default RankingTrophy;
