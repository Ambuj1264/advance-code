import { useCallback } from "react";

import { UserContextObject, UserInfo, userPreferences } from "../types/userTypes";
import {
  addCompanionImageFile,
  addMainImageFile,
  addTravelCompanion,
  checkForbudgetChanges,
  checkForCompanionChanges,
  checkForPreferenceChanges,
  checkForUserChanges,
  constructTravelBudgetInput,
  removeTravelcompanion,
  toggleTravelOption,
} from "../utils/userUtils";

import { useUserProfileStateContext } from "./UserProfileStateContext";

export const useOnUserInfoChanged = () => {
  const { setAllContextState } = useUserProfileStateContext();
  return useCallback(
    (_userId: string, updatedInfo: Partial<UserInfo>) => {
      setAllContextState(prevState => ({
        ...prevState,
        mainUserInfo: {
          ...prevState.mainUserInfo,
          ...updatedInfo,
        },
      }));
    },
    [setAllContextState]
  );
};

export const useOnCompanionInfoChanged = () => {
  const { setAllContextState } = useUserProfileStateContext();
  return useCallback(
    (userId: string, updatedInfo: Partial<UserInfo>) => {
      setAllContextState(prevState => {
        const { travelCompanions } = prevState;

        const companions = travelCompanions.map(myCompanion => {
          if (myCompanion.id === userId) {
            return {
              ...myCompanion,
              ...updatedInfo,
            };
          }
          return myCompanion;
        });

        return {
          ...prevState,
          travelCompanions: companions,
        };
      });
    },
    [setAllContextState]
  );
};

export const useOnAddCompanion = () => {
  const { setAllContextState } = useUserProfileStateContext();
  return useCallback(() => {
    setAllContextState(prevState => ({
      ...prevState,
      travelCompanions: addTravelCompanion(prevState.travelCompanions),
    }));
  }, [setAllContextState]);
};

export const useOnRemoveCompanion = () => {
  const { setAllContextState } = useUserProfileStateContext();
  return useCallback(
    (companionId?: string) => {
      if (companionId) {
        setAllContextState(prevState => ({
          ...prevState,
          travelCompanions: removeTravelcompanion(prevState.travelCompanions, companionId),
        }));
      }
    },
    [setAllContextState]
  );
};

export const useOnToggleTravelStyle = () => {
  const { travelStyle, setContextState } = useUserProfileStateContext();

  return useCallback(
    (styleID: string) => {
      setContextState({
        travelStyle: toggleTravelOption(styleID, travelStyle),
      });
    },
    [setContextState, travelStyle]
  );
};

export const useOnToggleTravelInterests = () => {
  const { travelInterests, setContextState } = useUserProfileStateContext();

  return useCallback(
    (styleID: string) => {
      setContextState({
        travelInterests: toggleTravelOption(styleID, travelInterests),
      });
    },
    [setContextState, travelInterests]
  );
};

export const useOnUploadImage = () => {
  const { mainUserInfo, travelCompanions, setContextState } = useUserProfileStateContext();

  return useCallback(
    (fileToUpload: File, isMainUser?: boolean, companionId?: string) => {
      if (isMainUser) {
        setContextState({
          mainUserInfo: addMainImageFile(mainUserInfo, fileToUpload),
        });
      } else {
        const companions = travelCompanions.map(myCompanion => {
          if (myCompanion.id === companionId) {
            return addCompanionImageFile(myCompanion, fileToUpload);
          }
          return myCompanion;
        });
        setContextState({
          travelCompanions: companions,
        });
      }
    },
    [mainUserInfo, setContextState, travelCompanions]
  );
};
export const useOnSetBudgetRange = () => {
  const { setContextState } = useUserProfileStateContext();
  return useCallback(
    (el: number[]) => {
      if (Array.isArray(el)) {
        setContextState({
          travelBudget: constructTravelBudgetInput(el),
        });
      }
    },
    [setContextState]
  );
};

export const useOnUpdateUserInfoOnSuccess = () => {
  const { setContextState } = useUserProfileStateContext();
  return useCallback(
    (
      mainUserInfo: UserInfo,
      travelCompanions: UserInfo[],
      travelStyle: userPreferences[],
      travelInterests: userPreferences[],
      travelBudget: { min: number; max: number }
    ) => {
      setContextState({
        mainUserInfo,
        travelCompanions,
        travelStyle,
        travelInterests,
        travelBudget,
      });
    },
    [setContextState]
  );
};

export const useOnCheckForChanges = () => {
  const {
    mainUserInfo,
    travelCompanions,
    travelStyle,
    travelInterests,
    travelBudget,
    originalState,
  } = useUserProfileStateContext();
  return useCallback(() => {
    const userHasChanged = checkForUserChanges(mainUserInfo, originalState?.mainUser);
    const companionsHasChanged = checkForCompanionChanges(
      travelCompanions,
      originalState?.frequentTravelers
    );
    const styleHasChanged = checkForPreferenceChanges(travelStyle, originalState?.travelStyle);
    const interestHasChanged = checkForPreferenceChanges(
      travelInterests,
      originalState?.travelInterests
    );
    const budgetHasChanged = checkForbudgetChanges(travelBudget, originalState?.travelBudget);
    return Boolean(
      userHasChanged ||
        companionsHasChanged ||
        styleHasChanged ||
        interestHasChanged ||
        budgetHasChanged
    );
  }, [
    mainUserInfo,
    originalState?.frequentTravelers,
    originalState?.mainUser,
    originalState?.travelBudget,
    originalState?.travelInterests,
    originalState?.travelStyle,
    travelBudget,
    travelCompanions,
    travelInterests,
    travelStyle,
  ]);
};

export const useOnResetOriginal = () => {
  const { setContextState } = useUserProfileStateContext();
  return useCallback(
    (updatedInfo: UserContextObject) => {
      setContextState({
        originalState: updatedInfo,
      });
    },
    [setContextState]
  );
};
