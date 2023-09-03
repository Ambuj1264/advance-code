import React from "react";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import { css } from "@emotion/core";

import ErrorBoundary from "../ErrorBoundary";

import FAQItem from "./FAQItem";
import FAQStructuredData from "./FAQStructuredData";

import { borderRadius, gutters } from "styles/variables";
import { mqMin } from "styles/base";
import { decodeHtmlEntity } from "utils/helperUtils";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const Container = styled.div<{ fullWidthContainer: boolean }>(
  ({ theme, fullWidthContainer }) =>
    css`
      margin-top: ${gutters.large}px;
      border: 1px solid ${rgba(theme.colors.primary, 0.4)};
      border-radius: ${borderRadius};
      width: 100%;
      ${mqMin.large} {
        width: ${fullWidthContainer ? "100%" : "685px"};
      }
    `
);

const FAQItemWrapper = styled.div(
  ({ theme }) =>
    css`
      padding: ${gutters.large}px ${gutters.small}px ${gutters.small}px ${gutters.small}px;
      ${mqMin.large} {
        padding: ${gutters.small}px ${gutters.large}px;
      }
      &:not(:first-of-type) {
        border-top: 1px solid ${rgba(theme.colors.primary, 0.4)};
      }
    `
);

type FAQContainerProps = {
  questions: SharedTypes.Question[];
  fullWidthContainer?: boolean;
};

export const FAQItems = ({ fullWidthContainer = false, questions }: FAQContainerProps) => (
  <Wrapper>
    <Container fullWidthContainer={fullWidthContainer}>
      {questions.map(({ question, answer, id }, idx) => (
        <FAQItemWrapper key={id || idx}>
          <FAQItem
            title={decodeHtmlEntity(question)}
            description={decodeHtmlEntity(answer)}
            id={id || idx}
          />
        </FAQItemWrapper>
      ))}
    </Container>
  </Wrapper>
);

const FAQContainer = ({
  questions,
  fullWidthContainer = false,
  shouldHaveStructured = true,
}: FAQContainerProps & { shouldHaveStructured?: boolean }) => {
  return (
    <ErrorBoundary>
      <FAQItems questions={questions} fullWidthContainer={fullWidthContainer} />
      {shouldHaveStructured && <FAQStructuredData questions={questions} />}
    </ErrorBoundary>
  );
};

export default FAQContainer;
