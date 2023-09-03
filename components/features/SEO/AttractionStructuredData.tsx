import React from "react";

import { useSettings } from "contexts/SettingsContext";

const ArticleStructuredData = ({ attraction }: { attraction: ArticleLayoutTypes.Attraction }) => {
  const { marketplaceUrl } = useSettings();

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org/",
          "@type": "TouristAttraction",
          name: attraction.name,
          description: attraction.metadata.description,
          url: `${marketplaceUrl}${attraction.url}`,
          image: attraction.images.map(image => image.url),
          geo: {
            "@type": "GeoCoordinates",
            latitude: attraction.latitude,
            longitude: attraction.longitude,
          },
          ...(attraction.location
            ? {
                address: attraction.location,
              }
            : null),
          ...(attraction.tourCategoryUrls.length
            ? {
                tourBookingPage: attraction.tourCategoryUrls,
              }
            : null),
        }),
      }}
    />
  );
};

export default ArticleStructuredData;
