import React, { ReactElement } from "react";
import { useQuery } from "@apollo/react-hooks";

import FAQQuery from "./queries/FAQQuery.graphql";
import { getFAQVariables } from "./utils/searchUtils";

import useActiveLocale from "hooks/useActiveLocale";
import { LandingPageType, PageType } from "types/enums";
import Section from "components/ui/Section/Section";
import SectionHeading from "components/ui/Section/SectionHeading";
import FAQContainer from "components/ui/FAQ/FAQContainer";
import { Trans } from "i18n";

const SearchPageFAQContainer = ({
  slug,
  landingPage,
  pageType,
  fallback = null,
  shouldHaveStructured = true,
}: {
  landingPage?: LandingPageType;
  pageType?: PageType;
  slug?: string;
  fallback?: ReactElement | null;
  shouldHaveStructured?: boolean;
}) => {
  const locale = useActiveLocale();
  const { data, loading, error } = useQuery<SearchPageTypes.QueryFAQ>(FAQQuery, {
    variables: getFAQVariables({ slug, landingPage, pageType, locale }),
  });
  if (loading || error || !data?.getFaq) return fallback;
  const { questions } = data.getFaq;

  if (questions.length === 0) {
    return null;
  }
  return (
    <Section useContentVisibility={false}>
      <SectionHeading>
        <Trans>Frequently asked questions</Trans>
      </SectionHeading>
      <FAQContainer
        questions={questions}
        shouldHaveStructured={shouldHaveStructured}
        fullWidthContainer={false}
      />
    </Section>
  );
};

export default SearchPageFAQContainer;
