import React from "react";
import Bubbles from "@travelshift/ui/components/Bubbles/Bubbles";
import styled from "@emotion/styled";

import CheckIcon from "components/icons/check.svg";
import { Trans } from "i18n";
import { Namespaces } from "shared/namespaces";
import { gutters, whiteColor } from "styles/variables";

const StyledCheckIcon = styled(CheckIcon)`
  margin-left: ${gutters.small}px;
  width: 14px;
  height: 14px;
  fill: ${whiteColor};
`;

const LoadingSuccess = ({
  isUpdating,
  saveSuccess,
  successMessage,
}: {
  isUpdating: boolean;
  saveSuccess: boolean;
  successMessage?: string;
}) => {
  if (isUpdating) {
    return <Bubbles />;
  }
  if (saveSuccess) {
    return (
      <>
        <Trans ns={Namespaces.commonNs}>{successMessage}</Trans>
        <StyledCheckIcon />
      </>
    );
  }
  return null;
};

export default LoadingSuccess;
