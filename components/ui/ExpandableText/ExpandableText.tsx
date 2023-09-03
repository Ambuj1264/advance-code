import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { useTranslation } from "i18n";
import useToggle from "hooks/useToggle";
import { gutters, greyColor, fontSizeBody1, fontWeightSemibold } from "styles/variables";
import { clampLines } from "styles/base";
import { getIdFromName } from "utils/helperUtils";
import { useIsMobile } from "hooks/useMediaQueryCustom";

const LINE_HEIGHT = 28;
const CLAMPED_TEXT_EXTRA_HEIGHT = 15;

const Wrapper = styled.div`
  color: ${greyColor};
  font-size: ${fontSizeBody1};
  line-height: ${LINE_HEIGHT}px;
`;

const ReadMoreTrigger = styled.span<{ isExpanded: boolean }>(({ theme, isExpanded }) => [
  css`
    display: inline;
    cursor: pointer;
    color: ${theme.colors.primary};
    font-weight: ${fontWeightSemibold};
  `,
  isExpanded &&
    css`
      display: inline-block;
    `,
]);

const Text = styled.div<{
  isExpanded: boolean;
  lineLimit: number;
  clampedTextExtraHeight?: number;
}>(({ isExpanded, lineLimit }) => [
  css`
    display: block;
    max-height: ${lineLimit * LINE_HEIGHT}px;
    overflow: hidden;
    p:not(:last-of-type) {
      content: "";
      display: block;
      margin-bottom: ${isExpanded ? gutters.small / 2 : "0"}px;
    }
  `,
  isExpanded
    ? css`
        display: inline;
        max-height: none;
      `
    : clampLines(lineLimit),
]);

const ReadLessWrapper = styled.span`
  margin-left: ${gutters.small / 4}px;
`;

const ExpandableText = ({
  id,
  text,
  lineLimit = 5,
  className,
  autoExpand = false,
  handleParagraphs = true,
  clampedTextExtraHeight,
}: {
  id: string;
  text: string;
  handleParagraphs?: boolean;
  lineLimit?: number;
  autoExpand?: boolean;
  className?: string;
  clampedTextExtraHeight?: number;
}) => {
  const { t } = useTranslation();
  const [textFits, setTextFits] = useState(autoExpand);
  const [isExpanded, toggleIsExpanded] = useToggle(autoExpand);
  const textId = getIdFromName(id);
  const isMobile = useIsMobile();

  useEffect(() => {
    const textElement = document.getElementById(textId);

    if (
      textElement &&
      textElement.offsetHeight >= textElement.scrollHeight - CLAMPED_TEXT_EXTRA_HEIGHT
    ) {
      setTextFits(true);
    }
  }, [textId, isMobile]);

  const paragraphs = handleParagraphs ? text.replace(/\n\n/g, "\n").replace(/^/gm, "<p>") : text;
  return (
    <Wrapper className={className}>
      <Text
        id={textId}
        isExpanded={isExpanded}
        lineLimit={lineLimit}
        clampedTextExtraHeight={clampedTextExtraHeight}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: paragraphs }}
      />
      {!autoExpand && !textFits && (
        <ReadMoreTrigger isExpanded={isExpanded} onClick={toggleIsExpanded}>
          {isExpanded ? <ReadLessWrapper>{t("Read less")}</ReadLessWrapper> : t("Read more")}
        </ReadMoreTrigger>
      )}
    </Wrapper>
  );
};

export default ExpandableText;
