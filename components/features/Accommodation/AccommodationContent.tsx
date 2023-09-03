import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { useStayBookingWidgetContext } from "../StayProductPage/StayBookingWidget/StayBookingWidgetStateContext";
import StayRoomsSection from "../StayProductPage/StayRoomsSection";

import AccommodationCover from "./AccommodationCover/AccommodationCover";

import AttractionsMapContainer from "components/ui/Map/AttractionsMapContainer";
import LazyHydrateWrapper from "components/ui/LazyHydrateWrapper";
import CustomNextDynamic from "lib/CustomNextDynamic";
import ProductPropositions from "components/ui/ProductPropositions";
import Information from "components/ui/Information/Information";
import IconList from "components/ui/IconList/IconList";
import { Content } from "components/ui/PageContentContainer";
import SectionContent from "components/ui/Section/SectionContent";
import { LeftSectionHeading } from "components/ui/Section/SectionHeading";
import Section from "components/ui/Section/Section";
import SimilarProductsLoading from "components/ui/SimilarProducts/SimilarProductsLoading";
import { MobileContainer } from "components/ui/Grid/Container";
import { Trans, useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import ReviewsLoading from "components/features/Reviews/ReviewsLoading";
import { gutters } from "styles/variables";
import { getTotalGuests } from "components/ui/RoomAndGuestPicker/utils/roomAndGuestUtils";
import { mqMin, skeletonPulse } from "styles/base";

const HeadlineLoading = styled.div([
  skeletonPulse,
  css`
    width: 120px;
    height: 20px;
  `,
]);
const NearbySectionLoading = () => {
  return (
    <Section id="nearby-accommodation">
      <MobileContainer>
        <LeftSectionHeading>
          <HeadlineLoading />
        </LeftSectionHeading>
        <SectionContent>
          <SimilarProductsLoading height={424} />
        </SectionContent>
      </MobileContainer>
    </Section>
  );
};

const SimilarAccommodationsContainer = CustomNextDynamic(
  () =>
    import(
      "components/features/Accommodation/SimilarAccommodations/SimilarAccommodationsContainer"
    ),
  {
    ssr: false,
    loading: () => <NearbySectionLoading />,
  }
);

const ReviewsContainer = CustomNextDynamic(
  () => import("components/features/Reviews/ReviewsContainer"),
  {
    ssr: false,
    loading: () => <ReviewsLoading />,
  }
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

const AccommodationContent = ({
  cover,
  url,
  slug,
  category,
  accommodationSections,
  props,
  specs,
  reviewTotalCount,
  reviewTotalScore,
  showReviews,
  staticRooms,
}: {
  slug: string;
  url: string;
  cover: AccommodationTypes.Cover;
  category: AccommodationTypes.Category;
  accommodationSections: ReadonlyArray<AccommodationTypes.AccommodationSection>;
  props: SharedTypes.ProductProp[];
  specs: SharedTypes.ProductSpec[];
  reviewTotalCount: number;
  reviewTotalScore: number;
  showReviews: boolean;
  staticRooms: StayBookingWidgetTypes.StaticRoom[];
}) => {
  const { t } = useTranslation(Namespaces.accommodationNs);
  const { selectedDates, occupancies } = useStayBookingWidgetContext();
  const totalGuests = getTotalGuests(occupancies);
  return (
    <Content>
      <AccommodationCover
        url={url}
        cover={cover}
        reviewTotalCount={reviewTotalCount}
        reviewTotalScore={reviewTotalScore}
        showReviews={showReviews}
      />
      <PropositionWrapper>
        <ProductPropositions productProps={props} useTruncationIcon={false} />
      </PropositionWrapper>
      {accommodationSections.map(
        (accommodationSection: AccommodationTypes.AccommodationSection) => {
          switch (accommodationSection.kind) {
            case "information": {
              return (
                <Section key={accommodationSection.id} id={accommodationSection.id} isFirstSection>
                  <MobileContainer>
                    <Information
                      id="staysInformation"
                      information={accommodationSection.information}
                      productSpecs={specs}
                      namespace={Namespaces.accommodationNs}
                      lineLimit={3}
                    />
                  </MobileContainer>
                </Section>
              );
            }
            case "amenitiesItems": {
              return (
                <Section id={accommodationSection.id}>
                  <MobileContainer>
                    <LeftSectionHeading>
                      <Trans ns={Namespaces.accommodationNs}>Amenities</Trans>
                    </LeftSectionHeading>
                    <StyledSectionContent>
                      <IconList
                        sectionId={accommodationSection.id}
                        iconList={accommodationSection.amenitiesItems}
                        iconLimit={8}
                        inGrid
                      />
                    </StyledSectionContent>
                  </MobileContainer>
                </Section>
              );
            }
            case "nearbyItems": {
              return (
                <LazyHydrateWrapper whenVisible key={accommodationSection.id}>
                  <AttractionsMapContainer
                    attractions={accommodationSection.nearbyItems}
                    sectionId={accommodationSection.id}
                    map={accommodationSection.mapData}
                    attractionsTitle={t("Attractions nearby")}
                  />
                </LazyHydrateWrapper>
              );
            }
            case "rooms": {
              return <StayRoomsSection staticRooms={staticRooms} />;
            }
            case "reviews": {
              return showReviews ? (
                <Section key={accommodationSection.id} id={accommodationSection.id} hasAnchorTarget>
                  <MobileContainer>
                    <LeftSectionHeading>
                      <Trans ns={Namespaces.commonNs}>Verified reviews</Trans>
                    </LeftSectionHeading>
                    <SectionContent>
                      <ReviewsContainer
                        slug={slug}
                        type="hotel"
                        reviewTotalScore={accommodationSection.reviewTotalScore}
                        reviewTotalCount={accommodationSection.reviewTotalCount}
                      />
                    </SectionContent>
                  </MobileContainer>
                </Section>
              ) : null;
            }
            case "similarAccommodations": {
              return (
                <Section id={accommodationSection.id} key={accommodationSection.id}>
                  <MobileContainer>
                    <SectionContent>
                      <SimilarAccommodationsContainer
                        slug={slug}
                        categoryName={category.name}
                        dateFrom={selectedDates.from}
                        dateTo={selectedDates.to}
                        roomsCount={occupancies.length}
                        adultsCount={totalGuests.numberOfAdults}
                        childrenCount={totalGuests.childrenAges.length}
                        childrenAges={totalGuests.childrenAges}
                      />
                    </SectionContent>
                  </MobileContainer>
                </Section>
              );
            }
            default:
              return null;
          }
        }
      )}
    </Content>
  );
};

export default AccommodationContent;
