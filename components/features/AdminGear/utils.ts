import getConfig from "next/config";

import {
  PageType,
  CategorySearchPageType,
  SupportedLanguages,
  AutoCompleteType,
} from "types/enums";
import { capitalize, isProd } from "utils/globalUtils";

const { isServerless } = getConfig().publicRuntimeConfig;

const getEditUrl = (
  name: AdminGearTypes.ItemName,
  adminUrl: string,
  itemId: number,
  editAddress: string
): string => {
  let urlPrefix: string;

  switch (name) {
    case PageType.ARTICLE: {
      urlPrefix = "articles-admin";
      break;
    }

    case PageType.BLOG: {
      urlPrefix = "locals/blogs";
      break;
    }

    case CategorySearchPageType.TOUR_CATEGORY: {
      urlPrefix = "tours/categories";
      break;
    }

    default: {
      urlPrefix = `${name}s`;
    }
  }

  return `${adminUrl}/${urlPrefix}/${editAddress}/${itemId}`;
};

const getRebuildNowItem = (marketplaceUrl: string, url: string): AdminGearTypes.AdminLink => {
  const REBUILD_PREFIX = "rebuild_static_cache=1";
  let clearCacheUrl = `${marketplaceUrl}${url}?${REBUILD_PREFIX}`;
  if (typeof window !== "undefined") {
    const windowLocationUrl = window.location.href || "";
    const paramSign = windowLocationUrl?.indexOf("?") === -1 ? "?" : "&";
    clearCacheUrl = `${windowLocationUrl}${paramSign}${REBUILD_PREFIX}`;
  }

  return {
    name: "Rebuild static cache",
    url: clearCacheUrl,
    options: {
      linkTarget: "_self",
    },
  };
};

export const filterAvailableLinks = (
  links: AdminGearTypes.AdminLink[],
  isAdmin: boolean
): AdminGearTypes.AdminLink[] => {
  return links.filter(link => {
    if (isAdmin) {
      return true;
    }

    return !link?.options?.adminOnly;
  });
};

export const getCommonAdminLinks = (
  path: string,
  adminUrl: string,
  marketplaceUrl: string,
  roles: {
    isAdmin: boolean;
    isTranslator: boolean;
  },
  activeLocale: string,
  shouldHide: boolean
) => {
  const postfix = activeLocale === "zh_CN" && !path.includes("zh_CN") ? "/zh_CN" : "";
  return [
    ...(roles.isAdmin
      ? [...(!isServerless && !isProd() ? [getRebuildNowItem(marketplaceUrl, path)] : [])]
      : []),
    ...((roles.isAdmin || roles.isTranslator) && !shouldHide
      ? [
          {
            name: "Meta data",
            url: `${adminUrl}/pagetitles/form?uri=${postfix}${encodeURIComponent(path)}`,
          },
        ]
      : []),
  ];
};

export const getEditItem = (
  itemName: PageType,
  itemId: number,
  adminUrl: string,
  editAddress: "form" | "view"
) => ({
  name: `Edit ${itemName}`.replace(PageType.HOTEL, PageType.ACCOMMODATION),
  url: getEditUrl(itemName, adminUrl, itemId, editAddress),
});

export const getEstablishmentSudoItem = (
  adminUrl: string,
  establishmentId: number
): AdminGearTypes.AdminLink => ({
  name: "Sudo",
  url: `${adminUrl}/establishments-admin/login/${establishmentId}`,
});

const getPreparedTranslationLinks = (
  activeLocale: string,
  translations: AdminGearTypes.AdminLink[]
): AdminGearTypes.AdminLink[] => {
  if (activeLocale === "en") {
    return [];
  }

  return translations;
};

export const getArticleAdminLinks = (
  activeLocale: SupportedLanguages,
  adminUrl: string,
  articleId: number,
  itemName: PageType
): AdminGearTypes.AdminLink[] => {
  return [
    getEditItem(itemName, articleId, adminUrl, "form"),
    ...getPreparedTranslationLinks(activeLocale, [
      {
        name: "Translate Article",
        url: `${adminUrl}/translate/article/${articleId}?locale=${activeLocale}`,
      },
    ]),
    {
      name: "Translate Interface",
      url: `${adminUrl}/translate/strings?tpl=about/article&locale=${activeLocale}`,
    },
  ];
};

