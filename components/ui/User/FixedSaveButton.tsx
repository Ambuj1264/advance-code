import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import SaveButton from "./SaveButton";

import { gutters, separatorColorLight, whiteColor, zIndex } from "styles/variables";
import { mqMin } from "styles/base";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { getErrorMessage } from "components/features/User/utils/userUtils";

const FixedButtonContainer = styled.div<{
  isSticky?: boolean;
}>(
  ({ isSticky }) => css`
    position: ${isSticky ? "fixed" : "relative"};
    bottom: 0;
    left: 0;
    z-index: ${zIndex.z2};
    border-top: ${isSticky ? `2px solid ${separatorColorLight}` : "none"};
    width: 100%;
    height: 56px;
    background-color: ${whiteColor};
  `
);

const FixedButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 0 ${gutters.small}px;
  height: 100%;
  ${mqMin.desktop} {
    margin: auto;
    width: 1090px;
  }
`;

const StyledSaveButton = styled(SaveButton)`
  border-radius: 25px;
`;
const FixedSaveButton = ({
  isUpdating,
  saveSuccess,
  formInvalid,
  hasChanged = true,
  onSaveClick,
  buttonText,
  successMessage,
  isSticky,
}: {
  isUpdating: boolean;
  saveSuccess: boolean;
  formInvalid?: boolean;
  hasChanged?: boolean;
  onSaveClick: () => void;
  buttonText: string;
  successMessage?: string;
  isSticky: boolean;
}) => {
  const fixedElId = "fixed-el-button-cs36f4";
  const { t } = useTranslation(Namespaces.userProfileNs);
  const toolTipMessage = getErrorMessage(formInvalid);
  return (
    <FixedButtonContainer id={fixedElId} isSticky={isSticky}>
      <FixedButtonWrapper>
        <StyledSaveButton
          isUpdating={isUpdating}
          saveSuccess={saveSuccess}
          onSaveClick={hasChanged ? onSaveClick : () => {}}
          buttonText={buttonText}
          successMessage={successMessage}
          tooltipErrorMessage={toolTipMessage ? t(toolTipMessage) : undefined}
        />
      </FixedButtonWrapper>
    </FixedButtonContainer>
  );
};

export default FixedSaveButton;
