import React from "react";

import { useSettings } from "contexts/SettingsContext";
import { PageType } from "types/enums";
import { constructPublisher } from "components/features/SEO/utils/SEOUtils";

const ArticleStructuredData = ({
  pageType,
  publicationDate,
  image,
  modifiedTime,
  metadata,
  title,
  url,
  author,
}: {
  pageType: PageType;
  publicationDate: string;
  image: ArticleLayoutTypes.ArticleImage;
  modifiedTime: string;
  metadata: SharedTypes.Metadata;
  title: string;
  url: string;
  author: ArticleLayoutTypes.ArticleAuthor;
}) => {
  const { marketplaceUrl, websiteName, marketplace } = useSettings();
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org/",
          "@type": pageType === PageType.ARTICLE ? "Article" : "BlogPosting",
          headline: title,
          datePublished: publicationDate,
          dateModified: modifiedTime,
          description: metadata.description,
          mainEntityOfPage: `${marketplaceUrl}${url}`,
          publisher: constructPublisher({
            websiteName,
            marketplace,
            marketplaceUrl,
          }),
          image: {
            "@type": "ImageObject",
            url: image.url,
            width: image.width || 1300,
            height: image.height || 880,
          },
          author: {
            "@type": "Person",
            name: author.name,
          },
          speakable: {
            "@type": "SpeakableSpecification",
            xpath: ["/html/head/title", "/html/head/meta[@name='description']/@content"],
          },
        }),
      }}
    />
  );
};

export default ArticleStructuredData;
