import { useMutation } from "@apollo/react-hooks";
import { useCallback } from "react";

import { useUserProfileStateContext } from "../contexts/UserProfileStateContext";
import { UserContextObject, userProfileQuery } from "../types/userTypes";
import { useOnUpdateUserInfoOnSuccess } from "../contexts/UserProfileStateHooks";
import { constructUserQueryContent } from "../utils/constructUserQueryContent";
import { constructMutationIntput } from "../utils/constructMutationIntput";

import UpdateUserProfile from "components/features/User/queries/UpdateUserMutation.graphql";
import { noCacheHeaders } from "utils/apiUtils";

const useUpdateUserMutation = (onResetOriginal: (updatedInfo: UserContextObject) => void) => {
  const { mainUserInfo, travelCompanions, travelStyle, travelInterests, travelBudget } =
    useUserProfileStateContext();

  const onUpdateUserInfoOnSuccess = useOnUpdateUserInfoOnSuccess();

  const [updateUserMutation, { data, loading, error }] = useMutation<{
    updateUserProfile: userProfileQuery;
  }>(UpdateUserProfile, {
    context: {
      headers: {
        ...noCacheHeaders,
      },
    },
    onCompleted: ({ updateUserProfile }) => {
      // TODO: handle errors from mutation
      if (updateUserProfile && !error) {
        const constructedUpdateData = constructUserQueryContent(updateUserProfile);
        onResetOriginal(constructedUpdateData);
        onUpdateUserInfoOnSuccess(
          constructedUpdateData.mainUser,
          constructedUpdateData.frequentTravelers,
          constructedUpdateData.travelStyle,
          constructedUpdateData.travelInterests,
          constructedUpdateData.travelBudget ?? { min: 351, max: 5332 }
        );
      }
    },
  });

  const updateUser = useCallback(() => {
    const input = constructMutationIntput(
      mainUserInfo,
      travelCompanions,
      travelStyle,
      travelInterests,
      travelBudget
    );
    updateUserMutation({
      variables: {
        input,
      },
    });
  }, [
    mainUserInfo,
    travelBudget,
    travelCompanions,
    travelInterests,
    travelStyle,
    updateUserMutation,
  ]);

  return {
    updateUserQuery: updateUser,
    updateUserLoading: loading,
    updateUserError: error,
    updatedData: data,
  };
};

export default useUpdateUserMutation;
