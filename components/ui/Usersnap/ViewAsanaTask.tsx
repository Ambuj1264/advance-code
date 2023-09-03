import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { withTheme } from "emotion-theming";
import Button from "@travelshift/ui/components/Inputs/Button";
import { ButtonSize } from "@travelshift/ui/types/enums";
import Input from "@travelshift/ui/components/Inputs/Input";
import TextArea from "@travelshift/ui/components/Inputs/TextArea";

import { AsanaTaskForm, AsanaTaskAction, AsanaTaskActionType } from "./usersnapTypes";
import { Heading, SubHeading, InputWrapper } from "./UsersnapFormsUI";
import { writeToSessionStorage, readFromSessionStorage } from "./localStorageUtils";

import BaseDropdown from "components/ui/Inputs/Dropdown/BaseDropdown";
import useSession from "hooks/useSession";
import { useSettings } from "contexts/SettingsContext";

const NAVIGATE_CHECK_RETRY_INTERVAL = 500;
const OAUTH_CHECK_RETRY_INTERVAL = 300;
const OAUTH_CHECK_RETRY_COUNT = 50;
const POPUP_WIDTH = 600;
const POPUP_HEIGHT = 600;

type AsanaItem = { gid: string; name: string };

const ThemedButton = withTheme(Button);

const SelectedDropdownOption = styled.span`
  position: absolute;
`;

const makePopup = (url: string, windowTitle: string, windowWidth: number, windowHeight: number) => {
  const dualScreenLeft = window.screenLeft;
  const dualScreenTop = window.screenTop;

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const windowLeft = screenWidth / 2 - windowWidth / 2 + dualScreenLeft;
  const windowTop = screenHeight / 2 - windowHeight / 2 + dualScreenTop;
  const newWindow = window.open(
    url,
    windowTitle,
    `scrollbars=yes, width=${windowWidth}, height=${windowHeight}, top=${windowTop}, left=${windowLeft}`
  );

  // Puts focus on the newWindow
  newWindow!.focus();
  return newWindow;
};

const doActionUntilReturnsTrue = (actionFunction: () => boolean, timeout: number) => {
  setTimeout(() => {
    if (!actionFunction()) {
      doActionUntilReturnsTrue(actionFunction, timeout);
    }
  }, timeout);
};

const AsanaConnect = ({
  asanaEndpointUri,
  dispatch,
}: {
  asanaEndpointUri: string;
  dispatch: React.Dispatch<AsanaTaskAction>;
}) => {
  const { user } = useSession();
  const { marketplaceUrl } = useSettings();

  if (!user) return null;

  const asanaRequestUrl = `${asanaEndpointUri}/Asana/RequestAccess?marketplace=${marketplaceUrl}&user_id=${
    user.id
  }&redirect_uri=${encodeURIComponent(window.location.href)}`;

  const onClick = () => {
    const popup = makePopup(
      `${marketplaceUrl}/utils/loading_page`,
      "Login to Asana",
      POPUP_WIDTH,
      POPUP_HEIGHT
    );

    let hasNavigated = false;

    // Handle messages from the popup
    const messageHandler = (messageEvent: MessageEvent) => {
      if (messageEvent.origin.indexOf(marketplaceUrl) < 0) {
        return;
      }
      const eventData = JSON.parse(messageEvent.data);

      if (eventData.event === "navigate" && eventData.target === eventData.value) {
        hasNavigated = true;
      }

      if (eventData.event !== "getVariable" || eventData.target !== "AsanaResponse") {
        return;
      }
      const { token } = eventData.value;
      if (!token) {
        return;
      }
      popup?.close();
      dispatch({ type: AsanaTaskActionType.SetToken, token });
      window.removeEventListener("message", messageHandler);
    };
    window.addEventListener("message", messageHandler);

    // Make the window navigate after loading up the loading page.
    doActionUntilReturnsTrue(() => {
      if (hasNavigated) {
        return true;
      }
      popup?.postMessage(
        JSON.stringify({
          event: "navigate",
          target: asanaRequestUrl,
        }),
        marketplaceUrl
      );
      return false;
    }, NAVIGATE_CHECK_RETRY_INTERVAL);

    let counter = OAUTH_CHECK_RETRY_COUNT;

    // Wait for the oAuth procedure to complete or timeout
    doActionUntilReturnsTrue(() => {
      if (!counter) {
        popup?.close();
        return true;
      }
      counter -= 1;
      if (!popup) {
        return true;
      }

      popup?.postMessage(
        JSON.stringify({
          event: "getVariable",
          target: "AsanaResponse",
        }),
        marketplaceUrl
      );

      return false;
    }, OAUTH_CHECK_RETRY_INTERVAL);
  };

  return (
    <>
      <Heading>Connect with Asana to create a new task</Heading>
      <SubHeading>
        I see something else that needs to be done
        <br />
        (Not a bug, feature request or support ticket)
      </SubHeading>
      <InputWrapper id="asanaConnectButton" label="">
        <ThemedButton buttonSize={ButtonSize.Large} onClick={onClick}>
          Connect with Asana
        </ThemedButton>
      </InputWrapper>
    </>
  );
};

