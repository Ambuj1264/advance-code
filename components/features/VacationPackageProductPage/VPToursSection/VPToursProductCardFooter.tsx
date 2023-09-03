import React, { useCallback } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { LoadingFooterContent, TextWrapper, Wrapper } from "../VPProductCardFooter";
import PriceWithoutTotal from "../PriceWithoutTotal";

import { Namespaces } from "shared/namespaces";
import Checkbox, { HiddenInput, Label } from "components/ui/Inputs/Checkbox";
import { useTranslation } from "i18n";
import { skeletonPulse } from "styles/base";
import { whiteColor } from "styles/variables";

export const StyledWrapper = styled(Wrapper)`
  &:hover {
    cursor: pointer;
  }
`;
export const CheckboxStyled = styled(Checkbox)`
  ${HiddenInput}::after {
    align-self: center;
  }
  ${Label}::after {
    background-color: ${whiteColor};
  }
`;

export const LoadingFooterText = styled.span([
  skeletonPulse,
  css`
    display: inline-block;
    width: 70px;
    height: 24px;
  `,
]);

const VPTourCardFooterInfo = ({
  isSelected,
  isSubmitted,
  value,
  price,
}: {
  isSelected: boolean;
  isSubmitted: boolean;
  value: string;
  price: number;
}) => {
  const { t: vacationPackageT } = useTranslation(Namespaces.vacationPackageNs);
  if (isSelected && !isSubmitted) {
    return <LoadingFooterText />;
  }
  if (isSubmitted && value !== "") {
    return (
      <TextWrapper>
        {vacationPackageT("{numberOfTravelers} travelers", {
          numberOfTravelers: value,
        })}
      </TextWrapper>
    );
  }
  return <PriceWithoutTotal value={price} />;
};

const VPTourProductCardFooter = ({
  price,
  className,
  checkboxValue,
  isSelected,
  isCardDisabled = false,
  productId,
  onSelectCard,
  day,
  isSubmitted,
}: {
  price?: number;
  className?: string;
  checkboxValue: string | number;
  isSelected: boolean;
  isCardDisabled?: boolean;
  productId: string;
  onSelectCard: (productId: string) => void;
  day: number;
  isSubmitted: boolean;
}) => {
  const value = checkboxValue.toString();
  const handleSelectCard = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      onSelectCard(productId);
    },
    [onSelectCard, productId]
  );

  return isCardDisabled || price === undefined ? (
    <Wrapper className={className} isSelected={isSubmitted}>
      <LoadingFooterContent />
    </Wrapper>
  ) : (
    <StyledWrapper className={className} isSelected={isSubmitted} onClick={handleSelectCard}>
      <CheckboxStyled
        id={`${day}-${productId}-checkbox`}
        name={`${day}-checkbox`}
        checked={isSelected}
        value={value}
        reverse
        label={
          <VPTourCardFooterInfo
            isSelected={isSelected}
            isSubmitted={isSubmitted}
            value={value}
            price={price}
          />
        }
      />
    </StyledWrapper>
  );
};

export default VPTourProductCardFooter;
