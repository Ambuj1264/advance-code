import React from "react";

import {
  getIconAndCategoryLabel,
  checkIfFlag,
} from "../Header/Header/NavigationBar/GTESearch/GTESearchUtils";

import { PageResultItems } from "./SearchResultContainer";
import MobileOverallSearchTileCard from "./MobileOverallSearchTileCard";
import DesktopOverallSearchTileCard from "./DesktopOverallSearchTileCard";

import { GridItemWrapper } from "components/ui/Search/SearchList";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { useIsTablet } from "hooks/useMediaQueryCustom";

const SearchResultItemCardMobile = ({ product }: { product: PageResultItems }) => {
  const { title, description, metadataUri, pageType, countryCode, id, imageSrc, reviewScore } =
    product;
  const { color, icon: Icon, category } = getIconAndCategoryLabel(pageType, countryCode);
  const { t } = useTranslation(Namespaces.headerNs);
  const isTablet = useIsTablet();
  const isFlag = checkIfFlag(pageType);
  const descriptionWithDots = description?.length >= 180 ? `${description}...` : description;
  return (
    <GridItemWrapper columnSizes={{ small: 1, medium: 1 / 2, desktop: 1 / 3 }}>
      {!isTablet ? (
        <MobileOverallSearchTileCard
          id={id}
          metadataUri={metadataUri}
          title={title}
          color={color}
          isFlag={isFlag}
          Icon={Icon}
          description={descriptionWithDots}
          reviewScore={reviewScore}
        />
      ) : (
        <DesktopOverallSearchTileCard
          id={id}
          metadataUri={metadataUri}
          title={title}
          color={color}
          isFlag={isFlag}
          Icon={Icon}
          category={t(category)}
          description={descriptionWithDots}
          imageSrc={imageSrc}
          reviewScore={reviewScore}
        />
      )}
    </GridItemWrapper>
  );
};

export default SearchResultItemCardMobile;
