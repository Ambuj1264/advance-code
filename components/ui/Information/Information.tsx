import React from "react";
import styled from "@emotion/styled";

import ExpandableText from "components/ui/ExpandableText/ExpandableText";
import ProductSpecs from "components/ui/Information/ProductSpecs";
import { LeftSectionHeading } from "components/ui/Section/SectionHeading";
import { mqMin, mqMax } from "styles/base";
import { gutters } from "styles/variables";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import Row from "components/ui/Grid/Row";
import Column from "components/ui/Grid/Column";

const Wrapper = styled.div`
  margin-top: ${gutters.large / 2}px;
`;

const StyledProductSpecs = styled(ProductSpecs)`
  ${mqMin.large} {
    margin-top: -${gutters.large}px;
    margin-bottom: 36px;
  }

  ${mqMax.medium} {
    margin-bottom: ${gutters.small * 2}px;
  }
`;

const InformationWrapper = styled.div`
  margin: ${gutters.large}px 0;
`;

const MobileTitleWrapper = styled.div`
  margin: ${gutters.small * 2}px 0 ${gutters.small}px;

  ${mqMin.large} {
    display: none;
  }
`;

const DesktopColumn = styled(Column)`
  display: none;

  ${mqMin.large} {
    display: block;
  }
`;

const Information = ({
  id,
  information,
  namespace = Namespaces.commonNs,
  productSpecs,
  className,
  lineLimit,
  handleParagraphs = true,
  autoExpand = false,
  clampedTextExtraHeight = 8,
}: {
  id: string;
  information: string;
  namespace?: Namespaces;
  productSpecs: SharedTypes.ProductSpec[];
  className?: string;
  lineLimit?: number;
  handleParagraphs?: boolean;
  autoExpand?: boolean;
  clampedTextExtraHeight?: number;
}) => {
  const { t: commonT } = useTranslation();
  const { t } = useTranslation(namespace);
  return (
    <InformationWrapper className={className}>
      <Row>
        <DesktopColumn columns={{ small: 1, medium: 2 }}>
          <LeftSectionHeading>{commonT("Description")}</LeftSectionHeading>
        </DesktopColumn>

        <Column columns={{ small: 1, medium: 2 }}>
          <LeftSectionHeading>{t("Summary")}</LeftSectionHeading>
        </Column>
      </Row>
      <Wrapper>
        <StyledProductSpecs id="productSpecs" fullWidth={false} productSpecs={productSpecs} />
        <MobileTitleWrapper>
          <LeftSectionHeading>{commonT("Description")}</LeftSectionHeading>
        </MobileTitleWrapper>
        <ExpandableText
          id={id}
          text={information}
          lineLimit={lineLimit}
          handleParagraphs={handleParagraphs}
          autoExpand={autoExpand}
          clampedTextExtraHeight={clampedTextExtraHeight}
        />
      </Wrapper>
    </InformationWrapper>
  );
};

export default Information;
