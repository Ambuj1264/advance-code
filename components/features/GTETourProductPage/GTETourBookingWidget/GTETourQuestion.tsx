import React, { useState } from "react";
import rgba from "polished/lib/color/rgba";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import Input from "@travelshift/ui/components/Inputs/Input";
import TextArea from "@travelshift/ui/components/Inputs/TextArea";
import { useTheme } from "emotion-theming";

import { useGTETourBookingWidgetContext } from "./GTETourBookingWidgetStateContext";
import GTETourTimeQuestion from "./GTETourTimeQuestion";
import { GTETourQuestionType, GTETourQuestionId } from "./types/enums";
import GTETourNumberAndUnitQuestion from "./GTETourNumberAndUnitQuestion";
import GTETourLocationQuestion from "./GTETourLocationQuestion";
import {
  getDateQuestionError,
  getIsNameError,
  getIsWeightOrHeightError,
} from "./utils/gteTourBookingWidgetUtils";

import NationalityDropdown from "components/ui/Inputs/Dropdown/NationalityDropdown";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import { typographyCaptionSemibold } from "styles/typography";
import DateSelect from "components/ui/Inputs/DateSelect";
import InputWrapper, { Label, InputError } from "components/ui/InputWrapper";
import { gutters, guttersPx, blackColor, redColor } from "styles/variables";

const DropdownWrapper = styled.div`
  margin-top: ${gutters.small / 2}px;
`;

export const Container = styled.div`
  width: 100%;
  & + & {
    margin-top: ${gutters.large}px;
  }
  ${DropdownWrapper} {
    margin-top: 0;
  }
`;

export const StyledInputWrapper = styled(InputWrapper)`
  display: flex;
  flex-direction: column;
  ${Label} {
    ${typographyCaptionSemibold};
    margin-bottom: ${gutters.small / 2}px;
    padding-right: ${guttersPx.smallHalf};
    color: ${rgba(blackColor, 0.7)};
  }
  ${InputError} {
    bottom: 48px;
  }
`;

const NumberAndUnitInputWrapper = styled(StyledInputWrapper)`
  ${InputError} {
    bottom: -18px;
  }
`;

const StyledInput = styled(Input)<{ error?: boolean }>(
  ({ theme, error }) => css`
    height: 45px;
    :not(.error) {
      box-shadow: none;
      border: 1px solid ${error ? redColor : theme.colors.primary};
    }
  `
);

const StyledDateSelect = styled(DateSelect)`
  svg {
    width: 14px;
    height: 14px;
  }
`;

const StyledTextArea = styled(TextArea)(
  ({ theme }) => css`
    box-shadow: none;
    border: 1px solid ${theme.colors.primary};
    resize: none;
  `
);

const StyledNationalityDropdown = styled(NationalityDropdown)`
  ${Label} {
    ${typographyCaptionSemibold};
    margin-bottom: ${gutters.small / 2}px;
    padding-right: ${guttersPx.smallHalf};
    color: ${rgba(blackColor, 0.7)};
  }
  svg {
    width: 14px;
    height: 14px;
  }
`;

