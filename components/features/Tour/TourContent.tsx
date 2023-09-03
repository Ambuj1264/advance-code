import React, { ReactNode } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import Guide from "./Guide";
import ItineraryContainer from "./ItineraryItem/ItineraryContainer";

import ImageGalleryCarousel from "components/ui/ImageCarousel/ImageGalleryCarousel";
import { StyledAttractionsMapContainer } from "components/ui/Map/AttractionsMapContainer";
import { SellOutLabel } from "components/ui/ProductLabels/ProductLabels";
import CustomNextDynamic from "lib/CustomNextDynamic";
import Information from "components/ui/Information/Information";
import ProductPropositions from "components/ui/ProductPropositions";
import ReviewSummary from "components/ui/ReviewSummary/ReviewSummary";
import Player from "components/ui/Player";
import ContentTemplates from "components/ui/ContentTemplates/ContentTemplates";
import IconList from "components/ui/IconList/IconList";
import { Content } from "components/ui/PageContentContainer";
import { LeftSectionHeading } from "components/ui/Section/SectionHeading";
import Section from "components/ui/Section/Section";
import SectionContent from "components/ui/Section/SectionContent";
import SectionParagraph from "components/ui/Section/SectionParagraph";
import { MobileContainer } from "components/ui/Grid/Container";
import ReviewsLoading from "components/features/Reviews/ReviewsLoading";
import SimilarProductsLoading from "components/ui/SimilarProducts/SimilarProductsLoading";
import LazyComponent, { LazyloadOffset } from "components/ui/Lazy/LazyComponent";
import { removeAt } from "utils/helperUtils";
import { Namespaces } from "shared/namespaces";
import { Trans, useTranslation } from "i18n";
import { gutters } from "styles/variables";
import LazyHydrateWrapper from "components/ui/LazyHydrateWrapper";
import ExpandableText from "components/ui/ExpandableText/ExpandableText";
import { useToursContext } from "components/contexts/Tours/ToursBookingWidgetSharedContext";
import { mqMin } from "styles/base";

const SectionParagraphStyled = styled(SectionParagraph)(css`
  margin-bottom: ${gutters.small / 2}px;
`);

const SimilarToursContainer = CustomNextDynamic(
  () => import("components/features/SimilarTours/SimilarToursContainer"),
  {
    ssr: false,
    loading: () => <SimilarProductsLoading />,
  }
);

const ReviewsContainer = CustomNextDynamic(
  () => import("components/features/Reviews/ReviewsContainer"),
  {
    ssr: false,
    loading: () => <ReviewsLoading />,
  }
);

const Translate = ({ children }: { children: ReactNode }) => (
  <Trans ns={Namespaces.tourNs}>{children}</Trans>
);

const PropositionWrapper = styled.div`
  margin-top: ${gutters.small / 2}px;
`;

const StyledSectionContent = styled(SectionContent)`
  margin-top: 0px;
  ${mqMin.large} {
    margin-top: 0px;
  }
`;

const StyledAdditionalInformationWrapper = styled.div`
  margin-top: ${gutters.large / 2}px;
`;

const StyledContentTemplateWrapper = styled.div`
  margin-top: ${gutters.large / 2}px;
`;

