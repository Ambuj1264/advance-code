import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import { fontWeightSemibold, blackColor, greyColor } from "styles/variables";
import SectionRow from "components/ui/Section/SectionRow";
import SimpleTruncation from "components/ui/SimpleTruncation";
import { typographyBody1, typographySubtitle1 } from "styles/typography";

const Wrapper = styled.div(({ theme }) => [
  typographyBody1,
  css`
    margin: 0 auto;
    width: 100%;
    max-width: 685px;
    a {
      color: ${theme.colors.primary};
      font-weight: ${fontWeightSemibold};
      &:hover {
        text-decoration: underline;
      }
    }
    p + * {
      margin-top: 25px;
    }
    p {
      color: ${greyColor};
      line-height: 25px;
    }
    strong,
    h3 {
      ${typographySubtitle1};
      margin-bottom: 12.5px;
      color: ${rgba(blackColor, 0.7)};
      text-align: center;
    }
  `,
]);

const InformationContainer = ({
  title,
  description,
  clampTextExtraHeight,
}: {
  title: string;
  description: string;
  clampTextExtraHeight?: number;
}) => {
  if (title === "" || description === "") return null;
  return (
    <SectionRow title={title}>
      <Wrapper>
        <SimpleTruncation
          content={description.replace(/h2/g, "h3")}
          id="categoryInformation"
          numberOfLines={8}
          clampTextExtraHeight={clampTextExtraHeight}
        />
      </Wrapper>
    </SectionRow>
  );
};

export default InformationContainer;
