import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import styled from "@emotion/styled";

import { getBase64 } from "components/features/User/utils/getBase64";

const ImageUploadContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const StyledInputField = styled.input`
  height: 0;
  visibility: hidden;
`;

const ImageUpload = ({
  id,
  isMainUser,
  companionId,
  onImageUpload,
  setFile,
  handleUserImageUpload,
}: {
  id: string;
  isMainUser?: boolean;
  companionId?: string;
  onImageUpload: (fileToUpload: File, isMainUser?: boolean, companionId?: string) => void;
  setFile: Dispatch<SetStateAction<string>>;
  handleUserImageUpload?: (base64Image: any) => void;
}) => {
  const [isSuccessful, setIsSuccessful] = useState(false);

  const [uploadError, setUploadError] = useState<ProgressEvent<FileReader> | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const ImageFiles = (e.target as HTMLInputElement).files;

    if (ImageFiles?.length !== undefined && ImageFiles?.length > 0) {
      const imageTempUrl = URL.createObjectURL(ImageFiles[0]);
      if (handleUserImageUpload) {
        let base64Img = "";
        getBase64(
          ImageFiles[0],
          result => {
            base64Img = result as string;
            const rawData = base64Img.split(",");
            handleUserImageUpload(rawData[1]);
          },
          setIsSuccessful,
          setUploadError
        );
      }

      setFile(imageTempUrl);

      if (isMainUser) {
        onImageUpload(ImageFiles[0], isMainUser, undefined);
      } else if (companionId) {
        onImageUpload(ImageFiles[0], undefined, companionId);
      } else {
        console.log("file upload failed");
      }
    }
  };
  // TODO: align with team on how to deal with error
  useEffect(() => {
    if (uploadError) {
      console.log(uploadError);
      setUploadError(null);
    }
    if (isSuccessful) {
      console.log(isSuccessful);
      setIsSuccessful(false);
    }
  }, [isSuccessful, uploadError]);
  return (
    <ImageUploadContainer>
      <StyledInputField id={id} type="file" accept="image/*" onChange={handleImageUpload} />
    </ImageUploadContainer>
  );
};

export default ImageUpload;