const AsanaForm = ({
  state,
  dispatch,
  isLoading,
  projects,
  users,
  tags,
}: {
  state: AsanaTaskForm;
  dispatch: React.Dispatch<AsanaTaskAction>;
  isLoading: boolean;
  projects: AsanaItem[];
  users: AsanaItem[];
  tags: AsanaItem[];
}) => (
  <>
    <Heading>Create an Asana task</Heading>
    <SubHeading>
      I see something else that needs to be done
      <br />
      (Not a bug, feature request or support ticket)
    </SubHeading>
    <InputWrapper
      id="usersnapFieldTitle"
      label="Please write a short, clear title"
      required
      hasError={state.title === ""}
    >
      <Input
        id="usersnapFieldTitle"
        type="text"
        value={state.title ?? ""}
        onChange={event =>
          dispatch({
            type: AsanaTaskActionType.SetTitle,
            title: event.target.value,
          })
        }
        name="title"
        placeholder="Example: Create payment failure procedure"
      />
    </InputWrapper>
    <InputWrapper
      id="usersnapFieldDescription"
      label="Please describe the task"
      required
      hasError={state.description === ""}
    >
      <TextArea
        id="usersnapFieldDescription"
        name="description"
        value={state.description ?? ""}
        onChange={event =>
          dispatch({
            type: AsanaTaskActionType.SetDescription,
            description: event.target.value,
          })
        }
        placeholder="Example: We need to set up a procedure on how to handle failed payments"
      />
    </InputWrapper>
    <InputWrapper id="usersnapFieldProject" label="Please pick a project for this task">
      <BaseDropdown
        id="usersnapFieldProjectDropdown"
        onChange={project => dispatch({ type: AsanaTaskActionType.SetProject, project })}
        options={[
          ...projects.map(p => ({
            value: p.gid,
            label: p.name,
            nativeLabel: p.name,
          })),
        ]}
        components={{
          // eslint-disable-next-line react/no-unstable-nested-components
          SingleValue: ({ data }: { data: SelectOption }) => (
            <SelectedDropdownOption>{data.label}</SelectedDropdownOption>
          ),
        }}
        selectedValue={state.project}
        isSearchable
        isLoading={isLoading}
        placeholder="-- Please pick a project --"
      />
    </InputWrapper>
    <InputWrapper id="usersnapFieldAssignee" label="Please select a user to assign this task to">
      <BaseDropdown
        id="usersnapFieldAssigneeDropdown"
        onChange={assignee => dispatch({ type: AsanaTaskActionType.SetAssignee, assignee })}
        options={[
          ...users.map(u => ({
            value: u.gid,
            label: u.name,
            nativeLabel: u.name,
          })),
        ]}
        components={{
          // eslint-disable-next-line react/no-unstable-nested-components
          SingleValue: ({ data }: { data: SelectOption }) => (
            <SelectedDropdownOption>{data.label}</SelectedDropdownOption>
          ),
        }}
        selectedValue={state.assignee}
        isSearchable
        isLoading={isLoading}
        placeholder="-- Please pick a user --"
      />
    </InputWrapper>
    <InputWrapper id="usersnapFieldTagProject" label="Please pick a tag to add to the task">
      <BaseDropdown
        id="usersnapFieldTagDropdown"
        onChange={tag => dispatch({ type: AsanaTaskActionType.SetTag, tag })}
        options={[
          ...tags.map(t => ({
            value: t.name,
            label: t.name,
            nativeLabel: t.name,
          })),
        ]}
        components={{
          // eslint-disable-next-line react/no-unstable-nested-components
          SingleValue: ({ data }: { data: SelectOption }) => (
            <SelectedDropdownOption>{data.label}</SelectedDropdownOption>
          ),
        }}
        selectedValue={state.tag}
        isSearchable
        isLoading={isLoading}
        placeholder="-- Please pick a tag --"
      />
    </InputWrapper>
  </>
);

