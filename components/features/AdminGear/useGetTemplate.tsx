import { useLazyQuery } from "@apollo/react-hooks";

import GetOrCreateCustomTemplate from "./graphql/GetOrCreateCustomTemplate.graphql";

import { GraphCMSPageType, GraphCMSPageVariation, PageType } from "types/enums";

export type TemplateInput = {
  pageVariation?: GraphCMSPageVariation;
  funnel?: GraphCMSPageType | PageType;
  subtype?: string;
  placeId?: string;
};

const useGetTemplate = ({ request }: { request?: TemplateInput }) => {
  const [createOrFetch, { error, loading }] = useLazyQuery<{
    orCreateCustomTemplate: {
      url: string;
    };
  }>(GetOrCreateCustomTemplate, {
    variables: { request },
    onCompleted: data => {
      const templateUrl = data?.orCreateCustomTemplate?.url;
      if (templateUrl) {
        window?.open(templateUrl, "_blank")?.focus();
      }
    },
  });

  const handleFetchUrl = () => {
    createOrFetch({
      variables: { request },
    });
  };

  return {
    handleFetchUrl,
    error,
    loading,
  };
};

export default useGetTemplate;
