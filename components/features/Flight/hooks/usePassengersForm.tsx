import { useEffect, useContext, useState, useCallback } from "react";

import { Namespaces } from "shared/namespaces";
import {
  getBirthdayError,
  getIsFormValid,
  isPassengerFormInvalid,
  validatePassengerDetailsForm,
} from "components/features/Flight/utils/flightUtils";
import FlightStateContext from "components/features/Flight/contexts/FlightStateContext";
import FlightConstantContext from "components/features/Flight/contexts/FlightConstantContext";
import FlightCallbackContext from "components/features/Flight/contexts/FlightCallbackContext";
import { useTranslation } from "i18n";
import { PassengersFields } from "components/features/FlightSearchPage/types/flightEnums";

const usePassengersForm = ({
  passenger,
  onPassengerDetailsChange,
}: {
  passenger: FlightTypes.PassengerDetails;
  onPassengerDetailsChange: (
    passengedId: number,
    passengerDetails: Partial<FlightTypes.PassengerDetails>
  ) => void;
}) => {
  const { t } = useTranslation(Namespaces.flightNs);
  const { t: commonT } = useTranslation();
  const { passportRequired, dateOfDeparture } = useContext(FlightConstantContext);
  const [blurred, setBlurred] = useState(false);
  const { id, birthday, category } = passenger;

  const handlePassengerInfoChange = useCallback(
    (passengerId: number, fieldName: string) =>
      (newInfo: React.ChangeEvent<HTMLInputElement> | string | boolean): void =>
        onPassengerDetailsChange(passengerId, {
          [fieldName]: typeof newInfo === "object" ? newInfo.target.value : newInfo,
        }),
    [onPassengerDetailsChange]
  );

  const handleBirthDateChange = useCallback(
    (passengerId: number) => (dateObject: SharedTypes.Birthdate) =>
      onPassengerDetailsChange(passengerId, {
        birthday: {
          ...dateObject,
        },
      }),
    [onPassengerDetailsChange]
  );

  const onNationalityChange = useCallback(
    newInfo => {
      return handlePassengerInfoChange(id, PassengersFields.nationality)(newInfo);
    },
    [handlePassengerInfoChange, id]
  );

  const onGivenNameChange = useCallback(
    newInfo => {
      return handlePassengerInfoChange(id, PassengersFields.name)(newInfo);
    },
    [handlePassengerInfoChange, id]
  );

  const onSurnameChange = useCallback(
    newInfo => {
      return handlePassengerInfoChange(id, PassengersFields.surname)(newInfo);
    },
    [handlePassengerInfoChange, id]
  );

  const onGenderChange = useCallback(
    newInfo => {
      return handlePassengerInfoChange(id, PassengersFields.gender)(newInfo);
    },
    [handlePassengerInfoChange, id]
  );

  const onBlur = useCallback(() => setBlurred(true), []);
  const birthDayDateError = getBirthdayError(birthday, id, dateOfDeparture, category, t);
  const passengerFormErrors = validatePassengerDetailsForm(
    passenger,
    passportRequired,
    dateOfDeparture,
    t
  );
  const { birthdayError, birthdayPrimaryError, birthdayCategoryError } = passengerFormErrors;

  const hasBirthdayError =
    blurred && (birthdayError || birthdayPrimaryError || birthdayCategoryError);

  const { formSubmitted, formErrors } = useContext(FlightStateContext);
  const { onValidatePassenger } = useContext(FlightCallbackContext);
  const isFormValid = getIsFormValid(passengerFormErrors);

  const customErrorMessage = commonT("Field is required");

  useEffect(() => {
    if (isPassengerFormInvalid(formErrors.passengerFormErrors, id, isFormValid)) {
      onValidatePassenger(id, !isFormValid);
    }
    if (formSubmitted) {
      onBlur();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formErrors.passengerFormErrors, formSubmitted, id, isFormValid, onBlur, onValidatePassenger]);

  return {
    passengerFormErrors,
    hasBirthdayError,
    birthDayDateError,
    blurred,
    passportRequired,
    handleBirthDateChange,
    handlePassengerInfoChange,
    onNationalityChange,
    onGivenNameChange,
    onSurnameChange,
    onGenderChange,
    customErrorMessage,
  };
};

export default usePassengersForm;
