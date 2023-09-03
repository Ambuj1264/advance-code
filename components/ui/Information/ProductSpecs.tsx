import React, { useRef, useState, useEffect } from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import { useTheme } from "emotion-theming";
import Arrow from "@travelshift/ui/icons/arrow.svg";

import { isValueTruncated } from "../utils/uiUtils";

import Box from "./Box";

import InformationCircle from "components/icons/information-circle.svg";
import { QFText } from "components/ui/SimilarProducts/SimilarProductsLoading";
import HighlightedText from "components/ui/HighlightedText";
import Tooltip from "components/ui/Tooltip/Tooltip";
import { typographyCaption } from "styles/typography";
import {
  fontWeightSemibold,
  gutters,
  blackColor,
  borderRadiusSmall,
  greyColor,
} from "styles/variables";
import { mqMin, mqIE, singleLineTruncation, capitalizeFirstLetter } from "styles/base";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import { Namespaces } from "shared/namespaces";
import { Trans } from "i18n";
import { formatNumericValueToHumanReadable } from "utils/helperUtils";

const getColor = (color: "primary" | "action", theme: Theme) => {
  return theme.colors[color] || theme.colors.primary;
};

export const iconStyles = (color: string) =>
  css`
    width: 18px;
    min-width: 18px;
    height: auto;
    max-height: 18px;
    fill: ${color};
    svg {
      max-height: 18px;
      fill: ${color};
    }
    ${mqIE} {
      height: 18px;
    }
  `;

const Value = styled.div<{
  ref: React.Ref<HTMLDivElement>;
  noLabel: boolean;
  predominantColor: "primary" | "action";
}>(({ theme, noLabel, predominantColor }) => [
  typographyCaption,
  singleLineTruncation,
  capitalizeFirstLetter,
  css`
    color: ${noLabel ? greyColor : getColor(predominantColor, theme)};
  `,
  noLabel
    ? css`
        margin-top: 6px;
      `
    : "",
]);

export const Label = styled.div<{
  predominantColor: "primary" | "action";
}>(({ theme, predominantColor }) => [
  typographyCaption,
  singleLineTruncation,
  css`
    margin-top: 2px;
    padding-right: ${gutters.small / 4}px;
    color: ${predominantColor !== "primary" ? theme.colors.action : rgba(blackColor, 0.7)};
    font-weight: ${fontWeightSemibold};
  `,
]);

const ExpandButton = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
`;

const quickFactStyles = (fullWidth: boolean) => css`
  position: relative;
  display: flex;
  flex-basis: ${fullWidth ? 25 : 50}%;
  align-items: flex-start;
  margin-top: ${gutters.small}px;
  max-width: ${fullWidth ? 25 : 50}%;
  ${mqMin.large} {
    margin-top: ${gutters.large}px;
  }
`;

export const MAX_NUMBER_OF_ELEMENTS_TO_EXPAND = 8;

export const QuickFact = styled.div<{ fullWidth: boolean }>(({ fullWidth }) => [
  quickFactStyles(fullWidth),
  css`
    ${ExpandButton} ~ &:nth-of-type(n + ${MAX_NUMBER_OF_ELEMENTS_TO_EXPAND}) {
      position: absolute;
      height: 1px;
      opacity: 0;
    }
    ${ExpandButton}:checked ~ & {
      position: relative;
      display: flex;
      height: auto;
      opacity: 1;
    }
  `,
]);

export const ExpandButtonLabel = styled.label<{ fullWidth: boolean }>(({ theme, fullWidth }) => [
  quickFactStyles(fullWidth),
  typographyCaption,
  css`
    display: flex;
    align-items: center;
    cursor: pointer;
    color: ${theme.colors.primary};
    ${ExpandButton}:checked ~ & {
      display: none;
      margin-left: auto;
    }
    ${ExpandButton}:focus ~ & {
      outline: auto 5px;
      outline: auto 5px -webkit-focus-ring-color;
    }
  `,
]);

const ExpandButtonText = styled.span([
  singleLineTruncation,
  css`
    ${ExpandButton}:checked ~ ${ExpandButtonLabel} & {
      display: none;
    }
  `,
]);

const ExpandIcon = styled(Arrow)<{}>(({ theme }) => [
  css`
    margin-top: 2px;
    margin-right: ${gutters.small}px;
    width: 15px;
    height: 15px;
    transform: rotate(90deg);
    fill: ${theme.colors.primary};
    ${ExpandButton}:checked ~ ${ExpandButtonLabel} & {
      transform: rotate(-90deg);
    }
  `,
]);

const TextContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 65%;
  height: 100%;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const LabelWrapper = styled.div`
  display: flex;
`;

export const IconWrapper = styled.div<{
  predominantColor: "primary" | "action";
}>(
  ({ theme, predominantColor }) =>
    css`
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 6px;
      margin-right: ${gutters.small / 2}px;
      border-radius: ${borderRadiusSmall};
      width: 32px;
      min-width: 32px;
      height: 24px;
      background-color: ${rgba(getColor(predominantColor, theme), 0.05)};
      text-align: center;
    `
);

export const StyledBox = styled(Box)`
  padding: 0;
`;

const StyledQFText = styled(QFText)`
  position: relative;
  width: auto;
  min-width: 60px;
