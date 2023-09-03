import { buildURL } from "react-imgix";
import { pipe } from "fp-ts/lib/pipeable";

export const convertImage = (image: QueryImage): Image => ({
  ...image,
  id: image.id.toString(),
  url: image.url.split("?")[0],
  name: image.alt || image.name || "",
});

// Shape of imgix image url: https://guidetoiceland.imgix.net/4950
export const getImgixImageId = (imageUrl: string): string | undefined => {
  const matchResult = imageUrl.match(/imgix\.net\/(\d+)\/?/) || [];
  const imageId = matchResult[1];
  return imageId || undefined;
};

const imageUrlWithNameRegexp = /\x\/0\/([^?]+)(?=\?)?.*/;
const imgixUrlRegexp = /\x\/0\//;
export const updateImageNameInUrl = (image: Image): Image => {
  const hasFileNameInUrl = imageUrlWithNameRegexp.test(image.url);
  const isImgixUrl = imgixUrlRegexp.test(image.url);
  if (hasFileNameInUrl || !image.name || !isImgixUrl) {
    return image;
  }

  const dashedImageName = image.name.replace(/(\s+)/g, "-").replace(/[.,]/g, "").toLowerCase();

  const urlWithParamsArray = image.url.split("?");
  const urlParams = urlWithParamsArray[1] ? `?${urlWithParamsArray[1]}` : "";
  const urlWithName = `${urlWithParamsArray[0]}${dashedImageName}${urlParams}`;

  const updatedImage = {
    ...image,
    url: urlWithName,
  };

  return updatedImage;
};

export const setImageParamsForSearchAndDiscoveryFeed = (image: Image): Image => {
  const imageUrlWithParams = buildURL(
    image.url,
    {
      ar: "1.91:1",
      w: 1200,
      fit: "crop",
    },
    {
      disableLibraryParam: true,
    }
  );

  return { ...image, url: imageUrlWithParams };
};

export const formatImagesForSEOmeta = (images: Image[]): Image[] => {
  return images.map(image =>
    pipe(image, updateImageNameInUrl, setImageParamsForSearchAndDiscoveryFeed)
  );
};

export const getImagesWithoutSize = (images: Image[]) =>
  images.map(image => ({
    ...image,
    url: image.url.replace(/\b[w|h]=[\d]*[&]?/g, ""),
  }));

export const convertImageWithNumberId = (image: Image) =>
  convertImage({
    ...image,
    id: Number(image.id),
  });

export const parseFirstImageAttributes = (htmlValue: string) => {
  const parsedFirstImage = /<img.*?>/.exec(htmlValue);

  if (parsedFirstImage) {
    const firstImage = parsedFirstImage[0];

    const imageSrc = /.*?src="(.*?)"./.exec(firstImage);
    const imageAlt = /.*?alt="(.*?)"/.exec(firstImage);
    const imageTitle = /.*?title="(.*?)"/.exec(firstImage);
    const imageWidth = /.*?width="(.*?)"/.exec(firstImage);
    const imageHeight = /.*?height="(.*?)"/.exec(firstImage);

    return {
      imageSrc: imageSrc ? imageSrc[1] : "",
      imageAlt: imageAlt ? imageAlt[1] : "",
      imageTitle: imageTitle ? imageTitle[1] : "",
      imageWidth: imageWidth ? imageWidth[1] : "",
      imageHeight: imageHeight ? imageHeight[1] : "",
    };
  }

  return {
    imageSrc: "",
    imageAlt: "",
    imageTitle: "",
    imageWidth: "",
    imageHeight: "",
  };
};

export const replaceImageWithPicture = ({
  htmlValue,
  imageSrc,
  imageAlt,
  imageTitle,
  imageWidth,
  imageHeight,
  pictureSource,
}: {
  htmlValue: string;
  imageSrc: string;
  pictureSource: string;
  imageAlt: string;
  imageTitle: string;
  imageWidth: string;
  imageHeight: string;
}) => {
  const imgRegex = /<img[^>]*>/;
  const parsedImage = imgRegex.exec(htmlValue);

  if (parsedImage) {
    const picture = `<picture><source srcset="${pictureSource}" media="(min-width: 720px)" /><img src="${imageSrc}" alt="${imageAlt}" title="${imageTitle}" width="${imageWidth}" height="${imageHeight}" data-src="${pictureSource}"/></picture>`;

    return htmlValue.replace(imgRegex, picture);
  }

  return htmlValue;
};

export const addAspectRatioForLazyImageWrapper = (htmlValue: string) =>
  htmlValue.replace(/<span.*?class="lazyContainer"[^>]*>(.*?)<\/span>/gm, match => {
    const { imageWidth, imageHeight } = parseFirstImageAttributes(match);
    const parsedImageHeight = parseInt(imageHeight, 10);
    const parsedImageWidth = parseInt(imageWidth, 10);

    if (parsedImageHeight && parsedImageWidth && parsedImageHeight > 0 && parsedImageWidth > 0) {
      const aspectRatio = (parsedImageHeight / parsedImageWidth) * 100;

      return match.replace(
        // <span class="lazyContainer" style="display: block;>...</span> always come from API.
        /style="display: block;"/gm,
        `style="display: block; padding-bottom: ${aspectRatio}%"`
      );
    }

    return match;
  });

export const constructImgixUrl = ({
  imageUrl,
  imageHeight = 400,
  imageBlur = 15,
  imageQuality = 10,
}: {
  imageUrl: string;
  imageHeight?: number;
  imageBlur?: number;
  imageQuality?: number;
}) => {
  const isImageStartsWithHttps = /^http(s)?:\/\//i.test(imageUrl);

  if (!imageUrl || !isImageStartsWithHttps) return "";

  let imgixParams =
    `?w=360&h=${imageHeight}&fit=crop` +
    `&crop=faces,entropy,center` +
    `&auto=format,compress` +
    `&q=${imageQuality}` +
    `&blur=${imageBlur}` +
    `&dpr=2`;
  const imageUrlWithoutParams = imageUrl.split("?")[0];

  if (imageUrlWithoutParams?.toLowerCase().endsWith("gif")) {
    imgixParams += "&fm=jpeg";
  }

  return `${imageUrlWithoutParams}${imgixParams}`;
};

export const gteImgixUrl = "https://gte-gcms.imgix.net";

export const getImgixImageFromGraphCMS = (
  image?: SharedTypes.GraphCMSAsset,
  customName?: string
) => {
  if (!image || !image.handle) return undefined;
  return {
    id: image.id,
    url: `${gteImgixUrl}/${image.handle}`,
    name: customName || image.caption || "",
  } as Image;
};

export const airlinesImgixUrl = "https://ts-flight-img.imgix.net";

export const getImgixImageFromKiwi = (relativeImageUrl?: string) => {
  return relativeImageUrl ? `${airlinesImgixUrl}/${relativeImageUrl}` : "";
};

export const getGraphCMSFlagImage = ({
  image,
  customName,
  width = 24,
  height = 16,
  altText,
}: {
  image?: SharedTypes.GraphCMSAsset;
  customName?: string;
  width?: number;
  height?: number;
  altText: string;
}) => {
  if (!image || !image.handle) return undefined;
  return {
    id: image.id,
    width,
    height,
    alt: altText,
    url: `https://media.graphassets.com/output=format:png/resize=w:24,h:16,fit:crop/quality=value:75/auto_image/compress/${image.handle}`,
    name: customName || image.caption || "",
  } as ImageWithSizes;
};
