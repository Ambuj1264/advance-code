import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import Tooltip from "../Tooltip/Tooltip";
import { isValueTruncated } from "../utils/uiUtils";

import { typographyBody2, typographyCaptionSemibold } from "styles/typography";
import { whiteColor, gutters } from "styles/variables";
import { mqMin, singleLineTruncation } from "styles/base";

const StyledTooltip = styled(Tooltip)<{ disablePointerEvents?: boolean }>(
  ({ disablePointerEvents }) => css`
    justify-content: left;
    pointer-events: ${disablePointerEvents ? "none" : "auto"};
  `
);

export const LabelParagraph = styled.p<{ includeMediumUpSize?: boolean }>([
  () => css`
    ${typographyCaptionSemibold};
    ${singleLineTruncation};
    position: relative;
    color: ${whiteColor};
    line-height: ${gutters.large}px;
  `,
  ({ includeMediumUpSize = true }) =>
    includeMediumUpSize === true &&
    css`
      ${mqMin.medium} {
        ${typographyBody2};
      }
    `,
  css`
    ${mqMin.large} {
      line-height: ${gutters.small * 2}px;
    }
  `,
]);

const Label = ({
  className,
  children,
  disablePointerEvents = false,
}: {
  className?: string;
  children: string | React.ReactNode;
  disablePointerEvents?: boolean;
}) => {
  const labelRef = useRef(null);
  const [hasTruncatedValue, setHasTruncatedValue] = useState(false);

  useEffect(() => {
    if (labelRef) {
      setHasTruncatedValue(isValueTruncated(labelRef));
    }
  }, [labelRef]);

  return (
    <StyledTooltip
      title={children}
      isVisible={hasTruncatedValue}
      disablePointerEvents={disablePointerEvents}
    >
      <LabelParagraph ref={labelRef} className={className}>
        {children}
      </LabelParagraph>
    </StyledTooltip>
  );
};

export default Label;
