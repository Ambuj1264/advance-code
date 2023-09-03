import React from "react";
import useStyles from "isomorphic-style-loader/useStyles";
import textAreaStyles from "@travelshift/ui/components/Inputs/TextArea.scss";

import ErrorBoundary from "../ErrorBoundary";

import CustomNextDynamic from "lib/CustomNextDynamic";
import useSession from "hooks/useSession";

const UsersnapContainer = CustomNextDynamic(
  () => import("components/ui/Usersnap/UsersnapContainer"),
  {
    loading: () => null,
    ssr: false,
  }
);

const UsersnapLoader = () => {
  const { user } = useSession();
  useStyles(textAreaStyles);
  if (!user?.isAdmin) {
    return null;
  }
  return (
    <ErrorBoundary>
      <UsersnapContainer />
    </ErrorBoundary>
  );
};

export default UsersnapLoader;
