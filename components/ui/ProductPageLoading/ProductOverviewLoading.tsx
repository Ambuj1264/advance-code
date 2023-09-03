import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { range } from "fp-ts/lib/Array";

import { gutters } from "styles/variables";
import { skeletonPulse } from "styles/base";
import SectionContent from "components/ui/Section/SectionContent";
import SectionHeading from "components/ui/Section/SectionHeading";
import Section from "components/ui/Section/Section";
import { MobileContainer } from "components/ui/Grid/Container";
import GridRow from "components/ui/Grid/Row";
import Column from "components/ui/Grid/Column";

const Heading = styled.div([
  skeletonPulse,
  css`
    width: 150px;
    height: 24px;
  `,
]);

const ListWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const ListItem = styled.div([
  skeletonPulse,
  css`
    margin-top: ${gutters.small / 2}px;
    width: 100px;
    height: 16px;
  `,
]);

const ListSection = () => (
  <Section>
    <MobileContainer>
      <SectionHeading>
        <Heading />
      </SectionHeading>
      <SectionContent>
        <GridRow>
          <ListWrapper>
            {range(0, 9).map((_, index) => (
              <Column key={index.toString()} columns={{ small: 2, medium: 3, large: 4 }}>
                <ListItem />
              </Column>
            ))}
          </ListWrapper>
        </GridRow>
      </SectionContent>
    </MobileContainer>
  </Section>
);

const ProductOverviewLoading = () => (
  <>
    <ListSection />
    <ListSection />
    <ListSection />
  </>
);

export default ProductOverviewLoading;
