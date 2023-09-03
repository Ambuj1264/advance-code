import { RefObject } from "react";
import { fromNullable, map, toUndefined } from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
import getConfig from "next/config";

import getBase64ForImage from "./getBase64ForImage";
import { constructImgixUrl, gteImgixUrl } from "./imageUtils";

import type { SupportedLanguagesValues } from "shared/translations";
import { SupportedLanguages, UserRoles } from "types/enums";

const {
  RUNTIME_ENV: runtimeEnvConfig,
  NODE_ENV,
  isServerless,
  assetPrefix,
} = getConfig().publicRuntimeConfig;

const RUNTIME_ENV = runtimeEnvConfig || process.env.RUNTIME_ENV;

export const constructImage = (image: QueryImage): Image => ({
  id: image.id?.toString() || image.url,
  url: image.url.split("?")[0].replace("%252f", "-"),
  name: image.alt || image.name || "",
});

export const isProd = () => RUNTIME_ENV === "prod";

export const isDevBranchDeployment = () => RUNTIME_ENV === "dev";

export const isDev = () => !isProd();

export const isDevBuild = NODE_ENV === "development";

export const getStaticDirPath = () => {
  if (isServerless) return `${assetPrefix}/_next/static`;
  return "/_next/static";
};

export const getChunksDirPath = () => {
  if (isServerless || isDevBuild) return `${assetPrefix}/_next/static`;
  return "/_next/static";
};

export const constructImages = (
  images: ReadonlyArray<QueryImage>,
  mainImage?: Readonly<QueryImage>,
  imageUrlBase64?: string
): Image[] => {
  const noImageList = !images || !images.length;

  if (!mainImage) {
    return images?.map(image => constructImage(image)) ?? [];
  }

  const mainImageWithBase64 = {
    imageUrlBase64,
    ...mainImage,
  };

  if (noImageList) {
    return [constructImage(mainImageWithBase64)];
  }

  const isOneImageArrayWithItemEqualsToMain = images[0].id === mainImage.id && images.length === 1;
  const isCoverDuplicatesFirstContentImage = images[0].id === mainImage.id && images.length > 1;

  /*
   * In this situation Cover image will be identical to the first image from the content.
   * That means we show same image twice one by one on the page: in the Cover as a main image
   * and in the content as a part of content.
   * To avoid this visual duplication we change mainImage to any other image from the content.
   * */
  if (isCoverDuplicatesFirstContentImage) {
    const lastImage = images[images.length - 1];
    return [
      {
        imageUrlBase64,
        ...lastImage,
      },
      mainImage,
      ...images.filter(image => image.id !== mainImage.id && image.id !== lastImage.id),
    ].map(image => constructImage(image));
  }

  // We can't merge main image to the one item array with the same image in it to prevent duplicates;
  if (isOneImageArrayWithItemEqualsToMain) {
    return [constructImage(mainImageWithBase64)];
  }

  // Use main image as a first image in the carousel
  return [mainImageWithBase64, ...images.filter(image => image.id !== mainImageWithBase64.id)].map(
    image => constructImage(image)
  );
};

export const constructUser = (user?: QueryUser): User | undefined => {
  return pipe(
    fromNullable(user),
    map(userData => ({
      ...userData,
      roles: userData?.roles.map(userRole => userRole.id),
    })),
    map(({ id, name, email, avatarImage, roles, countryCode, phone }) => ({
      id,
      name,
      email,
      phone,
      countryCode,
      avatarImage: avatarImage && constructImage(avatarImage),
      isAdmin: roles.includes(UserRoles.admin),
      isTranslator: roles.includes(UserRoles.translator),
      isAffiliate: roles.includes(UserRoles.affiliate),
    })),
    toUndefined
  );
};

// Should match the country code in the API countryListQuery
const nationalityMap: { [key in SupportedLanguagesValues]?: string } = {
  [SupportedLanguages.English]: "GB",
  [SupportedLanguages.Danish]: "DK",
  [SupportedLanguages.Japanese]: "JP",
  [SupportedLanguages.Korean]: "KR",
  [SupportedLanguages.Swedish]: "SE",
  [SupportedLanguages.Chinese]: "CN",
  [SupportedLanguages.LegacyChinese]: "CN",
};
export const transformLocaleToNationality = (locale: SupportedLanguages) =>
  nationalityMap[locale] || locale?.toUpperCase();

export const constructGTEUser = (user?: ActiveGTEUserQuery): User | undefined => {
  if (!user) return undefined;

  const { name, email, locale, nationality, imageHandle, userRoles, phone, picture } =
    user.userProfile;
  return {
    id: 1,
    name,
    email,
    phone,
    countryCode: nationality || transformLocaleToNationality(locale),
    avatarImage: {
      id: imageHandle,
      url: imageHandle ? `${gteImgixUrl}/${imageHandle}` : picture,
      name,
      isDefaultImage: false,
    },
    isAdmin: userRoles.includes("Admin"),
    isAffiliate: userRoles.includes("isAffiliate"),
    isTranslator: userRoles.includes("isTranslator"),
  };
};

export const capitalize = (value: string, activeLocale?: SupportedLanguages) => {
  if (activeLocale) {
    const correctedActiveLocale =
      activeLocale === SupportedLanguages.Chinese ? SupportedLanguages.LegacyChinese : activeLocale;
    return value.length
      ? value.charAt(0).toLocaleUpperCase(correctedActiveLocale) + value.slice(1)
      : value;
  }
  return value.length ? value.charAt(0).toUpperCase() + value.slice(1) : value;
};