const TourContent = ({
  url,
  valuePropositions,
  images,
  reviewTotalScore,
  reviewTotalCount,
  tourSections,
  slug,
  activeLocale,
}: {
  url: string;
  valuePropositions: SharedTypes.ProductProp[];
  images: Image[];
  reviewTotalScore: number;
  reviewTotalCount: number;
  tourSections: ReadonlyArray<TourSection>;
  slug: string;
  activeLocale: string;
}) => {
  const isChineseLocale = activeLocale === "zh_CN";
  const { t } = useTranslation(Namespaces.tourNs);
  const {
    similarToursDateFrom,
    adults,
    childrenAges,
    similarToursDateTo,
    startingLocationId,
    startingLocationName,
  } = useToursContext();
  return (
    <Content data-testid="contentWrapper">
      <ImageGalleryCarousel
        images={images}
        leftTopContent={
          reviewTotalCount !== 0 && (
            <ReviewSummary
              reviewTotalScore={reviewTotalScore}
              reviewTotalCount={reviewTotalCount}
              isLink
            />
          )
        }
        leftBottomContent={<SellOutLabel isStatic />}
        affiliateURl={url}
        crop="center"
      />
      <PropositionWrapper>
        <ProductPropositions productProps={valuePropositions} useTruncationIcon={false} />
      </PropositionWrapper>
      {tourSections.map((tourSection: TourSection) => {
        switch (tourSection.kind) {
          case "information": {
            return (
              <Section key={tourSection.id} id={tourSection.id} isFirstSection>
                <MobileContainer>
                  <Information
                    id="tourInformation"
                    information={tourSection.information}
                    namespace={Namespaces.tourNs}
                    productSpecs={tourSection.specs}
                    handleParagraphs={false}
                    lineLimit={7}
                  />
                </MobileContainer>
              </Section>
            );
          }
          case "includedItems": {
            return (
              <LazyHydrateWrapper ssrOnly key={tourSection.id}>
                <Section id={tourSection.id}>
                  <MobileContainer>
                    <LeftSectionHeading>
                      <Translate>Included</Translate>
                    </LeftSectionHeading>
                    <StyledSectionContent>
                      <IconList sectionId={tourSection.id} iconList={tourSection.includedItems} />
                    </StyledSectionContent>
                  </MobileContainer>
                </Section>
              </LazyHydrateWrapper>
            );
          }
          case "activityItems": {
            return (
              <LazyHydrateWrapper whenVisible key={tourSection.id}>
                <Section id={tourSection.id}>
                  <MobileContainer>
                    <LeftSectionHeading>
                      <Translate>Activities</Translate>
                    </LeftSectionHeading>
                    <StyledSectionContent>
                      <IconList
                        sectionId={tourSection.id}
                        iconList={tourSection.activityItems}
                        iconLimit={30}
                        inGrid
                      />
                    </StyledSectionContent>
                  </MobileContainer>
                </Section>
              </LazyHydrateWrapper>
            );
          }
          case "attractionsItems": {
            return (
              <LazyHydrateWrapper whenVisible key={tourSection.id}>
                <StyledAttractionsMapContainer
                  attractions={tourSection.attractionsItems}
                  sectionId={tourSection.id}
                  map={tourSection.mapData}
                  attractionsTitle={t("Attractions")}
                />
              </LazyHydrateWrapper>
            );
          }
          case "itinerary": {
            const firstItineraryItem = tourSection.itinerary[0];
            const restOfItineraryItems = removeAt(0, tourSection.itinerary);
            return (
              <LazyHydrateWrapper whenVisible key={tourSection.id}>
                <ItineraryContainer
                  sectionId={tourSection.id}
                  slug={slug}
                  firstItineraryItem={firstItineraryItem}
                  restOfItineraryItems={restOfItineraryItems}
                />
              </LazyHydrateWrapper>
            );
          }
          case "shouldBringItems": {
            return (
              <LazyHydrateWrapper ssrOnly key={tourSection.id}>
                <Section id={tourSection.id}>
                  <MobileContainer>
                    <LeftSectionHeading>
                      <Translate>What to bring</Translate>
                    </LeftSectionHeading>
                    <StyledSectionContent>
                      <IconList
                        sectionId={tourSection.id}
                        iconList={tourSection.shouldBringItems}
                        columns={{ medium: 2 }}
                        inGrid
                      />
                    </StyledSectionContent>
                  </MobileContainer>
                </Section>
              </LazyHydrateWrapper>
            );
          }
          case "additionalInformation": {
            return (
              <LazyHydrateWrapper whenVisible key={tourSection.id}>
                <Section key={tourSection.id} id={tourSection.id}>
                  <MobileContainer>
                    <LeftSectionHeading>
                      <Translate>Good to know</Translate>
                    </LeftSectionHeading>
                    <StyledAdditionalInformationWrapper>
                      <ExpandableText
                        id={tourSection.id}
                        text={tourSection.additionalInformation}
                      />
                    </StyledAdditionalInformationWrapper>
                  </MobileContainer>
                </Section>
              </LazyHydrateWrapper>
            );
          }
          case "video": {
            return (
              !isChineseLocale && (
                <LazyHydrateWrapper whenVisible key={tourSection.id}>
                  <Section id={tourSection.id}>
                    <MobileContainer>
                      <LeftSectionHeading>
                        <Translate>Video</Translate>
                      </LeftSectionHeading>
                      <SectionContent>
                        <Player videoUrl={tourSection.videoUrl} />
                      </SectionContent>
                    </MobileContainer>
                  </Section>
                </LazyHydrateWrapper>
              )
            );
          }
          case "guides": {
            const firstGuide = tourSection.guides[0];
            const restOfGuides = removeAt(0, tourSection.guides);
            return (
              <LazyHydrateWrapper whenVisible key={tourSection.id}>
                <Section id={tourSection.id}>
                  <MobileContainer>
                    <LeftSectionHeading>
                      <Translate>Guides</Translate>
                    </LeftSectionHeading>
                    <SectionContent>
                      <Guide guide={firstGuide} />
                    </SectionContent>
                  </MobileContainer>
                </Section>
                {restOfGuides.map((guide: Guide) => (
                  <Section key={guide.id}>
                    <MobileContainer>
                      <Guide guide={guide} />
                    </MobileContainer>
                  </Section>
                ))}
              </LazyHydrateWrapper>
            );
          }
          case "reviews": {
            return (
              <Section key={tourSection.id} id={tourSection.id} hasAnchorTarget>
                <MobileContainer>
                  <LeftSectionHeading>
                    <Trans ns={Namespaces.commonNs}>Verified reviews</Trans>
                  </LeftSectionHeading>
                  <SectionContent>
                    <LazyComponent lazyloadOffset={LazyloadOffset.Medium}>
                      <ReviewsContainer
                        slug={slug}
                        type="tour"
                        reviewTotalScore={tourSection.reviewTotalScore}
                        reviewTotalCount={tourSection.reviewTotalCount}
                      />
                    </LazyComponent>
                  </SectionContent>
                </MobileContainer>
              </Section>
            );
          }
          case "similarTours": {
            return (
              <Section key={tourSection.id} id={tourSection.id}>
                <MobileContainer>
                  <LeftSectionHeading>
                    <Translate>Similar tours</Translate>
                  </LeftSectionHeading>
                  <SectionContent>
                    <LazyComponent lazyloadOffset={LazyloadOffset.Medium}>
                      <SimilarToursContainer
                        slug={slug}
                        dateFrom={similarToursDateFrom}
                        adults={adults}
                        dateTo={similarToursDateTo}
                        childrenAges={childrenAges}
                        startingLocationId={startingLocationId}
                        startingLocationName={startingLocationName}
                      />
                    </LazyComponent>
                  </SectionContent>
                </MobileContainer>
              </Section>
            );
          }
          case "contentTemplate": {
            const columns = () => {
              if (tourSection.contentTemplate.items.length === 1) return 1;
              if (tourSection.contentTemplate.items.length % 2 === 0) return 2;
              return 3;
            };
            return (
              <Section id={tourSection.id} key={tourSection.id}>
                <MobileContainer>
                  <LazyHydrateWrapper ssrOnly>
                    <LeftSectionHeading>{tourSection.contentTemplate.name}</LeftSectionHeading>
                  </LazyHydrateWrapper>
                  <StyledContentTemplateWrapper>
                    {Boolean(tourSection.contentTemplate.information?.length) && (
                      <LazyHydrateWrapper ssrOnly>
                        {tourSection.contentTemplate.information
                          .replace(/(\n|\r|\r\n)+/g, "\n")
                          .split(/\n/)
                          .map((text, index) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <SectionParagraphStyled key={index}>{text}</SectionParagraphStyled>
                          ))}
                      </LazyHydrateWrapper>
                    )}
                    <LazyHydrateWrapper whenVisible>
                      <ContentTemplates
                        id={tourSection.id}
                        items={tourSection.contentTemplate.items}
                        columns={{ medium: columns() }}
                      />
                    </LazyHydrateWrapper>
                  </StyledContentTemplateWrapper>
                </MobileContainer>
              </Section>
            );
          }
          default:
            return null;
        }
      })}
    </Content>
  );
};

export default TourContent;
