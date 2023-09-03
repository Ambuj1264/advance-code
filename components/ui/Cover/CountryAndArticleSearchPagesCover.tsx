import React, { ReactNode } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import Cover, { DEFAULT_HEIGHT, DESKTOP_HEIGHT, TABLET_HEIGHT } from "components/ui/Cover/Cover";
import {
  typographyH2,
  typographyH4,
  typographySubtitle1,
  typographySubtitle2,
} from "styles/typography";
import {
  blackColor,
  borderRadius,
  borderRadiusSmall,
  gutters,
  guttersPx,
  whiteColor,
  zIndex,
} from "styles/variables";
import { mqMax, mqMin } from "styles/base";

const HeadingContainer = styled.div`
  z-index: ${zIndex.z1};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: ${guttersPx.small} 0 ${gutters.small / 4}px 0;
  color: ${whiteColor};
  text-align: center;

  ${mqMin.large} {
    padding-top: 39px;
    padding-bottom: 0;
  }

  ${mqMin.desktop} {
    padding-top: 69px;
  }
`;

const Heading1 = styled.h1([
  typographyH4,
  css`
    padding: 0 35px;
    font-size: 28px;
    text-shadow: 1px 1px 1px ${rgba(blackColor, 0.2)};
    ${mqMin.large} {
      ${typographyH2};
      z-index: 1;
    }
  `,
]);

const Description = styled.div`
  ${typographySubtitle2};
  display: none;
  margin: ${gutters.small / 2}px ${gutters.small}px;
  border-radius: ${borderRadiusSmall};
  padding: ${gutters.small / 2}px;
  background-color: ${rgba(blackColor, 0.2)};

  ${mqMin.large} {
    z-index: 1;
    display: block;
    ${typographySubtitle1};
    max-width: 80%;
    font-size: 18px;
  }
`;

export const CoverHeader = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) => {
  return (
    <HeadingContainer>
      <Heading1
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: title }}
      />
      {description && (
        <Description>
          <span
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </Description>
      )}
      {children}
    </HeadingContainer>
  );
};

export const CoverDefaultProps = {
  id: "frontCover",
  height: DESKTOP_HEIGHT,
};

export const CoverStyled = styled(Cover)<{
  loading?: boolean;
}>(({ loading = false }) => [
  css`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: ${DEFAULT_HEIGHT}px;

    ${mqMax.large} {
      margin-right: -${gutters.small}px;
      margin-left: -${gutters.small}px;
    }

    ${mqMin.large} {
      align-items: flex-start;
      border-radius: ${borderRadius};
      min-height: ${TABLET_HEIGHT}px;
    }

    ${mqMin.desktop} {
      min-height: ${DESKTOP_HEIGHT}px;
    }
  `,
  loading &&
    css`
      min-height: ${DEFAULT_HEIGHT}px;

      ${mqMin.large} {
        border-radius: ${borderRadius};
        min-height: ${TABLET_HEIGHT}px;
      }

      ${mqMin.desktop} {
        min-height: ${DESKTOP_HEIGHT}px;
      }
    `,
]);
