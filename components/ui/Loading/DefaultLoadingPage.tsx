import React from "react";
import { css } from "@emotion/core";
import { useTheme } from "emotion-theming";
import Bubbles from "@travelshift/ui/components/Bubbles/Bubbles";
import styled from "@emotion/styled";

import { typographyH3, typographyH5 } from "styles/typography";
import { mqMin, responsiveTypography } from "styles/base";
import { gutters } from "styles/variables";

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: calc(100vh - 50px);
`;

const LoadingTitle = styled.h1<{ disableResponsiveTypography: boolean }>(
  ({ theme, disableResponsiveTypography }) => [
    disableResponsiveTypography
      ? typographyH3
      : responsiveTypography({ small: typographyH5, large: typographyH3 }),
    css`
      margin-bottom: ${gutters.small}px;
      color: ${theme.colors.primary};
      text-align: center;
      ${mqMin.large} {
        margin-bottom: ${gutters.large}px;
      }
    `,
  ]
);

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 650px;
  & > span {
    height: unset;
  }
`;

const DefaultPageLoading = ({
  title,
  className,
  disableResponsiveTypography = false,
}: {
  title?: string;
  className?: string;
  disableResponsiveTypography?: boolean;
}) => {
  const theme: Theme = useTheme();
  return (
    <Container data-testid="defaultPageLoading" className={className}>
      <HeaderContainer>
        {title && (
          <LoadingTitle disableResponsiveTypography={disableResponsiveTypography}>
            {title}
          </LoadingTitle>
        )}
        <Bubbles color="primary" theme={theme} size="large" />
      </HeaderContainer>
    </Container>
  );
};

export default DefaultPageLoading;