`;

const HighlightedTextStyled = styled(HighlightedText)(
  ({ color, theme }: { color: string; theme: Theme }) => [
    css`
      margin-top: 4px;
      margin-left: 0;
    `,
    color === "action" &&
      css`
        background-color: ${rgba(theme.colors.action, 0.05)};
        color: ${theme.colors.action};
      `,
  ]
);

const InformationCircleStyled = styled(InformationCircle)(
  ({ theme }) => css`
    width: 14px;
    height: 18px;
    opacity: 0.4;
    fill: ${theme.colors.primary};
  `
);

const BulletPointList = styled.ul`
  list-style: none;
  margin-block-end: 0;
  margin-block-start: 4px;
  padding-inline-start: 2px;
`;

const BulletPoint = styled.li(
  ({ theme }) => css`
    &:before {
      content: "•";
      display: inline-block;
      width: 1em;
      color: ${theme.colors.primary};
      font-weight: bold;
    }
  `
);
const ProductSpecInformation = ({ information }: { information: SharedTypes.ProductSpecInfo }) => {
  const { value, bulletPoints } = information;
  return (
    <>
      {value}
      {bulletPoints && (
        <BulletPointList>
          {bulletPoints.map(info => (
            <BulletPoint>{info}</BulletPoint>
          ))}
        </BulletPointList>
      )}
    </>
  );
};
const ProductSpec = ({
  productSpec,
  fullWidth,
  theme,
  isMobile,
  predominantColor,
  dataTestid,
  index,
}: {
  productSpec: SharedTypes.ProductSpec;
  fullWidth: boolean;
  theme: Theme;
  isMobile: boolean;
  predominantColor: Color;
  dataTestid?: string;
  index?: number;
}) => {
  const colorAsString = predominantColor as "primary" | "action";
  const ref = useRef(null);
  const { name, value, Icon, isLoading, subtitle, information } = productSpec;
  const [hasTruncatedValue, setHasTruncatedValue] = useState(false);
  useEffect(() => {
    if (ref) {
      setHasTruncatedValue(isValueTruncated(ref));
    }
  }, [ref]);
  return (
    <QuickFact key={name} fullWidth={fullWidth} data-testid={dataTestid}>
      <IconWrapper predominantColor={colorAsString}>
        <Icon css={iconStyles(getColor(colorAsString, theme))} />
      </IconWrapper>
      <TextContentWrapper>
        <LabelWrapper>
          {name && (
            <Label predominantColor={colorAsString} data-testid={`name-${index}`}>
              {name}
            </Label>
          )}
          {information?.value && (
            <Tooltip
              title={<ProductSpecInformation information={information} />}
              tooltipWidth={300}
              alwaysTop
            >
              <InformationCircleStyled />
            </Tooltip>
          )}
        </LabelWrapper>
        {hasTruncatedValue && !isMobile && !isLoading ? (
          <Tooltip title={value}>
            <Value
              ref={ref}
              noLabel={!name}
              predominantColor={colorAsString}
              data-testid={`value-${index}`}
            >
              {formatNumericValueToHumanReadable(value)}
            </Value>
          </Tooltip>
        ) : (
          <Value
            ref={ref}
            noLabel={!name}
            predominantColor={colorAsString}
            data-testid={`value-${index}`}
          >
            {formatNumericValueToHumanReadable(value)}
          </Value>
        )}
        {isLoading && <StyledQFText />}
        {subtitle && (
          <HighlightedTextStyled color={colorAsString} theme={theme}>
            {subtitle}
          </HighlightedTextStyled>
        )}
      </TextContentWrapper>
    </QuickFact>
  );
};

const ProductSpecs = ({
  id,
  fullWidth,
  className,
  productSpecs,
  isExpandable = false,
  predominantColor = "primary",
}: {
  id: string;
  className?: string;
  fullWidth: boolean;
  productSpecs: SharedTypes.ProductSpec[];
  isExpandable?: boolean;
  predominantColor?: Color;
}) => {
  const theme: Theme = useTheme();
  const wrapperRef = useRef(null);
  const isMobile = useIsMobile();
  const isShowExpendButton = productSpecs.length > MAX_NUMBER_OF_ELEMENTS_TO_EXPAND && isExpandable;
  return (
    <StyledBox fullWidth={fullWidth} className={className} theme={theme}>
      <Wrapper ref={wrapperRef} data-testid="product-specs-wrapper">
        {isShowExpendButton && <ExpandButton type="checkbox" id={`quickFactsExpandButton${id}`} />}
        {productSpecs.map((productSpec: SharedTypes.ProductSpec, index) => (
          <ProductSpec
            key={`${productSpec.value}-${productSpec.name}`}
            productSpec={productSpec}
            fullWidth={fullWidth}
            theme={theme}
            isMobile={isMobile}
            predominantColor={predominantColor}
            dataTestid={`product-spec-${index}`}
            index={index}
          />
        ))}
        {isShowExpendButton && (
          <ExpandButtonLabel fullWidth={fullWidth} htmlFor={`quickFactsExpandButton${id}`}>
            <ExpandIcon />
            <ExpandButtonText>
              <Trans
                ns={Namespaces.commonNs}
                i18nKey="+ {numberOfSpecsToExpand} Specifications"
                defaults="+ {numberOfSpecsToExpand} Specifications"
                values={{
                  numberOfSpecsToExpand: productSpecs.length - MAX_NUMBER_OF_ELEMENTS_TO_EXPAND + 1,
                }}
              />
            </ExpandButtonText>
          </ExpandButtonLabel>
        )}
      </Wrapper>
    </StyledBox>
  );
};

export default ProductSpecs;
