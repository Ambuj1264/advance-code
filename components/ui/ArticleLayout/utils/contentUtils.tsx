import {
  processWidget,
  filterWideWidgets,
  filterWideBottomWidget,
  extractWideWidgetsToBottom,
  extractOnlyLastWideBottomWidget,
  extractTOCWidget,
  filterRedundantRightBarTeasers,
  ConstructContentOptions,
} from "./articleLayoutUtils";

import { constructImages } from "utils/globalUtils";
import { convertImage, formatImagesForSEOmeta } from "utils/imageUtils";

export const constructContent = (
  data: ContentTypes.QueryContentData,
  options: ConstructContentOptions,
  isGTI: boolean
): ArticleLayoutTypes.Article => {
  const { contentPage, tourLandingUrl } = data;
  const mainContent =
    contentPage?.contentPageMainFormatted ?? contentPage?.content?.contentPageMain;
  const notFilteredContent = {
    left: contentPage?.content?.contentPageLeftSidebar?.map(processWidget(options, isGTI)) ?? [],
    main:
      mainContent?.map(
        processWidget(
          {
            ...options,
            reduceNumberOfSpecs: true,
            skipProductProps: true,
          },
          isGTI
        )
      ) ?? [],
    right: contentPage?.content?.contentPageRightSidebar?.map(processWidget(options, isGTI)) ?? [],
  };

  const content = {
    left: filterWideWidgets(notFilteredContent.left),
    main: filterWideBottomWidget(notFilteredContent.main),
    right: filterRedundantRightBarTeasers(notFilteredContent.right),
  };
  const imageList = constructImages(contentPage.images, contentPage.image);
  return {
    tourLandingUrl,
    publishedTime: contentPage.publishedTime,
    modifiedTime: contentPage.modifiedTime,
    id: contentPage.id,
    title: contentPage.title,
    slug: contentPage.uri,
    url: contentPage.frontUrl,
    uriMetaEditing: contentPage.uriMetaEditing,
    isIndexed: contentPage.isIndexed,
    draft: contentPage.draft,
    author: contentPage.author,
    image: convertImage(contentPage.image),
    images: imageList,
    metaImages: formatImagesForSEOmeta(imageList),
    hrefLangs: contentPage.hrefLangs,
    metadata: {
      title: contentPage.metadata.title,
      description: contentPage.metadata.description,
      facebookLikeUrl: contentPage.metadata.facebookLikeUrl,
      facebookCommentsUrlOverride: contentPage.metadata.facebookCommentsUrlOverride,
      canonicalUrl: contentPage.metadata.canonicalUrl,
    },
    content,
    bottom: [
      ...extractWideWidgetsToBottom([notFilteredContent.left, notFilteredContent.right]),
      ...extractOnlyLastWideBottomWidget(notFilteredContent.main),
    ],
    tableOfContents: extractTOCWidget([content.left, content.right]),
  };
};

export const replaceHTML = (value: string) =>
  value
    ?.replace("<table", "<div class='table-overflow' ><table")
    .replace("</table>", "</table></div>");
