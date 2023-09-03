import placePhotoQuery from "components/features/PostBooking/queries/placePhotoQuery.graphql";
import useQueryClient from "hooks/useQueryClient";

const replaceGoogleUrl = (url?: string) => {
  if (!url) return undefined;
  const imgixUrl = url.replace("lh3.googleusercontent.com", "gte-lh3.imgix.net");
  return imgixUrl;
};

const usePlacePhoto = ({
  photoReference,
  maxWidth,
  skip = true,
}: {
  photoReference?: string;
  maxWidth?: number;
  skip?: boolean;
}) => {
  const { data, loading, error } = useQueryClient<any>(placePhotoQuery, {
    variables: {
      photoReference,
      maxWidth,
    },
    skip: skip || !photoReference,
  });
  return {
    image: replaceGoogleUrl(data?.getPlacePhoto?.photo),
    imageLoading: loading,
    imageError: error,
  };
};

export default usePlacePhoto;
