import React from "react";

import { UserInfo } from "./types/userTypes";

import SingleUserForm from "components/ui/User/SingleUserForm";

const UserInputFields = ({
  user,
  handleUserInfoChanged,
  onImageUpload,
}: {
  user: UserInfo;
  handleUserInfoChanged: (userId: string, updatedInfo: Partial<UserInfo>) => void;
  onImageUpload: (fileToUpload: File, isMainUser?: boolean, companionId?: string) => void;
}) => {
  return (
    <SingleUserForm
      user={user}
      isMainUser
      handleUserInfoChanged={handleUserInfoChanged}
      onImageUpload={onImageUpload}
      formId={`main-user-${user.id}`}
    />
  );
};

export default UserInputFields;
