import { userQueryResult } from "../types/userTypes";

import UserContentQuery from "components/features/User/queries/UserContentQuery.graphql";
import { noCacheHeaders } from "utils/apiUtils";
import useQueryClient from "hooks/useQueryClient";

const useUserProfileQuery = () => {
  const {
    data: userData,
    loading: userDataLoading,
    error: userDataError,
  } = useQueryClient<userQueryResult>(UserContentQuery, {
    context: {
      headers: noCacheHeaders,
    },
  });
  return {
    userData,
    userDataLoading,
    userDataError,
  };
};

export default useUserProfileQuery;
