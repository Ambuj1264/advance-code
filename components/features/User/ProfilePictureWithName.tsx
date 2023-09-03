import styled from "@emotion/styled";
import React, { useCallback } from "react";
import { css } from "@emotion/core";

import { useOnRemoveCompanion } from "./contexts/UserProfileStateHooks";

import Person from "components/icons/person-with-white.svg";
import EditProfilePicture from "components/ui/User/EditProfilePicture";
import { typographyH5 } from "styles/typography";
import { fontWeightSemibold } from "styles/variables";
import CloseButton from "components/ui/User/CloseButton";
import ConfirmationModal from "components/ui/User/ConfirmationModal";
import useToggle from "hooks/useToggle";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";

export const ImageNameWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const NameTextWrapper = styled.h3<{}>(({ theme }) => [
  typographyH5,
  css`
    color: ${theme.colors.primary};
    font-weight: ${fontWeightSemibold};
  `,
]);

const ProfilePictureWithName = ({
  fullName = "",
  imageUrl,
  id,
  isMainUser = false,
  companionId,
  newlyAdded,
  onImageUpload,
  handleUserImageUpload,
}: {
  fullName?: string;
  imageUrl?: string;
  id: string;
  isMainUser?: boolean;
  companionId?: string;
  newlyAdded?: boolean;
  onImageUpload: (fileToUpload: File, isMainUser?: boolean, companionId?: string) => void;
  handleUserImageUpload?: (newInfo: any) => void;
}) => {
  const [showModal, toggleShowModal] = useToggle(false);
  const removeCompanion = useOnRemoveCompanion();
  const { t } = useTranslation(Namespaces.userProfileNs);

  const handleRemoveCompanion = useCallback(() => {
    removeCompanion(companionId);
    // TODO send frequent travelers array to mutation after removal.
  }, [companionId, removeCompanion]);
  return (
    <>
      <ImageNameWrapper>
        <EditProfilePicture
          onImageUpload={onImageUpload}
          isMainUser={isMainUser}
          companionId={companionId}
          imageUrl={imageUrl}
          id={id}
          handleUserImageUpload={handleUserImageUpload}
        />
        <NameTextWrapper>{fullName}</NameTextWrapper>
        {!isMainUser ? (
          <CloseButton id="remove" onClick={newlyAdded ? handleRemoveCompanion : toggleShowModal} />
        ) : null}
      </ImageNameWrapper>
      {showModal && (
        <ConfirmationModal
          onClose={toggleShowModal}
          title={t("Remove companion?")}
          Icon={Person}
          BodyText={t(`Are you sure you want to remove ${fullName} as your travel companion?`, {
            fullName,
          })}
          onConfirmClick={handleRemoveCompanion}
        />
      )}
    </>
  );
};

export default ProfilePictureWithName;
