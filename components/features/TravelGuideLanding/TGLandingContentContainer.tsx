import React from "react";

import destinationLandingWhereConditions from "./TGLandingUtils/TGLandingWhereConditions";
import TGLandingSectionContent from "./TGLandingSectionContent";

import { GraphCMSPageType } from "types/enums";

const TGLandingContentContainer = ({
  queryCondition,
}: {
  queryCondition: LandingPageTypes.LandingPageQueryCondition;
}) => {
  const conditions = destinationLandingWhereConditions({ queryCondition });
  return (
    <>
      {conditions.map((condition, index) => {
        return (
          <TGLandingSectionContent
            // eslint-disable-next-line react/no-array-index-key
            key={`tg-section-${index}`}
            pageType={GraphCMSPageType.TravelGuidesLanding}
            sectionCondition={condition}
          />
        );
      })}
    </>
  );
};

export default TGLandingContentContainer;
