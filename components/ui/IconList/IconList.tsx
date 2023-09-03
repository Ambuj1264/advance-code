import React, { useEffect, useState } from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import ArrowIcon from "@travelshift/ui/icons/arrow.svg";

import IconItem from "./IconItem";

import Column from "components/ui/Grid/Column";
import { typographyH5, typographyBody2 } from "styles/typography";
import { borderRadiusSmall, gutters, whiteColor } from "styles/variables";
import { mqMax, mqMin } from "styles/base";
import GridRow from "components/ui/Grid/Row";
import { Trans } from "i18n";
import { Namespaces } from "shared/namespaces";
import { useIsMobile } from "hooks/useMediaQueryCustom";

const Arrow = styled(ArrowIcon)<{ isDark?: boolean }>(
  ({ theme, isDark = false }) => css`
    margin-right: ${isDark ? gutters.small / 2 : 0}px;
    width: 16px;
    min-width: 16px;
    height: 12px;
    fill: ${isDark ? theme.colors.primary : whiteColor};
  `
);

const HiddenCheckbox = styled.input`
  display: none;
`;

export const SeeMoreWrapper = styled.span(({ theme }) => [
  typographyBody2,
  css`
    display: flex;
    align-items: center;
    color: ${theme.colors.primary};
  `,
]);

export const ReadMoreTrigger = styled.label<{ hasImage: boolean }>(
  ({ hasImage }) => css`
    display: inline-block;
    margin-top: ${hasImage ? 0 : 24}px;
    cursor: pointer;
    ${SeeMoreWrapper} {
      margin-left: ${hasImage ? 0 : gutters.large / 2}px;
    }
  `
);

const columnStyles = (limit: number) =>
  css`
    &:nth-of-type(n + ${limit + 1}) {
      display: none;
    }
    ${HiddenCheckbox}:checked ~ & {
      display: block;
    }
  `;

const ShowMore = styled.span`
  ${HiddenCheckbox}:checked ~ * & {
    display: none;
  }
`;
const ShowLess = styled.span`
  display: none;
  ${HiddenCheckbox}:checked ~ * & {
    display: block;
  }
`;

export const SeeMoreButton = styled.span(({ theme }) => [
  typographyH5,
  css`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: ${gutters.small / 2}px;
    border-radius: ${borderRadiusSmall};
    width: 56px;
    height: 40px;
    background-color: ${theme.colors.primary};
    color: ${whiteColor};
    ${mqMin.medium} {
      margin-top: ${gutters.small / 2}px;
    }
  `,
]);

export const customIconListStyles = css`
  ${mqMax.large} {
    ${GridRow} {
      display: grid;
      grid-auto-columns: minmax(calc(50% - 8px), 1fr);
      grid-auto-flow: column;
      grid-gap: ${gutters.small / 2}px ${gutters.small}px;
      grid-template-columns: repeat(auto-fill, minmax(calc(50% - 8px), 1fr));
      grid-template-rows: auto auto auto;
      overflow-x: auto;
    }
    ${Column} {
      width: 100%;
    }
  }
`;

const IconList = ({
  sectionId,
  iconList,
  iconLimit = iconList.length,
  className,
  onClick,
  inGrid = false,
  columns = { small: 2, medium: 3, large: 4 },
  shouldUseDynamicLimit = false,
  capitalize,
}: {
  sectionId: string;
  iconList: ReadonlyArray<SharedTypes.Icon>;
  iconLimit?: number;
  className?: string;
  onClick?: (icon: SharedTypes.Icon) => void;
  inGrid?: boolean;
  columns?: SharedTypes.Columns;
  shouldUseDynamicLimit?: boolean;
  capitalize?: boolean;
}) => {
  const normalizedIconLimit = iconLimit + 1 === iconList.length ? iconLimit + 1 : iconLimit;
  const itemsLeft = iconList.length - normalizedIconLimit;
  const hasImage = iconList[0]?.image !== undefined;
  const [dynamicIconLimit, setDynamicIconLimit] = useState(normalizedIconLimit);
  const isMobile = useIsMobile();
  useEffect(() => {
    if (shouldUseDynamicLimit && normalizedIconLimit > 1) {
      // Since we usually have 3 icons per column
      if (normalizedIconLimit % 3) {
        setDynamicIconLimit(isMobile ? normalizedIconLimit + 1 : normalizedIconLimit);
      } else {
        setDynamicIconLimit(isMobile ? normalizedIconLimit - 1 : normalizedIconLimit);
      }
    }
  }, [normalizedIconLimit, isMobile, shouldUseDynamicLimit]);

  return (
    <div className={className}>
      <GridRow>
        <HiddenCheckbox type="checkbox" id={`${sectionId}-expand`} />
        {iconList.map((iconItem: SharedTypes.Icon) => {
          return (
            <Column
              key={iconItem.id}
              columns={inGrid ? columns : {}}
              css={columnStyles(dynamicIconLimit)}
            >
              <IconItem
                sectionId={sectionId}
                iconItem={iconItem}
                onClick={iconItem.isClickable ? onClick : undefined}
                capitalize={capitalize}
              />
            </Column>
          );
        })}
        {itemsLeft > 0 && (
          <Column columns={inGrid ? columns : {}}>
            <ReadMoreTrigger htmlFor={`${sectionId}-expand`} hasImage={hasImage}>
              <ShowMore>
                <SeeMoreWrapper>
                  {" "}
                  {hasImage ? (
                    <SeeMoreButton>{`+${itemsLeft}`}</SeeMoreButton>
                  ) : (
                    <Arrow
                      isDark={!hasImage}
                      css={css`
                        transform: rotate(90deg);
                      `}
                    />
                  )}
                  <Trans ns={Namespaces.commonNs}>Show more</Trans>
                </SeeMoreWrapper>
              </ShowMore>
              <ShowLess>
                <SeeMoreWrapper>
                  {hasImage ? (
                    <SeeMoreButton>
                      <Arrow
                        css={css`
                          transform: rotate(-90deg);
                        `}
                      />
                    </SeeMoreButton>
                  ) : (
                    <Arrow
                      isDark
                      css={css`
                        transform: rotate(-90deg);
                      `}
                    />
                  )}
                  <Trans ns={Namespaces.commonNs}>Show less</Trans>
                </SeeMoreWrapper>
              </ShowLess>
            </ReadMoreTrigger>
          </Column>
        )}
      </GridRow>
    </div>
  );
};

export default IconList;
