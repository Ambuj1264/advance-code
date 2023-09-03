import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import Teaser from "components/ui/Teaser/Teaser";
import { typographyH5 } from "styles/typography";
import { column, row, mqMin } from "styles/base";
import { greyColor, gutters } from "styles/variables";

const Wrapper = styled.div`
  margin-top: ${gutters.small}px;
`;

const HorizontalListWrapper = styled.ul([
  row,
  css`
    align-self: center;
    margin: 0;
    margin-top: ${gutters.small}px;
    margin-right: -${gutters.small / 2}px;
    margin-left: -${gutters.small / 2}px;
    width: calc(100% + ${gutters.small}px);
    padding-left: 0;
    list-style: none;

    ${mqMin.large} {
      margin-right: -${gutters.large / 2}px;
      margin-left: -${gutters.large / 2}px;
      width: calc(100% + ${gutters.large}px);
    }
  `,
]);

const TeaserItemWrapper = styled.li([
  column({ small: 1, medium: 1 / 3 }),
  css`
    & + & {
      margin-top: ${gutters.small}px;
    }

    ${mqMin.medium} {
      & + & {
        margin-top: 0;
      }
    }
  `,
]);

const StyledHeader = styled.h2([
  typographyH5,
  css`
    margin-bottom: ${gutters.small}px;
    color: ${greyColor};
    text-align: center;
  `,
]);

const MAX_HORIZONTAL_ITEMS = 3;

const TeaserListHorizontal = ({ title, teasers, titleLink }: TeaserListTypes.TeaserList) => {
  const titleComponent = titleLink ? <a href={titleLink}>{title}</a> : title;
  return (
    <Wrapper>
      <StyledHeader>{titleComponent}</StyledHeader>
      <HorizontalListWrapper>
        {teasers.slice(0, MAX_HORIZONTAL_ITEMS).map((teaser: TeaserTypes.Teaser, index: number) => (
          // eslint-disable-next-line react/no-array-index-key
          <TeaserItemWrapper key={index}>
            <Teaser {...teaser} />
          </TeaserItemWrapper>
        ))}
      </HorizontalListWrapper>
    </Wrapper>
  );
};

export default TeaserListHorizontal;
