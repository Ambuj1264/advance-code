import React from "react";
import rgba from "polished/lib/color/rgba";
import styled from "@emotion/styled";
import { ApolloError } from "apollo-client";

import { CloseButtonWrapper, CloseIcon } from "../Header/Header/NavigationBar/Cart/CartComponents";

import { IconWrapper, InfoText } from "./sharedAdminComponents";

import { bittersweetRedColor, borderRadius, gutters } from "styles/variables";
import { typographySubtitle2Regular } from "styles/typography";
import WarningIcon from "components/icons/alert-triangle.svg";

const MessageContainer = styled.div`
  display: contents;
  margin-bottom: ${gutters.small}px;

  ${InfoText} {
    ${typographySubtitle2Regular}
  }
`;

const BubbleMessageContainer = styled.div`
  position: relative;
  margin-top: ${gutters.small / 2}px;
  margin-bottom: ${gutters.small}px;
  border: 1px solid ${rgba(bittersweetRedColor, 0.5)};
  border-radius: ${borderRadius};
  padding: ${gutters.small / 2}px;
  padding-top: ${gutters.small + gutters.small / 2}px;
  overflow: hidden;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 16px;
    background-color: ${rgba(bittersweetRedColor, 0.5)};
  }
`;

const StyledCloseButtonWrapper = styled(CloseButtonWrapper)`
  position: absolute;
  top: 0;
  right: ${gutters.small / 2}px;
  background-color: transparent;
  cursor: pointer;

  ${CloseIcon} {
    cursor: pointer;
  }
`;

const AdminModalError = ({
  onDismissError,
  isDismissable,
  useGenericErrorMessage,
  apolloError,
  children,
}: {
  onDismissError?: () => void;
  isDismissable?: boolean;
  useGenericErrorMessage?: boolean;
  apolloError?: ApolloError;
  children?: React.ReactNode;
}) => {
  const content = useGenericErrorMessage ? (
    <>
      <InfoText>
        <IconWrapper>
          <WarningIcon />
        </IconWrapper>
        An error has occurred. Please check if there are any expired items in the cart.
      </InfoText>
      <InfoText>
        <strong>{apolloError?.networkError?.message || apolloError?.message}</strong>
      </InfoText>
    </>
  ) : (
    children
  );
  return (
    <MessageContainer>
      <BubbleMessageContainer>
        {isDismissable && (
          <StyledCloseButtonWrapper onClick={onDismissError}>
            <CloseIcon />
          </StyledCloseButtonWrapper>
        )}
        {content}
      </BubbleMessageContainer>
    </MessageContainer>
  );
};

export default AdminModalError;
