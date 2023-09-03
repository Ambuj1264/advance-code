import React from "react";
import styled from "@emotion/styled";

import TopImagesSkeleton from "./TopImagesSkeleton";

import { useIsSmallDevice } from "hooks/useMediaQueryCustom";
import Row from "components/ui/Grid/Row";
import Cover from "components/ui/Cover/Cover";
import SectionRow from "components/ui/Section/SectionRow";
import { SeeAllWrapper } from "components/ui/Section/SectionRowSeeAll";
import { column } from "styles/base";
import { CoverVariant } from "types/enums";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import { getImagesWithoutSize } from "utils/imageUtils";

const Container = styled.div(column({ small: 1, desktop: 2 / 3 }));

const StyledRow = styled(Row)`
  justify-content: center;
`;

const StyledSectionRow = styled(SectionRow)`
  ${SeeAllWrapper} {
    ${column({ small: 1, desktop: 2 / 3 })};
    margin-right: auto;
    margin-left: auto;
  }
`;

const TopImagesContainer = ({
  images,
  metadata,
  loading = false,
}: {
  images: Image[];
  metadata: SharedTypes.PageSectionMetadata;
  loading?: boolean;
}) => {
  const { t } = useTranslation(Namespaces.countryNs);
  const isMobile = useIsSmallDevice();
  const coverHeight = isMobile ? 240 : 480;

  return loading ? (
    <TopImagesSkeleton coverHeight={coverHeight} />
  ) : (
    <StyledSectionRow
      title={metadata.title}
      subtitle={metadata.subtitle}
      categoryLink={metadata.url}
      categoryLinkTitle={t("See all photos")}
      CustomRowWrapper={StyledRow}
      isLegacyRoute
    >
      <Container>
        <Cover
          imageUrls={getImagesWithoutSize(images)}
          variant={CoverVariant.HERO}
          height={coverHeight}
          responsiveThumbnails={{ medium: 5, large: 7, desktop: 7 }}
          isLazy
        />
      </Container>
    </StyledSectionRow>
  );
};

export default TopImagesContainer;
