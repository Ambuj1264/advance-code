import React, { memo } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { getWeekdays } from "utils/dateUtils";
import { gutters } from "styles/variables";
import { typographyCaptionSmall } from "styles/typography";

const Weekday = styled.div`
  width: ${(1 / 7) * 100}%;
  text-align: center;
`;

const Weekdays = styled.div([
  typographyCaptionSmall,
  css`
    display: flex;
    justify-content: space-between;
    margin-top: ${gutters.large / 2}px;
  `,
]);

export default memo(({ activeLocale }: { activeLocale: string }) => {
  return (
    <Weekdays>
      {getWeekdays("short", activeLocale).map((day: string) => (
        <Weekday key={day}>{day}</Weekday>
      ))}
    </Weekdays>
  );
});
