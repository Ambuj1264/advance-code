import { css } from "@emotion/core";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";

import ProductNotification from "../ProductPageNotification/ProductNotification";

import {
  blackColor,
  borderRadiusSmall,
  fontSizeBody2,
  fontWeightSemibold,
  gutters,
  lightBlueColor,
} from "styles/variables";
import {
  column,
  container,
  DefaultMarginTop,
  mqMax,
  mqMin,
  skeletonPulse,
  styledWebkitScrollbar,
} from "styles/base";
import { ProductCardContainer } from "components/ui/ProductCard/ProductCardContainer";
import GridColumn from "components/ui/Grid/Column";
import Row from "components/ui/Grid/Row";

export const Column = styled.div<{ small?: number; large?: number }>(
  ({ small = 1, large = 1 / 2 }) => [
    css`
      margin-top: ${gutters.small}px;
      ${mqMin.large} {
        margin-top: 0;
        &:nth-of-type(n + 3) {
          margin-top: ${gutters.large}px;
        }
      }
    `,
    column({ small, large }),
  ]
);

export const CardContainer = styled(ProductCardContainer)(
  ({
    isExpiredOffer,
    isRemovingAnotherItem = false,
  }: {
    isExpiredOffer: boolean;
    isRemovingAnotherItem?: boolean;
    className?: string;
  }) => [
    isRemovingAnotherItem &&
      css`
        img {
          opacity: 0.5;
        }
      `,
    isExpiredOffer &&
      css`
        background-color: ${rgba(blackColor, 0.2)};
        img {
          opacity: 0.2;
        }
      `,
  ]
);

export const InputWithIconWrapper = styled.div`
  position: relative;

  svg {
    position: absolute;
    top: 50%;
    right: ${gutters.small / 2}px;
    border-radius: 3px;
    width: 27px;
    height: 18px;
    transform: translateY(-50%);

    &:nth-of-type(2) {
      right: 38px;
    }
  }
`;

export const RestWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const PaymentMethodsContainer = styled.div([
  styledWebkitScrollbar,
  css`
    display: flex;
    margin-bottom: ${gutters.small / 2}px;
    margin-left: -${gutters.small / 2}px;
    max-width: 100%;
    padding: ${gutters.small / 2}px;
    padding-top: 2px;
    overflow-x: auto;
  `,
]);

export const InputSkeleton = styled.div`
  ${skeletonPulse}
  display: block;
  border-radius: ${borderRadiusSmall};
  width: 100%;
  height: 40px;

  ${mqMin.large} {
    height: 45px;
  }
`;

export const LabelSkeleton = styled.div`
  ${skeletonPulse}
  width: 30%;
  min-width: 100px;
  height: 19px;
`;

export const ColumnWithMarginTop = styled(GridColumn)`
  ${DefaultMarginTop}
`;

export const CartWrapperContainer = styled.div([
  container,
  css`
    padding-bottom: ${gutters.large * 5}px;
  `,
]);

export const CartContainerColumn = styled.div(column({ small: 1, large: 1 / 2 }));

export const CartContainerRow = styled(Row)([
  css`
    ${mqMin.large} {
      ${DefaultMarginTop};
    }
  `,
]);

export const CartStyledProductNotification = styled(ProductNotification)`
  ${mqMax.large} {
    bottom: 58px;
  }
`;

export const LoadingPrice = styled.span([
  skeletonPulse,
  css`
    margin-left: auto;
    width: 100px;
    height: 26px;

    ${mqMin.medium} {
      width: 40%;
      min-width: 100px;
    }
  `,
]);

export const SectionTitle = styled.div`
  margin-bottom: ${gutters.small / 2}px;
  width: 100%;
  height: ${gutters.large}px;
  background-color: ${rgba(lightBlueColor, 0.05)};
  color: ${lightBlueColor};
  font-size: ${fontSizeBody2};
  font-weight: ${fontWeightSemibold};
  line-height: ${gutters.large}px;
  text-align: center;

  ${Row} + & {
    margin-top: ${gutters.large}px;
  }
`;
