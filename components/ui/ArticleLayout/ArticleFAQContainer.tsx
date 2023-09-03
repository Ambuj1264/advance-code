import React from "react";
import { useQuery } from "@apollo/react-hooks";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import FAQQuery from "./queries/FAQQuery.graphql";

import { Namespaces } from "shared/namespaces";
import FAQContainer from "components/ui/FAQ/FAQContainer";
import { Trans } from "i18n";
import { gutters } from "styles/variables";
import { typographyH5 } from "styles/typography";

const FAQWrapper = styled.div`
  margin-top: ${gutters.large}px;
`;

const FAQTitle = styled.div(({ theme }) => [
  typographyH5,
  css`
    color: ${theme.colors.primary};
  `,
]);

const ArticleFAQContainer = ({ slug, pageType }: { slug: string; pageType: string }) => {
  const { data, loading, error } = useQuery<SearchPageTypes.QueryFAQ>(FAQQuery, {
    variables: { pageType, slug },
  });
  if (loading || error || !data || !data.getFaq) return null;
  const { questions } = data.getFaq;

  return (
    <FAQWrapper>
      <FAQTitle>
        <Trans ns={Namespaces.commonNs}>Frequently asked questions</Trans>
      </FAQTitle>
      <FAQContainer questions={questions} fullWidthContainer />
    </FAQWrapper>
  );
};

export default ArticleFAQContainer;
