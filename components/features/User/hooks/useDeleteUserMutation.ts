import { useMutation } from "@apollo/react-hooks";
import { useCallback } from "react";

import DeleteUserMutation from "components/features/User/queries/DeleteUserMutation.graphql";
import { noCacheHeaders } from "utils/apiUtils";

const useDeleteUserMutation = () => {
  const [deleteUserMutation, { data, loading, error }] = useMutation<{
    deleteUserProfile: {
      deleted: boolean;
      message: string;
    };
  }>(DeleteUserMutation, {
    context: {
      headers: {
        ...noCacheHeaders,
      },
    },
    onCompleted: ({ deleteUserProfile }) => {
      // TODO: handle errors from mutation
      if (deleteUserProfile && !error) {
        // eslint-disable-next-line functional/immutable-data
        window.location.href = "/auth/logout";
      }
    },
  });

  const deleteUser = useCallback(() => {
    deleteUserMutation();
  }, [deleteUserMutation]);

  return {
    deleteUserMutation: deleteUser,
    deleteUserLoading: loading,
    deleteUserError: error,
    deleteData: data,
  };
};

export default useDeleteUserMutation;
