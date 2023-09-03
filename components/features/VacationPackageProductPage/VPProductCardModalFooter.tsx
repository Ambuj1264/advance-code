import React from "react";
import { useTheme } from "emotion-theming";
import styled from "@emotion/styled";

import Tooltip from "components/ui/Tooltip/Tooltip";
import { ModalFooterContainer } from "components/ui/Modal/Modal";
import { Namespaces } from "shared/namespaces";
import Button from "components/ui/Inputs/Button";
import { ButtonSize } from "types/enums";
import { Trans } from "i18n";
import { zIndex } from "styles/variables";

export const StyledModalFooterContainer = styled(ModalFooterContainer)`
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: ${zIndex.z1};
  width: 100%;
  height: 56px;
`;

const TooltipContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 80px;
`;

export const VPModalFooterButton = ({
  isLoading,
  handleSubmit,
}: {
  isLoading: boolean;
  handleSubmit: (event?: React.FormEvent<HTMLFormElement> | React.SyntheticEvent) => void;
}) => {
  const theme: Theme = useTheme();
  return (
    <Button
      color="action"
      buttonSize={ButtonSize.Small}
      theme={theme}
      type="submit"
      loading={isLoading}
      onClick={handleSubmit}
    >
      <Trans ns={Namespaces.commonNs}>Select</Trans>
    </Button>
  );
};

export const VPProductCardModalFooter = ({
  isLoading,
  handleSubmit,
  error,
}: {
  isLoading: boolean;
  handleSubmit: (event?: React.FormEvent<HTMLFormElement> | React.SyntheticEvent) => void;
  error?: string;
}) => {
  return (
    <StyledModalFooterContainer>
      {error ? (
        <Tooltip title={error} fullWidth>
          <TooltipContent>
            <VPModalFooterButton isLoading={isLoading} handleSubmit={handleSubmit} />
          </TooltipContent>
        </Tooltip>
      ) : (
        <VPModalFooterButton isLoading={isLoading} handleSubmit={handleSubmit} />
      )}
    </StyledModalFooterContainer>
  );
};

export default VPProductCardModalFooter;
