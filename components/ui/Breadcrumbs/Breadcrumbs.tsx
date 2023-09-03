import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import Arrow from "@travelshift/ui/icons/arrow.svg";

import BreadcrumbsStructuredData from "./BreadcrumbsStructuredData";

import { fallbackFontFamily, gutters } from "styles/variables";
import { typographyCaptionSmall } from "styles/typography";
import LazyHydrateWrapper from "components/ui/LazyHydrateWrapper";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: start;
  font-family: ${fallbackFontFamily};
  word-spacing: 0.5px;

  ${typographyCaptionSmall}
`;

const BreadcrumbLink = styled.a(
  ({ theme }) => css`
    display: flex;
    color: ${theme.colors.primary};
  `
);

const CapitalizedSpan = styled.span(
  css`
    &:first-letter {
      text-transform: uppercase;
    }
  `
);

export const StyledArrow = styled(Arrow)(
  ({ theme }) =>
    css`
      width: 6px;
      height: 6px;
      fill: ${theme.colors.primary};
    `
);

export const ArrowContainer = styled.div`
  margin: 0 ${gutters.small / 2}px;
`;

const BreadcrumbSection = ({
  name,
  url,
  isLast,
}: SharedTypes.BreadcrumbData & {
  isLast: boolean;
}) => {
  if (isLast) {
    return (
      <BreadcrumbLink href={url} title={name}>
        {/* eslint-disable-next-line react/no-danger */}
        <CapitalizedSpan dangerouslySetInnerHTML={{ __html: name }} />
      </BreadcrumbLink>
    );
  }
  return (
    <BreadcrumbLink href={url} title={name}>
      {/* eslint-disable-next-line react/no-danger */}
      <CapitalizedSpan dangerouslySetInnerHTML={{ __html: name }} />
      <ArrowContainer>
        <StyledArrow />
      </ArrowContainer>
    </BreadcrumbLink>
  );
};

const Breadcrumbs = ({
  breadcrumbs,
  hideLastBreadcrumb = true,
}: {
  breadcrumbs: SharedTypes.BreadcrumbData[];
  hideLastBreadcrumb?: boolean;
}) => {
  const truncatedBreadcrumbs = hideLastBreadcrumb ? breadcrumbs.slice(0, -1) : breadcrumbs;
  if (truncatedBreadcrumbs.length === 0) return null;
  return (
    <>
      <LazyHydrateWrapper ssrOnly>
        <BreadcrumbsStructuredData items={truncatedBreadcrumbs} />
      </LazyHydrateWrapper>
      <Container>
        {truncatedBreadcrumbs.map((breadcrumb, index) => (
          <BreadcrumbSection
            key={breadcrumb.name}
            isLast={index === truncatedBreadcrumbs.length - 1}
            name={breadcrumb.name}
            url={breadcrumb.url}
          />
        ))}
      </Container>
    </>
  );
};

export default Breadcrumbs;
