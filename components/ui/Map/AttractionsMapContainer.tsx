import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { useTranslation } from "react-i18next";

import GridRow from "components/ui/Grid/Row";
import Column from "components/ui/Grid/Column";
import ProductMapContainer from "components/ui/Cover/CoverMap/ProductMapContainer";
import IconList, {
  customIconListStyles,
  SeeMoreButton,
  SeeMoreWrapper,
} from "components/ui/IconList/IconList";
import Section from "components/ui/Section/Section";
import { LeftSectionHeading } from "components/ui/Section/SectionHeading";
import { gutters } from "styles/variables";
import { MobileContainer } from "components/ui/Grid/Container";
import { clampLines, mqMax } from "styles/base";
import { Text, IconItemWrapper } from "components/ui/IconList/IconItem";

export const StyledColumn = styled(Column)`
  margin: ${gutters.large / 2}px 0;
`;

export const StyledLeftSectionHeading = styled(LeftSectionHeading)`
  margin-bottom: ${gutters.small}px;
`;

const MapTitle = () => {
  const { t } = useTranslation();
  return <StyledLeftSectionHeading>{t("Map")}</StyledLeftSectionHeading>;
};

export const StyledIconList = styled(IconList)<{ iconLimit: number; iconList: any }>([
  customIconListStyles,
  ({ iconLimit, iconList }) => css`
    grid-template-columns: repeat(auto-fill, 240px);
    margin-top: ${gutters.small}px;
    ${GridRow} {
      padding-bottom: ${gutters.small / 2 - 2}px;
    }
    span {
      line-height: 18px;
    }
    ${IconItemWrapper} {
      margin-top: 0;
      margin-bottom: ${gutters.large + 4}px;
      ${mqMax.large} {
        margin-bottom: ${gutters.small / 2}px;
      }
    }
    ${SeeMoreWrapper} {
      align-items: center;
    }
    ${SeeMoreButton} {
      margin-top: 0;
    }
    ${Column} {
      &:nth-of-type(${iconLimit}) {
        ${IconItemWrapper} {
          margin-bottom: 0;
        }
      }
    }
    ${Text} {
      ${clampLines(2)}
    }
    ${iconList?.length < 5 &&
    `${GridRow} {
      grid-template-rows: ${iconList?.length > 2 ? "auto auto" : "auto"};
    }`}
  `,
]);

const AttractionsMapContainer = ({
  sectionId,
  attractions,
  map,
  attractionsTitle,
  onIconClick,
  className,
  shouldUseDynamicLimit,
  useAlternateStaticImageOnly,
}: {
  sectionId: string;
  attractions: ReadonlyArray<SharedTypes.Icon>;
  map: SharedTypes.Map;
  attractionsTitle: string;
  onIconClick?: (icon: SharedTypes.Icon) => void;
  className?: string;
  shouldUseDynamicLimit?: boolean;
  useAlternateStaticImageOnly?: boolean;
}) => (
  <MobileContainer>
    <Section id={sectionId}>
      <GridRow className={className}>
        <StyledColumn columns={{ small: 1, large: 2 }}>
          <MapTitle />
          <ProductMapContainer
            mapData={map}
            mapId={sectionId}
            useAlternateStaticImageOnly={useAlternateStaticImageOnly}
          />
        </StyledColumn>
        <StyledColumn columns={{ small: 1, large: 2 }}>
          <StyledLeftSectionHeading>{attractionsTitle}</StyledLeftSectionHeading>
          <StyledIconList
            className={className}
            sectionId={sectionId}
            iconList={attractions}
            iconLimit={9}
            inGrid
            columns={{ small: 2 }}
            onClick={onIconClick}
            shouldUseDynamicLimit={shouldUseDynamicLimit}
          />
        </StyledColumn>
      </GridRow>
    </Section>
  </MobileContainer>
);

export default AttractionsMapContainer;

export const StyledAttractionsMapContainer = styled(AttractionsMapContainer)`
  ${StyledColumn} {
    ${mqMax.large} {
      margin: 0;
      &:last-of-type {
        margin-top: ${gutters.small * 2}px;
      }
    }
  }
`;
