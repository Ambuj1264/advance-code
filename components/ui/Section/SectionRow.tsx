import React, { ReactNode } from "react";

import Row from "../Grid/Row";
import ErrorBoundary from "../ErrorBoundary";

import SectionHeading from "./SectionHeading";
import SectionSubHeading from "./SectionSubHeading";
import SectionContent from "./SectionContent";
import Section from "./Section";
import SectionRowSeeAll from "./SectionRowSeeAll";

import { PageType } from "types/enums";

const SectionRow = ({
  title,
  subtitle,
  categoryLink,
  categoryLinkTitle,
  categoryLinkPageType = PageType.TOURCATEGORY,
  children,
  CustomRowWrapper,
  isLegacyRoute = false,
  className,
  isFirstSection,
  dataTestid,
}: {
  title?: string | ReactNode;
  subtitle?: string | ReactNode;
  categoryLink?: string;
  categoryLinkTitle?: string;
  categoryLinkPageType?: PageType;
  CustomRowWrapper?: React.FC<any>;
  isLegacyRoute?: boolean;
  children: ReactNode;
  className?: string;
  isFirstSection?: boolean;
  dataTestid?: string;
}) => {
  const RowWrapper = CustomRowWrapper || Row;
  return (
    <ErrorBoundary>
      <Section className={className} isFirstSection={isFirstSection} dataTestid={dataTestid}>
        <SectionHeading>{title}</SectionHeading>
        {subtitle && <SectionSubHeading>{subtitle}</SectionSubHeading>}
        <SectionContent>
          <RowWrapper>{children}</RowWrapper>
          <SectionRowSeeAll
            categoryLink={categoryLink}
            categoryLinkTitle={categoryLinkTitle}
            categoryLinkPageType={categoryLinkPageType}
            isLegacyRoute={isLegacyRoute}
          />
        </SectionContent>
      </Section>
    </ErrorBoundary>
  );
};

export default SectionRow;
