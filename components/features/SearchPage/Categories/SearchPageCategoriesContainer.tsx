import React, { ReactElement } from "react";
import styled from "@emotion/styled";
import { useQuery } from "@apollo/react-hooks";

import CategoryOverviewQuery from "./CategoryOverviewQuery.graphql";

import { AntiSectionHeading } from "components/ui/Section/SectionHeading";
import SectionSubHeading from "components/ui/Section/SectionSubHeading";
import Section from "components/ui/Section/Section";
import CategoryCover, { CategoryCoverSkeleton } from "components/ui/CategoryCover/CategoryCover";
import { gutters } from "styles/variables";
import { Trans } from "i18n";
import { Namespaces } from "shared/namespaces";

const CategoryContainer = styled.div`
  margin-top: ${gutters.large}px;
`;

export const constructCategories = (
  queryCategories: SearchPageTypes.QueryCategory[]
): SearchPageTypes.Category[] =>
  queryCategories.map(({ id, name, tours, image, subCategories, url }) => ({
    id,
    name,
    tours,
    image: {
      id: image.name || "",
      url: image.url,
      name: image.name,
    },
    url,
    subCategories: subCategories ? constructCategories(subCategories) : [],
  }));

const SearchPageCategoriesContainer = ({ fallback = null }: { fallback?: ReactElement | null }) => {
  const { data, loading, error } =
    useQuery<SearchPageTypes.QueryCategoryOverview>(CategoryOverviewQuery);

  if (loading || error || !data) return fallback;

  const categories = constructCategories(data.categoryOverview);

  return (
    <Section>
      <AntiSectionHeading>
        <Trans ns={Namespaces.tourSearchNs}>We offer so much more</Trans>
      </AntiSectionHeading>
      <SectionSubHeading>
        <Trans ns={Namespaces.tourSearchNs}>
          Explore an unequalled wealth of tours and packages
        </Trans>
      </SectionSubHeading>

      {
        // this is possible because SearchPageCategoriesContainer is wrapped with OnDemand
        typeof window === "undefined"
          ? categories.map(category => (
              <CategoryContainer key={category.id}>
                <CategoryCoverSkeleton category={category} />
              </CategoryContainer>
            ))
          : categories.map(category => (
              <CategoryContainer key={category.id}>
                <CategoryCover category={category} />
              </CategoryContainer>
            ))
      }
    </Section>
  );
};

export default SearchPageCategoriesContainer;
