import React from "react";
import { useTheme } from "emotion-theming";
import styled from "@emotion/styled";

import FilterIcon from "components/icons/filters.svg";
import Button from "components/ui/Inputs/Button";
import { ButtonSize } from "types/enums";
import { whiteColor, gutters } from "styles/variables";
import { singleLineTruncation } from "styles/base";
import { Namespaces } from "shared/namespaces";
import { Trans } from "i18n";

const ButtonStyled = styled(Button, { shouldForwardProp: () => true })`
  ${singleLineTruncation};
  display: inline-block;
  justify-content: start;
`;

const FilterIconStyled = styled(FilterIcon)`
  margin-right: ${gutters.small / 2}px;
  width: 16px;
  height: 16px;
  vertical-align: middle;
  fill: ${whiteColor};
`;

export const MobileFooterButton = ({
  children,
  onClick,
  className,
  color = "action",
  ...props
}: {
  children: string | React.ReactElement | ReadonlyArray<React.ReactElement | string>;
  onClick: () => void;
  color?: "action" | "primary" | "error";
  props?: object;
  className?: string;
}) => {
  const theme: Theme = useTheme();

  return (
    <ButtonStyled
      color={color}
      theme={theme}
      buttonSize={ButtonSize.Small}
      onClick={onClick}
      className={className}
      {...props}
    >
      {children}
    </ButtonStyled>
  );
};

export const MobileFooterFilterButton = ({
  onClick,
  numberOfSelectedFilters,
  className,
}: {
  onClick: () => void;
  numberOfSelectedFilters?: number;
  className?: string;
}) => {
  return (
    <MobileFooterButton onClick={onClick} className={className}>
      <FilterIconStyled />
      {numberOfSelectedFilters ? (
        <Trans
          ns={Namespaces.commonSearchNs}
          i18nKey="{numberOfSelectedFilters} filters"
          defaults="{numberOfSelectedFilters} filters"
          values={{ numberOfSelectedFilters }}
        />
      ) : (
        <Trans ns={Namespaces.commonSearchNs}>Filters</Trans>
      )}
    </MobileFooterButton>
  );
};
