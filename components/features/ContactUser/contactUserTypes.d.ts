declare namespace ContactUserTypes {
  type TranslationsWithDefaults = {
    messageSentInfo: string;
    closeButton: string;
    sendMessageButton: string;
  };

  type RequiredTranslations = {
    modalTitle: string;
    placeholder: string;
  };

  type Translations = RequiredTranslations & TranslationsWithDefaults;
  type InputTranslations = RequiredTranslations & Partial<TranslationsWithDefaults>;
}
