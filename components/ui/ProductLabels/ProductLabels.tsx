import React from "react";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import { css } from "@emotion/core";

import { Namespaces } from "../../../shared/namespaces";

import WarningIcon from "components/icons/warning.svg";
import {
  bittersweetRedColor,
  borderRadiusSmall,
  fontSizeMiddleCaption,
  gutters,
  whiteColor,
} from "styles/variables";
import { useTranslation } from "i18n";

const TextWrapper = styled.span`
  display: inline-block;
  padding: ${gutters.small / 4}px 0;
  text-align: left;
`;

export const ProductLabelWrapper = styled.div<{ isStatic?: boolean }>(({ isStatic = false }) => [
  !isStatic &&
    css`
      position: absolute;
      bottom: ${gutters.small / 2}px;
      left: ${gutters.small / 2}px;
    `,
  css`
    display: flex;
    align-items: center;
    border-radius: ${borderRadiusSmall};
    width: fit-content;
    max-width: 80%;
    min-height: 32px;
    padding: 0 ${gutters.small / 2}px;
    background-color: ${rgba(bittersweetRedColor, 0.9)};
    color: ${whiteColor};
    font-size: ${fontSizeMiddleCaption};
    font-weight: 600;
    line-height: ${fontSizeMiddleCaption};

    svg {
      margin-right: ${gutters.small / 2}px;
      width: 24px;
      min-width: 24px;
      fill: ${whiteColor};
    }
  `,
]);

export const SellOutLabel = ({
  className,
  isStatic,
}: {
  className?: string;
  isStatic?: boolean;
}) => {
  const { t } = useTranslation(Namespaces.commonNs);

  return (
    <ProductLabelWrapper className={className} isStatic={isStatic}>
      <WarningIcon />
      <TextWrapper>{t("Likely to sell out soon")}</TextWrapper>
    </ProductLabelWrapper>
  );
};
