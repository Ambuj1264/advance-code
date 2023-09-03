import styled from "@emotion/styled";
import React, { ReactNode, SyntheticEvent, useCallback } from "react";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";
import Arrow from "@travelshift/ui/icons/arrow.svg";

import RadioButton, { RadioButtonLabel } from "../Inputs/RadioButton";
import Checkbox, { HiddenInput, Label as CheckboxLael } from "../Inputs/Checkbox";

import { useOnToggleModal } from "components/features/VacationPackageProductPage/contexts/VPStateHooks";
import { TooltipWrapper } from "components/ui/Tooltip/Tooltip";
import ImageComponent from "components/ui/ImageComponent";
import ProductSpecs, {
  IconWrapper,
  Label,
  QuickFact,
} from "components/ui/Information/ProductSpecs";
import { typographyBody2, typographyBody2Semibold, typographyCaption } from "styles/typography";
import InformationIcon from "components/icons/information-circle.svg";
import { borderRadius, gutters, guttersPx, zIndex } from "styles/variables";
import { mqMax, mqMin, singleLineTruncation, skeletonPulse } from "styles/base";
import { VPActiveModalTypes } from "components/features/VacationPackageProductPage/contexts/VPModalStateContext";
import InformationTooltip, {
  InformationCircleIcon,
} from "components/ui/Tooltip/InformationTooltip";

const radioButtonWidth = 27;

export const SelectContentItemWrapper = styled.div<{
  isSelected?: boolean;
  isFirstItem?: boolean;
}>(({ theme, isSelected, isFirstItem }) => [
  css`
    position: relative;
    margin: 0 ${guttersPx.largeHalf};
    height: 100%;
    padding: ${guttersPx.small} 0 ${guttersPx.smallHalf};
    cursor: pointer;
    color: ${isSelected ? theme.colors.action : theme.colors.primary};
  `,
  isFirstItem &&
    css`
      padding: ${guttersPx.smallHalf} 0;
    `,
]);

const StyledInformationIcon = styled(InformationIcon)`
  width: 14px;
  height: 14px;
  fill: currentColor;
`;

export const InfoIcon = styled.div`
  margin-right: ${gutters.small / 2}px;
  margin-bottom: ${gutters.small / 4}px;
  width: 14px;
  height: 16px;
  cursor: pointer;
`;

const ProductSelectRow = styled.div`
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  padding-right: ${radioButtonWidth}px;
`;

const ProductSelectBottomRow = styled.div<{
  isCarExtras?: boolean;
}>(
  ({ isCarExtras }) => css`
    position: relative;
    z-index: ${zIndex.z2};
    display: flex;
    justify-content: ${isCarExtras ? "flex-end" : "normal"};
    padding-top: ${guttersPx.smallHalf};
  `
);

const ProductSelectColumn = styled.div<{ fixedWidth?: boolean }>(({ fixedWidth }) => [
  css`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: center;
    min-width: 0;
  `,
  fixedWidth &&
    css`
      flex-grow: 0;
      flex-shrink: 0;
    `,
]);

const ImageWrapper = styled.div`
  margin-right: ${guttersPx.smallHalf};
  border-radius: ${borderRadius};
  width: 70px;
  height: 60px;
  text-align: center;
  overflow: hidden;
`;

const ProductTitleWrapper = styled.div`
  position: relative;
  /* 24px of the typographyBody2 line-height in "ProductTitle" and 8px of the bottom padding */
  height: 32px;
`;

const ProductTitle = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  width: 100%;
  padding-bottom: ${guttersPx.smallHalf};
  color: inherit;
`;

const TitleWrapper = styled.div([typographyBody2, singleLineTruncation]);

const ImageComponentStyled = styled(ImageComponent)`
  display: inline;
  max-height: 60px;
  vertical-align: middle;
`;

const SpecsWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  max-width: 100%;
`;

