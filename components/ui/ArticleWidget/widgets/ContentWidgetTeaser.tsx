import React from "react";
import styled from "@emotion/styled";

import { gutters } from "styles/variables";
import Teaser from "components/ui/Teaser/Teaser";

const TeaserWrapper = styled.div`
  margin: ${gutters.small}px 0;
`;

const ContentWidgetTeaser = (widget: ArticleWidgetTypes.ArticleWidgetTeaser) => {
  return (
    <TeaserWrapper>
      <Teaser {...widget} />
    </TeaserWrapper>
  );
};

export default ContentWidgetTeaser;
