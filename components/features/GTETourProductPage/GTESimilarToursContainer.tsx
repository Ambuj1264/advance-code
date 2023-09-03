import React from "react";

import { useTranslation } from "i18n";
import Section from "components/ui/Section/Section";
import SectionContent from "components/ui/Section/SectionContent";
import SimilarProducts from "components/ui/SimilarProducts/SimilarProducts";
import SimilarProductsLoading from "components/ui/SimilarProducts/SimilarProductsLoading";
import { MobileContainer } from "components/ui/Grid/Container";
import { LeftSectionHeading } from "components/ui/Section/SectionHeading";
import { PageType } from "types/enums";
import { Namespaces } from "shared/namespaces";

const GTESimilarToursSection = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation(Namespaces.tourNs);
  return (
    <Section id="similarTours" key="similarTours">
      <MobileContainer>
        <LeftSectionHeading>{t("Similar tours")}</LeftSectionHeading>
        <SectionContent>{children}</SectionContent>
      </MobileContainer>
    </Section>
  );
};

const GTESimilarTours = ({
  searchUrl,
  similarTours,
  similarToursLoading,
}: {
  searchUrl: string;
  similarToursLoading: boolean;
  similarTours: SharedTypes.SimilarProduct[];
}) => {
  if (similarToursLoading)
    return (
      <GTESimilarToursSection>
        <SimilarProductsLoading />
      </GTESimilarToursSection>
    );

  return (
    <GTESimilarToursSection>
      <SimilarProducts
        seeMoreLink={searchUrl}
        similarProducts={similarTours || []}
        searchPageType={PageType.GTE_TOUR_SEARCH}
      />
    </GTESimilarToursSection>
  );
};

export default GTESimilarTours;
