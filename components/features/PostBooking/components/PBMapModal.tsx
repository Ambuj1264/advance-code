import React, { ElementType, useEffect, useMemo } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { ModalCloseButton } from "./PBSharedComponents";

import { useSettings } from "contexts/SettingsContext";
import { getEmbeddedStreetViewUrl } from "components/ui/Cover/CoverMap/Google/mapUtils";
import { useGetCurrentMapType } from "components/ui/Cover/CoverMap/hooks/useGetAvailableMap";
import { MAP_TYPE } from "types/enums";
import Modal, { ModalContentWrapper, ModalHeader } from "components/ui/Modal/Modal";
import { mqMin } from "styles/base";
import { getBaiduMapDirectionPageUrl } from "components/ui/Cover/CoverMap/Baidu/mapUtils";
import { capitalize } from "utils/globalUtils";
import { gutters, whiteColor } from "styles/variables";

const StyledModalContentWrapper = styled(ModalContentWrapper)`
  padding: 0;

  ${mqMin.large} {
    padding: 0;
  }
`;

const StyledModalCloseButton = styled(ModalCloseButton)`
  display: none;

  ${mqMin.large} {
    display: block;
    padding: 0;
    &::before {
      display: none;
    }
  }
`;

const StyledModalTitle = styled.div`
  display: flex;
  alig-items: center;
  svg {
    margin-right: ${gutters.small / 2}px;
    height: 20px;
    fill: ${whiteColor};
  }
`;

const modalIconStyle = css`
  fill: ${whiteColor};
`;

export const PBMapModal = ({
  point,
  title,
  closeModal,
  Icon,
}: {
  title: string;
  point: Pick<SharedTypes.Map, "latitude" | "longitude">;
  closeModal: () => void;
  Icon: ElementType;
}) => {
  const { googleApiKey } = useSettings();
  const mapType = useGetCurrentMapType();

  const isGoogleMap = mapType === MAP_TYPE.GOOGLE;

  const src = useMemo(() => {
    if (isGoogleMap) {
      return getEmbeddedStreetViewUrl(point, googleApiKey, true);
    }
    return getBaiduMapDirectionPageUrl({
      ...point,
      title,
    });
  }, [googleApiKey, isGoogleMap, point, title]);

  // we're unable to embedd BAIDU map into iframe,
  // thus we simply open a map destination into a new window and ensure we close the modal back
  useEffect(() => {
    if (!isGoogleMap) {
      closeModal();
      window.open(src, "_blank");
    }
  }, [closeModal, isGoogleMap, mapType, src]);

  if (!isGoogleMap) {
    return null;
  }

  return (
    <Modal id="embedded-map" onClose={closeModal} wide>
      <ModalHeader
        title={
          <StyledModalTitle>
            <Icon css={modalIconStyle} />
            {capitalize(title)}
          </StyledModalTitle>
        }
        rightButton={<StyledModalCloseButton onClick={closeModal} />}
      />
      <StyledModalContentWrapper>
        <iframe
          width="100%"
          height="100%"
          frameBorder={0}
          no-referrer-when-downgrade="true"
          title="google map directions frame"
          id="embedded-map-iframe"
          src={src}
        />
      </StyledModalContentWrapper>
    </Modal>
  );
};
