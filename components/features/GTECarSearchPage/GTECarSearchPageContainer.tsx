import React, { useMemo } from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import { useRouter } from "next/router";

import AdminGearLoader from "../AdminGear/AdminGearLoader";

import GTECarLandingPageContentContainer from "./GTECarLandingPageContentContainer";
import { doesCarPageHasFilters } from "./utils/carSearchPageUtils";

import { defaultCarSEOImage } from "components/ui/LandingPages/utils/landingPageUtils";
import CarSearchContainer from "components/features/CarSearchPage/CarSearchContainer";
import { cleanAsPathWithLocale } from "utils/routerUtils";
import useCarSearchQueryParams from "components/features/CarSearchPage/useCarSearchQueryParams";
import { container } from "styles/base";
import { gutters } from "styles/variables";
import LandingPageBreadcrumbs from "components/ui/LandingPages/LandingPageBreadcrumbs";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import LandingPageSEOContainer from "components/ui/LandingPages/LandingPageSEOContainer";
import { getSearchBreadcrumbsConditions } from "components/ui/Search/utils/sharedSearchUtils";
import { GraphCMSPageType } from "types/enums";

const Container = styled.div([
  container,
  css`
    display: flex;
    flex-direction: column;
    margin-bottom: ${gutters.small / 2}px;
  `,
]);

const GTECarSearchPageContainer = ({
  queryCondition,
}: {
  queryCondition: LandingPageTypes.LandingPageQueryCondition;
}) => {
  const { t } = useTranslation(Namespaces.commonSearchNs);
  const { asPath } = useRouter();
  const [{ dateFrom, dateTo, pickupId, dropoffId, orderBy, carLocationType }] =
    useCarSearchQueryParams();
  const hasFilters = doesCarPageHasFilters({
    dateFrom,
    dateTo,
    pickupId,
    dropoffId,
    orderBy,
  });
  const searchBreadcrumbsConditions = useMemo(
    () => getSearchBreadcrumbsConditions(GraphCMSPageType.Cars, pickupId, carLocationType),
    [pickupId, carLocationType]
  );
  return hasFilters ? (
    <>
      <LandingPageSEOContainer
        queryCondition={queryCondition}
        isIndexed={false}
        ogImages={[defaultCarSEOImage]}
        funnelType={GraphCMSPageType.Cars}
      />
      <Container data-testid="carSearchResultGTE">
        <LandingPageBreadcrumbs
          queryCondition={searchBreadcrumbsConditions || queryCondition}
          customLastBreadcrumb={t("Search results")}
        />
        <CarSearchContainer slug="" carProductUrl={`${cleanAsPathWithLocale(asPath)}/details`} />
      </Container>
      <AdminGearLoader hideCommonLinks />
    </>
  ) : (
    <GTECarLandingPageContentContainer queryCondition={queryCondition} />
  );
};

export default GTECarSearchPageContainer;
