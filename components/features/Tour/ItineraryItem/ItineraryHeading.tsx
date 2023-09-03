import React from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";

import { typographySubtitle1, typographyOverline } from "styles/typography";
import { greyColor } from "styles/variables";
import { mqMin, mqMax } from "styles/base";
import { Trans } from "i18n";
import { Namespaces } from "shared/namespaces";

type Props = {
  title?: string;
  className?: string;
  children: string;
};

type WrapperProps = {
  hasTitle: boolean;
};

export const Heading = styled.h3(typographySubtitle1);

const SecondaryHeading = styled.div([
  typographySubtitle1,
  css`
    text-align: center;
  `,
]);

const Title = styled.span([
  typographyOverline,
  css`
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    align-items: center;
    height: 100%;
    ${mqMin.large} {
      right: auto;
      left: 0;
    }
    ${mqMax.medium} {
      display: none;
    }
  `,
]);

export const Wrapper = styled.div<WrapperProps>(
  ({ hasTitle }) =>
    css`
      position: relative;
      color: ${greyColor};
      ${Heading} {
        text-align: left;
        ${mqMin.large} {
          text-align: ${hasTitle ? "center" : "left"};
        }
      }
    `
);

const ItineraryHeading = ({ title, className, children }: Props) => (
  <Wrapper hasTitle={!!title} className={className}>
    {title ? (
      <>
        <SecondaryHeading dangerouslySetInnerHTML={{ __html: children }} />
        <Title>
          <Trans ns={Namespaces.tourNs}>{title}</Trans>
        </Title>
      </>
    ) : (
      <Heading dangerouslySetInnerHTML={{ __html: children }} />
    )}
  </Wrapper>
);

export default ItineraryHeading;