export const isIOSUserAgent = (userAgent: string) =>
  /iP(ad|od|hone)/i.test(userAgent) &&
  /WebKit/i.test(userAgent) &&
  !/(CriOS|FxiOS|OPiOS|mercury)/i.test(userAgent);

export const getCallToActionModalButtonText = ({
  isMultipleStepsModal,
  isLastStep,
  t,
}: {
  isMultipleStepsModal: boolean;
  isLastStep: boolean;
  t: TFunction;
}) => {
  if (!isMultipleStepsModal) {
    return t("Apply");
  }
  if (isMultipleStepsModal && !isLastStep) {
    return t("Continue");
  }
  return t("Search");
};

export const groupBy = (array: any[], key: string) => {
  return array.reduce((acc, element) => {
    // eslint-disable-next-line functional/immutable-data
    (acc[element[key]] = acc[element[key]] || []).push(element);
    return acc;
  }, {});
};

export const convertImgixImageToBase64 = async ({
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
  try {
    if (typeof window !== "undefined") return "";

    const imageUrlToConvert = constructImgixUrl({
      imageUrl,
      imageHeight,
      imageBlur,
      imageQuality,
    });

    if (imageUrlToConvert) {
      const base64Image = await getBase64ForImage(imageUrlToConvert);

      return base64Image;
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }

  return "";
};

export const appStringCachePrefix = "_string";
export const namespaceCachePrefix = "_NS";

export const scrollRefIntoView = (
  ref: RefObject<HTMLDivElement>,
  block?: "start" | "end" | "nearest"
) => ref?.current?.scrollIntoView({ behavior: "smooth", block });

const shouldOmitKey = (key: string) => {
  return (
    key.includes("getFooter") ||
    key.startsWith("footers") ||
    key.includes("getFaq") ||
    key.startsWith("Faq:") ||
    key.includes("SubCategoryResponse") ||
    key.includes("TourCategoryOverviewResponse") ||
    key.includes("tourCategoryInformation") ||
    key.startsWith(appStringCachePrefix) ||
    key.startsWith(namespaceCachePrefix) ||
    key.startsWith("applicationNamespaces")
  );
};

export const cleanupApolloSSRState = (apolloState: any) => {
  const optimisationFields = ["contentPageMainFormatted"];
  const rootQueryKey = "ROOT_QUERY";

  return Object.keys(apolloState).reduce((state: any, key) => {
    if (shouldOmitKey(key)) {
      return state;
    }

    if (key === rootQueryKey) {
      // eslint-disable-next-line functional/immutable-data,no-param-reassign
      apolloState[rootQueryKey] = Object.keys(apolloState[rootQueryKey]).reduce(
        (rootSubState: any, rootSubKey) => {
          if (shouldOmitKey(rootSubKey)) {
            return rootSubState;
          }
          // eslint-disable-next-line functional/immutable-data,no-param-reassign
          rootSubState[rootSubKey] = apolloState[rootQueryKey][rootSubKey];

          return rootSubState;
        },
        {}
      );
    }

    // if the value is ArticleWidget of type "html"
    // we still keep it in the cache so Apollo thinks the data is here and don't refetch
    // it at the client side
    if (apolloState[key].type === "html" && apolloState[key].value) {
      // eslint-disable-next-line no-param-reassign,functional/immutable-data
      state[key] = {
        ...apolloState[key],
        value: "",
      };
    } else if (apolloState[key].type === "listOfTeasers" && apolloState[key].teasers) {
      // eslint-disable-next-line no-param-reassign,functional/immutable-data
      state[key] = {
        ...apolloState[key],
        teasers: [],
      };
    } else if (apolloState[key].type === "listOfTours" && apolloState[key].tourList) {
      // eslint-disable-next-line no-param-reassign,functional/immutable-data
      state[key] = {
        ...apolloState[key],
        tourList: [],
      };
    } else if (
      apolloState[key].type === "tableOfContentsList" &&
      apolloState[key].tableOfContentsList
    ) {
      // eslint-disable-next-line no-param-reassign,functional/immutable-data
      state[key] = {
        ...apolloState[key],
        tableOfContentsList: [],
      };
    }
    // we should cleanup query results from "footers" query, as they are stored in the cache ¯\_(ツ)_/¯
    else if (
      // eslint-disable-next-line no-underscore-dangle
      apolloState[key]?.__typename &&
      // eslint-disable-next-line no-underscore-dangle
      /^GraphCMSFooter/.test(apolloState[key]?.__typename)
    ) {
      return state;
    } else {
      // eslint-disable-next-line functional/immutable-data, no-param-reassign
      state[key] = apolloState[key];
    }

    for (let i = 0; i < optimisationFields.length; i += 1) {
      const optimisationField = optimisationFields[i];

      if (apolloState[key][optimisationField]) {
        // in case there is a "defer" field, the same non-defer field should not be used,
        // and we can safely remove it from cache
        const noDeferStr = optimisationField.replace("defer", "");
        const noDeferFieldName = noDeferStr[0].toLowerCase() + noDeferStr.slice(1);
        // eslint-disable-next-line no-param-reassign,functional/immutable-data
        state[key][noDeferFieldName] = null;
      }
    }

    return state;
  }, {});
};
