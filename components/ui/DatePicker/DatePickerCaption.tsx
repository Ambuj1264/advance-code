import React, { memo } from "react";
import styled from "@emotion/styled";

import { CaptionElementProps } from "./CommonDatePicker";

const CaptionWrapper = styled.div``;

const CaptionDate = styled.div``;

export default memo(({ date, locale, months, localeUtils, classNames }: CaptionElementProps) => {
  return (
    <CaptionWrapper className={classNames.caption}>
      <CaptionDate>
        {months
          ? `${months[date.getMonth()]} ${date.getFullYear()}`
          : localeUtils.formatMonthTitle(date, locale)}
      </CaptionDate>
    </CaptionWrapper>
  );
});
