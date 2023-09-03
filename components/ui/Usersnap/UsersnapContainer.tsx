import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import Head from "next/head";

import UsersnapQuery from "./queries/UsersnapQuery.graphql";
import UsersnapButton from "./UsersnapButton";
import UsersnapModalContainer from "./UsersnapModalContainer";
import {
  AsanaTaskForm,
  BugReportForm,
  FeatureRequestForm,
  SupportRequestForm,
  QueryData,
  SendFeedbackFn,
} from "./usersnapTypes";

import useSession from "hooks/useSession";
import useToggle from "hooks/useToggle";
import {
  constructAsanaTask,
  constructBugReport,
  constructFeatureRequest,
  constructSupportRequest,
} from "components/ui/Usersnap/utils";

const USERSNAP_KEY = "4ba5e857-c929-4254-9115-64941088cb79";

const UsersnapContainer = () => {
  const { error, data } = useQuery<QueryData>(UsersnapQuery, {
    context: {
      fetchOptions: {
        method: "POST",
      },
    },
  });

  const { user } = useSession();
  const [isModalOpen, toggleModal] = useToggle();
  const [isLoading, setLoading] = useState(false);
  const [usersnap, setUsersnap] = useState<{
    on: (eventType: string, callback: (event: any) => void) => void;
    open: () => void;
    logEvent: (event: string) => void;
    show: (project: string) => Promise<any>;
    hide: (project: string) => Promise<any>;
  }>();
  const [errorText, setErrorText] = useState<string>();
  // eslint-disable-next-line
  const usersnapAsanaConfig = data?.configuration.usersnapConfiguration;

  useEffect(() => {
    if (error || !data?.configuration || !user) return;

    /* eslint-disable-next-line functional/immutable-data */
    window.onUsersnapLoad = (api: any) => {
      api.init({
        button: null,
      });
      api.hide(USERSNAP_KEY);
      setUsersnap(api);
    };
  }, [error, data, user]);

  const sendFeedback: SendFeedbackFn = async (type, values) => {
    let report;
    if (type === "bug report") {
      report = constructBugReport(values as BugReportForm, user!, usersnapAsanaConfig!);
    } else if (type === "feature request") {
      report = constructFeatureRequest(values as FeatureRequestForm, user!, usersnapAsanaConfig!);
    } else if (type === "support request") {
      report = constructSupportRequest(values as SupportRequestForm, user!, usersnapAsanaConfig!);
    } else {
      report = constructAsanaTask(values as AsanaTaskForm, user!);
    }

    try {
      const response = await fetch("/api/digest", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: JSON.stringify(report),
      });
      if (response.status !== 200) {
        throw new Error(`digest request has failed with status ${response.status}`);
      }

      setLoading(true);
      const body = await response.text();
      usersnap?.on("open", (event: any) => {
        event.api.setValue("custom", body);
      });
      toggleModal();
      setLoading(false);
      usersnap?.show(USERSNAP_KEY).then(widgetApi => widgetApi.open());
    } catch (err) {
      setErrorText(
        `There was an error processing bug report, please try again. Error - ${
          (err as Error).message
        }`
      );
    }
  };

  if (!usersnapAsanaConfig || !user) return null;
  return (
    <>
      <Head>
        <script
          type="text/javascript"
          src="//widget.usersnap.com/global/load/3f35ae34-8559-449a-a073-6a6c2bc283f1?onload=onUsersnapLoad"
        />
      </Head>
      {usersnap && (
        <>
          <UsersnapButton onClick={toggleModal} />
          {isModalOpen && (
            <UsersnapModalContainer
              toggle={toggleModal}
              sendFeedback={sendFeedback}
              isLoading={isLoading}
              asanaEndpointUri={usersnapAsanaConfig.endpointUri}
              asanaWorkspaceName={usersnapAsanaConfig.asanaWorkspaceName}
              errorText={errorText}
            />
          )}
        </>
      )}
    </>
  );
};

export default UsersnapContainer;
