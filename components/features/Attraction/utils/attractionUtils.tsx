import { constructProductProps } from "components/ui/utils/uiUtils";
import { constructContent } from "components/ui/ArticleLayout/utils/contentUtils";
import { ConstructContentOptions } from "components/ui/ArticleLayout/utils/articleLayoutUtils";
import { convertImage } from "utils/imageUtils";

const constructMapPoints = (points: SharedTypes.QueryMapPoint[]) => {
  return points.map((mapPoint: SharedTypes.QueryMapPoint) => {
    return {
      ...mapPoint,
      image: mapPoint.image && convertImage(mapPoint.image),
      reviewTotalScore: mapPoint.reviewTotalScore || 0,
      reviewTotalCount: mapPoint.reviewTotalCount || 0,
    };
  });
};

function createMapObject({
  contentPage,
}: ContentTypes.QueryAttractionData): SharedTypes.Map | null {
  const isLocationHasLetters = /[a-zA-Z]/.test(contentPage.location);
  const location = isLocationHasLetters ? contentPage.location : "";
  const isCoordinatesDefined = contentPage.latitude && contentPage.longitude;
  if (!isCoordinatesDefined) {
    return null;
  }

  return {
    location,
    latitude: contentPage.latitude,
    longitude: contentPage.longitude,
    zoom: 10,
    staticMapImage: convertImage(contentPage.imageMap),
    points: constructMapPoints(contentPage.nearbyMapPoints),
  };
}

export const constructAttraction = (
  data: ContentTypes.QueryAttractionData,
  options: ConstructContentOptions,
  isGTI: boolean
): ArticleLayoutTypes.Attraction => {
  const articleContent = constructContent(data, options, isGTI);

  const { contentPage } = data;

  return {
    ...articleContent,
    contentPageMainFormatted: contentPage.contentPageMainFormatted ?? articleContent.content.main,
    toursSearchUrl: contentPage.toursSearchUrl,
    hotelsSearchUrl: contentPage.hotelsSearchUrl,
    carsSearchUrl: contentPage.carsSearchUrl,
    tourCategoryUrls: contentPage.tourCategoryUrls,
    shortDescription: contentPage.shortDescription,
    reviewTotalScore: contentPage.reviewTotalScore
      ? parseFloat(contentPage.reviewTotalScore)
      : undefined,
    reviewTotalCount: contentPage.reviewTotalCount,
    isGoogleReview: contentPage.isGoogleReview,
    name: contentPage.name,
    isABTestEnabled: contentPage.isABTestEnabled,
    props: constructProductProps(contentPage.props),
    latitude: contentPage.latitude,
    longitude: contentPage.longitude,
    location: contentPage.location,
    map: createMapObject(data),
  };
};
