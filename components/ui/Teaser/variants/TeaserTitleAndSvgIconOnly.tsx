import React from "react";
import styled, { StyledComponent } from "@emotion/styled";
import isPropValid from "@emotion/is-prop-valid";
import { css } from "@emotion/core";

import { Card } from "../TeaserComponents";

import { Title, TitleHolder } from "./TeaserImageTitleOnly";

import { GraphCMSPageType } from "types/enums";
import { useTranslation } from "i18n";
import { borderRadius, whiteColor } from "styles/variables";
import { Namespaces } from "shared/namespaces";
import Cars from "components/icons/car-with-white.svg";
import Flights from "components/icons/flight-with-white.svg";
import Experiences from "components/icons/person-with-white.svg";
import Hotels from "components/icons/house-with-white.svg";
import Destinations from "components/icons/pin.svg";
import Attractions from "components/icons/camera-with-white.svg";
import Information from "components/icons/information-circle-with-white.svg";
import Vacations from "components/icons/pin-flag-with-white.svg";

const StyledCard = styled(Card, {
  shouldForwardProp: prop => isPropValid(prop) && prop !== "height",
})<{
  height: number;
}>(
  ({ height }) => css`
    height: ${height}px;
  `,
  ({ theme }) => css`
    border-radius: ${borderRadius};
    width: 100%;
    background: ${theme.colors.primary};
  `
);

const iconsByPageType: { [pageType: string]: React.ElementType } = {
  [GraphCMSPageType.Cars]: Cars,
  [GraphCMSPageType.Flights]: Flights,
  [GraphCMSPageType.Stays]: Hotels,
  [GraphCMSPageType.Tours]: Experiences,
  [GraphCMSPageType.Destinations]: Destinations,
  [GraphCMSPageType.Attractions]: Attractions,
  [GraphCMSPageType.Information]: Information,
  [GraphCMSPageType.VacationPackages]: Vacations,
  [GraphCMSPageType.TravelGuidesLanding]: Destinations,
};

type iconSizeParamsType = { width: number; height: number };

const iconSizeParamsByType: { [pageType: string]: iconSizeParamsType } = {
  [GraphCMSPageType.Cars]: { height: 49, width: 46 },
  [GraphCMSPageType.Flights]: { height: 49, width: 56 },
  [GraphCMSPageType.Stays]: { height: 49, width: 43 },
  [GraphCMSPageType.Tours]: { height: 49, width: 33 },
  [GraphCMSPageType.Destinations]: { height: 32, width: 48 },
  [GraphCMSPageType.Attractions]: { height: 49, width: 38 },
  [GraphCMSPageType.Information]: { height: 46, width: 46 },
  [GraphCMSPageType.VacationPackages]: { height: 49, width: 46 },
  [GraphCMSPageType.TravelGuidesLanding]: { height: 49, width: 46 },
};

const translationsByPageType: { [pageType: string]: string } = {
  [GraphCMSPageType.Cars]: "Car rentals",
  [GraphCMSPageType.Flights]: "Flights",
  [GraphCMSPageType.Stays]: "Stays",
  [GraphCMSPageType.Tours]: "Experiences",
  [GraphCMSPageType.Destinations]: "Trips",
  [GraphCMSPageType.Attractions]: "Attractions",
  [GraphCMSPageType.Information]: "Information",
  [GraphCMSPageType.VacationPackages]: "Vacations",
  [GraphCMSPageType.TravelGuidesLanding]: "Destinations",
};

const TeaserTitleAndSvgIconOnly = ({
  title,
  subtitle,
  smallTitle = false,
  height,
  url,
  LinkComponent,
  className,
  pageType,
  tagType = "h3",
}: TeaserTypes.Teaser & {
  smallTitle?: boolean;
  height: number;
  LinkComponent?: StyledComponent<{ href: string }, { href: string }, Theme>;
  className?: string;
  tagType?: React.ElementType;
}) => {
  // eslint-disable-next-line react/no-unstable-nested-components
  const WrapperComponent = ({ children }: { children: React.ReactElement }) =>
    LinkComponent ? <LinkComponent href={url}>{children}</LinkComponent> : children;

  const { t: headerT } = useTranslation(Namespaces.headerNs);
  const titleString = pageType ? headerT(translationsByPageType[pageType]) : title;

  const IconToRender = pageType === undefined ? Information : iconsByPageType[pageType];

  const iconSizeParams =
    pageType === undefined ? { height: 50, width: 50 } : iconSizeParamsByType[pageType];

  const StyledIconToRender = styled(IconToRender)`
    position: absolute;
    top: 50%;
    left: 50%;
    width: ${iconSizeParams.width}px;
    height: ${iconSizeParams.height}px;
    transform: translate(-50%, -50%);
    fill: ${whiteColor};
  `;

  return (
    <WrapperComponent>
      <StyledCard height={height} className={className}>
        <StyledIconToRender />
        <TitleHolder hasSubtitle={!!subtitle}>
          <Title as={tagType} smallTitle={smallTitle}>
            {titleString}
          </Title>
        </TitleHolder>
      </StyledCard>
    </WrapperComponent>
  );
};

export default TeaserTitleAndSvgIconOnly;
