import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { constructUniqueIdentifier } from "@travelshift/ui/utils/utils";

import { useTranslation } from "i18n";
import { clampLines } from "styles/base";

const HiddenCheckbox = styled.input`
  display: none;
`;

const Content = styled.div<{
  numberOfLines: number;
  lineHeight: number;
  clampTextExtraHeight: number;
}>(({ numberOfLines, lineHeight, clampTextExtraHeight }) => [
  clampLines(numberOfLines),
  css`
    max-height: ${lineHeight * numberOfLines + clampTextExtraHeight}px;
    ${HiddenCheckbox}:checked ~ & {
      display: block;
      max-height: unset;
      overflow: visible;
      -webkit-box-orient: unset;
      -webkit-line-clamp: unset;
    }
  `,
]);

const ReadMoreTrigger = styled.label(
  ({ theme }) => css`
    display: inline-block;
    cursor: pointer;
    color: ${theme.colors.primary};
    font-weight: 600;
    /* stylelint-disable-next-line selector-max-type */
    ${HiddenCheckbox}:checked ~ & {
      display: none;
    }
  `
);

const SimpleTruncation = ({
  id,
  numberOfLines,
  content,
  className,
  lineHeight = 25,
  clampTextExtraHeight = 0,
}: {
  id: string;
  numberOfLines: number;
  content: string;
  className?: string;
  lineHeight?: number;
  clampTextExtraHeight?: number;
}) => {
  const { t } = useTranslation();

  const uniqueId = constructUniqueIdentifier(`${id}ReadMore`);
  return (
    <div>
      <HiddenCheckbox type="checkbox" id={uniqueId} />
      <Content
        className={className}
        numberOfLines={numberOfLines}
        lineHeight={lineHeight}
        clampTextExtraHeight={clampTextExtraHeight}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <ReadMoreTrigger htmlFor={uniqueId}>{t("Read more")}</ReadMoreTrigger>
    </div>
  );
};

export default SimpleTruncation;
