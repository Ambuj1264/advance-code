import React, { memo } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import TopAttractionsSkeleton from "./TopAttractionsSkeleton";
import topAttractionStyles from "./topAttractionStyles";

import { urlToRelative } from "utils/apiUtils";
import { getProductSlugFromHref } from "utils/routerUtils";
import { TeaserVariant, PageType } from "types/enums";
import TeaserImageTitleOnly from "components/ui/Teaser/variants/TeaserImageTitleOnly";
import ClientLinkPrefetch from "components/ui/ClientLinkPrefetch";
import { borderRadius, whiteColor, redCinnabarColor } from "styles/variables";
import { mqMax, mqMin } from "styles/base";
import { typographyH4, typographySubtitle1 } from "styles/typography";
import SectionRow from "components/ui/Section/SectionRow";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import { useIsSmallDevice } from "hooks/useMediaQueryCustom";
import { convertImage } from "utils/imageUtils";

const StyledClientLinkPrefetch = styled(ClientLinkPrefetch)(topAttractionStyles);

export const NumberContainer = styled.div`
  position: absolute;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${borderRadius} 0px;
  width: 24px;
  height: 24px;
  background-color: ${redCinnabarColor};
  ${mqMin.medium} {
    width: 40px;
    height: 40px;
  }
`;

const Number = styled.div([
  typographySubtitle1,
  css`
    color: ${whiteColor};
    ${mqMin.medium} {
      ${typographyH4};
    }
  `,
]);

const TeaserImageTitleOnlyStyled = styled(TeaserImageTitleOnly)`
  ${mqMax.medium} {
    height: 120px;
  }
`;

const TopAttractionsContainer = ({
  attractions,
  metadata,
  loading = false,
}: {
  attractions: SharedTypes.PageTopAttraction[];
  metadata: SharedTypes.PageSectionMetadata;
  loading?: boolean;
}) => {
  const { t } = useTranslation(Namespaces.countryNs);
  const isMobile = useIsSmallDevice();
  const teaserHeight = isMobile ? 120 : undefined;

  if (loading) {
    return <TopAttractionsSkeleton attractionHeight={teaserHeight} />;
  }

  if (!attractions.length) {
    return null;
  }

  return (
    <SectionRow
      title={metadata.title}
      subtitle={metadata.subtitle}
      categoryLink={metadata.url}
      categoryLinkTitle={t(`See all attractions`)}
      isLegacyRoute
      dataTestid="top-attractions-container"
    >
      {attractions.map((attraction, index) => (
        <StyledClientLinkPrefetch
          linkUrl={urlToRelative(attraction.url)}
          key={attraction.url}
          clientRoute={{
            query: {
              slug: getProductSlugFromHref(attraction.url),
            },
            route: `/${PageType.ATTRACTION}`,
            as: urlToRelative(attraction.url),
          }}
          title={attraction.name}
          dataTestid={`attraction-item-${index}`}
        >
          <TeaserImageTitleOnlyStyled
            variant={TeaserVariant.IMAGE_TITLE_ONLY}
            url=""
            image={convertImage(attraction.image)}
            title={attraction.name}
            smallTitle
            height={isMobile ? 120 : undefined}
            overlay={
              <NumberContainer>
                <Number>{index + 1}</Number>
              </NumberContainer>
            }
          />
        </StyledClientLinkPrefetch>
      ))}
    </SectionRow>
  );
};

export default memo(TopAttractionsContainer);
