import React, { useState, useCallback } from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import isPropValid from "@emotion/is-prop-valid";
import rgba from "polished/lib/color/rgba";

import { LeftContent, RightBottomContent, RightTopContent } from "../../Cover";
import CoverMapWrapper from "../CoverMapWrapper";
import { controlButtonsStyles, DirectionIcon, DirectionsButton } from "../CoverMapButtons";

import { getGoogleMapDirectionPageUrl } from "./mapUtils";

import { Trans } from "i18n";
import { Namespaces } from "shared/namespaces";
import LocationUserIcon from "components/icons/location-user-colorized.svg";
import { mqMin } from "styles/base";
import { buttercupColor, gutters } from "styles/variables";
import useToggle from "hooks/useToggle";
import GoogleMap from "components/ui/Cover/CoverMap/Google/GoogleMapContainer";
import GoogleStreetViewModal from "components/ui/Cover/CoverMap/Google/GoogleStreetView";

const STREET_VIEW_MODAL_ID = "street-view-modal";

export const LeftBottomContent = styled(LeftContent)`
  display: flex;
`;

const LocationIcon = styled(LocationUserIcon)<{ isSmall: boolean }>(({ theme, isSmall }) => [
  css`
    position: absolute;
    left: 12px;
    margin-right: ${gutters.large / 2}px;
    width: 20px;
    height: 20px;

    .location-user-colorized_svg__user {
      fill: ${buttercupColor};
    }

    .location-user-colorized_svg__circle {
      fill: ${rgba(theme.colors.primary, 0.2)};
    }
  `,
  !isSmall &&
    css`
      ${mqMin.medium} {
        width: 28px;
        height: 28px;
      }
    `,
]);

export const StreetViewButton = styled("button", {
  shouldForwardProp: prop => isPropValid(prop) || prop === "on",
})<{ isSmall: boolean }>(({ isSmall }) => [
  ({ theme }) => css`
    color: ${theme.colors.primary};
  `,
  controlButtonsStyles(isSmall),
  css`
    margin-left: ${gutters.small / 2}px;

    ${mqMin.medium} {
      margin-left: ${gutters.small}px;
    }
  `,
]);

const CoverGoogleMap = ({
  mapId,
  map,
  rightTopContent,
  rightBottomContent,
  isDirectionsEnabled = true,
  isStreetViewEnabled = true,
  isClustersEnabled = true,
  useSmallButtons = false,
  useAlternateInfobox = false,
  useAlternateStaticImageOnly,
  children,
  className,
}: {
  mapId?: string;
  map: SharedTypes.Map;
  rightTopContent?: React.ReactNode;
  rightBottomContent?: React.ReactNode;
  isStreetViewEnabled?: boolean;
  isDirectionsEnabled?: boolean;
  useAlternateInfobox?: boolean;
  isClustersEnabled?: boolean;
  useSmallButtons?: boolean;
  useAlternateStaticImageOnly?: boolean;
  children?: React.ReactNode;
  className?: string;
}) => {
  const [isStreetViewModalOpen, toggleStreetViewModal] = useToggle();
  const [hasAvailableStreetView, setHasAvailableStreetView] = useState(false);

  const handleAssertIfStreetView = useCallback((hasStreetViewData: boolean) => {
    setHasAvailableStreetView(hasStreetViewData);
  }, []);

  return (
    <CoverMapWrapper className={className}>
      <>
        <GoogleMap
          mapId={mapId}
          map={map}
          isClustersEnabled={isClustersEnabled}
          useAlternateInfobox={useAlternateInfobox}
          onCheckForAvailableStreetView={isStreetViewEnabled ? handleAssertIfStreetView : undefined}
          useAlternateStaticImageOnly={useAlternateStaticImageOnly}
        />
        {isStreetViewEnabled && hasAvailableStreetView && (
          <GoogleStreetViewModal
            modalId={STREET_VIEW_MODAL_ID}
            map={map}
            isStreetViewModalOpen={isStreetViewModalOpen}
            toggleStreetViewModal={toggleStreetViewModal}
          />
        )}
      </>
      <LeftBottomContent>
        {isDirectionsEnabled && (
          <DirectionsButton
            href={getGoogleMapDirectionPageUrl({ coords: map })}
            rel="nofollow noopener"
            target="_blank"
            isSmall={useSmallButtons}
          >
            <DirectionIcon isSmall={useSmallButtons} />
            <Trans ns={Namespaces.articleNs}>Directions</Trans>
          </DirectionsButton>
        )}
        {isStreetViewEnabled && hasAvailableStreetView && (
          <StreetViewButton isSmall={useSmallButtons} onClick={toggleStreetViewModal} type="button">
            <LocationIcon isSmall={useSmallButtons} />
            <Trans ns={Namespaces.articleNs}>Street view</Trans>
          </StreetViewButton>
        )}
      </LeftBottomContent>
      {rightTopContent && <RightTopContent>{rightTopContent}</RightTopContent>}
      {rightBottomContent && <RightBottomContent>{rightBottomContent}</RightBottomContent>}
      {children}
    </CoverMapWrapper>
  );
};

export default CoverGoogleMap;
