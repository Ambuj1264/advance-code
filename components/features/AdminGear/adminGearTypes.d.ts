declare namespace AdminGearTypes {
  import { PageType, CategorySearchPageType } from "types/enums";

  type AdminLink = {
    name: string;
    url: string;
    options?: {
      linkTarget?: string;
      adminOnly?: boolean;
    };
  };

  type AdminFunctionalItem = {
    name: string;
    loading: boolean;
    onClick: () => void;
  };

  export type Item = {
    id?: string;
    url: string;
    uriMetaEditing?: string;
  };

  export type ItemName = PageType & CategorySearchPageType;

  export type QueryIndexationRulesData = {
    indexationRule: {
      id: string;
      allowChanging: boolean;
      objectId?: string;
      object?: string;
    };
  };

  export type MutationUpdateIndexationData = {
    id: string;
    isIndexed: boolean;
  };

  export type MutationUpdateIndexationVariables = {
    objectType: string;
    objectId?: number;
    isIndexed: boolean;
    locale: string;
  };
}
