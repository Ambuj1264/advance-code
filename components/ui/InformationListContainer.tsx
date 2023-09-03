import React from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";

import SectionContent from "components/ui/Section/SectionContent";
import GridRow from "components/ui/Grid/Row";
import Column from "components/ui/Grid/Column";
import CircleIcon from "components/icons/circle.svg";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import { gutters, greyColor, borderRadiusSmall } from "styles/variables";
import { capitalizeFirstLetter, mqMin } from "styles/base";
import { typographyBody2, typographySubtitle2 } from "styles/typography";
import { IconContainer } from "components/ui/IconList/IconItem";

const ItemWrapper = styled.div([
  typographyBody2,
  css`
    display: flex;
    align-items: flex-start;
    margin-top: ${gutters.small / 2}px;
    width: 100%;
    ${mqMin.medium} {
      margin-top: ${gutters.large}px;
    }
  `,
]);

const ItemTitle = styled.div<{ capitalize?: boolean }>(({ theme, capitalize }) => [
  typographySubtitle2,
  css`
    color: ${theme.colors.primary};
  `,
  capitalize && capitalizeFirstLetter,
]);

const ItemDescription = styled.div`
  color: ${greyColor};
  ${capitalizeFirstLetter};
`;

const CustomIconWrapper = styled.div<{}>(
  ({ theme }) =>
    css`
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 6px;
      margin-right: ${gutters.small / 2}px;
      border-radius: ${borderRadiusSmall};
      width: 40px;
      min-width: 40px;
      height: 32px;
      background-color: ${rgba(theme.colors.primary, 0.05)};
    `
);

const ItemTextWrapper = styled.div``;

const StyledCircleIcon = styled(CircleIcon)<{ isMobile: boolean }>(
  ({ isMobile, theme }) =>
    css`
      margin-top: ${isMobile ? "10px" : "12px"};
      width: 5px;
      min-width: 5px;
      height: auto;
      fill: ${theme.colors.primary};
    `
);

const StyledGridRow = styled(GridRow)`
  ${mqMin.medium} {
    margin-top: -${gutters.large}px;
  }
`;

const iconStyles = (theme: Theme) => css`
  width: 18px;
  height: auto;
  max-height: 20px;
  fill: ${theme.colors.primary};
`;

const InformationListContainer = ({
  informationList,
  capitalize,
}: {
  informationList: SharedTypes.Icon[];
  capitalize?: boolean;
}) => {
  const isMobile = useIsMobile();
  return (
    <SectionContent>
      <StyledGridRow>
        {informationList.map(({ id, title, description, details, Icon }: SharedTypes.Icon) => {
          return (
            <Column
              key={id}
              columns={{
                small: 1,
                large: informationList.length === 1 ? 1 : 2,
              }}
            >
              <ItemWrapper>
                {Icon ? (
                  <CustomIconWrapper>
                    <Icon css={iconStyles} />
                  </CustomIconWrapper>
                ) : (
                  <IconContainer>
                    <StyledCircleIcon isMobile={isMobile} />
                  </IconContainer>
                )}
                <ItemTextWrapper>
                  <ItemTitle capitalize={capitalize}>{title}</ItemTitle>
                  {description && (
                    <ItemDescription
                      dangerouslySetInnerHTML={{
                        __html: description,
                      }}
                    />
                  )}
                  {details && !description && <ItemDescription>{details}</ItemDescription>}
                </ItemTextWrapper>
              </ItemWrapper>
            </Column>
          );
        })}
      </StyledGridRow>
    </SectionContent>
  );
};

export default InformationListContainer;
