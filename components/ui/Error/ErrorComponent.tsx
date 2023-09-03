/* eslint-disable @typescript-eslint/no-unused-expressions */

import React, { useEffect } from "react";
import { useRouter } from "next/router";

import { useServerSideRedirect } from "hooks/useRedirect";
import DefaultLoadingPage from "components/ui/Loading/DefaultLoadingPage";
import ErrorPage from "pages/_error";
import lazyCaptureException from "lib/lazyCaptureException";
import { useSettings } from "contexts/SettingsContext";
import { addLeadingSlashIfNotPresent } from "utils/helperUtils";
import useGetRedirectData from "lib/useGetRedirectData";
import { RedirectTypes } from "types/RedirectTypes";

const ErrorComponent = ({
  error,
  LoadingComponent = DefaultLoadingPage,
  shouldCaptureException = true,
  componentName,
  handleSsrRedirect,
  isRequired = false,
}: {
  error: any;
  LoadingComponent?: React.FunctionComponent<any>;
  shouldCaptureException?: boolean;
  componentName: string;
  handleSsrRedirect?: true | undefined;
  isRequired?: boolean;
}) => {
  const router = useRouter();
  const { marketplace } = useSettings();

  const { loading, data } = useGetRedirectData(router, marketplace, handleSsrRedirect);

  useEffect(() => {
    if (!loading) {
      if (data.url) {
        shouldCaptureException &&
          lazyCaptureException(new Error(`Client side redirect`), {
            pathname: router.asPath,
            errorInfo: {
              to: data.url,
            },
          });
        // eslint-disable-next-line functional/immutable-data
        window.location.href = addLeadingSlashIfNotPresent(data.url);
      } else {
        if (!shouldCaptureException) return;

        let errorToSend;
        if (error) {
          errorToSend = error;
        } else if (componentName) {
          errorToSend = new Error(`No data sent for route`);
        } else {
          errorToSend = new Error(`Unknown error sent for this route`);
        }

        lazyCaptureException(errorToSend, {
          pathname: router.asPath,
          ...(componentName ? { componentName } : undefined),
        });
      }
    }
  }, [componentName, data, error, loading, router.asPath, shouldCaptureException]);

  useServerSideRedirect({
    to: data?.url ?? "",
    status: (data?.code as RedirectTypes.RedirectStatus) || 302,
    condition: Boolean(handleSsrRedirect && data?.url),
  });

  if (loading || data?.url) return <LoadingComponent />;

  let statusCode: number;
  if (error && isRequired) {
    statusCode = 500;
  } else {
    statusCode = 404;
  }

  return <ErrorPage statusCode={statusCode} fromErrorComponent />;
};

export default ErrorComponent;
