import { pipe } from "fp-ts/lib/pipeable";
import { getOrElse, fromNullable } from "fp-ts/lib/Option";

import { DEFAULT_METADATA } from "components/features/CountryPage/utils/countryUtils";

export const normalizeArticleHeaderData = (
  headerData?: ArticleSearchPageTypes.ArticleSearchHeader
): SharedTypes.CategoryHeaderData => {
  if (!headerData) {
    return {
      images: [],
      title: "",
      description: "",
    };
  }

  const {
    metadata: { title, subtitle },
    category: { name, image },
  } = headerData;

  return {
    title,
    description: subtitle,
    images: [{ name, ...image }],
  };
};

export const getSectionMetadata = ({
  metadata,
}: {
  metadata?: SharedTypes.PageCategoriesMetaType;
} = {}) =>
  pipe(
    metadata,
    fromNullable,
    getOrElse(() => DEFAULT_METADATA)
  );
