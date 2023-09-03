import React from "react";
import styled from "@emotion/styled";

import Information from "./Information";
import CarRibbon from "./CarRibbon/CarRibbon";
import ItemsListContainer from "./ItemsList/ItemsListContainer";
import SimilarCars from "./SimilarCars";
import CarInsuranceContent from "./CarInsurance/CarInsuranceContent";
import CarLocationDetailsContainer from "./CarLocationDetails/CarLocationDetailsContainer";
import CarRentalInformation from "./CarRentalInformation";

import InformationListContainer from "components/ui/InformationListContainer";
import ImageGalleryCarousel from "components/ui/ImageCarousel/ImageGalleryCarousel";
import { SellOutLabel } from "components/ui/ProductLabels/ProductLabels";
import { fontWeightSemibold, gutters } from "styles/variables";
import CustomNextDynamic from "lib/CustomNextDynamic";
import ProductPropositions from "components/ui/ProductPropositions";
import QuickFacts from "components/ui/Information/QuickFacts";
import SectionContent from "components/ui/Section/SectionContent";
import Section from "components/ui/Section/Section";
import { LeftSectionHeading } from "components/ui/Section/SectionHeading";
import { MobileContainer } from "components/ui/Grid/Container";
import { Namespaces } from "shared/namespaces";
import { useTranslation, Trans } from "i18n";
import ReviewsLoading from "components/features/Reviews/ReviewsLoading";
import ReviewSummary from "components/ui/ReviewSummary/ReviewSummary";
import LazyComponent, { LazyloadOffset } from "components/ui/Lazy/LazyComponent";
import InformationOverflow from "components/ui/Information/InformationOverflow";
import { Content } from "components/ui/PageContentContainer";
import EstablishmentInfo, {
  EstablishmentName,
  Label as EstablishmentLabel,
} from "components/ui/Search/EstablishmentInfo";
import { typographyBody2 } from "styles/typography";

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

const StyledEstablishmentInfo = styled(EstablishmentInfo)`
  ${EstablishmentName} {
    font-weight: ${fontWeightSemibold};
  }
  ${EstablishmentLabel} {
    ${typographyBody2}
  }
`;