const GTETourQuestion = ({
  question,
  onChange,
  onUnitChange = () => {},
  birthdayError,
  passportExpirationError,
  productCode,
  locationType,
  isInModal = false,
}: {
  question: GTETourBookingWidgetTypes.TourQuestionAnswer;
  onChange: (
    id: number,
    value: string | SharedTypes.Birthdate | SharedTypes.Time | SharedTypes.AutocompleteItem
  ) => void;
  onUnitChange?: (id: number, value: string) => void;
  birthdayError?: string;
  passportExpirationError?: string;
  productCode: string;
  locationType?: string;
  isInModal?: boolean;
}) => {
  const { t } = useTranslation(Namespaces.tourNs);
  const { allowCustomTravelerPickup, selectedDates } = useGTETourBookingWidgetContext();
  const theme: Theme = useTheme();
  const [blurred, setBlurred] = useState(false);
  const { id, type, answer, label, hint, providerBookingQuestionId, required, maxLength } =
    question;
  const onBlur = () => setBlurred(true);
  const hasError = blurred && answer === "" && required;
  if (type === GTETourQuestionType.DATE) {
    const { year, month, day } = answer as SharedTypes.Birthdate;
    const hasDateError = blurred && (!year || !month || !day) && required;
    const isBirthday = providerBookingQuestionId === GTETourQuestionId.DATE_OF_BIRTH;
    const { isDateError, customErrorMessage } = getDateQuestionError({
      t,
      hasDateError,
      questionId: providerBookingQuestionId as GTETourQuestionId,
      answer: answer as SharedTypes.Birthdate,
      birthdayError,
      passportExpirationError,
      dateFrom: selectedDates.from,
    });
    return (
      <Container>
        <StyledInputWrapper
          id={providerBookingQuestionId}
          label={label}
          hasError={isDateError}
          required={required}
          customErrorMessage={customErrorMessage}
        >
          <StyledDateSelect
            date={answer as SharedTypes.Birthdate}
            onDateChange={(value: SharedTypes.Birthdate) => onChange(id, value)}
            selectHeight={45}
            isExpiration={!isBirthday}
            error={isDateError}
            borderColor={theme.colors.primary}
            maxHeight={isInModal ? "180px" : undefined}
          />
        </StyledInputWrapper>
      </Container>
    );
  }
  if (type === GTETourQuestionType.NUMBER_AND_UNIT) {
    const { isWeightOrHeightError, customErrorMessage, maxValue } = getIsWeightOrHeightError(
      t,
      providerBookingQuestionId as GTETourQuestionId,
      answer as string,
      question.selectedUnit
    );
    return (
      <Container>
        <NumberAndUnitInputWrapper
          id={providerBookingQuestionId}
          label={label}
          hasError={isWeightOrHeightError}
          required={required}
          customErrorMessage={customErrorMessage}
        >
          <GTETourNumberAndUnitQuestion
            id={providerBookingQuestionId}
            units={question.units || []}
            selectedUnit={question.selectedUnit}
            answer={answer as string}
            onUnitChange={value => onUnitChange(id, value)}
            onChange={(value: string) => onChange(id, value)}
            borderColor={theme.colors.primary}
            isError={isWeightOrHeightError}
            maxValue={maxValue}
            onBlur={onBlur}
          />
        </NumberAndUnitInputWrapper>
      </Container>
    );
  }
  if (type === GTETourQuestionType.TEXTAREA) {
    return (
      <Container>
        <StyledInputWrapper
          id={providerBookingQuestionId}
          label={label}
          hasError={hasError}
          required={required}
        >
          <StyledTextArea
            value={answer as string}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
              onChange(id, event.target.value);
            }}
            placeholder={hint}
            onBlur={onBlur}
            maxLength={maxLength}
          />
        </StyledInputWrapper>
      </Container>
    );
  }
  if (type === GTETourQuestionType.TIME) {
    return (
      <Container>
        <StyledInputWrapper
          id={providerBookingQuestionId}
          label={label}
          hasError={hasError}
          required={required}
        >
          <GTETourTimeQuestion
            id={providerBookingQuestionId}
            selectedTime={answer as SharedTypes.Time}
            onTimeChange={(value: SharedTypes.Time) => onChange(id, value)}
            borderColor={theme.colors.primary}
          />
        </StyledInputWrapper>
      </Container>
    );
  }
  if (type === GTETourQuestionType.LOCATION_REF_OR_FREE_TEXT) {
    const hasLocationError =
      blurred &&
      !allowCustomTravelerPickup &&
      !(answer as SharedTypes.AutocompleteItem).id &&
      required;
    const locationTitle =
      providerBookingQuestionId === GTETourQuestionId.PICKUP_POINT ? t("Pickup point") : label;
    const locationLabel = allowCustomTravelerPickup
      ? t("{location} or custom location", {
          location: locationTitle,
        })
      : locationTitle;
    return (
      <Container>
        <StyledInputWrapper
          id={providerBookingQuestionId}
          label={locationLabel}
          hasError={hasLocationError}
          required={required}
          customErrorMessage={hasLocationError ? t("Please select a location") : undefined}
        >
          <GTETourLocationQuestion
            id={providerBookingQuestionId}
            answer={answer as SharedTypes.AutocompleteItem}
            onChange={(value: SharedTypes.AutocompleteItem) => onChange(id, value)}
            onBlur={onBlur}
            productCode={productCode}
            hasError={hasLocationError}
            locationType={locationType}
          />
        </StyledInputWrapper>
      </Container>
    );
  }
  if (providerBookingQuestionId === GTETourQuestionId.PASSPORT_NATIONALITY) {
    return (
      <Container>
        <StyledNationalityDropdown
          hasError={hasError}
          nationality={answer as string}
          onChange={(value: string) => onChange(id, value)}
          placeholder={hint}
          useNameAsValue
          customLabel={label}
          required={required}
          borderColor={theme.colors.primary}
        />
      </Container>
    );
  }
  const { isNameError, customErrorMessage } = getIsNameError(
    providerBookingQuestionId as GTETourQuestionId,
    answer as string,
    t
  );
  return (
    <Container>
      <StyledInputWrapper
        id={providerBookingQuestionId}
        label={label}
        hasError={isNameError || hasError}
        required={required}
        customErrorMessage={customErrorMessage}
      >
        <StyledInput
          name={providerBookingQuestionId}
          value={answer as string}
          placeholder={hint}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            onChange(id, event.target.value);
          }}
          onBlur={onBlur}
          error={isNameError || hasError}
          solid
          maxLength={maxLength}
          scrollToCenterOnFocus={false}
        />
      </StyledInputWrapper>
    </Container>
  );
};

export default GTETourQuestion;
