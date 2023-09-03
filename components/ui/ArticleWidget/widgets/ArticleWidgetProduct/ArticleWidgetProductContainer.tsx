import React, { useEffect, useContext, useMemo, useState, useCallback, useRef } from "react";

import { constructArticleTeaser } from "../utils/productWidgetUtils";

import ArticleWidgetProduct from "./ArticleWidgetProduct";
import ToursQuery from "./queries/SearchToursInCategories.graphql";
import ArticlesQuery from "./queries/SearchArticlesInCategories.graphql";

import useQueryClient from "hooks/useQueryClient";
import { useDebouncedCallback } from "hooks/useDebounce";
import { ProductCardType } from "types/enums";
import LocaleContext from "contexts/LocaleContext";
import ArticleContext, { ArticleContextType } from "components/ui/ArticleLayout/ArticleContext";
import { constructTour } from "components/ui/ArticleLayout/utils/articleLayoutUtils";

const PRODUCT_ITEM_HEIGHT = 520;
const PRODUCT_TITLE_HEIGHT = 64;

/*
 * We don't have queries for Car or Blog types,
 * so, we shouldn't even try to render this types until we
 * update getQueryAndVariables function with required queries and variables
 * otherwise we call query with undefined arguments
 * */
const SUPPORTED_PRODUCTS = [ProductCardType.TOUR, ProductCardType.ARTICLE];

type Product = TeaserTypes.Tour | TeaserTypes.Teaser;

const detectProductType = ({
  tours,
  articles,
  cars,
  blogs,
}: Partial<ArticleWidgetTypes.ArticleWidgetTour>): ProductCardType | null => {
  if (tours) {
    return ProductCardType.TOUR;
  }
  if (articles) {
    return ProductCardType.ARTICLE;
  }
  if (cars) {
    return ProductCardType.CAR;
  }
  if (blogs) {
    return ProductCardType.BLOG;
  }

  return null;
};

const getQueryAndVariables = (
  productType: ProductCardType,
  props: Partial<ArticleWidgetTypes.ArticleWidgetTour>,
  articleContext: ArticleContextType
) => {
  switch (productType) {
    case ProductCardType.TOUR:
      return {
        query: ToursQuery,
        variables: {
          categoryIDs: props?.tours?.categories,
          limit: props?.tours?.limit,
        },
      };
    case ProductCardType.ARTICLE:
      return {
        query: ArticlesQuery,
        variables: {
          categoryIDs: props?.articles?.categories,
          limit: props?.articles?.limit,
          excludeID: articleContext.id,
        },
      };
    default:
      return {};
  }
};

const ArticleWidgetProductContainer = ({
  title,
  titleLink,
  icon,
  productType,
  ...rest
}: ArticleWidgetTypes.ArticleWidgetTour & {
  productType: ProductCardType;
}) => {
  const productContainerRef = useRef<HTMLDivElement>(null);
  const activeLocale = useContext(LocaleContext);
  const articleContext = useContext(ArticleContext);
  const { mainContentRef, rightColumnRef } = articleContext;
  const { query, variables } = getQueryAndVariables(productType, rest, articleContext);
  const { data: rawData } = useQueryClient(query, {
    variables: {
      ...variables,
      locale: activeLocale,
    },
  });
  const [maxListLength, setMaxListLength] = useState<number>(0);

  const calculateMaxListLength = useCallback(() => {
    if (mainContentRef.current && rightColumnRef.current && productContainerRef.current) {
      const mainBlockHeight = mainContentRef.current.clientHeight;
      const rightColumnHeight = rightColumnRef.current.clientHeight;
      const productContainerHeight = productContainerRef.current.clientHeight;
      const maxHeightForProducts =
        mainBlockHeight - rightColumnHeight - PRODUCT_TITLE_HEIGHT + productContainerHeight;

      if (mainBlockHeight > 0) {
        setMaxListLength(Math.ceil(maxHeightForProducts / PRODUCT_ITEM_HEIGHT));
      }
    }

    return undefined;
  }, [mainContentRef, rightColumnRef]);

  const calculateMaxListLengthDebounced = useDebouncedCallback(calculateMaxListLength, 500);

  useEffect(() => calculateMaxListLengthDebounced(), [calculateMaxListLengthDebounced]);

  useEffect(() => {
    function handleScroll() {
      calculateMaxListLengthDebounced();
    }
    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  }, [rawData, variables, activeLocale, calculateMaxListLengthDebounced]);

  const products = useMemo<Product[]>(() => {
    switch (productType) {
      case ProductCardType.TOUR:
        return rawData?.searchToursInCategories
          ?.slice?.(0, maxListLength)
          .map((tour: TeaserTypes.QueryTour) => constructTour(tour));
      case ProductCardType.ARTICLE:
        return rawData?.searchArticlesInCategories
          ?.slice?.(0, maxListLength)
          .map((article: Omit<TeaserTypes.Teaser, "variant">) => constructArticleTeaser(article));
      default:
        return [];
    }
  }, [productType, rawData, maxListLength]);

  return (
    <div ref={productContainerRef}>
      {Boolean(products?.length) && (
        <ArticleWidgetProduct
          productType={productType}
          list={products}
          title={title}
          titleLink={titleLink}
          icon={icon}
        />
      )}
    </div>
  );
};

const ArticleWidgetProductContainerWithProductType = (
  props: ArticleWidgetTypes.ArticleWidgetTour
) => {
  const { tours, articles, cars, blogs } = props;
  const productType = detectProductType({
    tours,
    articles,
    cars,
    blogs,
  });

  if (!productType) {
    return null;
  }

  if (!SUPPORTED_PRODUCTS.includes(productType)) {
    return null;
  }

  return <ArticleWidgetProductContainer {...props} productType={productType} />;
};

export default ArticleWidgetProductContainerWithProductType;