const CarContent = ({
  car,
  includedItems,
  availableInsurancesItems,
  availableExtrasItems,
  similarCarsProps,
  deposit,
  isCarnect,
  activeLocale,
  searchCategory,
  searchPageUrl,
  className,
  isModalView = false,
  useAlternateStaticImageOnly = false,
}: {
  car: CarTypes.Car;
  includedItems: SharedTypes.Icon[];
  availableInsurancesItems: SharedTypes.Icon[];
  availableExtrasItems: SharedTypes.Icon[];
  deposit?: string;
  similarCarsProps?: CarTypes.SimilarCarsProps;
  isCarnect: boolean;
  activeLocale: string;
  searchCategory?: CarTypes.SearchCategory;
  searchPageUrl?: string;
  className?: string;
  isModalView?: boolean;
  useAlternateStaticImageOnly?: boolean;
}) => {
  const { t } = useTranslation(Namespaces.commonCarNs);
  const {
    cover,
    valuePropositions,
    reviewTotalScore,
    reviewTotalCount,
    establishment,
    quickFacts,
    productInformation,
    locationDetails,
    insuranceInformation,
  } = car;

  return (
    <Content className={className}>
      <ImageGalleryCarousel
        backgroundColor="transparent"
        images={cover.images}
        fallBackImg={cover.fallBackImg}
        leftTopContent={
          reviewTotalCount !== 0 &&
          !isModalView && (
            <ReviewSummary
              reviewTotalScore={reviewTotalScore}
              reviewTotalCount={reviewTotalCount}
              isLink={!isCarnect}
            />
          )
        }
        leftBottomContent={
          isModalView ? (
            <StyledEstablishmentInfo name={establishment.name} image={establishment.image} />
          ) : (
            <SellOutLabel isStatic />
          )
        }
        rightTopContent={<CarRibbon discount={car.discountPercent} />}
        isFullWidth={false}
        crop="center"
        shouldShowModalGallery={!isModalView}
      />
      {!isModalView && (
        <PropositionWrapper>
          <ProductPropositions productProps={valuePropositions} maxDesktopColumns={4} />
        </PropositionWrapper>
      )}

      <Section isFirstSection>
        <QuickFacts quickFacts={quickFacts} namespace={Namespaces.commonCarNs} fullWidth />
      </Section>
      {includedItems.length > 0 && (
        <Section key="includedItems">
          <MobileContainer>
            <LeftSectionHeading>
              <Trans ns={Namespaces.commonCarNs}>Included</Trans>
            </LeftSectionHeading>
            <InformationListContainer informationList={includedItems} />
          </MobileContainer>
        </Section>
      )}
      {insuranceInformation && (
        <Section key="insuranceInformation">
          <MobileContainer>
            <LeftSectionHeading>{insuranceInformation.policyName}</LeftSectionHeading>
            <SectionContent>
              <InformationOverflow id="insurancePolicy">
                <CarInsuranceContent insuranceInfo={insuranceInformation} />
              </InformationOverflow>
            </SectionContent>
          </MobileContainer>
        </Section>
      )}
      {availableInsurancesItems.length > 0 && (
        <Section key="availableInsurancesItems">
          <MobileContainer>
            <LeftSectionHeading>
              <Trans ns={Namespaces.commonCarNs}>Available Insurances</Trans>
            </LeftSectionHeading>
            <ItemsListContainer
              itemsList={availableInsurancesItems}
              sectionId="availableInsurancesItems"
              initialTitle={t("Available Insurances")}
            />
          </MobileContainer>
        </Section>
      )}
      {availableExtrasItems.length > 0 && (
        <Section key="availableExtrasItems">
          <MobileContainer>
            <LeftSectionHeading>
              <Trans ns={Namespaces.commonCarNs}>Available Extras</Trans>
            </LeftSectionHeading>
            <ItemsListContainer
              itemsList={availableExtrasItems}
              sectionId="availableExtrasItems"
              initialTitle={t("Available Extras")}
            />
          </MobileContainer>
        </Section>
      )}
      {isCarnect && (
        <MobileContainer>
          <CarLocationDetailsContainer
            locationDetails={locationDetails}
            activeLocale={activeLocale}
            useAlternateStaticImageOnly={useAlternateStaticImageOnly}
          />
        </MobileContainer>
      )}
      {deposit && (
        <Section key="depositInformation">
          <MobileContainer>
            <LeftSectionHeading>
              <Trans ns={Namespaces.commonCarNs}>Deposit</Trans>
            </LeftSectionHeading>
            <SectionContent>
              <Information content={deposit} />
            </SectionContent>
          </MobileContainer>
        </Section>
      )}
      {productInformation && (
        <CarRentalInformation
          productInformation={productInformation}
          establishmentName={establishment.name}
        />
      )}
      {!isModalView && !isCarnect && (
        <Section key="reviews" id="reviews" hasAnchorTarget>
          <MobileContainer>
            <LeftSectionHeading>
              <Trans
                ns={Namespaces.commonCarNs}
                i18nKey="Reviews about {establishmentName}"
                defaults="Reviews about {establishmentName}"
                values={{ establishmentName: establishment.name }}
              />
            </LeftSectionHeading>
            <SectionContent>
              <LazyComponent lazyloadOffset={LazyloadOffset.None}>
                <ReviewsContainer
                  id={Number(car.establishment.id)}
                  type="establishment"
                  reviewTotalScore={reviewTotalScore}
                  reviewTotalCount={reviewTotalCount}
                  reviewsLogo={car.establishment.image}
                />
              </LazyComponent>
            </SectionContent>
          </MobileContainer>
        </Section>
      )}
      {similarCarsProps && (
        <SimilarCars
          similarCarsProps={similarCarsProps}
          searchCategory={searchCategory}
          searchPageUrl={searchPageUrl}
        />
      )}
    </Content>
  );
};

export default CarContent;
