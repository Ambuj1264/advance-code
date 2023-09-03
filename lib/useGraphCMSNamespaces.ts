import { useQuery } from "@apollo/react-hooks";
import { i18n } from "i18next";

import NamespaceQuery from "./namespaceQuery.graphql";

import useActiveLocale from "hooks/useActiveLocale";
import { SupportedLanguages } from "types/enums";
import {
  getMissingNamespaces,
  getSplitNamespaces,
  normalizeGraphCMSLocale,
} from "utils/helperUtils";
import { longCacheHeaders } from "utils/apiUtils";
import { i18next } from "i18n";

type ApplicationString = {
  stringId: string;
  value: string;
};

type ApplicationNamespace = {
  namespaceName: string;
  applicationStrings: ApplicationString[];
};

const constructi18nextResourceBundles = (
  applicationNamespaces: ApplicationNamespace[],
  secondApplicationNamespaces: ApplicationNamespace[],
  lastApplicationNamespaces: ApplicationNamespace[],
  activeLocale: SupportedLanguages
) => {
  return [
    ...applicationNamespaces,
    ...secondApplicationNamespaces,
    ...lastApplicationNamespaces,
  ].reduce(
    (acc, applicationNamespace) => {
      const namespaceStrings = applicationNamespace.applicationStrings.reduce(
        (accummulatedStrings, applicationString) => ({
          ...accummulatedStrings,
          [applicationString.stringId]: applicationString.value,
        }),
        {}
      );

      return {
        [activeLocale]: {
          ...acc[activeLocale],
          [applicationNamespace.namespaceName]: namespaceStrings,
        },
      };
    },
    { [activeLocale]: {} }
  );
};

const useGetQueryData = (namespaces: string[], locale: SupportedLanguages, skip: boolean) => {
  const { error, loading, data } = useQuery<{
    applicationNamespaces: ApplicationNamespace[];
  }>(NamespaceQuery, {
    variables: {
      namespaces,
      locale,
    },
    skip,
    context: {
      headers: longCacheHeaders,
    },
  });
  return {
    error,
    loading,
    data,
  };
};

const useGraphCMSNamespace = (
  namespaces: string[],
  ssrI18n?: i18n,
  ssrBundle?: ReturnType<typeof constructi18nextResourceBundles>
) => {
  const activeLocale = useActiveLocale();
  const graphCMSLocale = normalizeGraphCMSLocale(activeLocale) as SupportedLanguages;
  const namespacesMissing = getMissingNamespaces(namespaces, graphCMSLocale);
  const { firstNamespaces, secondNamespaces, lastNamespaces } =
    getSplitNamespaces(namespacesMissing);
  const { error, loading, data } = useGetQueryData(
    firstNamespaces,
    graphCMSLocale,
    firstNamespaces?.length === 0 || Boolean(ssrBundle)
  );
  const {
    error: secondError,
    data: secondData,
    loading: secondLoading,
  } = useGetQueryData(
    secondNamespaces,
    graphCMSLocale,
    secondNamespaces?.length === 0 || Boolean(ssrBundle)
  );
  const {
    error: lastError,
    data: lastData,
    loading: lastLoading,
  } = useGetQueryData(
    lastNamespaces,
    graphCMSLocale,
    lastNamespaces?.length === 0 || Boolean(ssrBundle)
  );
  const hasError = error || lastError || secondError;
  const isLoading = loading || lastLoading || secondLoading;
  const isMissingNamespaceData =
    !data?.applicationNamespaces ||
    (lastNamespaces.length > 0 && !lastData?.applicationNamespaces) ||
    (secondNamespaces.length > 0 && !secondData?.applicationNamespaces);
  if (hasError || isLoading || (isMissingNamespaceData && !ssrBundle)) {
    return;
  }
  const currenti18n = ssrI18n || i18next;
  const resourceBundle =
    ssrBundle ||
    constructi18nextResourceBundles(
      data?.applicationNamespaces ?? [],
      secondData?.applicationNamespaces ?? [],
      lastData?.applicationNamespaces ?? [],
      graphCMSLocale
    );

  // eslint-disable-next-line functional/immutable-data
  currenti18n.store.data = {
    ...resourceBundle,
    [graphCMSLocale]: {
      ...currenti18n.store.data[graphCMSLocale],
      ...resourceBundle[graphCMSLocale],
    },
  };

  // eslint-disable-next-line consistent-return
  return resourceBundle;
};

export default useGraphCMSNamespace;
