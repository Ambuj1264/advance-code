import React from "react";

import useRepositionContactUsButton from "hooks/useRepositionContactUsButton";
import { ContactUsMobileMargin } from "components/features/ContactUs/ContactUsButton";
import { Direction } from "types/enums";
import useWaypoint from "components/ui/Lazy/hooks/useWaypoint";
import ArticleWidgetTableOfContentsMobile from "components/ui/ArticleWidget/widgets/ArticleWidgetTableOfContents/ArticleWidgetTableOfContentsMobile";

export const TOCLoader = ({
  tableOfContents,
  skipOffset = false,
}: {
  tableOfContents?: ArticleWidgetTypes.ArticleWidgetTableOfContents;
  skipOffset?: boolean;
}) => {
  const { isPageScrolledDown: isTOCVisible, WaypointElement } = useWaypoint({
    lazyloadOffset: "500px",
    disabled: skipOffset,
  });

  useRepositionContactUsButton({
    bottomPosition: ContactUsMobileMargin.RegularFooter,
    buttonPosition: Direction.Left,
    isMobileFooterShown: false,
  });

  if (!tableOfContents) {
    return null;
  }

  return (
    <>
      {WaypointElement}

      {isTOCVisible && <ArticleWidgetTableOfContentsMobile {...tableOfContents} />}
    </>
  );
};

export default TOCLoader;
