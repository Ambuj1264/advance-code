import React from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";

import Tooltip from "components/ui/Tooltip/Tooltip";
import InformationCircle from "components/icons/information-circle.svg";
import { typographyCaption, typographyCaptionSemibold } from "styles/typography";
import { gutters, greyColor } from "styles/variables";
import { Trans, useTranslation } from "i18n";
import { mqMin, mqIE, singleLineTruncation, clampLines } from "styles/base";
import { Namespaces } from "shared/namespaces";

const LoadableSvgIconWrapper = styled.div<{ iconColor: string }>(
  ({ iconColor }) => css`
    font-size: 0;
    svg {
      margin-right: ${gutters.small / 2}px;
      width: 18px;
      min-width: 18px;
      height: auto;
      max-height: 20px;
      fill: ${iconColor};

      ${mqIE} {
        height: 18px;
      }
    }
  `
);

const Label = styled.div([
  typographyCaptionSemibold,
  singleLineTruncation,
  css`
    margin-top: ${gutters.small / 8}px;
  `,
]);

const Value = styled.div([
  typographyCaption,
  clampLines(2),
  css`
    word-break: break-word;
  `,
]);

export const QuickFact = styled.div`
  position: relative;
  display: flex;
  flex-basis: 50%;
  align-items: center;
  margin-top: ${gutters.small}px;
  max-width: 50%;
  ${mqMin.large} {
    flex-basis: 50%;
    margin-top: ${gutters.large / 2}px;
    max-width: 50%;
  }
`;

const InformationCircleStyled = styled(InformationCircle)(
  ({ theme }) => css`
    position: absolute;
    right: -${gutters.large / 2}px;
    bottom: 2px;
    width: 12px;
    height: 12px;
    opacity: 0.7;
    fill: ${theme.colors.primary};
  `
);

export const TextContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 70%;
  color: ${greyColor};
`;

export const QuickFactsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding-top: ${gutters.small / 2}px;
  padding-bottom: ${gutters.small / 2}px;

  ${mqMin.large} {
    padding-top: 0;
    padding-bottom: 0;
  }
`;

const QuickFactsWithoutModals = ({
  items,
  namespace,
  className,
  iconColor,
}: {
  className?: string;
  items: SharedTypes.QuickFact[];
  namespace: Namespaces;
  iconColor: string;
}) => {
  const { t } = useTranslation(namespace);

  return (
    <QuickFactsWrapper className={className}>
      {items.map((quickFact: SharedTypes.QuickFact) => {
        const { id, label, value, description, Icon, translateValue } = quickFact;

        const translatedValue = typeof value === "string" ? t(value) : t(value.key, value.options);

        const actualValue = translateValue ? translatedValue : (value as string);

        return (
          <QuickFact key={id}>
            <LoadableSvgIconWrapper iconColor={iconColor}>
              <Icon />
            </LoadableSvgIconWrapper>
            <TextContentWrapper>
              {label && (
                <Label data-testid={label}>
                  <Trans ns={namespace}>{label}</Trans>
                </Label>
              )}
              <Value title={actualValue} data-testid={value}>
                {actualValue}
              </Value>
            </TextContentWrapper>
            {description && (
              <Tooltip title={description}>
                <InformationCircleStyled />
              </Tooltip>
            )}
          </QuickFact>
        );
      })}
    </QuickFactsWrapper>
  );
};

export default QuickFactsWithoutModals;
