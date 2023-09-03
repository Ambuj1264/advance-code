export type AsanaConfig = {
  endpointUri: string;
  asanaWorkspaceName: string;
  usersnapProjectAPIKey: string;
  defaultBugAsanaProject: string;
  defaultBugAsanaUser: string;
  defaultFeatureAsanaProject: string;
  defaultFeatureAsanaUser: string;
  defaultSupportAsanaProject: string;
};

export type QueryData = {
  configuration: {
    usersnapConfiguration: AsanaConfig;
  };
};

export enum BugReportActionType {
  SetTitle,
  SetIsSevere,
  SetAreWeLosingCustomers,
  SetDescription,
  SetExpectedBehavior,
  SetAdditionalInformation,
  SetTitleAndDescriptionEmpty,
}

export type BugReportAction =
  | { type: BugReportActionType.SetTitle; title: string }
  | { type: BugReportActionType.SetIsSevere; isSevere: boolean }
  | {
      type: BugReportActionType.SetAreWeLosingCustomers;
      areWeLosingCustomers: boolean;
    }
  | { type: BugReportActionType.SetDescription; description: string }
  | {
      type: BugReportActionType.SetExpectedBehavior;
      expectedBehavior: string;
    }
  | {
      type: BugReportActionType.SetAdditionalInformation;
      additionalInformation: string;
    }
  | { type: BugReportActionType.SetTitleAndDescriptionEmpty };

export type BugReportForm = {
  title?: string;
  isSevere: boolean;
  areWeLosingCustomers: boolean;
  description?: string;
  expectedBehavior: string;
  additionalInformation: string;
};

export enum FeatureRequestActionType {
  SetTitle,
  SetShouldSaveTime,
  SetShouldGenerateMoney,
  SetDesiredEffect,
  SetFunctionalDescription,
  SetBenefits,
  SetAdditionalNotes,
}

export type FeatureRequestAction =
  | { type: FeatureRequestActionType.SetTitle; title: string }
  | {
      type: FeatureRequestActionType.SetShouldSaveTime;
      shouldSaveTime: boolean;
    }
  | {
      type: FeatureRequestActionType.SetShouldGenerateMoney;
      shouldGenerateMoney: boolean;
    }
  | { type: FeatureRequestActionType.SetDesiredEffect; desiredEffect: string }
  | {
      type: FeatureRequestActionType.SetFunctionalDescription;
      functionalDescription: string;
    }
  | { type: FeatureRequestActionType.SetBenefits; benefits: string }
  | {
      type: FeatureRequestActionType.SetAdditionalNotes;
      additionalNotes: string;
    };

export type FeatureRequestForm = {
  title?: string;
  shouldSaveTime: boolean;
  shouldGenerateMoney: boolean;
  desiredEffect: string;
  functionalDescription: string;
  benefits: string;
  additionalNotes: string;
};

export enum AsanaTaskActionType {
  SetToken,
  SetTitle,
  SetDescription,
  SetProject,
  SetAssignee,
  SetTag,
  SetTitleAndDescriptionEmpty,
}

export type AsanaTaskAction =
  | {
      type: AsanaTaskActionType.SetToken;
      token: string;
    }
  | {
      type: AsanaTaskActionType.SetTitle;
      title: string;
    }
  | {
      type: AsanaTaskActionType.SetDescription;
      description: string;
    }
  | {
      type: AsanaTaskActionType.SetTitleAndDescriptionEmpty;
    }
  | {
      type: AsanaTaskActionType.SetProject;
      project: string;
    }
  | {
      type: AsanaTaskActionType.SetAssignee;
      assignee: string;
    }
  | {
      type: AsanaTaskActionType.SetTag;
      tag: string;
    };

export type AsanaTaskForm = {
  token?: string;
  title?: string;
  description?: string;
  project?: string;
  assignee?: string;
  tag?: string;
};

export enum SupportRequestActionType {
  SetTitle,
  SetDescription,
  SetTitleAndDescriptionEmpty,
}

export type SupportRequestAction =
  | {
      type: SupportRequestActionType.SetTitle;
      title: string;
    }
  | {
      type: SupportRequestActionType.SetDescription;
      description: string;
    }
  | {
      type: SupportRequestActionType.SetTitleAndDescriptionEmpty;
    };

export type SupportRequestForm = {
  title?: string;
  description?: string;
};

export type SendFeedbackFn = (
  type: "bug report" | "feature request" | "asana task" | "support request",
  values: BugReportForm | FeatureRequestForm | AsanaTaskForm | SupportRequestForm
) => void;
