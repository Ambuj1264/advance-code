declare namespace BloggerSearchTypes {
  import { PageType, TeaserOverlayBannerIconId } from "types/enums";

  export type QueryBlog = SharedTypes.QueryBlog & {
    description: string;
    date: string;
    bannerId: TeaserOverlayBannerIconId;
  };

  export type SearchBlog = SharedTypes.PlaceProduct & {
    author?: SharedTypes.Author;
    bannerId?: TeaserTypes.TeaserOverlayBannerIcon;
    pageType: PageType;
  };

  export type QueryBlogCategory = {
    id: number;
    name: string;
  };

  export type QueryBlogCategories = {
    localCategories: QueryBlogCategory[];
    travelCategories: QueryBlogCategory[];
  };
}
