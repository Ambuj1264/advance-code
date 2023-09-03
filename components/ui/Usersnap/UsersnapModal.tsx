import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { withTheme } from "emotion-theming";
import Button from "@travelshift/ui/components/Inputs/Button";

import AsanaTaskContainer from "./ViewAsanaTask";
import BugReport from "./ViewBugReport";
import FeatureRequest from "./ViewFeatureRequest";
import SupportRequest from "./ViewSupportRequest";
import {
  AsanaTaskForm,
  AsanaTaskAction,
  BugReportForm,
  BugReportAction,
  FeatureRequestForm,
  FeatureRequestAction,
  SupportRequestForm,
  SupportRequestAction,
  SendFeedbackFn,
} from "./usersnapTypes";

import Modal, {
  ModalFooterContainer,
  ModalContentWrapper as BaseModalContentWrapper,
  ModalHeader,
  CloseButton,
} from "components/ui/Modal/Modal";
import Tabs from "components/ui/Tabs/Tabs";
import { ButtonSize } from "types/enums";
import { gutters } from "styles/variables";

const ModalContentWrapper = styled(BaseModalContentWrapper)`
  padding-bottom: ${gutters.large / 2}px;
`;

const Background = styled.div`
  display: flex;
  flex: 1;
  overflow-y: scroll;
`;

const onKeyDown = (event: KeyboardEvent) => {
  // Prevent Escape from closing the modal if focus is in some form
  if (event.key === "Escape") {
    event.stopImmediatePropagation();
  }
};

const StyledButton = withTheme(Button);

const UsersnapModal = ({
  toggle,
  handleSubmit,
  bugReportDispatch,
  bugReportState,
  featureRequestDispatch,
  featureRequestState,
  asanaTaskState,
  asanaTaskDispatch,
  asanaEndpointUri,
  asanaWorkspaceName,
  supportRequestState,
  supportRequestDispatch,
  isLoading,
  errorText,
}: {
  toggle: () => void;
  handleSubmit: SendFeedbackFn;
  bugReportDispatch: React.Dispatch<BugReportAction>;
  bugReportState: BugReportForm;
  featureRequestDispatch: React.Dispatch<FeatureRequestAction>;
  featureRequestState: FeatureRequestForm;
  asanaTaskState: AsanaTaskForm;
  asanaTaskDispatch: React.Dispatch<AsanaTaskAction>;
  supportRequestState: SupportRequestForm;
  supportRequestDispatch: React.Dispatch<SupportRequestAction>;
  asanaEndpointUri: string;
  asanaWorkspaceName: string;
  isLoading: boolean;
  errorText?: string;
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ref = formRef.current;
    ref?.addEventListener("keydown", onKeyDown);
    return () => {
      ref?.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const onSubmit = () => {
    switch (activeTab) {
      case 0:
        handleSubmit("bug report", bugReportState);
        break;
      case 1:
        handleSubmit("feature request", featureRequestState);
        break;
      case 2:
        handleSubmit("support request", supportRequestState);
        break;
      case 3:
        handleSubmit("asana task", asanaTaskState);
        break;
      default:
        break;
    }
  };

  return (
    <Modal id="usersnapModal" onClose={toggle}>
      <ModalHeader title="Create a ticket" rightButton={<CloseButton onClick={toggle} />} />

      <Tabs
        labels={["Bug report", "Feature request", "Support ticket", "Asana task"]}
        onChange={index => setActiveTab(index)}
        currentIndex={activeTab}
        hasUnderlineStyle
      />
      <Background ref={formRef}>
        <ModalContentWrapper>
          {errorText && <h4 style={{ color: "red" }}>{errorText}</h4>}
          {activeTab === 0 && <BugReport dispatch={bugReportDispatch} state={bugReportState} />}
          {activeTab === 1 && (
            <FeatureRequest dispatch={featureRequestDispatch} state={featureRequestState} />
          )}
          {activeTab === 2 && (
            <SupportRequest dispatch={supportRequestDispatch} state={supportRequestState} />
          )}
          {activeTab === 3 && (
            <AsanaTaskContainer
              asanaEndpointUri={asanaEndpointUri}
              asanaWorkspaceName={asanaWorkspaceName}
              dispatch={asanaTaskDispatch}
              state={asanaTaskState}
            />
          )}
        </ModalContentWrapper>
      </Background>

      <ModalFooterContainer>
        <StyledButton onClick={onSubmit} buttonSize={ButtonSize.Medium} loading={isLoading}>
          Take screenshot
        </StyledButton>
      </ModalFooterContainer>
    </Modal>
  );
};

export default UsersnapModal;
