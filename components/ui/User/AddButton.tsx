import React, { SyntheticEvent } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";
import Close from "@travelshift/ui/icons/close.svg";

import PlusIcon from "components/icons/plus.svg";
import { borderRadiusBig, gutters, redCinnabarColor, whiteColor } from "styles/variables";
import { typographySubtitle3 } from "styles/typography";
import { Namespaces } from "shared/namespaces";
import { Trans } from "i18n";

export const StyledAddButton = styled.div<{ isDelete?: boolean }>(
  ({ isDelete, theme }) => css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: ${gutters.small / 2}px;
    border-radius: ${borderRadiusBig};
    width: fit-content;
    height: 16px;
    padding: 0 ${gutters.large / 2}px 0 0;
    background-color: ${isDelete ? rgba(redCinnabarColor, 0.1) : rgba(theme.colors.action, 0.1)};
    cursor: pointer;
  `
);

const StyledPlusIcon = styled(PlusIcon)`
  width: 12px;
  height: 12px;
  fill: ${whiteColor};
`;

const StyledCloseIcon = styled(Close)`
  width: 10px;
  height: 10px;
  fill: ${whiteColor};
`;

const TextWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: center;
  padding-left: ${gutters.large / 3}px;
`;

export const Text = styled.p<{ isDelete?: boolean }>(
  [typographySubtitle3],
  ({ isDelete, theme }) =>
    css`
      color: ${isDelete ? redCinnabarColor : theme.colors.action};
    `
);

export const PlusIconWrapper = styled.div<{ isDelete?: boolean }>(
  ({ isDelete, theme }) =>
    css`
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      width: 16px;
      height: 16px;
      background-color: ${isDelete ? redCinnabarColor : theme.colors.action};
    `
);

const AddDeleteButton = ({
  buttonText = "Add",
  isDelete = false,
  onClick,
  className,
}: {
  buttonText?: string;
  isDelete?: boolean;
  onClick?: (e: SyntheticEvent) => void;
  className?: string;
}) => {
  const Icon = isDelete ? StyledCloseIcon : StyledPlusIcon;
  return (
    <StyledAddButton className={className} onClick={onClick} isDelete={isDelete}>
      <PlusIconWrapper isDelete={isDelete}>
        <Icon />
      </PlusIconWrapper>
      <TextWrapper>
        <Text isDelete={isDelete}>
          <Trans ns={Namespaces.userProfileNs}>{buttonText}</Trans>
        </Text>
      </TextWrapper>
    </StyledAddButton>
  );
};

export default AddDeleteButton;
