import React, { useMemo } from "react";
import styled from "@emotion/styled";
import { useQuery } from "@apollo/react-hooks";

import { TGDSectionType } from "../types/travelGuideEnums";
import { getSectionCondition } from "../utils/travelGuideUtils";

import TGContentWidgetSectionHeader from "./TGContentWidgetSectionHeader";

import ClientLink from "components/ui/ClientLink";
import useActiveLocale from "hooks/useActiveLocale";
import SectionContent from "components/ui/Section/SectionContent";
import { LazyHydratedSection } from "components/ui/LandingPages/LazyHydratedSection";
import TeaserImageCardWithAction from "components/ui/Teaser/variants/TeaserImageCardWithAction";
import { gutters } from "styles/variables";
import { mqMin } from "styles/base";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import LandingPageCardOverlay from "components/ui/LandingPages/LandingPageCardOverlay";
import LandingPageSectionsSortedQuery from "components/ui/LandingPages/queries/LandingPageSectionsSortedQuery.graphql";
import { GraphCMSPageVariation } from "types/enums";
import { emptyArray } from "utils/constants";
import {
  constructLandingPageImageWithActionSectionCards,
  getSectionLandingPageType,
} from "components/ui/LandingPages/utils/landingPageUtils";
import { urlToRelative } from "utils/apiUtils";
import CustomNextDynamic from "lib/CustomNextDynamic";
import IconLoading from "components/ui/utils/IconLoading";

const GTEIcon = CustomNextDynamic(() => import("components/icons/gte-favicon.svg"), {
  loading: IconLoading,
});

const StyledTeaserImageCardWithAction = styled(TeaserImageCardWithAction)`
  margin-bottom: ${gutters.large}px;
  ${mqMin.large} {
    margin-bottom: ${gutters.large}px;
  }
`;

const StyledGTEIcon = styled(GTEIcon)`
  width: 24px;
  height: 24px;
`;

const TGDGuideToContinent = ({
  place,
  sectionType,
  conditions,
  ssrRender = true,
}: {
  place: TravelGuideTypes.DestinationPlace;
  sectionType: TGDSectionType;
  conditions: TravelGuideTypes.TGSectionCondition[];
  ssrRender?: boolean;
}) => {
  const locale = useActiveLocale();
  const { t } = useTranslation(Namespaces.commonNs);
  const sectionCondition = getSectionCondition(conditions, sectionType);
  const { data, loading } = useQuery<LandingPageTypes.QueryLandingPageSection>(
    LandingPageSectionsSortedQuery,
    {
      variables: {
        where: sectionCondition?.where,
        sectionWhere: sectionCondition?.sectionWhere,
        first: sectionCondition?.first,
        continentGroup: sectionCondition?.continentGroup,
        metadataUri: sectionCondition?.metadataUri,
        locale,
      },
    }
  );
  const sectionItems = useMemo(() => {
    return (
      data?.sectionContent.edges.map(({ node }) => node) ??
      (emptyArray as LandingPageTypes.SectionContentEdge[])
    );
  }, [data]);
  if (loading && !sectionItems) {
    return null;
  }
  if (sectionItems) {
    const sectionContent = constructLandingPageImageWithActionSectionCards(
      sectionItems as LandingPageTypes.QueryLandingPageSectionCardData[],
      locale
    );
    return (
      <>
        <TGContentWidgetSectionHeader
          title={t("Most popular countries in Europe")}
          Icon={StyledGTEIcon}
        />
        <SectionContent>
          <LazyHydratedSection ssrRender={ssrRender} key={sectionType}>
            {sectionContent.map(sectionCard => {
              const { image, title, smallTitle, destinationFlag, linkUrl } = sectionCard;
              return (
                <ClientLink
                  key={title}
                  clientRoute={{
                    query: {
                      slug: sectionCard.slug,
                      country: place?.country?.name?.value,
                      destinationName: place?.name?.value,
                      metadataUri: linkUrl,
                      pageVariation: GraphCMSPageVariation.guide,
                    },
                    as: urlToRelative(linkUrl),
                    route: `/${getSectionLandingPageType(sectionCard.pageType)}`,
                  }}
                  title={sectionCard.title}
                >
                  <StyledTeaserImageCardWithAction
                    title={title}
                    width={330}
                    smallTitle={smallTitle}
                    imageAlt={title}
                    imageUrl={image?.url}
                    overlay={
                      <LandingPageCardOverlay destinationFlag={destinationFlag} onRightSide />
                    }
                  />
                </ClientLink>
              );
            })}
          </LazyHydratedSection>
        </SectionContent>
      </>
    );
  }

  return null;
};

export default TGDGuideToContinent;