export const getBlogAdminLinks = (
  activeLocale: SupportedLanguages,
  adminUrl: string,
  articleId: number,
  itemName: PageType
): AdminGearTypes.AdminLink[] => {
  return [
    getEditItem(itemName, articleId, adminUrl, "form"),
    {
      name: "Translate Interface",
      url: `${adminUrl}/translate/strings?tpl=includes/blog&locale=${activeLocale}`,
    },
  ];
};

export const getAttractionAdminLinks = (
  activeLocale: SupportedLanguages,
  adminUrl: string,
  articleId: number,
  itemName: PageType
): AdminGearTypes.AdminLink[] => {
  return [
    getEditItem(itemName, articleId, adminUrl, "form"),
    {
      name: "Translate Interface",
      url: `${adminUrl}/translate/strings?tpl=plan/attraction&locale=${activeLocale}`,
    },
  ];
};

export const getTourAdminLinks = (
  activeLocale: SupportedLanguages,
  adminUrl: string,
  marketplaceUrl: string,
  tour: QueryTour
): AdminGearTypes.AdminLink[] => {
  return [
    getEstablishmentSudoItem(adminUrl, tour.establishment.id),
    getEditItem(PageType.TOUR, tour.id, adminUrl, "view"),
    ...getPreparedTranslationLinks(activeLocale, [
      {
        name: "Translate Tour",
        url: `${adminUrl}/translate/tour/${tour.id}?locale=${activeLocale}`,
      },
      {
        name: "Translate Activities",
        url: `${adminUrl}/translate/activities?locale=${activeLocale}`,
      },
      {
        name: "Translate Difficulties",
        url: `${adminUrl}/translate/tour_difficulties?locale=${activeLocale}`,
      },
      {
        name: "Translate Group Sizes",
        url: `${adminUrl}/translate/tour_filters/tour_group_size?locale=${activeLocale}`,
      },
      {
        name: "Translate Tour Types",
        url: `${adminUrl}/translate/tour_filters/tour_type?locale=${activeLocale}`,
      },
    ]),
    {
      name: "Translate Interface",
      url: `${adminUrl}/translate/strings?tpl=tours/view&locale=${activeLocale}`,
    },
    {
      name: "Availability & Bookings",
      url: `${adminUrl}/tours/edit_departures/${tour.id}`,
      options: {
        adminOnly: true,
      },
    },
    {
      name: `Go to ${tour.establishment.name}`,
      url: `${marketplaceUrl}${tour.establishment.url}`,
      options: {
        adminOnly: true,
      },
    },
  ];
};

export const getAccommodationAdminLinks = (
  activeLocale: SupportedLanguages,
  adminUrl: string,
  accommodation: AccommodationTypes.QueryAccommodation
): AdminGearTypes.AdminLink[] => {
  return [
    getEstablishmentSudoItem(adminUrl, accommodation.establishment.id),
    getEditItem(PageType.HOTEL, accommodation.id, adminUrl, "view"),
    ...getPreparedTranslationLinks(activeLocale, [
      {
        name: "Translate Hotel",
        url: `${adminUrl}/translate/accommodation/${accommodation.id}?locale=${activeLocale}`,
      },
      {
        name: "Translate Amenities",
        url: `${adminUrl}/translate/amenities?locale=${activeLocale}`,
      },
      {
        name: "Translate Hotel Extras",
        url: `${adminUrl}/translate/hotel_extras?locale=${activeLocale}`,
      },
    ]),
    {
      name: `${activeLocale !== "en" ? "Translate" : "Edit"} Interface`,
      url: `${adminUrl}/translate/strings?tpl=hotels/view&locale=${activeLocale}`,
    },
  ];
};

