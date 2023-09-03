import { ElementType } from "react";

import { FilterType } from "types/enums";

export type CommonFilterSectionType = {
  sectionId: string;
  title: string;
  placeholder?: string;
  Icon: ElementType<any>;
};

export type FilterSectionType = CommonFilterSectionType & {
  filters: SearchPageTypes.Filter[];
};

export type RangeFilterSectionType = CommonFilterSectionType & {
  filters: SearchPageTypes.RangeFilter[];
  min: number;
  max: number;
};

export type FilterSectionListItemType = (FilterSectionType | RangeFilterSectionType) & {
  type: FilterType;
};

export type FilterSectionListType = FilterSectionListItemType[];

export type SelectedFilter = {
  sectionId: string;
  value: string[];
  name: string;
  queryParamList: string[];
  filterType: FilterType;
};
