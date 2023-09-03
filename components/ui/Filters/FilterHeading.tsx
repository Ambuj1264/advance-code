import React, { ElementType } from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import { useTheme } from "emotion-theming";
import CloseIcon from "@travelshift/ui/icons/close.svg";

import { blackColor, gutters, greyColor } from "styles/variables";
import { typographySubtitle1, typographyBody2 } from "styles/typography";
import { Namespaces } from "shared/namespaces";
import { Trans } from "i18n";

const iconStyles = (theme: Theme) => css`
  width: 20px;
  height: 20px;
  fill: ${theme.colors.primary};
`;

const StyledCloseIcon = styled(CloseIcon)`
  margin-left: ${gutters.small / 2}px;
  width: 10px;
  height: 10px;
  fill: ${rgba(greyColor, 0.7)};
`;

const FilterText = styled.button([
  typographyBody2,
  css`
    display: flex;
    align-items: center;
    color: ${rgba(greyColor, 0.7)};
    line-height: 20px;
  `,
]);

const Title = styled.span([
  typographySubtitle1,
  css`
    margin-left: ${gutters.small + gutters.small / 4}px;
    color: ${rgba(blackColor, 0.7)};
  `,
]);

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const FilterHeading = ({
  title,
  Icon,
  numberOfSelectedFilters,
  onClearFilterClick,
  isRange = false,
  skipClear = false,
}: {
  title: string;
  Icon: ElementType<any>;
  numberOfSelectedFilters: number;
  onClearFilterClick: () => void;
  isRange?: boolean;
  skipClear?: boolean;
}) => {
  const theme: Theme = useTheme();
  return (
    <Container>
      <TitleWrapper>
        <Icon css={iconStyles(theme)} />
        <Title>{title}</Title>
      </TitleWrapper>
      {numberOfSelectedFilters > 0 && !skipClear && (
        <FilterText onClick={onClearFilterClick}>
          {!isRange ? (
            <Trans
              ns={Namespaces.commonSearchNs}
              i18nKey="{numberOfSelectedFilters} filters"
              defaults="{numberOfSelectedFilters} filters"
              values={{ numberOfSelectedFilters }}
            />
          ) : (
            <Trans>Clear</Trans>
          )}
          <StyledCloseIcon />
        </FilterText>
      )}
    </Container>
  );
};

export default FilterHeading;