export const getCarAdminLinks = (
  activeLocale: SupportedLanguages,
  adminUrl: string,
  carId: string,
  establishmentId: number,
  isCarnect: boolean
): AdminGearTypes.AdminLink[] => {
  const carIdNumberic = Number(carId);
  return [
    ...(!isCarnect ? [getEstablishmentSudoItem(adminUrl, establishmentId)] : []),
    ...(!Number.isNaN(carIdNumberic)
      ? [getEditItem(PageType.CAR, carIdNumberic, adminUrl, "form")]
      : []),
    ...(!isCarnect
      ? [
          {
            name: "Availability",
            url: `${adminUrl}/cars/availability/${carId}`,
          },
        ]
      : []),
    ...getPreparedTranslationLinks(activeLocale, [
      {
        name: "Translate Car",
        url: `${adminUrl}/translate/orm/${carId}?locale=${activeLocale}&type=car`,
      },
      {
        name: "Translate Settings",
        url: `${adminUrl}/translate/car_settings?locale=${activeLocale}`,
      },
      {
        name: "Translate Extras",
        url: `${adminUrl}/translate/car_addons?locale=${activeLocale}&type=extra&establishment_id=${establishmentId}`,
      },
      {
        name: "Translate Insurances",
        url: `${adminUrl}/translate/car_addons?locale=${activeLocale}&type=insurance&establishment_id=${establishmentId}`,
      },
      {
        name: "Translate Pickups",
        url: `${adminUrl}/translate/car_addons?locale=${activeLocale}&type=pickup&establishment_id=${establishmentId}`,
      },
    ]),
    {
      name: `${activeLocale !== "en" ? "Translate" : "Edit"} Interface`,
      url: `${adminUrl}/translate/strings?tpl=cars/view&locale=${activeLocale}`,
    },
  ];
};

export const getTourCategorySearchItemName = ({
  isTourCategory,
  isTourSearch,
}: {
  isTourCategory: boolean;
  isTourSearch: boolean;
}): AdminGearTypes.ItemName => {
  if (isTourCategory) {
    return CategorySearchPageType.TOUR_CATEGORY;
  }

  if (isTourSearch) {
    return CategorySearchPageType.TOUR_SEARCH;
  }

  return CategorySearchPageType.TOUR_INDEX;
};

export const getAccommodationCategorySearchItemName = ({
  isAccommodationCategory,
  isAccommodationSearch,
}: {
  isAccommodationCategory: boolean;
  isAccommodationSearch: boolean;
}): AdminGearTypes.ItemName => {
  if (isAccommodationCategory) {
    return CategorySearchPageType.ACCOMMODATION_CATEGORY;
  }

  if (isAccommodationSearch) {
    return CategorySearchPageType.ACCOMMODATION_SEARCH;
  }

  return CategorySearchPageType.ACCOMMODATION_INDEX;
};

const getTourCategoryTranslateIterfaceTPL = (itemName: AdminGearTypes.ItemName) => {
  if (itemName === CategorySearchPageType.TOUR_CATEGORY) {
    return "tours/category";
  }

  if (itemName === CategorySearchPageType.TOUR_SEARCH) {
    return "tours/search";
  }

  return "tours/index";
};

export const getTourCategoryAdminLinks = (
  activeLocale: SupportedLanguages,
  adminUrl: string,
  itemName: string,
  categoryId?: number
): AdminGearTypes.AdminLink[] => {
  const translateInterfaceTPL = getTourCategoryTranslateIterfaceTPL(itemName);
  return [
    ...(categoryId
      ? [
          {
            name: "Edit Category",
            url: getEditUrl(itemName as PageType, adminUrl, categoryId, "form"),
          },
          {
            name: "Translate Category",
            url: `${adminUrl}/translate/orm/${categoryId}?type=tour_category&locale=${activeLocale}`,
          },
          {
            name: "Sort list",
            url: `${adminUrl}/tours/categories/sort/${categoryId}`,
          },
        ]
      : []),
    {
      name: "Translate Interface",
      url: `${adminUrl}/translate/strings?tpl=${translateInterfaceTPL}&locale=${activeLocale}`,
    },
  ];
};

const getAccommodationCategoryTranslateIterfaceTPL = (itemName: AdminGearTypes.ItemName) => {
  if (itemName === CategorySearchPageType.ACCOMMODATION_CATEGORY) {
    return "hotels/category";
  }

  return "hotels/index";
};