const ProductSpecsStyled = styled(ProductSpecs)`
  flex-grow: 1;
  margin: ${gutters.small / 2}px ${gutters.small}px ${gutters.small}px ${gutters.small}px;
  border-radius: ${borderRadius};
  padding: 0 0 ${gutters.large / 2}px 0px;

  ${mqMin.medium} {
    float: none;
    margin: 0;
    border-radius: ${borderRadius};
  }

  ${mqMax.medium} {
    margin: ${gutters.small / 2}px ${gutters.small}px 0px 0px;
    width: 100%;
  }
  ${mqMin.large} {
    padding: 0;
  }

  ${QuickFact} {
    margin: 0;
    padding-right: ${guttersPx.small};
    &:only-of-type {
      flex-basis: 100%;
      max-width: none;
    }
    &:last-of-type {
      padding-right: 0;
    }

    ${Label} {
      margin-bottom: 2px;
    }

    ${IconWrapper} {
      margin-right: ${guttersPx.smallHalf};
      > svg {
        ${mqMax.large} {
          width: 16px;
          min-width: 16px;
          height: auto;
          max-height: 16px;
        }
      }
      > div > svg {
        max-height: 16px;
        ${mqMin.large} {
          max-height: 18px;
        }
      }
    }
  }
`;

const RadioButtonStyled = styled(RadioButton)`
  position: absolute;
  top: 55%;
  right: -${gutters.small}px;
  z-index: ${zIndex.z1};
  height: 100%;
  text-align: center;
  transform: translate(-50%, -50%);

  ${RadioButtonLabel} {
    top: calc(25% - 4px);
    padding-left: ${radioButtonWidth}px;
  }
`;

const CheckboxWrapper = styled.div`
  position: absolute;
  top: 52%;
  right: -${gutters.small}px;
  height: 100%;
  text-align: center;
  transform: translate(-50%, -50%);
  ${mqMin.large} {
    z-index: -1;
  }
`;

const CheckboxStyled = styled(Checkbox)`
  top: calc(43% - 4px);
  ${CheckboxLael} {
    padding-left: 7px;
  }

  ${HiddenInput}::after {
    align-self: center;
  }

  svg {
    margin-left: -21px;
  }
`;

const PriceLabel = styled.div(
  [typographyBody2],
  css`
    flex-grow: 1;
  `
);

const ExtrasWrapper = styled.div`
  align-self: flex-end;
  text-align: right;
`;

const ExtraLinkTitle = styled.span([
  typographyCaption,
  css`
    display: inline-block;
    color: inherit;
    vertical-align: middle;
  `,
]);

const ExtraLinkWrapper = styled.div`
  display: inline-block;
  margin-left: ${guttersPx.smallHalf};
  cursor: pointer;
`;

const ArrowIcon = styled(Arrow)`
  display: inline-block;
  margin-top: 2px;
  margin-left: 2px;
  width: 13px;
  height: 9px;
  vertical-align: middle;
  transform: rotate(90deg);
  fill: currentColor;
`;

export const LoadingPriceSkeleton = styled.span([
  skeletonPulse,
  css`
    display: inline-block;
    width: 70px;
    height: 16px;
  `,
]);

const StyledInformationTooltip = styled(InformationTooltip)(
  ({ theme }) => css`
    padding-right: ${gutters.small / 2}px;
    cursor: pointer;
    ${TooltipWrapper} {
      padding: ${gutters.small}px;
    }
    ${InformationCircleIcon} {
      margin-bottom: ${gutters.large / 4}px;
      width: 14px;
      height: 16px;
      fill: ${theme.colors.primary};
    }
    > button {
      margin-left: 0;
    }
  `
);

export type BookingWidgetExtraType = {
  name: string;
  onClick: (e: SyntheticEvent<HTMLDivElement>) => void;
};

const ExtraLink = ({ name, onClick }: BookingWidgetExtraType) => {
  return (
    <ExtraLinkWrapper onClick={onClick}>
      <ExtraLinkTitle>{name}</ExtraLinkTitle>
      <ArrowIcon />
    </ExtraLinkWrapper>
  );
};

