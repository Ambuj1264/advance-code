import React, { memo, useMemo } from "react";

import { constructAccommodationSectionsCard } from "../utils/accommodationSearchUtils";
import useAccommodationSearchCategories, {
  HotelSearchCategoriesTypes,
} from "../hooks/useAccommodationSearchCategories";

import LandingPageCardSection from "components/ui/LandingPages/LandingPageCardSection";
import { GraphCMSDisplayType } from "types/enums";

const AccommodationDestinations = ({ slug }: { slug: string }) => {
  const { data, error } = useAccommodationSearchCategories(
    HotelSearchCategoriesTypes.topCities,
    slug
  );
  const isLargeImage = false;
  const columnSizes = useMemo(
    () =>
      isLargeImage
        ? { small: 1, large: 1 / 3, desktop: 1 / 4 }
        : { small: 1 / 2, large: 1 / 4, desktop: 1 / 6 },
    [isLargeImage]
  );

  if (error || !data || !data.categories || !data.metadata) {
    return null;
  }

  const sectionCards = constructAccommodationSectionsCard(data.categories);

  return (
    <LandingPageCardSection
      title={data.metadata.title}
      sectionContent={sectionCards}
      cardsOnPage={24}
      mobileRows={sectionCards.length > 6 ? 2 : 1}
      displayType={GraphCMSDisplayType.IMAGE}
      columnSizes={columnSizes}
      mobileCardWidth={190}
      isFirstSection={false}
      paginationParams={null}
    />
  );
};

export default memo(AccommodationDestinations);