export const getAccommodationCategoryAdminLinks = (
  activeLocale: SupportedLanguages,
  adminUrl: string,
  itemName: string,
  categoryId?: number
): AdminGearTypes.AdminLink[] => {
  const translateInterfaceTPL = getAccommodationCategoryTranslateIterfaceTPL(itemName);
  const isEnglish = activeLocale === "en";
  return [
    ...(categoryId
      ? [
          isEnglish
            ? {
                name: "Edit Category",
                url: `${adminUrl}/hotels/searchcategories/form/${categoryId}`,
              }
            : {
                name: "Translate Category",
                url: `${adminUrl}/translate/orm/${categoryId}?type=${itemName}&locale=${activeLocale}`,
              },
        ]
      : [
          ...(isEnglish
            ? [
                {
                  name: "Edit Categories",
                  url: `${adminUrl}/hotels/searchcategories`,
                },
              ]
            : []),
        ]),
    {
      name: isEnglish ? "Edit Interface" : "Translate Interface",
      url: `${adminUrl}/translate/strings?tpl=${translateInterfaceTPL}&locale=${activeLocale}`,
    },
  ];
};

export const getHomeAdminLinks = (activeLocale: string, adminUrl: string) => [
  {
    name: "Edit links",
    url: `${adminUrl}/translate/links/?locale=${activeLocale}`,
  },
  {
    name: "Translate Interface",
    url: `${adminUrl}/translate/strings?tpl=home/index&locale=${activeLocale}`,
  },
];

const getCarSearchAdminLinks = (activeLocale: string, adminUrl: string) => {
  // Search page en
  const editContent = `${adminUrl}/cars/landing_page`;

  // Search page all locales
  const openHTMLBuilder = `${adminUrl}/htmlbuilder/form/117?locale_id=${activeLocale}`;
  const translateInterface = `${adminUrl}/translate/strings?tpl=cars/index&locale=${activeLocale}`;

  // Search page on different locales then en
  const editContentNonDefaultLocales = `${adminUrl}/translate/orm/62?locale=${activeLocale}&type=page`;

  const productFiltersTranslation = `${adminUrl}/translate/product_filters/?locale=${activeLocale}&type=car`;
  return [
    ...(activeLocale === "en" ? [{ name: "Edit content", url: editContent }] : []),
    { name: "Open HTML editor", url: openHTMLBuilder },
    ...(activeLocale !== "en"
      ? [
          { name: "Translate content", url: editContentNonDefaultLocales },
          { name: "Translate product filters", url: productFiltersTranslation },
        ]
      : []),
    { name: "Translate interface", url: translateInterface },
  ];
};

const getCarCategoryAdminLinks = (activeLocale: string, adminUrl: string) => {
  const translateInterface = `${adminUrl}/translate/strings?tpl=cars/catelog&locale=${activeLocale}`;
  const translateCategories = `${adminUrl}/translate/car_categories?locale=${activeLocale}`;
  const translateSearchCategories = `${adminUrl}/translate/car_search_categories?locale=${activeLocale}`;
  return [
    {
      name: "Translate Interface",
      url: translateInterface,
    },
    ...(activeLocale !== "en"
      ? [
          {
            name: "Translate categories",
            url: translateCategories,
          },
          {
            name: "Translate search categories",
            url: translateSearchCategories,
          },
        ]
      : []),
  ];
};

export const getCarSearchAndCategoryAdminLinks = (
  activeLocale: SupportedLanguages,
  adminUrl: string,
  isCarCategory: boolean
) =>
  isCarCategory
    ? getCarCategoryAdminLinks(activeLocale, adminUrl)
    : getCarSearchAdminLinks(activeLocale, adminUrl);

export const getTravelCommunityAdminLinks = (
  activeLocale: SupportedLanguages,
  adminUrl: string
) => [
  {
    name: "Edit interface",
    url: `${adminUrl}/translate/strings?tpl=local/index&locale=${activeLocale}`,
  },
];

