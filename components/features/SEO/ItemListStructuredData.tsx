import React from "react";

import { PageType } from "types/enums";
import { useSettings } from "contexts/SettingsContext";
import { constructPublisher } from "components/features/SEO/utils/SEOUtils";

type ItemType = {
  url: string;
  title: string;
  imgUrl: string;
};

const ItemListStructuredData = ({
  pageType,
  publicationDate,
  author,
  itemList,
  modifiedTime,
  url,
}: {
  pageType: PageType;
  publicationDate: string;
  modifiedTime: string;
  author: ArticleLayoutTypes.ArticleAuthor;
  url: string;
  itemList: ItemType[];
}) => {
  const { marketplaceUrl, websiteName, marketplace } = useSettings();

  if (!itemList.length) {
    return null;
  }

  const itemListElement = itemList
    .filter(item => !!item.imgUrl)
    .map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": pageType === PageType.ARTICLE ? "Article" : "BlogPosting",
        url: `${marketplaceUrl}${item.url}`,
        headline: item.title,
        image: item.imgUrl,

        author: {
          "@type": "Person",
          name: author.name,
        },
        publisher: constructPublisher({
          websiteName,
          marketplace,
          marketplaceUrl,
        }),
        datePublished: publicationDate,
        dateModified: modifiedTime,
        mainEntityOfPage: `${marketplaceUrl}${url}`,
      },
    }));

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement,
        }),
      }}
    />
  );
};

export default ItemListStructuredData;
