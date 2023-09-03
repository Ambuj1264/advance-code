import React from "react";

import { OverlayIconContainer, overlayIconStyles } from "../OverlayIconContainer";

import TravelCommunitySkeleton from "./TravelCommunitySkeleton";
import { Column, StyledScrollSnapWrapper } from "./TravelCommunityShared";

import TravellerIcon from "components/icons/traveler.svg";
import LocalCompanies from "components/icons/local-companies.svg";
import StyleTwoPinInformation from "components/icons/style-two-pin-information.svg";
import PinLocation from "components/icons/pin-location-1.svg";
import TravelPaperPlane from "components/icons/travel-paper-plane.svg";
import ClientLinkPrefetch from "components/ui/ClientLinkPrefetch";
import { getProductSlugFromHref } from "utils/routerUtils";
import { urlToRelative } from "utils/apiUtils";
import TeaserSideCardHorizontal from "components/ui/Teaser/variants/TeaserSideCardHorizontal";
import SectionRow from "components/ui/Section/SectionRow";
import { convertImageWithNumberId } from "utils/imageUtils";
import { PageType } from "types/enums";

const iconsByIconPageType: { [key in PageType]?: any } = {
  [PageType.TOURSEARCH]: TravellerIcon,
  [PageType.PAGE]: LocalCompanies,
  [PageType.ARTICLECATEGORY]: StyleTwoPinInformation,
  [PageType.LOCALCOMMUNITY]: PinLocation,
  [PageType.TRAVELCOMMUNITY]: TravelPaperPlane,
};

const TravelCommunityContainer = ({
  items,
  metadata,
  loading = false,
}: {
  items: CountryPageTypes.TravelCommunityItemType[];
  metadata: SharedTypes.PageCategoriesMetaType;
  loading?: boolean;
}) => {
  return loading ? (
    <TravelCommunitySkeleton />
  ) : (
    <SectionRow
      title={metadata.title}
      subtitle={metadata.subtitle}
      CustomRowWrapper={StyledScrollSnapWrapper}
    >
      {items.map(item => {
        const Icon = iconsByIconPageType[item.iconPageType as PageType];
        const image: Image = convertImageWithNumberId(item.image);

        return (
          <Column key={item.title}>
            <ClientLinkPrefetch
              linkUrl={urlToRelative(item.uri)}
              useRegularLink={item.isLegacy}
              clientRoute={{
                query: {
                  slug: getProductSlugFromHref(item.uri),
                },
                route: `/${item.pageType}`,
                as: urlToRelative(item.uri),
              }}
              title={item.title}
            >
              <TeaserSideCardHorizontal
                url={item.uri}
                title={item.title}
                description={item.description}
                image={image}
                hasCallToAction={false}
                teaserSize="small"
                overlay={
                  Icon ? (
                    <OverlayIconContainer>
                      <Icon css={overlayIconStyles} />
                    </OverlayIconContainer>
                  ) : null
                }
              />
            </ClientLinkPrefetch>
          </Column>
        );
      })}
    </SectionRow>
  );
};

export default TravelCommunityContainer;
