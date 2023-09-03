import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { useTheme } from "emotion-theming";

import { typographyH2, typographyH3, typographyH4 } from "styles/typography";
import { mqMin } from "styles/base";
import { fontSizeBody2, greyColor, gutters } from "styles/variables";

export const H1 = styled.h1<{ textColor: string }>(({ textColor }) => [
  typographyH4,
  css`
    padding: 0 30px;
    color: ${textColor};
    text-align: center;

    ${mqMin.large} {
      ${typographyH3}
    }

    ${mqMin.desktop} {
      ${typographyH2}
    }
  `,
]);

const Subtitle = styled.div`
  margin-top: ${gutters.small / 2}px;
  color: ${greyColor};
  font-size: ${fontSizeBody2};
  line-height: 20px;
  text-align: center;
`;

const ArticleLayoutHeading = ({
  title,
  subtitle,
  textColor,
}: {
  title: string;
  subtitle?: string;
  textColor?: string;
}) => {
  const theme: Theme = useTheme();

  return (
    <>
      <H1
        textColor={textColor || theme.colors.primary}
        dangerouslySetInnerHTML={{ __html: title }}
      />
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
    </>
  );
};

export default ArticleLayoutHeading;