export const getArticleCategoryAdminLinks = ({
  activeLocale,
  adminUrl,
  articleCategoryId,
}: {
  activeLocale: string;
  adminUrl: string;
  articleCategoryId: number;
}) => [
  {
    name: "Translate interface",
    url: `${adminUrl}/translate/strings?tpl=about/categories&locale=${activeLocale}`,
  },
  {
    name: "Edit article category",
    url: `${adminUrl}/articles-categories-admin/form/${articleCategoryId}`,
  },
  {
    name: "Sort list",
    url: `${adminUrl}/sort/articles/${articleCategoryId}?strip_gui=1&locale=${activeLocale}`,
  },
];

export const getArticleSearchAdminLinks = ({
  activeLocale,
  adminUrl,
}: {
  activeLocale: SupportedLanguages;
  adminUrl: string;
}) => [
  {
    name: "Translate interface",
    url: `${adminUrl}/translate/strings?tpl=about/index&locale=${activeLocale}`,
  },
  ...(activeLocale === "en"
    ? [
        {
          name: "Page search terms",
          url: `${adminUrl}/searchterms/form/?route_name=about-default&action=index`,
        },
      ]
    : []),
  {
    name: "Trending now",
    url: `${adminUrl}/lists/form/7?strip_gui=1&locale=${activeLocale}`,
  },
  {
    name: "Top articles",
    url: `${adminUrl}/lists/form/8?strip_gui=1&locale=${activeLocale}`,
  },
];

export const getArticleSearchAndCategoryAdminLinks = ({
  activeLocale,
  adminUrl,
  articleCategoryId,
}: {
  activeLocale: SupportedLanguages;
  adminUrl: string;
  articleCategoryId?: number;
}) =>
  articleCategoryId
    ? getArticleCategoryAdminLinks({
        activeLocale,
        adminUrl,
        articleCategoryId,
      })
    : getArticleSearchAdminLinks({ activeLocale, adminUrl });

export const getSaveCartInfoText = ({
  isSavingCartError,
  isCartLinkCopied,
}: {
  isSavingCartError: boolean;
  isCartLinkCopied: boolean;
}) => {
  if (isSavingCartError) return "Please check if there are expired items in your cart.";
  return isCartLinkCopied
    ? "The link is copied to clipboard."
    : "But we could not automatically copy the link. Please do so manually:";
};

export const formatPackageIdInput = (packageId: string) => {
  if (!packageId.length || packageId === "T" || packageId === "-") return "";

  return /^(T-)/.test(packageId) ? packageId.replace(/[^A-Z0-9-]/g, "") : `T-${packageId}`;
};

export const isPackagePatternValid = (
  key: string,
  // eslint-disable-next-line default-param-last
  currentValue = "",
  maxLength?: number
) => {
  const packageIdPattern = /^(T-)?\d*$/;
  const newInputValue = currentValue + key;

  return (
    packageIdPattern.test(newInputValue) && (maxLength ? newInputValue.length <= maxLength : true)
  );
};

