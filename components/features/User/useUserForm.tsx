import { useCallback } from "react";

import { UserInfo } from "./types/userTypes";
import { UserFields } from "./types/UserEnums";

import { useTranslation } from "i18n";

const useUserForm = (
  userId: string,
  onPassengerDetailsChange: (id: string, userDetails: Partial<UserInfo>) => void
) => {
  const { t: commonT } = useTranslation();

  const handlePassengerInfoChange = useCallback(
    (fieldName: string) =>
      (newInfo: React.ChangeEvent<HTMLInputElement> | string | boolean): void =>
        onPassengerDetailsChange(userId, {
          [fieldName]: typeof newInfo === "object" ? newInfo.target.value : newInfo,
        }),
    [onPassengerDetailsChange, userId]
  );

  const handleExpireDateChange = useCallback(
    (dateObject: SharedTypes.Birthdate) =>
      onPassengerDetailsChange(userId, {
        passportExpiration: dateObject,
      }),
    [onPassengerDetailsChange, userId]
  );
  const handleBirthDateChange = useCallback(
    (dateObject: SharedTypes.Birthdate) =>
      onPassengerDetailsChange(userId, {
        birthdate: dateObject,
      }),
    [onPassengerDetailsChange, userId]
  );

  const customErrorMessage = commonT("Field is required");

  const handleNationality = useCallback(
    newInfo => handlePassengerInfoChange(UserFields.nationality)(newInfo),
    [handlePassengerInfoChange]
  );
  const handleFirstName = useCallback(
    newInfo => handlePassengerInfoChange(UserFields.firstName)(newInfo),
    [handlePassengerInfoChange]
  );
  const handleLastName = useCallback(
    newInfo => handlePassengerInfoChange(UserFields.lastName)(newInfo),
    [handlePassengerInfoChange]
  );

  const handleGender = useCallback(
    newInfo => handlePassengerInfoChange(UserFields.gender)(newInfo),
    [handlePassengerInfoChange]
  );

  const handlePassportChange = useCallback(
    newInfo => handlePassengerInfoChange(UserFields.passportno)(newInfo),
    [handlePassengerInfoChange]
  );

  const handleRelationChange = useCallback(
    newInfo => handlePassengerInfoChange(UserFields.relation)(newInfo),
    [handlePassengerInfoChange]
  );
  const handleNoExpiryChange = useCallback(
    newInfo => handlePassengerInfoChange(UserFields.noPassportExpiration)(newInfo),
    [handlePassengerInfoChange]
  );

  return {
    handlePassengerInfoChange,
    handleExpireDateChange,
    handleBirthDateChange,
    fieldHandlers: {
      handleNationality,
      handleFirstName,
      handleLastName,
      handleGender,
      handlePassportChange,
      handleNoExpiryChange,
      handleRelationChange,
    },
    customErrorMessage,
  };
};

export default useUserForm;