const AsanaTaskContainer = ({
  asanaEndpointUri,
  asanaWorkspaceName,
  state,
  dispatch,
}: {
  asanaEndpointUri: string;
  asanaWorkspaceName: string;
  state: AsanaTaskForm;
  dispatch: React.Dispatch<AsanaTaskAction>;
}) => {
  const cacheKeyPrefix = `asana-${asanaWorkspaceName.replace(".", "-")}`;
  const WORKSPACES_CACHE_KEY = cacheKeyPrefix;
  const PROJECTS_CACHE_KEY = `${cacheKeyPrefix}-projects`;
  const USERS_CACHE_KEY = `${cacheKeyPrefix}-users`;
  const TAGS_CACHE_KEY = `${cacheKeyPrefix}-tags`;
  const [{ isLoading, workspace, projects, users, tags }, setAsanaState] = useState<{
    isLoading: boolean;
    workspace: AsanaItem;
    projects: AsanaItem[];
    users: AsanaItem[];
    tags: AsanaItem[];
  }>({
    isLoading: false,
    workspace: readFromSessionStorage(WORKSPACES_CACHE_KEY),
    projects: readFromSessionStorage(PROJECTS_CACHE_KEY) ?? [],
    users: readFromSessionStorage(USERS_CACHE_KEY) ?? [],
    tags: readFromSessionStorage(TAGS_CACHE_KEY) ?? [],
  });
  useEffect(() => {
    // If no token we do nothing here and render the asana auth view below
    // If we already have a workspace we can assume we already have the data in session storage
    if (!state.token || workspace) {
      return;
    }

    const options = {
      headers: {
        "X-Asana-Token": state.token!,
      },
    };

    const fetchAsanaData = (type: string, workspaceName: string) =>
      fetch(
        `${asanaEndpointUri}/Asana/${type.toUpperCase()}?workspace=${encodeURIComponent(
          workspaceName
        )}`,
        options
      ).then(response => response.json());

    const fetchAsanaWorkspace = async () => {
      // Fetch asana workspaces
      const workspaceResults = await fetch(`${asanaEndpointUri}/Asana/Workspaces`, options)
        .then(response => response.json())
        .then(workspacesObjects => {
          return workspacesObjects.find(
            (pWorkspace: any) => pWorkspace.name === asanaWorkspaceName
          );
        });

      // Fetch project, user and tag data
      const [projectResults, userResults, tagResults] = await Promise.all([
        fetchAsanaData("projects", workspaceResults.name),
        fetchAsanaData("users", workspaceResults.name),
        fetchAsanaData("tags", workspaceResults.name),
      ]);
      // Store everything
      writeToSessionStorage(WORKSPACES_CACHE_KEY, workspaceResults);
      writeToSessionStorage(PROJECTS_CACHE_KEY, projectResults);
      writeToSessionStorage(USERS_CACHE_KEY, userResults);
      writeToSessionStorage(TAGS_CACHE_KEY, tagResults);
      setAsanaState({
        isLoading: false,
        workspace: workspaceResults,
        projects: projectResults,
        users: userResults,
        tags: tagResults,
      });
    };

    if (!isLoading) {
      fetchAsanaWorkspace();
      setAsanaState(asanaState => ({
        ...asanaState,
        isLoading: true,
      }));
    }
  }, [
    PROJECTS_CACHE_KEY,
    TAGS_CACHE_KEY,
    USERS_CACHE_KEY,
    WORKSPACES_CACHE_KEY,
    asanaEndpointUri,
    asanaWorkspaceName,
    isLoading,
    state.token,
    workspace,
  ]);

  if (!state.token) {
    return <AsanaConnect asanaEndpointUri={asanaEndpointUri} dispatch={dispatch} />;
  }

  return (
    <AsanaForm
      state={state}
      dispatch={dispatch}
      projects={projects}
      users={users}
      tags={tags}
      isLoading={isLoading}
    />
  );
};

export default AsanaTaskContainer;
