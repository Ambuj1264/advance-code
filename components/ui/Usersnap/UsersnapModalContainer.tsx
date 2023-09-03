import React, { useReducer } from "react";

import {
  BugReportForm,
  BugReportAction,
  BugReportActionType,
  FeatureRequestForm,
  FeatureRequestAction,
  FeatureRequestActionType,
  AsanaTaskForm,
  AsanaTaskAction,
  AsanaTaskActionType,
  SupportRequestForm,
  SupportRequestAction,
  SupportRequestActionType,
  SendFeedbackFn,
} from "./usersnapTypes";
import { getAsanaToken, setAsanaToken } from "./localStorageUtils";

import UsersnapModal from "components/ui/Usersnap/UsersnapModal";

const bugReportReducer = (state: BugReportForm, action: BugReportAction): BugReportForm => {
  switch (action.type) {
    case BugReportActionType.SetTitle: {
      const { title } = action;
      return {
        ...state,
        title,
      };
    }
    case BugReportActionType.SetIsSevere: {
      const { isSevere } = action;
      return {
        ...state,
        isSevere,
        areWeLosingCustomers: isSevere === false ? false : state.areWeLosingCustomers,
      };
    }
    case BugReportActionType.SetAreWeLosingCustomers: {
      const { areWeLosingCustomers } = action;
      return {
        ...state,
        areWeLosingCustomers,
      };
    }
    case BugReportActionType.SetDescription: {
      const { description } = action;
      return {
        ...state,
        description,
      };
    }
    case BugReportActionType.SetExpectedBehavior: {
      const { expectedBehavior } = action;
      return {
        ...state,
        expectedBehavior,
      };
    }
    case BugReportActionType.SetAdditionalInformation: {
      const { additionalInformation } = action;
      return {
        ...state,
        additionalInformation,
      };
    }
    case BugReportActionType.SetTitleAndDescriptionEmpty: {
      return {
        ...state,
        title: state.title ?? "",
        description: state.description ?? "",
      };
    }
    default:
      return state;
  }
};

const featureRequestReducer = (
  state: FeatureRequestForm,
  action: FeatureRequestAction
): FeatureRequestForm => {
  switch (action.type) {
    case FeatureRequestActionType.SetTitle: {
      const { title } = action;
      return {
        ...state,
        title,
      };
    }
    case FeatureRequestActionType.SetShouldSaveTime: {
      const { shouldSaveTime } = action;
      return {
        ...state,
        shouldSaveTime,
      };
    }
    case FeatureRequestActionType.SetShouldGenerateMoney: {
      const { shouldGenerateMoney } = action;
      return {
        ...state,
        shouldGenerateMoney,
      };
    }
    case FeatureRequestActionType.SetDesiredEffect: {
      const { desiredEffect } = action;
      return {
        ...state,
        desiredEffect,
      };
    }
    case FeatureRequestActionType.SetFunctionalDescription: {
      const { functionalDescription } = action;
      return {
        ...state,
        functionalDescription,
      };
    }
    case FeatureRequestActionType.SetBenefits: {
      const { benefits } = action;
      return {
        ...state,
        benefits,
      };
    }
    case FeatureRequestActionType.SetAdditionalNotes: {
      const { additionalNotes } = action;
      return {
        ...state,
        additionalNotes,
      };
    }
    default:
      return state;
  }
};

const asanaTaskReducer = (state: AsanaTaskForm, action: AsanaTaskAction): AsanaTaskForm => {
  switch (action.type) {
    case AsanaTaskActionType.SetToken: {
      const { token } = action;
      setAsanaToken(token);
      return {
        ...state,
        token,
      };
    }
    case AsanaTaskActionType.SetTitle: {
      const { title } = action;
      return {
        ...state,
        title,
      };
    }
    case AsanaTaskActionType.SetDescription: {
      const { description } = action;
      return {
        ...state,
        description,
      };
    }
    case AsanaTaskActionType.SetTitleAndDescriptionEmpty: {
      return {
        ...state,
        title: state.title ?? "",
        description: state.description ?? "",
      };
    }
    case AsanaTaskActionType.SetProject: {
      const { project } = action;
      return {
        ...state,
        project,
      };
    }
    case AsanaTaskActionType.SetAssignee: {
      const { assignee } = action;
      return {
        ...state,
        assignee,
      };
    }
    case AsanaTaskActionType.SetTag: {
      const { tag } = action;
      return {
        ...state,
        tag,
      };
    }
    default:
      return state;
  }
};

