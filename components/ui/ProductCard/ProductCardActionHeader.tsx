import React, { ElementType } from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import { useTheme } from "emotion-theming";
import rgba from "polished/lib/color/rgba";

import { typographyCaption, typographySubtitle3 } from "styles/typography";
import { whiteColor, gutters, bittersweetRedColor, placeholderColor } from "styles/variables";
import InformationIcon from "components/icons/information-circle.svg";
import EditIcon from "components/icons/pencil.svg";
import RemoveIcon from "components/icons/remove-circle.svg";
import { mqMin, singleLineTruncation } from "styles/base";

const iconStyles = css`
  margin: 0 ${gutters.large / 2}px;
  width: 14px;
  height: 14px;
  fill: ${whiteColor};

  ${mqMin.large} {
    margin: 0 ${gutters.small / 2}px;
  }
`;

export const ProductHeaderContainer = styled.div([
  typographyCaption,
  css`
    position: absolute;
    top: 0;
    display: flex;
    justify-content: space-between;
    margin-left: -${gutters.large / 2}px;
    width: 100%;
    height: 32px;
    color: white;

    ${mqMin.large} {
      height: 24px;
    }
  `,
]);

export const Product = styled.div<{
  isExpiredOffer: boolean;
  isRemovingAnotherItem?: boolean;
}>(({ theme, isExpiredOffer, isRemovingAnotherItem = false }) => [
  css`
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: ${theme.colors.primary};
  `,
  isRemovingAnotherItem &&
    css`
      background-color: ${rgba(theme.colors.primary, 0.6)};
    `,
  isExpiredOffer &&
    css`
      background-color: ${bittersweetRedColor};
    `,
]);

export const Actions = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  height: 100%;
`;

const Title = styled.div<{ isExpiredOffer: boolean; hasOnEditClick: boolean }>(
  ({ isExpiredOffer, hasOnEditClick }) => [
    typographySubtitle3,
    singleLineTruncation,
    css`
      max-width: calc(100% - ${hasOnEditClick ? 148 : 110}px);
      ${mqMin.large} {
        max-width: calc(100% - ${hasOnEditClick ? 120 : 92}px);
      }
    `,
    isExpiredOffer &&
      css`
        width: 100%;
        text-align: center;
      `,
  ]
);

const IconWrapper = styled.button<{ wrapperColor: string; disabled?: boolean }>(
  ({ wrapperColor, disabled = false }) => css`
    display: flex;
    align-items: center;
    background-color: ${wrapperColor};
    &:disabled {
      background-color: ${placeholderColor};
    }
    &:hover {
      background-color: ${disabled ? placeholderColor : rgba(wrapperColor, 0.7)};
    }
  `
);

const ProductCardActionHeader = ({
  title,
  Icon,
  onEditClick,
  onInformationClick,
  onRemoveClick,
  isExpiredOffer = false,
  className,
  disableActions = false,
}: {
  title: string;
  className?: string;
  Icon?: ElementType<any>;
  onEditClick?: () => void;
  onInformationClick?: (e: React.SyntheticEvent) => void;
  onRemoveClick?: () => void;
  isExpiredOffer?: boolean;
  disableActions?: boolean;
}) => {
  const theme: Theme = useTheme();
  return (
    <ProductHeaderContainer className={className}>
      <Product
        isExpiredOffer={isExpiredOffer}
        isRemovingAnotherItem={Boolean(disableActions && onRemoveClick)}
      >
        {Icon && <Icon css={iconStyles} />}
        <Title
          isExpiredOffer={isExpiredOffer}
          hasOnEditClick={onEditClick !== undefined}
          data-testid="productTitle"
          dangerouslySetInnerHTML={{ __html: title }}
        />
      </Product>
      <Actions>
        {onInformationClick && !isExpiredOffer && (
          <IconWrapper
            wrapperColor={
              disableActions ? rgba(theme.colors.primary, 0) : rgba(theme.colors.primary, 0.8)
            }
            onClick={onInformationClick}
          >
            <InformationIcon css={iconStyles} data-testid="informationIcon" />
          </IconWrapper>
        )}
        {onEditClick && !isExpiredOffer && (
          <IconWrapper
            wrapperColor={theme.colors.action}
            onClick={onEditClick}
            disabled={disableActions}
          >
            <EditIcon css={iconStyles} data-testid="editIcon" />
          </IconWrapper>
        )}
        {onRemoveClick && (
          <IconWrapper
            wrapperColor={bittersweetRedColor}
            onClick={onRemoveClick}
            disabled={disableActions}
          >
            <RemoveIcon css={iconStyles} data-testid="removeIcon" />
          </IconWrapper>
        )}
      </Actions>
    </ProductHeaderContainer>
  );
};

export default ProductCardActionHeader;
