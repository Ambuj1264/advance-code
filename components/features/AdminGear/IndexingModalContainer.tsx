import React, { useState, useContext } from "react";
import { useMutation } from "@apollo/react-hooks";

import UpdateIndexationMutation from "./graphql/UpdateIndexationMutation.graphql";
import IndexingModal from "./IndexingModal";

import LocaleContext from "contexts/LocaleContext";

const IndexingModalContainer = ({
  isIndexed: isIndexedInitial,
  toggle,
  objectId,
  objectType,
  handleCacheClearForSinglePage,
}: {
  isIndexed: boolean;
  toggle: () => void;
  objectId?: number;
  objectType: string;
  handleCacheClearForSinglePage: () => void;
}) => {
  const [updateIndexation] = useMutation<
    AdminGearTypes.MutationUpdateIndexationData,
    AdminGearTypes.MutationUpdateIndexationVariables
  >(UpdateIndexationMutation);
  const activeLocale = useContext(LocaleContext);
  const [hasError, setError] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = async (isIndexed: boolean) => {
    setLoading(true);
    try {
      await updateIndexation({
        variables: {
          isIndexed,
          objectType,
          locale: activeLocale,
          objectId,
        },
      });
      toggle();
      handleCacheClearForSinglePage();
    } catch (e) {
      setError(true);
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  if (hasError) return null;

  return (
    <IndexingModal
      isIndexedInitial={isIndexedInitial}
      toggle={toggle}
      handleSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
};

export default IndexingModalContainer;
