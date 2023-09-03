import React from "react";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";

import { getEmbeddedStreetViewUrl } from "./mapUtils";

import { useSettings } from "contexts/SettingsContext";
import { CloseButton } from "components/ui/Modal/Modal";
import { boxShadowIcon, greyColor, gutters, whiteColor } from "styles/variables";
import { mqMin } from "styles/base";

const StreetViewWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: ${greyColor};
`;

const StreetViewIframe = styled.iframe`
  border: none;
  width: 100%;
  height: 100%;
`;

const StyledCloseButton = styled(CloseButton)`
  position: absolute;
  top: ${gutters.small / 2}px;
  right: ${gutters.small / 2}px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${boxShadowIcon};
  border-radius: 50%;
  width: 32px;
  height: 32px;
  background: ${whiteColor};

  ${mqMin.large} {
    top: ${gutters.small}px;
    right: ${gutters.small}px;
    width: 40px;
    height: 40px;
  }

  svg {
    fill: ${rgba(greyColor, 0.7)};
  }
`;

const GoogleStreetViewModal = ({
  modalId,
  map,
  isStreetViewModalOpen,
  toggleStreetViewModal,
}: {
  modalId: string;
  map: SharedTypes.Map;
  isStreetViewModalOpen: boolean;
  toggleStreetViewModal: () => void;
}) => {
  const { googleApiKey } = useSettings();

  const embeddedStreetViewUrl = getEmbeddedStreetViewUrl(map, googleApiKey);

  return isStreetViewModalOpen ? (
    <StreetViewWrapper>
      <StreetViewIframe title={map.location} src={embeddedStreetViewUrl} />
      <StyledCloseButton on={`tap:${modalId}.close`} onClick={toggleStreetViewModal} />
    </StreetViewWrapper>
  ) : null;
};

export default GoogleStreetViewModal;
