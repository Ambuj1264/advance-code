import React, { useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import ImageUpload from "../Inputs/ImageUpload";

import CameraIcon from "components/icons/camera-1.svg";
import { StyledEditIcon } from "components/features/VacationPackageProductPage/VPProductCardFooter";
import {
  borderRadiusTiny,
  boxShadowTileRegular,
  separatorColorLight,
  whiteColor,
} from "styles/variables";

const PictureWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 75px;
  height: 75px;
`;

const ProfileImage = styled.div<{
  imageSrc: string;
}>(
  ({ imageSrc }) => css`
    position: absolute;
    border-radius: 50%;
    width: 65px;
    height: 65px;
    background-color: ${separatorColorLight};
    background-image: url(${imageSrc});
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
  `
);

const StyledCameraIcon = styled(CameraIcon)<{
  hasImage: boolean;
}>(
  ({ hasImage }) => css`
    position: absolute;
    top: 50%;
    left: 50%;
    display: ${hasImage ? "none" : "block"};
    width: 25px;
    height: 25px;
    opacity: 0.3;
    transform: translate(-50%, -50%);
  `
);

const ProfileImageWrapper = styled.label`
  position: relative;
  width: 65px;
  height: 65px;
  cursor: pointer;
`;

const EditButtonWrapper = styled.label(
  ({ theme }) =>
    css`
      position: absolute;
      top: 5px;
      right: 5px;
      z-index: 99;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: ${boxShadowTileRegular};
      border: solid ${borderRadiusTiny} ${whiteColor};
      border-radius: 50%;
      width: 24px;
      height: 24px;
      background-color: ${theme.colors.primary};
      cursor: pointer;
    `
);

const EditProfilePicture = ({
  imageUrl = "",
  id,
  isMainUser,
  companionId,
  onImageUpload,
  handleUserImageUpload,
}: {
  imageUrl?: string;
  id: string;
  isMainUser?: boolean;
  companionId?: string;
  onImageUpload: (fileToUpload: File, isMainUser?: boolean, companionId?: string) => void;
  handleUserImageUpload?: (newInfo: any) => void;
}) => {
  const [file, setFile] = useState(imageUrl);
  return (
    <PictureWrapper>
      <EditButtonWrapper htmlFor={id}>
        <StyledEditIcon />
      </EditButtonWrapper>
      <ProfileImageWrapper>
        <ProfileImage imageSrc={file} />
        <StyledCameraIcon hasImage={Boolean(file)} />
        <ImageUpload
          id={id}
          isMainUser={isMainUser}
          companionId={companionId}
          setFile={setFile}
          onImageUpload={onImageUpload}
          handleUserImageUpload={handleUserImageUpload}
        />
      </ProfileImageWrapper>
    </PictureWrapper>
  );
};

export default EditProfilePicture;