export const BookingWidgetProductSelectItem = ({
  className,
  productId,
  productName,
  isSelected,
  image,
  productSpecs,
  priceLabel,
  extras,
  extrasContent,
  sectionName,
  onSelectCard,
  hideExtras = false,
  onMobileWidget = false,
  inCarSection = false,
  isFirstItem = false,
  infoModalId = VPActiveModalTypes.None,
  modalProductId,
  multiSelect,
  informationTooltipContent,
}: {
  className?: string;
  sectionName: string;
  productId: string;
  productName: string;
  isSelected?: boolean;
  isFirstItem?: boolean;
  image?: Image;
  productSpecs?: SharedTypes.ProductSpec[];
  priceLabel?: string;
  extras?: BookingWidgetExtraType[];
  extrasContent?: ReactNode;
  hideExtras?: boolean;
  onSelectCard: (productId: string) => void;
  onMobileWidget?: boolean;
  inCarSection?: boolean;
  infoModalId?: VPActiveModalTypes;
  modalProductId?: string;
  multiSelect?: boolean;
  informationTooltipContent?: string | React.ReactNode;
}) => {
  const [, toggleInfoModal] = useOnToggleModal(infoModalId, modalProductId);
  const onClickHandler = useCallback(() => {
    onSelectCard(productId);
  }, [onSelectCard, productId]);

  const isExtrasShown = Boolean(!hideExtras && isSelected && extras && extras.length > 0);

  const isExtrasContentShown = Boolean(!hideExtras && isSelected && extrasContent);

  const onInfoClickHandler = useCallback(
    e => {
      e.stopPropagation();
      toggleInfoModal();
    },
    [toggleInfoModal]
  );

  return (
    <SelectContentItemWrapper
      className={className}
      title={productName}
      onClick={onClickHandler}
      isSelected={isSelected}
      isFirstItem={isFirstItem}
    >
      <ProductSelectRow>
        {image && (
          <ProductSelectColumn fixedWidth>
            <ImageWrapper>
              <ImageComponentStyled
                imageUrl={image.url}
                imageAlt={image.name}
                width={70}
                height={60}
              />
            </ImageWrapper>
          </ProductSelectColumn>
        )}
        <ProductSelectColumn>
          <ProductTitleWrapper>
            <ProductTitle>
              {infoModalId !== VPActiveModalTypes.None &&
                modalProductId &&
                !informationTooltipContent && (
                  <InfoIcon onClick={onInfoClickHandler}>
                    <StyledInformationIcon />
                  </InfoIcon>
                )}
              {informationTooltipContent && (
                <StyledInformationTooltip
                  information={informationTooltipContent}
                  direction="right"
                  tooltipWidth={300}
                  topThreshold={500}
                />
              )}
              <TitleWrapper>{productName}</TitleWrapper>
            </ProductTitle>
          </ProductTitleWrapper>
          {productSpecs && (
            <SpecsWrapper>
              <ProductSpecsStyled
                id={String(productId)}
                productSpecs={productSpecs.slice(0, 2)}
                fullWidth={false}
                predominantColor={isSelected ? "action" : "primary"}
              />
            </SpecsWrapper>
          )}
        </ProductSelectColumn>
      </ProductSelectRow>
      {multiSelect ? (
        <CheckboxWrapper>
          <CheckboxStyled
            id={String(productId)}
            name={`${productId}-checkbox`}
            checked={isSelected}
            value="value"
            reverse
            disabled={onMobileWidget}
            label=""
          />
        </CheckboxWrapper>
      ) : (
        <RadioButtonStyled
          id={String(productId)}
          checked={isSelected}
          onChange={() => {}}
          label=""
          name={sectionName}
          value="value"
        />
      )}
      <ProductSelectBottomRow isCarExtras={isExtrasContentShown}>
        {isSelected && inCarSection && onMobileWidget ? null : (
          <PriceLabel>
            {priceLabel && priceLabel.length ? priceLabel : <LoadingPriceSkeleton />}
          </PriceLabel>
        )}
        {(onMobileWidget && isExtrasContentShown && extrasContent) || null}
        <ExtrasWrapper>
          {isExtrasShown &&
            extras!.map(extra => (
              <ExtraLink key={extra.name} name={extra.name} onClick={extra.onClick} />
            ))}
        </ExtrasWrapper>
      </ProductSelectBottomRow>
    </SelectContentItemWrapper>
  );
};

const SelectContentWrapper = styled.div(
  ({ theme }) => css`
    ${SelectContentItemWrapper} + ${SelectContentItemWrapper} {
      border-top: 4px solid ${rgba(theme.colors.primary, 0.1)};
    }
  `
);

const Title = styled.div([
  typographyBody2Semibold,
  ({ theme }) => css`
    height: 32px;
    background-color: ${rgba(theme.colors.primary, 0.1)};
    color: ${theme.colors.primary};
    line-height: 32px;
    text-align: center;
  `,
]);

export const BookingWidgetProductSelectContainer = ({
  title,
  children,
  className,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) => {
  return (
    <SelectContentWrapper className={className}>
      {title && <Title>{title}</Title>}
      {children}
    </SelectContentWrapper>
  );
};