const supportRequestReducer = (
  state: SupportRequestForm,
  action: SupportRequestAction
): SupportRequestForm => {
  switch (action.type) {
    case SupportRequestActionType.SetTitle: {
      const { title } = action;
      return {
        ...state,
        title,
      };
    }
    case SupportRequestActionType.SetDescription: {
      const { description } = action;
      return {
        ...state,
        description,
      };
    }
    case SupportRequestActionType.SetTitleAndDescriptionEmpty:
    default: {
      return {
        ...state,
        title: state.title ?? "",
        description: state.description ?? "",
      };
    }
  }
};

const UsersnapModalContainer = ({
  sendFeedback,
  toggle,
  isLoading,
  asanaEndpointUri,
  asanaWorkspaceName,
  errorText,
}: {
  sendFeedback: SendFeedbackFn;
  toggle: () => void;
  isLoading: boolean;
  asanaEndpointUri: string;
  asanaWorkspaceName: string;
  errorText?: string;
}) => {
  const [bugReportState, bugReportDispatch] = useReducer(bugReportReducer, {
    title: undefined,
    isSevere: false,
    areWeLosingCustomers: false,
    description: undefined,
    expectedBehavior: "",
    additionalInformation: "",
  });
  const [featureRequestState, featureRequestDispatch] = useReducer(featureRequestReducer, {
    title: undefined,
    shouldSaveTime: false,
    shouldGenerateMoney: false,
    desiredEffect: "",
    functionalDescription: "",
    benefits: "",
    additionalNotes: "",
  });
  const [supportRequestState, supportRequestDispatch] = useReducer(supportRequestReducer, {
    title: undefined,
    description: undefined,
  });
  const [asanaTaskState, asanaTaskDispatch] = useReducer(asanaTaskReducer, {
    token: getAsanaToken(),
  });

  const handleSubmit: SendFeedbackFn = (type, values) => {
    let isValid = Boolean(values.title?.trim());
    if ("description" in values) {
      isValid = isValid && Boolean(values.description?.trim());
    }
    if (!isValid) {
      if (type === "bug report") {
        bugReportDispatch({
          type: BugReportActionType.SetTitleAndDescriptionEmpty,
        });
        return;
      }
      if (type === "feature request") {
        featureRequestDispatch({
          type: FeatureRequestActionType.SetTitle,
          title: "",
        });
        return;
      }
      if (type === "support request") {
        supportRequestDispatch({
          type: SupportRequestActionType.SetTitleAndDescriptionEmpty,
        });
        return;
      }
      asanaTaskDispatch({
        type: AsanaTaskActionType.SetTitleAndDescriptionEmpty,
      });
      return;
    }
    sendFeedback(type, values);
  };

  return (
    <UsersnapModal
      bugReportDispatch={bugReportDispatch}
      bugReportState={bugReportState}
      featureRequestDispatch={featureRequestDispatch}
      featureRequestState={featureRequestState}
      asanaTaskState={asanaTaskState}
      asanaTaskDispatch={asanaTaskDispatch}
      supportRequestDispatch={supportRequestDispatch}
      supportRequestState={supportRequestState}
      asanaEndpointUri={asanaEndpointUri}
      asanaWorkspaceName={asanaWorkspaceName}
      toggle={toggle}
      handleSubmit={handleSubmit}
      isLoading={isLoading}
      errorText={errorText}
    />
  );
};

export default UsersnapModalContainer;
