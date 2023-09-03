import IconMock from "components/icons/tags-check.svg";

// @ts-ignore
export const fakeTranslate: TFunction = (label: string) => label;

// @ts-ignore
export const fakeTranslateWithValues: TFunction = (label: string, options) =>
  `label:${label}, options:${JSON.stringify(options)}`;

export const NotImportantIconMock = IconMock;
