import nanoMemoize from "nano-memoize";

import { convertImgixImageToBase64, isDev } from "utils/globalUtils";
import {
  addAspectRatioForLazyImageWrapper,
  parseFirstImageAttributes,
  replaceImageWithPicture,
  gteImgixUrl,
} from "utils/imageUtils";
import { isBrowser } from "utils/helperUtils";

const PDPResolver = {
  contentPageMainFormatted: async ({ content }: ContentTypes.QueryContent) => {
    if (content?.contentPageMain?.length) {
      const contentPageMainPromises = content.contentPageMain.map(
        async (contentItem: ArticleWidgetTypes.QueryArticleWidget, index) => {
          if (contentItem?.type === "html") {
            const htmlValue = contentItem.data.value;

            const htmlWithAspectRatio = addAspectRatioForLazyImageWrapper(htmlValue);

            const isFirstHtmlSection = index === 0;
            const isFirstHtmlSectionAttractions =
              index === 1 && content.contentPageMain[0]?.type === "listOfQuickFacts";

            // Convert to base64 only the first image in first visible html section
            if ((isFirstHtmlSection || isFirstHtmlSectionAttractions) && !isBrowser) {
              const { imageSrc, imageTitle, imageAlt, imageHeight, imageWidth } =
                parseFirstImageAttributes(htmlValue);

              if (imageSrc && !imageSrc.includes("data:") && !imageSrc.startsWith("/")) {
                const firstImageBase64 = await convertImgixImageToBase64({
                  imageUrl: imageSrc,
                  imageHeight: 220,
                  imageQuality: 10,
                  imageBlur: 0,
                });

                if (firstImageBase64) {
                  return {
                    ...contentItem,
                    data: {
                      ...contentItem.data,
                      value: replaceImageWithPicture({
                        pictureSource: imageSrc,
                        imageSrc: firstImageBase64,
                        htmlValue: htmlWithAspectRatio,
                        imageTitle,
                        imageAlt,
                        imageWidth,
                        imageHeight,
                      }),
                    },
                  };
                }
              }
            }

            return {
              ...contentItem,
              data: { ...contentItem.data, value: htmlWithAspectRatio },
            };
          }

          return contentItem;
        }
      );

      return Promise.all(contentPageMainPromises);
    }

    return [];
  },
};

const memoizedSvgIcon = nanoMemoize(
  async (icon: SharedTypes.GraphCMSAsset) =>
    fetch(`${gteImgixUrl}/${icon.handle}`)
      .then(response => response.text())
      .catch(err => {
        if (isDev()) {
          // eslint-disable-next-line no-console
          console.error("Failed to fetch image (apolloLocalResolvers):", err);
        }
        return null;
      }),
  {
    equals: (currentValue: SharedTypes.GraphCMSAsset, prevValue: SharedTypes.GraphCMSAsset) =>
      currentValue.handle === prevValue.handle,
  }
);

const ValuePropIconToSvgResolver = {
  svgAsString: async (icon: SharedTypes.GraphCMSAsset | null) =>
    icon && icon.handle ? memoizedSvgIcon(icon) : null,
};

export const resolvers = {
  Article: PDPResolver,
  Blog: PDPResolver,
  Tour: PDPResolver,
  Hotel: PDPResolver,
  Attraction: {
    contentPageMainFormatted: PDPResolver.contentPageMainFormatted,
  },
  GraphCMSAsset: ValuePropIconToSvgResolver,
};
