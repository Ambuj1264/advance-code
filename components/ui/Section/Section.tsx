import React, { Ref } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { gutters } from "styles/variables";
import { mqMax, mqMin } from "styles/base";

export const SectionWrapper = styled.div<{
  hasAnchorTarget?: boolean;
  isFirstSection?: boolean;
  useContentVisibility?: boolean;
}>(({ hasAnchorTarget, isFirstSection, useContentVisibility = true }) => [
  hasAnchorTarget &&
    css`
      position: relative;
      margin-top: ${isFirstSection ? gutters.small : gutters.small * 2}px;
      ${mqMin.large} {
        margin-top: ${isFirstSection ? gutters.large : gutters.large * 2}px;
      }
    `,
  css`
    margin-top: ${isFirstSection ? gutters.small : gutters.small * 2}px;
    ${mqMin.large} {
      margin-top: ${isFirstSection ? gutters.large : gutters.large * 2}px;
    }
  `,
  !isFirstSection &&
    useContentVisibility &&
    css`
      ${mqMax.large} {
        contain-intrinsic-size: 0 390px;
        content-visibility: auto;
        overflow-clip-margin: ${gutters.small}px;
      }
    `,
]);

const AnchorTarget = styled.div`
  position: absolute;
  top: -80px;
  pointer-events: none;
  visibility: hidden;
`;

const Section = ({
  id,
  hasAnchorTarget = false,
  isFirstSection = false,
  useContentVisibility = true,
  children,
  className,
  innerRef,
  dataTestid,
}: {
  id?: string;
  hasAnchorTarget?: boolean;
  isFirstSection?: boolean;
  useContentVisibility?: boolean;
  children: React.ReactNode;
  className?: string;
  innerRef?: Ref<HTMLDivElement>;
  dataTestid?: string;
}) => (
  <SectionWrapper
    useContentVisibility={useContentVisibility}
    className={className}
    hasAnchorTarget={hasAnchorTarget}
    isFirstSection={isFirstSection}
    ref={innerRef}
    data-testid={dataTestid}
  >
    {hasAnchorTarget && <AnchorTarget id={id} />}
    {children}
  </SectionWrapper>
);

export default Section;
