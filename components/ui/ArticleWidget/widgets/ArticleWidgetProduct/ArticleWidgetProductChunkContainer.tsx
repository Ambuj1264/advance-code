import React from "react";
import { useMediaQuery } from "react-responsive";

import CustomNextDynamic from "lib/CustomNextDynamic";
import { breakpointsMax } from "styles/variables";

const ArticleWidgetProductContainer = CustomNextDynamic(
  () => import("./ArticleWidgetProductContainer"),
  {
    ssr: false,
    loading: () => null,
  }
);

const ArticleWidgetProductChunkContainer = ({
  articles,
  blogs,
  cars,
  tours,
  title,
  titleLink,
  icon,
}: ArticleWidgetTypes.ArticleWidgetTour) => {
  const isMobile = useMediaQuery({ maxWidth: breakpointsMax.large });
  if (isMobile) return null;
  return (
    <ArticleWidgetProductContainer
      articles={articles}
      blogs={blogs}
      cars={cars}
      tours={tours}
      title={title}
      titleLink={titleLink}
      icon={icon}
      variant=""
    />
  );
};

export default ArticleWidgetProductChunkContainer;
