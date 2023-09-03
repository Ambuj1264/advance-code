import React, { useMemo } from "react";
import styled from "@emotion/styled";
import { useTranslation } from "react-i18next";

import Section from "components/ui/Section/Section";
import { MobileContainer } from "components/ui/Grid/Container";
import GridRow from "components/ui/Grid/Row";
import Column from "components/ui/Grid/Column";
import IconList, { customIconListStyles } from "components/ui/IconList/IconList";
import { LeftSectionHeading } from "components/ui/Section/SectionHeading";
import { Namespaces } from "shared/namespaces";
import { mqMin } from "styles/base";
import { gutters } from "styles/variables";

const StyledIconList = styled(IconList)([customIconListStyles]);

const StyledSection = styled(Section)`
  ${mqMin.large} {
    margin-top: ${gutters.large}px;
  }
`;

const GTETourAmenitiesSection = ({
  includedItems,
  destinations,
  onDestinationClick,
}: {
  includedItems: SharedTypes.Icon[];
  destinations?: TravelStopTypes.TravelStops[];
  onDestinationClick: (travelStopInfo?: SharedTypes.Icon) => void;
}) => {
  const { t } = useTranslation(Namespaces.tourNs);
  const memoizedDestinations = useMemo(() => {
    return (
      destinations?.reduce((acc: SharedTypes.Icon[], curr) => [...acc, curr.info], []) ??
      ([] as SharedTypes.Icon[])
    );
  }, [destinations]);
  const hasDestinations = memoizedDestinations.length > 0;
  const defaultSingleColSize = { small: 2 } as SharedTypes.Columns;
  const defaultLargeAndSmallColSize = {
    small: 1,
    large: 2,
  } as SharedTypes.Columns;
  const includedLargeAndSmallColSize = {
    small: 1,
    large: hasDestinations ? 2 : 1,
  } as SharedTypes.Columns;
  return (
    <MobileContainer>
      <GridRow>
        {includedItems.length > 0 && (
          <Column columns={includedLargeAndSmallColSize}>
            <StyledSection id="tourIncluded">
              <LeftSectionHeading>{t("Included")}</LeftSectionHeading>
              <IconList
                sectionId="tourIncluded"
                iconList={includedItems}
                iconLimit={5}
                columns={{ small: 1, large: hasDestinations ? 1 : 2 }}
                inGrid={!hasDestinations}
                capitalize
              />
            </StyledSection>
          </Column>
        )}
        <>
          {/* TODO: Add a check if it's a multi day tour vs single day tour to display
        either one of the sections below */}
          {hasDestinations && (
            <Column columns={defaultLargeAndSmallColSize}>
              <Section id="tourDestinations">
                <LeftSectionHeading>{t("Destinations")}</LeftSectionHeading>
                <StyledIconList
                  sectionId="tourDestinations"
                  iconList={memoizedDestinations}
                  iconLimit={9}
                  onClick={onDestinationClick}
                  inGrid
                  columns={defaultSingleColSize}
                  capitalize
                />
              </Section>
            </Column>
          )}
        </>
      </GridRow>
    </MobileContainer>
  );
};

export default GTETourAmenitiesSection;
