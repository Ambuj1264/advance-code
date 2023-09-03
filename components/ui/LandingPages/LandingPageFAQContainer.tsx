import React from "react";
import { useQuery } from "@apollo/react-hooks";

import { constructLandingPageFAQs } from "./utils/landingPageUtils";

import { normalizeGraphCMSLocale } from "utils/helperUtils";
import LandingPageFAQQuery from "components/ui/LandingPages/queries/LandingPageFAQQuery.graphql";
import Section from "components/ui/Section/Section";
import SectionHeading from "components/ui/Section/SectionHeading";
import FAQContainer from "components/ui/FAQ/FAQContainer";
import { Trans } from "i18n";
import FAQSkeletonContainer from "components/ui/FAQ/FAQSkeletonContainer";
import FAQStructuredData from "components/ui/FAQ/FAQStructuredData";

const LandingPageFAQContainer = ({
  activeLocale,
  queryCondition,
  shouldRemoveLinks = false,
}: {
  activeLocale: string;
  queryCondition: object;
  shouldRemoveLinks?: boolean;
}) => {
  const { data, loading, error } = useQuery<{
    landingPages: {
      faqs: SharedTypes.Question[];
      faqItems: SharedTypes.Question[];
    }[];
  }>(LandingPageFAQQuery, {
    variables: {
      where: queryCondition,
      locale: normalizeGraphCMSLocale(activeLocale),
    },
  });

  const queryFaqItems = data?.landingPages?.[0]?.faqItems || [];
  const queryFaqs = data?.landingPages?.[0]?.faqs || [];
  if (
    loading ||
    error ||
    !data?.landingPages?.length ||
    (!queryFaqItems.length && !queryFaqs.length)
  ) {
    return null;
  }

  const queryFaqList = queryFaqItems.length > 0 ? queryFaqItems : queryFaqs;
  const faqs = constructLandingPageFAQs(queryFaqList);

  if (!faqs || faqs?.length === 0) {
    return null;
  }

  // TODO: Remove when stay product pages are ready
  const questions = shouldRemoveLinks
    ? faqs.map(faq => ({
        id: faq.id,
        question: faq.question,
        answer: faq.answer.replace(/<\/?a[^>]*>/g, ""),
      }))
    : faqs;
  return (
    <Section useContentVisibility={false}>
      <SectionHeading>
        <Trans>Frequently asked questions</Trans>
      </SectionHeading>
      {
        // this is possible because SearchPageCategoriesContainer is wrapped with OnDemand
        typeof window === "undefined" ? (
          <>
            <FAQSkeletonContainer items={questions} />
            <FAQStructuredData questions={questions} />
          </>
        ) : (
          <FAQContainer questions={questions} />
        )
      }
    </Section>
  );
};

export default LandingPageFAQContainer;
