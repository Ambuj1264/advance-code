import styled from "@emotion/styled";
import React, { useCallback, useMemo, memo } from "react";
import { useTheme } from "emotion-theming";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";
import { buildURL } from "react-imgix";

import RadioButton from "../Inputs/RadioButton";
import { validateUserDetailsForm } from "../../features/User/utils/userUtils";
import { ContentWrapper, ColumnWrapper } from "../FlightsShared/flightShared";
import { StyledInput } from "../Inputs/PhoneNumberInput";

import PassportRow from "./PassportRow";
import CompanionRow from "./CompanionRow";
import {
  StyledDateSelection,
  StyledLeftColumn,
  StyledRightColumn,
  StyledUserInput,
} from "./SharedStyledComponent";
import AddDeleteButton from "./AddButton";
import ConfirmationModal from "./ConfirmationModal";

import {
  DoubleInputWrapper,
  DoubleInputWrapperContainer,
  GenderWrapper,
} from "components/features/Cart/CartPassengerDetailsForm";
import InputWrapper from "components/ui/InputWrapper";
import PhoneNumberInputContainer from "components/ui/Inputs/PhoneNumberInputContainer";
import NationalityDropdown from "components/ui/Inputs/Dropdown/NationalityDropdown";
import { greyColor, gutters, whiteColor } from "styles/variables";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import { UserFields } from "components/features/User/types/UserEnums";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import ProfilePictureWithName from "components/features/User/ProfilePictureWithName";
import { getGenderOptions } from "components/features/Flight/utils/flightUtils";
import useUserForm from "components/features/User/useUserForm";
import { mqMin } from "styles/base";
import { ColumnItemWrapper } from "components/features/Flight/PassengerDetailsForm";
import { UserInfo } from "components/features/User/types/userTypes";
import { gteImgixUrl } from "utils/imageUtils";
import useToggle from "hooks/useToggle";
import Alert from "components/icons/alert-triangle.svg";
import useDeleteUserMutation from "components/features/User/hooks/useDeleteUserMutation";

const StyledContentWrapper = styled(ContentWrapper)`
  margin: 0;
  padding: 0;
  ${mqMin.large} {
    margin-right: -${gutters.large / 2}px;
    margin-left: 0;
  }
`;

const StyledPhoneNumberInputContainer = memo(
  styled(PhoneNumberInputContainer)<{
    isEditing?: boolean;
  }>(
    ({ theme, isEditing }) =>
      css`
        ${StyledInput} {
          border: ${isEditing
            ? `1px solid ${theme.colors.primary}`
            : `1px solid ${rgba(greyColor, 0.5)}`};
        }
        input:disabled {
          background-color: ${whiteColor};
        }
      `
  )
);

const TravelerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const SingleUserForm = ({
  user,
  isMainUser,
  companionId,
  handleUserInfoChanged,
  onImageUpload,
  formId = "",
}: {
  user: UserInfo;
  isMainUser?: boolean;
  companionId?: string;
  handleUserInfoChanged: (userId: string, updatedInfo: Partial<UserInfo>) => void;
  onImageUpload: (fileToUpload: File, isMainUser?: boolean, companionId?: string) => void;
  formId: string;
}) => {
  const { t } = useTranslation(Namespaces.userProfileNs);
  const [showDeleteModal, toggleShowDeleteModal] = useToggle(false);
  const isMobile = useIsMobile();
  const selectHeight = isMobile ? 40 : 45;
  const theme: Theme = useTheme();

  const {
    handlePassengerInfoChange,
    handleExpireDateChange,
    handleBirthDateChange,
    fieldHandlers: {
      handleFirstName,
      handleLastName,
      handleNationality,
      handlePassportChange,
      handleNoExpiryChange,
      handleGender,
    },
  } = useUserForm(user.id, handleUserInfoChanged);

  const handleMainUserEmailChange = useCallback(
    newInfo => {
      handlePassengerInfoChange(UserFields.email)(newInfo);
    },
    [handlePassengerInfoChange]
  );

  const handleUserImageUpload = useCallback(
    newInfo => {
      handlePassengerInfoChange(UserFields.base64Image)(newInfo);
    },
    [handlePassengerInfoChange]
  );
  const handleRelationChange = useCallback(
    newInfo => handlePassengerInfoChange(UserFields.relation)(newInfo),
    [handlePassengerInfoChange]
  );

  const { deleteUserMutation, deleteUserLoading } = useDeleteUserMutation();

  const handleDeleteClick = useCallback(() => {
    deleteUserMutation();
  }, [deleteUserMutation]);

  const {
    id,
    email,
    imageHandle,
    picture,
    firstName,
    lastName,
    nationality,
    gender,
    birthdate,
    passportno,
    passportExpiration,
    noPassportExpiration,
    phone,
    relation,
    newlyAdded,
  } = user;

  const { nameError, surnameError, emailError } = validateUserDetailsForm(user);

  const fullName = firstName || lastName ? `${firstName} ${lastName}` : t("Unnamed traveler");

  const gendersOption = useMemo(() => getGenderOptions(t), [t]);
  const genderGroup = `genderSelect-${id}`;

  const borderColor = theme.colors.primary;

  const imageUrl = imageHandle
    ? buildURL(`${gteImgixUrl}/${imageHandle}`, {
        w: 75,
        h: 75,
        dpr: 3,
        auto: "compress",
        fit: "faces",
        q: 100,
      })
    : picture;

  return (
    <>
      <TravelerWrapper>
        <ProfilePictureWithName
          imageUrl={imageUrl}
          fullName={fullName}
          onImageUpload={onImageUpload}
          isMainUser={isMainUser}
          companionId={companionId}
          id={formId}
          newlyAdded={newlyAdded}
          handleUserImageUpload={handleUserImageUpload}
        />
        {isMainUser && (
          <AddDeleteButton buttonText="Delete user" isDelete onClick={toggleShowDeleteModal} />
        )}
      </TravelerWrapper>
      <StyledContentWrapper>
        <StyledLeftColumn>
          <DoubleInputWrapper
            label={t("Name")}
            id="userProfilegivenNameWrapper"
            hasError={nameError || surnameError}
            customErrorMessage={nameError || surnameError ? t("Fields are required") : undefined}
            topRight
          >
            <DoubleInputWrapperContainer>
              <StyledUserInput
                id="firstName"
                placeholder={t("Given names")}
                value={firstName}
                onChange={handleFirstName}
                useDebounce={false}
                autocomplete="given-name"
                isEditing
              />
              <StyledUserInput
                id="surName"
                placeholder={t("Surnames")}
                value={lastName}
                onChange={handleLastName}
                useDebounce={false}
                autocomplete="family-name"
                isEditing
              />
            </DoubleInputWrapperContainer>
          </DoubleInputWrapper>
          <GenderWrapper
            label=""
            id={`${id}gendersOption`}
            hasError={false}
            customErrorMessage={t("error message")}
          >
            <>
              {gendersOption.map(genderOption => {
                const genderOptionId = `${genderGroup}${genderOption.value}`;
                return (
                  <RadioButton
                    checked={gender?.toLowerCase() === genderOption.value.toLowerCase()}
                    label={t(genderOption.label)}
                    name={genderGroup}
                    value={genderOption.value}
                    id={genderOptionId}
                    key={genderOptionId}
                    onChange={handleGender}
                  />
                );
              })}
            </>
          </GenderWrapper>
        </StyledLeftColumn>
        <StyledRightColumn>
          <DoubleInputWrapper
            label={t("Email")}
            id="email"
            hasError={emailError}
            customErrorMessage={emailError ? t("Email must be valid") : undefined}
            topRight
          >
            <StyledUserInput
              id="email"
              name="email"
              placeholder={t("Add contact email")}
              value={email}
              onChange={handleMainUserEmailChange}
              error={false}
              autocomplete="email"
              useDebounce={false}
              isEditing
            />
          </DoubleInputWrapper>
        </StyledRightColumn>
        <StyledLeftColumn>
          <ColumnWrapper>
            <ColumnItemWrapper>
              <NationalityDropdown
                hasError={false}
                nationality={nationality}
                onChange={handleNationality}
                placeholder={t("Select country")}
                borderColor={borderColor}
              />
            </ColumnItemWrapper>
            <ColumnItemWrapper>
              <StyledPhoneNumberInputContainer
                hasError={false}
                phoneNumber={phone ?? ""}
                onPhoneNumberChange={handlePassengerInfoChange(UserFields.phone)}
                placeholder={t("Add a phone number")}
                isEditing
              />
            </ColumnItemWrapper>
          </ColumnWrapper>
        </StyledLeftColumn>
        <StyledRightColumn>
          <InputWrapper
            label={t("Date of birth")}
            id="userBirthDate"
            customErrorMessage={t("there is an error")}
          >
            <StyledDateSelection
              key="dateofbirth"
              date={birthdate}
              onDateChange={handleBirthDateChange}
              error={false}
              selectHeight={selectHeight}
              borderColor={borderColor}
            />
          </InputWrapper>
        </StyledRightColumn>
        <PassportRow
          passportno={passportno}
          handlePassportChange={handlePassportChange}
          passportExpiration={passportExpiration}
          handleExpireDateChange={handleExpireDateChange}
          handleNoExpiry={handleNoExpiryChange}
          noPassportExpiration={noPassportExpiration}
          selectHeight={selectHeight}
          translate={t}
          id={id}
          borderColor={borderColor}
        />
        {!isMainUser && (
          <CompanionRow
            id={id}
            selectHeight={selectHeight}
            handleRelationChange={handleRelationChange}
            relation={relation}
            translate={t}
            borderColor={borderColor}
          />
        )}
        {showDeleteModal && (
          <ConfirmationModal
            onClose={toggleShowDeleteModal}
            title={t("Delete user")}
            Icon={Alert}
            BodyText={t(`Are you sure you want to delete the account?`, {
              fullName,
            })}
            loading={deleteUserLoading}
            onConfirmClick={handleDeleteClick}
          />
        )}
      </StyledContentWrapper>
    </>
  );
};

export default SingleUserForm;
