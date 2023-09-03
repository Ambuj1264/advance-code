import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { useRouter } from "next/router";

import { getFAQVariables } from "../SearchPage/utils/searchUtils";

import FAQTranslationLinkQuery from "./graphql/FAQTranslationLinkQuery.graphql";
import IndexationRulesQuery from "./graphql/IndexationRulesQuery.graphql";
import AdminGear from "./AdminGear";
import { TemplateInput } from "./useGetTemplate";

import useActiveLocale from "hooks/useActiveLocale";
import { LandingPageType, PageType } from "types/enums";
import { noCacheHeaders } from "utils/apiUtils";
import useQueryClient from "hooks/useQueryClient";

const AdminGearContainer = ({
  links,
  hideCommonLinks,
  infoText,
  functionalItems,
  landingPageType,
  pageType,
  slug,
  customerInfo,
  refetchCartData,
  templateInput,
}: {
  links?: AdminGearTypes.AdminLink[];
  hideCommonLinks: boolean;
  infoText?: string[];
  functionalItems?: AdminGearTypes.AdminFunctionalItem[];
  landingPageType?: LandingPageType;
  pageType?: PageType;
  slug?: string;
  customerInfo?: CartTypes.CommonCustomerInfoInput;
  refetchCartData?: () => void;
  templateInput?: TemplateInput;
}) => {
  const locale = useActiveLocale();
  const { asPath } = useRouter();
  const { error, data } = useQueryClient<AdminGearTypes.QueryIndexationRulesData>(
    IndexationRulesQuery,
    {
      variables: {
        locale,
        url: asPath,
      },
      context: { headers: noCacheHeaders },
    }
  );

  const FAQVariables = getFAQVariables({
    slug,
    landingPage: landingPageType,
    pageType,
  });

  const shouldSkipFAQ = !slug && !pageType && !landingPageType;

  const { data: FAQData } = useQuery<{
    getFaq: {
      faqID: number;
      translationLink: string | null;
    };
  }>(FAQTranslationLinkQuery, {
    variables: FAQVariables,
    skip: shouldSkipFAQ,
  });

  const translationLink = FAQData?.getFaq?.translationLink ?? undefined;
  if (error || !data) {
    return null;
  }
  const itemId = data.indexationRule.objectId ? Number(data.indexationRule.objectId) : undefined;
  return (
    <AdminGear
      indexationRules={data.indexationRule}
      itemId={itemId}
      itemName={data.indexationRule.object}
      links={links}
      hideCommonLinks={hideCommonLinks}
      infoText={infoText}
      functionalItems={functionalItems}
      translationLink={translationLink}
      customerInfo={customerInfo}
      refetchCartData={refetchCartData}
      templateInput={templateInput}
    />
  );
};

export default AdminGearContainer;
