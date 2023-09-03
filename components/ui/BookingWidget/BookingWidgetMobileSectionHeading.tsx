import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import { gutters, fontWeightSemibold, whiteColor } from "styles/variables";
import { typographyBody2 } from "styles/typography";

const BookingWidgetMobileSectionHeading = styled.div<{ isDark?: boolean }>(
  ({ isDark = false, theme }) => [
    typographyBody2,
    css`
      margin: 0 -${gutters.small}px;
      padding: 0 ${gutters.small}px;
      background-color: ${rgba(theme.colors.primary, isDark ? 0.7 : 0.1)};
      color: ${isDark ? whiteColor : theme.colors.primary};
      font-weight: ${fontWeightSemibold};
    `,
  ]
);

export default BookingWidgetMobileSectionHeading;
