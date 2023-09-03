import styled from "@emotion/styled";
import React, { useEffect, useCallback, useState } from "react";
import { Waypoint } from "react-waypoint";

import { NameTextWrapper } from "./ProfilePictureWithName";
import UserInputFields from "./UserInputFields";
import {
  useOnAddCompanion,
  useOnCheckForChanges,
  useOnCompanionInfoChanged,
  useOnResetOriginal,
  useOnSetBudgetRange,
  useOnToggleTravelInterests,
  useOnToggleTravelStyle,
  useOnUploadImage,
  useOnUserInfoChanged,
} from "./contexts/UserProfileStateHooks";
import { useUserProfileStateContext } from "./contexts/UserProfileStateContext";
import CompanionInputFields from "./CompanionInputFields";
import UserBudgetRange from "./UserBudgetRange";
import useUpdateUserMutation from "./hooks/useUpdateUserMutation";
import { isFormInvalid } from "./utils/userUtils";

import TravelPreferenceButtons from "components/ui/User/TravelPreferenceButtons";
import { MobileContainer } from "components/ui/Grid/Container";
import AddDeleteButton from "components/ui/User/AddButton";
import FixedSaveButton from "components/ui/User/FixedSaveButton";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import useToggle from "hooks/useToggle";
import WaypointWrapper from "components/ui/Lazy/WaypointWrapper";
import { ScrollStopEl, StyledSection } from "components/ui/User/SharedStyledComponent";

export const UsercontentContainer = styled.div`
  margin: auto;
  max-width: 1090px;
`;

// TODO: go over user related files and add translation where needed.

const UserContent = ({ priceFilters }: { priceFilters: SearchPageTypes.RangeFilter[] }) => {
  const { mainUserInfo, travelCompanions, travelStyle, travelInterests, travelBudget } =
    useUserProfileStateContext();

  const { t } = useTranslation(Namespaces.userProfileNs);
  const onUserInfoChange = useOnUserInfoChanged();
  const onCompanionInfoChange = useOnCompanionInfoChanged();
  const onAddCompanion = useOnAddCompanion();
  const onTravelStyleClick = useOnToggleTravelStyle();
  const onTravelInterestClick = useOnToggleTravelInterests();
  const onImageUpload = useOnUploadImage();
  const onUpdateBudget = useOnSetBudgetRange();
  const onCheckForChanges = useOnCheckForChanges();
  const onResetOriginal = useOnResetOriginal();

  const [isSuccessTimeout, toggleIsSuccessTimeout] = useToggle(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSticky, setIsSticky] = useState(true);

  useEffect(() => {
    setIsInvalid(isFormInvalid(mainUserInfo, travelCompanions));
    if (!isInvalid) {
      setHasChanges(onCheckForChanges());
    }
  }, [
    mainUserInfo,
    travelCompanions,
    travelStyle,
    travelInterests,
    travelBudget,
    isInvalid,
    onCheckForChanges,
  ]);

  const handleWaypointEnter = useCallback(() => {
    setIsSticky(false);
  }, []);
  const handleWaypointExit = useCallback(
    ({
      currentPosition,
      previousPosition,
    }: {
      currentPosition?: string;
      previousPosition?: string;
    }) => {
      if (currentPosition === Waypoint.above && previousPosition === Waypoint.inside) {
        setIsSticky(false);
      } else {
        setIsSticky(true);
      }
    },
    [setIsSticky]
  );
  const { updateUserQuery, updateUserLoading, updatedData } =
    useUpdateUserMutation(onResetOriginal);

  const handleSaveClick = useCallback(() => {
    updateUserQuery();
  }, [updateUserQuery]);

  useEffect(() => {
    if (updatedData && !hasChanges) {
      toggleIsSuccessTimeout(true);
    } else {
      toggleIsSuccessTimeout(false);
    }
    return undefined;
  }, [hasChanges, toggleIsSuccessTimeout, updatedData]);

  return (
    <UsercontentContainer>
      <StyledSection id="main-userinfo">
        <MobileContainer>
          <UserInputFields
            user={mainUserInfo}
            handleUserInfoChanged={onUserInfoChange}
            onImageUpload={onImageUpload}
          />
        </MobileContainer>
      </StyledSection>
      <StyledSection id="frequent-traveler-userinfo">
        <MobileContainer>
          <NameTextWrapper>{t("Frequently traveling together")}</NameTextWrapper>
          <AddDeleteButton buttonText="Add" onClick={onAddCompanion} />
          <CompanionInputFields
            companions={travelCompanions}
            handleCompanionInfoChanged={onCompanionInfoChange}
            onImageUpload={onImageUpload}
          />
        </MobileContainer>
      </StyledSection>
      <StyledSection id="travelstyle-userinfo">
        <MobileContainer>
          <NameTextWrapper>{t("Travel style")}</NameTextWrapper>
          <TravelPreferenceButtons
            sectionId="travel-style"
            travelPreferences={travelStyle}
            onClick={onTravelStyleClick}
          />
        </MobileContainer>
      </StyledSection>
      <StyledSection id="travelinterests-userinfo">
        <MobileContainer>
          <NameTextWrapper>{t("Interests")}</NameTextWrapper>
          <TravelPreferenceButtons
            sectionId="travel-interests"
            travelPreferences={travelInterests}
            onClick={onTravelInterestClick}
          />
        </MobileContainer>
      </StyledSection>
      <StyledSection id="user-travel-budget">
        <MobileContainer>
          {/* TODO: get actual range of budget, and filters from backend */}
          <UserBudgetRange
            initialMin={351}
            initialMax={5332}
            travelBudget={travelBudget}
            priceFilters={priceFilters}
            onAfterChange={onUpdateBudget}
          />
        </MobileContainer>
      </StyledSection>
      <ScrollStopEl>
        <FixedSaveButton
          buttonText="Update profile"
          successMessage="Successfully updated user"
          onSaveClick={handleSaveClick}
          isUpdating={updateUserLoading}
          saveSuccess={isSuccessTimeout}
          formInvalid={isInvalid}
          hasChanged={hasChanges}
          isSticky={isSticky}
        />
      </ScrollStopEl>
      <WaypointWrapper onEnter={handleWaypointEnter} onLeave={handleWaypointExit} />
    </UsercontentContainer>
  );
};

export default UserContent;
