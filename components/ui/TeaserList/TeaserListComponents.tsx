import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import WifiSignal2Icon from "components/icons/wifi-signal-2.svg";
import MatchesFire from "components/icons/matches-fire.svg";
import NotesQuill from "components/icons/notes-quill.svg";
import BulbAlternate from "components/icons/bulb-alternate.svg";
import Compass1Alternate from "components/icons/compass-1-alternate.svg";
import ArrowRight from "components/icons/arrow-right.svg";
import Traveler from "components/icons/traveler.svg";
import { greyColor, gutters } from "styles/variables";
import { typographySubtitle1, typographyH4 } from "styles/typography";

export const H2 = styled.h2<{
  textColor?: string;
  isAttractionPage?: boolean;
}>([
  typographySubtitle1,
  ({ textColor }) => css`
    color: ${textColor || greyColor};
    & svg {
      display: inline-block;
      margin-right: ${gutters.small / 2}px;
      height: 24px;
      vertical-align: bottom;
      fill: ${textColor || greyColor};
    }
  `,
  ({ isAttractionPage }) =>
    isAttractionPage && [
      typographyH4,
      css`
        & svg {
          height: 24px;
          vertical-align: baseline;
        }
      `,
    ],
]);

const ArrowDown = styled(ArrowRight)`
  transform: rotate(90deg);
`;

const Icon = ({ icon }: { icon?: string }) => {
  switch (icon) {
    case "arrow-right":
      return <ArrowDown />;
    case "matches-fire":
      return <MatchesFire />;
    case "notes-quill":
      return <NotesQuill />;
    case "bulb-alternate":
      return <BulbAlternate />;
    case "compass-1-alternate":
      return <Compass1Alternate />;
    case "travellers_1":
      return <Traveler />;
    case "wifi-signal-2":
    default:
      return <WifiSignal2Icon />;
  }
};

const TitleWithIconWrapper = styled.span<{ isReverse?: boolean }>(
  ({ isReverse }) =>
    isReverse &&
    css`
      display: inline-flex;
      flex-direction: row-reverse;
      align-items: center;

      & svg {
        margin: 0;
        margin-left: ${gutters.small / 2}px;
      }
    `
);

export const Header = ({
  title,
  icon,
  url,
  textColor,
  isAttractionPage,
  hasReversedIconAndText,
}: {
  title: string;
  icon?: string;
  url?: string;
  textColor?: string;
  isAttractionPage?: boolean;
  hasReversedIconAndText?: boolean;
}) => {
  const titleWithIcon = (
    <TitleWithIconWrapper isReverse={hasReversedIconAndText}>
      <Icon icon={icon} />
      {title}
    </TitleWithIconWrapper>
  );
  return (
    <H2 textColor={textColor} isAttractionPage={isAttractionPage}>
      {url ? <a href={url}>{titleWithIcon}</a> : titleWithIcon}
    </H2>
  );
};
