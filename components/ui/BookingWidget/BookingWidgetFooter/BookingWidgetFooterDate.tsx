import React, { memo } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { withTheme } from "emotion-theming";
import rgba from "polished/lib/color/rgba";

import { createDateCaption } from "../utils/bookingWidgetUtils";

import CheckMark from "components/ui/CheckMark";
import { IconSize } from "types/enums";
import { typographyCaption } from "styles/typography";
import { gutters, greyColor } from "styles/variables";

type Props = {
  startDate: string;
  endDate: string;
  theme: Theme;
};

const Date = styled.div`
  display: inline;
  margin-left: ${gutters.small / 2}px;
  color: ${rgba(greyColor, 0.7)};
`;

const BookingWidgetFooterDate = styled.div([
  typographyCaption,
  css`
    display: flex;
    align-items: center;
  `,
]);

export default withTheme(
  memo(({ startDate, endDate, theme }: Props) => (
    <BookingWidgetFooterDate>
      <CheckMark color={theme.colors.action} iconSize={IconSize.Medium} />
      <Date>{createDateCaption(startDate, endDate)}</Date>
    </BookingWidgetFooterDate>
  ))
);
