import React, { useRef, useState, memo } from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import { useTheme } from "emotion-theming";

import ProductValuesTruncation from "./ProductValuesTruncation";

import { typographyCaptionSemibold } from "styles/typography";
import { borderRadius, gutters } from "styles/variables";
import { mqIE, mqMin, singleLineTruncation } from "styles/base";
import Column from "components/ui/Grid/Column";
import InformationCircle from "components/icons/information-circle.svg";
import Tooltip from "components/ui/Tooltip/Tooltip";
import LazyHydrateWrapper from "components/ui/LazyHydrateWrapper";

export const Wrapper = styled.div(
  ({ theme }) =>
    css`
      width: 100%;
      background-color: ${rgba(theme.colors.action, 0.05)};

      ${mqIE} {
        justify-content: space-between;

        &:before,
        &:after {
          content: "";
          display: block;
        }
      }

      ${mqMin.large} {
        border-radius: ${borderRadius};
      }
    `
);

const LoadableSvgIconWrapper = styled.div(
  ({ theme }) =>
    css`
      svg {
        margin-right: ${gutters.small / 2}px;
        width: 14px;
        min-width: 14px;
        height: auto;
        max-height: 16px;
        fill: ${theme.colors.action};

        ${mqIE} {
          height: 16px;
        }

        ${mqMin.large} {
          width: 16px;
          min-width: 16px;
          max-height: 18px;
        }
      }
    `
);

const StyledRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding-right: ${gutters.small}px;
  ${mqMin.medium} {
    padding: 0 ${gutters.large}px;
  }

  ${mqMin.large} {
    padding: 0;
  }
`;

export const ProductPropositionsValue = styled.div(singleLineTruncation);

const InformationCircleStyled = styled(InformationCircle)(
  ({ theme }) => css`
    position: absolute;
    right: -${gutters.small}px;
    bottom: -${gutters.large / 4}px;
    width: 12px;
    height: 12px;
    opacity: 0.7;
    fill: ${theme.colors.action};
  `
);

const TooltipStyled = styled(Tooltip)`
  max-width: 100%;
`;

const columnStyles = (theme: Theme, maxDesktopColumns: number, useTruncationIcon: boolean) =>
  css`
    ${typographyCaptionSemibold};
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 24px;
    padding: 0 ${useTruncationIcon ? gutters.large / 2 : 0}px 0 ${gutters.small}px;
    color: ${theme.colors.action};
    &:nth-of-type(n + ${5}) {
      display: none;
    }
    ${mqMin.large} {
      justify-content: center;
      height: 32px;
      &:nth-of-type(n + ${maxDesktopColumns + 1}) {
        display: none;
      }
    }
  `;

const ProductPropositions = ({
  productProps,
  maxDesktopColumns = 3,
  useTruncationIcon = true,
  className,
}: {
  productProps: SharedTypes.ProductProp[];
  maxDesktopColumns?: number;
  useTruncationIcon?: boolean;
  className?: string;
}) => {
  const theme: Theme = useTheme();
  const wrapperRef = useRef(null);
  const valueRefs = useRef(productProps.map(() => React.createRef<HTMLDivElement>()));
  const [truncatedValues, setTruncatedValues] = useState<Array<string | boolean>>([]);
  const largeCol =
    productProps.length < maxDesktopColumns ? productProps.length : maxDesktopColumns;

  return (
    <Wrapper className={className} ref={wrapperRef} data-nosnippet>
      <ProductValuesTruncation
        values={productProps}
        wrapperRef={wrapperRef}
        valueRefs={valueRefs}
        setTruncatedValues={setTruncatedValues}
      >
        <StyledRow>
          {productProps.map(({ title, Icon, description }: SharedTypes.ProductProp, index) => {
            const tooltipInfo = description || truncatedValues[index];
            const productProp = (
              <>
                <LazyHydrateWrapper ssrOnly>
                  <LoadableSvgIconWrapper>
                    <Icon />
                  </LoadableSvgIconWrapper>
                </LazyHydrateWrapper>

                <ProductPropositionsValue ref={valueRefs.current[index]}>
                  {title}
                </ProductPropositionsValue>
              </>
            );

            return (
              <Column
                key={title}
                columns={{ small: 2, large: largeCol }}
                css={columnStyles(theme, maxDesktopColumns, useTruncationIcon)}
              >
                {/* eslint-disable-next-line no-nested-ternary */}
                {!tooltipInfo ? (
                  productProp
                ) : useTruncationIcon || description ? (
                  <>
                    {productProp}
                    <Tooltip
                      title={tooltipInfo}
                      direction={description ? "center" : "left"}
                      tooltipWidth={description ? 200 : undefined}
                    >
                      <InformationCircleStyled />
                    </Tooltip>
                  </>
                ) : (
                  <TooltipStyled title={tooltipInfo} direction="left">
                    {productProp}
                  </TooltipStyled>
                )}
              </Column>
            );
          })}
        </StyledRow>
      </ProductValuesTruncation>
    </Wrapper>
  );
};

export default memo(ProductPropositions);
