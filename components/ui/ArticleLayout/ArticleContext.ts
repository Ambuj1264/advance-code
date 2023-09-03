import React, { createContext } from "react";

import { PageType } from "types/enums";

type DefaultArticleContextType = {
  mainContentRef: React.RefObject<HTMLDivElement>;
  rightColumnRef: React.RefObject<HTMLDivElement>;
};

export type ArticleContextPatchType = {
  id?: number;
  slug: string;
  pageType: PageType | undefined;
};

export type ArticleContextType = DefaultArticleContextType & ArticleContextPatchType;

export default createContext<ArticleContextType>({
  slug: "",
  id: undefined,
  pageType: undefined,
  mainContentRef: {
    current: null,
  },
  rightColumnRef: {
    current: null,
  },
});
