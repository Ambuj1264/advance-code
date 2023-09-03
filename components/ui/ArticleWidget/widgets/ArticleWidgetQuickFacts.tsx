import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { gutters, bittersweetRedColor, fontSizeMiddleCaption } from "styles/variables";
import ProductSpecs, { QuickFact, ExpandButtonLabel } from "components/ui/Information/ProductSpecs";
import Box from "components/ui/Information/Box";
import { mqMin, mqMax, containerPaddingsBackward } from "styles/base";

const Wrapper = styled.div([
  css`
    margin-bottom: ${gutters.small}px;

    ${mqMax.large} {
      ${containerPaddingsBackward}
    }

    ${QuickFact} {
      ${mqMin.large} {
        margin-top: 0;
        margin-bottom: ${gutters.large}px;
      }
    }

    ${QuickFact},
    ${ExpandButtonLabel} {
      flex-basis: 50%;
      max-width: 50%;
      font-size: ${fontSizeMiddleCaption};

      ${mqMin.medium} {
        flex-basis: 25%;
        max-width: 25%;
      }

      svg {
        fill: ${bittersweetRedColor};
      }
    }

    ${Box} {
      ${mqMin.large} {
        padding: ${gutters.small}px;
        padding-top: 0;
      }
    }
  `,
]);

const ArticleWidgetQuickFacts = ({
  listOfQuickFacts,
}: ArticleWidgetTypes.ArticleWidgetListOfQuickFacts) => {
  if (!listOfQuickFacts.length) {
    return null;
  }

  return (
    <Wrapper data-nosnippet>
      <ProductSpecs id="articleProductSpecs" productSpecs={listOfQuickFacts} fullWidth />
    </Wrapper>
  );
};

export default ArticleWidgetQuickFacts;
