import {
  AsanaTaskForm,
  BugReportForm,
  FeatureRequestForm,
  SupportRequestForm,
  AsanaConfig,
} from "./usersnapTypes";

export const getBugReportLabels = (formValues: BugReportForm) => {
  let labels = ["Bug"];
  if (formValues.areWeLosingCustomers) {
    labels = [...labels, "High Priority"];
  } else if (formValues.isSevere) {
    labels = [...labels, "Priority"];
  }
  return labels;
};

export const getFeatureRequestLabels = (formValues: FeatureRequestForm) => {
  let labels = ["Feature Request"];
  if (formValues.shouldGenerateMoney || formValues.shouldSaveTime) {
    labels = [...labels, "Priority"];
  }
  return labels;
};

const commonFields = (user: User) => ({
  "User Id": {
    sortorder: 9000,
    type: "metadata",
    value: user.id,
  },
  Username: {
    sortorder: 9001,
    type: "metadata",
    value: user.name,
  },
  "Current URL": {
    sortorder: 9002,
    type: "metadata",
    value: window.location.href,
  },
  ...(document.referrer && {
    "Previous URL": {
      sortorder: 9003,
      type: "simple",
      value: document.referrer,
    },
  }),
  "User Agent": {
    sortorder: 9004,
    type: "metadata",
    value: navigator.userAgent,
  },
  "Screen size": {
    sortorder: 9005,
    type: "metadata",
    value: `${window.screen.width} x ${window.screen.height}`,
  },
  "Window size": {
    sortorder: 9006,
    type: "metadata",
    value: `${document.documentElement.clientWidth} x ${document.documentElement.clientHeight}`,
  },
});

export const constructBugReport = (
  formValues: BugReportForm,
  user: User,
  asanaConfig: AsanaConfig
) => ({
  ...commonFields(user),
  system_labels: getBugReportLabels(formValues),
  system_project: asanaConfig.defaultBugAsanaProject,
  system_user: asanaConfig.defaultBugAsanaUser,
  system_title: formValues.title,
  "Problem description": {
    sortorder: 1,
    type: "textBlock",
    value: formValues.description,
  },
  "Correct behaviour description": {
    sortorder: 2,
    type: "textBlock",
    value: formValues.expectedBehavior,
  },
  "Additional information": {
    sortorder: 3,
    type: "textBlock",
    value: formValues.additionalInformation,
  },
});

export const constructFeatureRequest = (
  formValues: FeatureRequestForm,
  user: User,
  asanaConfig: AsanaConfig
) => ({
  ...commonFields(user),
  system_labels: getFeatureRequestLabels(formValues),
  system_project: asanaConfig.defaultFeatureAsanaProject,
  system_user: asanaConfig.defaultFeatureAsanaUser,
  system_title: formValues.title,
  "Should generate money": {
    sortorder: 11,
    type: "metadata",
    value: formValues.shouldGenerateMoney ? "Yes" : "No",
  },
  "Should save time": {
    sortorder: 12,
    type: "simple",
    value: formValues.shouldSaveTime ? "Yes" : "No",
  },
  "Desired effect": {
    sortorder: 1,
    type: "textBlock",
    value: formValues.desiredEffect,
  },
  "Functional description": {
    sortorder: 2,
    type: "textBlock",
    value: formValues.functionalDescription,
  },
  Benefits: {
    sortorder: 3,
    type: "textBlock",
    value: formValues.benefits,
  },
  "Additional Notes": {
    sortorder: 4,
    type: "textBlock",
    value: formValues.additionalNotes,
  },
});

export const constructAsanaTask = (formValues: AsanaTaskForm, user: User) => ({
  ...commonFields(user),
  system_asana_oauth_token: formValues.token,
  system_project: formValues.project,
  system_user: formValues.assignee,
  system_title: formValues.title,
  system_labels: [formValues.tag],
  "Task description": {
    sortorder: 1,
    type: "textBlock",
    value: formValues.description,
  },
});

export const constructSupportRequest = (
  formValues: SupportRequestForm,
  user: User,
  asanaConfig: AsanaConfig
) => ({
  ...commonFields(user),
  system_user: "",
  system_title: formValues.title,
  system_project: asanaConfig.defaultSupportAsanaProject,
  system_labels: [],
  "Task description": {
    sortorder: 1,
    type: "textBlock",
    value: formValues.description,
  },
});