// TODO: Add unit test
export const createPackageDetailSections = (
  queryPackageDetails?: CartTypes.ChosenPackageDetails
) => {
  let selectedPackageSections;
  if (queryPackageDetails) {
    selectedPackageSections = [
      ...(queryPackageDetails.bookingNumber || queryPackageDetails.id
        ? [
            {
              order: 1,
              title: "Booking number",
              value: queryPackageDetails.bookingNumber || `T-${queryPackageDetails.id}`,
            },
          ]
        : []),
      ...(queryPackageDetails.customerName || queryPackageDetails.customerEmail
        ? [
            {
              order: 2,
              title: "User info",
              value: `${queryPackageDetails.customerName} (${
                queryPackageDetails.customerEmail || "no registered email"
              })`,
            },
          ]
        : []),
      ...Object.keys(queryPackageDetails).reduce((acc, key, _, array) => {
        if (
          key &&
          key !== "id" &&
          key !== "bookingNumber" &&
          !key.includes("customer") &&
          !key.includes("typename")
        ) {
          let title;
          let url;
          let order: number = array.length;
          const keyOfType = key as keyof CartTypes.ChosenPackageDetails;
          let value = queryPackageDetails[keyOfType];
          switch (keyOfType) {
            case "urlAdminBooking":
              order = 0;
              url = queryPackageDetails[keyOfType];
              value = "Admin link";
              title = "Package details";
              break;
            case "cancelled":
              title = "cancelled?";
              value = queryPackageDetails[keyOfType] ? "Yes" : "No";
              break;
            case "reservation":
              title = "is reservation?";
              value = queryPackageDetails[keyOfType] ? "Yes" : "No";
              break;
            case "pickupInformationObject":
            case "pickupLocationObject":
              title = (queryPackageDetails[keyOfType] as CartTypes.ChosenPackageDetailsInfo)?.label;
              value = (queryPackageDetails[keyOfType] as CartTypes.ChosenPackageDetailsInfo)?.value;
              break;
            default:
              order = keyOfType === "tourName" ? 3 : order;
              title = key
                .split(/(?=[A-Z])/)
                .join(" ")
                .toLowerCase();
              break;
          }
          return [
            ...acc,
            ...(title && value
              ? [{ order, title: capitalize(title), value: value.toString(), url }]
              : []),
          ];
        }
        return acc;
      }, [] as { order: number; title: string; value: string; url?: string }[]),
    ] as CartTypes.ChosenPackageDetailsSection[];
  }
  // eslint-disable-next-line no-unsafe-optional-chaining
  return selectedPackageSections?.sort((a, b) => a?.order - b?.order);
};

export const constructSimilarPackagesList = (
  querySimilarTourPackages?: SharedTypes.AutocompleteItem[]
) => {
  if (querySimilarTourPackages) {
    return querySimilarTourPackages.map(item => ({
      id: item.id.toString(),
      name: item.name,
      type: AutoCompleteType.PRODUCT,
    }));
  }
  return querySimilarTourPackages;
};

export const adjustPercentageValue = ({
  sumOfPayerAdjustedPercentages,
  numberOfCustomPercentages,
  numberOfExtraPayers,
}: {
  sumOfPayerAdjustedPercentages: number;
  numberOfCustomPercentages: number;
  numberOfExtraPayers: number;
}) => {
  // Number.EPSILON ensures that values like 1.005 will round correctly
  const unroundedNewPercentage =
    (100 - sumOfPayerAdjustedPercentages) / (numberOfExtraPayers - numberOfCustomPercentages) +
    Number.EPSILON;
  return Math.round(unroundedNewPercentage * 100) / 100;
};

export const formatInputToValidFloatString = (value: string) => {
  // Checking for leading "." or a string with leading 0s
  if (!value.length || value.trim() === "." || value.startsWith("0")) return "";

  const cleanedUpValue = value.replace(/[^0-9.]/g, "");
  const maybeDotIndex = cleanedUpValue.indexOf(".");
  const percentagePattern = /^(\d+(?:.\d{1,2})?).*/;
  const canAddMoreDecimals = cleanedUpValue.substring(maybeDotIndex + 1).length < 3;

  // Here we want to add a dot between 2 digits always. However, if the dot is already there,
  // we'll let it proceed to the default test case
  if (cleanedUpValue.length > 2 && maybeDotIndex === -1 && cleanedUpValue[2] !== ".") {
    return percentagePattern.test(cleanedUpValue)
      ? cleanedUpValue.replace(/(.{2})/g, `${cleanedUpValue.slice(0, 2)}.`)
      : cleanedUpValue;
  }

  const adjustedValue = canAddMoreDecimals
    ? cleanedUpValue
    : cleanedUpValue.slice(0, cleanedUpValue.length - 1);

  return percentagePattern.test(adjustedValue) ? adjustedValue : "";
};

export const isFloatOrIntPattern = (
  key: string,
  // eslint-disable-next-line default-param-last
  currentValue = ""
) => {
  const isDigitOrDividerChar = /^[0-9.]+$/;
  const isDoubleConsecutiveDots = /(\..*){2,}/;

  const newInputValue = currentValue + key;

  return isDigitOrDividerChar.test(newInputValue) && !isDoubleConsecutiveDots.test(newInputValue);
};
