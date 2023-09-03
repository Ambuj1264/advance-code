import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import OpeningHours from "./OpeningHours";

import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import GridRow from "components/ui/Grid/Row";
import Column from "components/ui/Grid/Column";
import { LeftSectionHeading } from "components/ui/Section/SectionHeading";
import SectionContent from "components/ui/Section/SectionContent";
import Section from "components/ui/Section/Section";
import { gutters, blackColor, fontWeightSemibold } from "styles/variables";
import { typographyBody1 } from "styles/typography";
import ProductMapContainer from "components/ui/Cover/CoverMap/ProductMapContainer";
import { mqMin } from "styles/base";
import { getMapDataWithMapboxStaticImage } from "components/ui/Cover/CoverMap/Google/mapUtils";

const StyledColumn = styled(Column)`
  margin: ${gutters.large / 2}px 0;
`;

const StyledStructureColumn = styled(Column)`
  padding: 0;
  ${mqMin.large} {
    padding: 0;
  }
`;

const StyledLeftSectionHeading = styled(LeftSectionHeading)`
  margin-bottom: ${gutters.large}px;
`;

const DetailsContainer = styled.div([
  typographyBody1,
  css`
    margin-top: ${gutters.small}px;
    color: ${rgba(blackColor, 0.7)};
  `,
]);

const AdditionalInformation = styled.div`
  margin-top: ${gutters.small}px;
`;

const DetailsTitle = styled.div`
  margin-right: ${gutters.small / 4}px;
  font-weight: ${fontWeightSemibold};
`;

const DetailsTitleWrapper = styled.div`
  display: flex;
`;

const DetailInfoWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-items: flex-start;

  ${mqMin.desktop} {
    flex-direction: row;
  }
`;

const COLUMN_SIZES = { small: 1, desktop: 2 };

const CarLocationDetailsContainer = ({
  locationDetails,
  activeLocale,
  useAlternateStaticImageOnly = false,
}: {
  locationDetails: CarTypes.LocationsDetails;
  activeLocale: string;
  useAlternateStaticImageOnly?: boolean;
}) => {
  const { t: commonT } = useTranslation(Namespaces.commonCarNs);
  const { pickup, dropoff } = locationDetails;
  const locationItems = pickup.address === dropoff.address ? [pickup] : [pickup, dropoff];
  const titles =
    locationItems.length === 1
      ? [commonT("Pick-up & Drop-off location")]
      : [commonT("Pick-up location"), commonT("Drop-off location")];
  const detailsTitles =
    locationItems.length === 1
      ? [commonT("Pick-up & drop-off")]
      : [commonT("Pick-up"), commonT("Drop-off")];

  return (
    <>
      {locationItems.map((item, index) => {
        // TODO: remove this override after we resolve the issue with dynamc google map API
        const { contentMapData } = getMapDataWithMapboxStaticImage(false, item.mapData, 920, 430);
        return (
          <Section key={`carlocationItem${index.toString()}`}>
            <GridRow>
              <StyledStructureColumn>
                <DetailInfoWrapper>
                  <StyledColumn columns={COLUMN_SIZES}>
                    <StyledLeftSectionHeading>{titles[index]}</StyledLeftSectionHeading>
                    <ProductMapContainer
                      mapData={contentMapData!}
                      mapId={`google-maps-${
                        index % 2 === 0 ? `pickUp` : `dropOff`
                      }-location-${index.toString()}`}
                      useAlternateStaticImageOnly={useAlternateStaticImageOnly}
                    />
                  </StyledColumn>
                  <StyledColumn columns={COLUMN_SIZES}>
                    <StyledLeftSectionHeading>{commonT("Opening hours")}</StyledLeftSectionHeading>
                    <OpeningHours
                      key={`openingHours${index.toString()}`}
                      openingHours={item.openingHours}
                      activeLocale={activeLocale}
                    />
                  </StyledColumn>
                </DetailInfoWrapper>
              </StyledStructureColumn>
            </GridRow>
            <SectionContent>
              <LeftSectionHeading>{commonT("Rental location details")}</LeftSectionHeading>
              <DetailsContainer>
                <DetailsTitleWrapper>
                  <DetailsTitle>{`${detailsTitles[index]}: `}</DetailsTitle>
                  <div>{item.name}</div>
                </DetailsTitleWrapper>
                <div>{`${item.streetNumber}, ${item.postalCode ? `${item.postalCode},` : ""} ${
                  item.cityName
                }, ${item.country}`}</div>
                <div>
                  {commonT("Tel: {phoneNumber}", {
                    phoneNumber: item.phoneNumber,
                  })}
                </div>
                <AdditionalInformation>{item.additionalParkInfo}</AdditionalInformation>
              </DetailsContainer>
            </SectionContent>
          </Section>
        );
      })}
    </>
  );
};

export default CarLocationDetailsContainer;
