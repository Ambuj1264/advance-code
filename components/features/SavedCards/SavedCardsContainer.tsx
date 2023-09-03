import React from "react";

import SavedCardsContent from "./SavedCardsContent";

import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import DefaultHeadTags from "lib/DefaultHeadTags";

const SavedCardsContainer = () => {
  const { t } = useTranslation(Namespaces.userProfileNs);

  return (
    <>
      <DefaultHeadTags title={t("Payment methods")} />
      <SavedCardsContent />
    </>
  );
};

export default SavedCardsContainer;
