export const getBase64 = (
  file: File,
  cb: (el: string | ArrayBuffer | null) => void,
  setOnSuccess: React.Dispatch<React.SetStateAction<boolean>>,
  onError: React.Dispatch<React.SetStateAction<ProgressEvent<FileReader> | null>>
) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  // eslint-disable-next-line functional/immutable-data
  reader.onload = () => {
    cb(reader.result);
    setOnSuccess(true);
  };
  // eslint-disable-next-line functional/immutable-data
  reader.onerror = error => {
    console.log("Base64Error: ", error);
    // TODO: Actually handle the error, need to align with team
    onError(error);
  };
};
