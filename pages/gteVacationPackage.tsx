import React from "react";
import { NextPageContext } from "next";
import getConfig from "next/config";
import { NextRouter } from "next/router";

import FlightGetLocationsQuery from "../components/ui/FlightSearchWidget/queries/FlightLocations.graphql";
import CountryListQuery from "../hooks/queries/CountryListQuery.graphql";
import { useSettings } from "../contexts/SettingsContext";
import useActiveLocale from "../hooks/useActiveLocale";
import { constructQueryFromSelectedDates } from "../components/ui/DatePicker/utils/datePickerUtils";

import CarSubTypesQuery from "components/features/VacationPackageProductPage/VPCarSection/queries/CarSubTypesQuery.graphql";
import LandingPageBreadcrumbsQuery from "components/ui/LandingPages/queries/LandingPageBreadcrumbsQuery.graphql";
import {
  constructVacationPackageContent,
  getVacationPackageDatesWithDefault,
  getVPLandingUrl,
  getVPQueryParamsString,
} from "components/features/VacationPackageProductPage/utils/vacationPackageUtils";
import {
  getVacationPackageProductBreadcrumbsQueryCondition,
  getVacationPackageQueryCondition,
} from "components/features/VacationPackages/utils/vacationPackagesUtils";
import {
  getLanguageFromContext,
  getMarketplaceFromCtx,
  getQueryParamsViaLayer0,
  longCacheHeaders,
} from "utils/apiUtils";
import { getClientSideUrl, normalizeGraphCMSLocale } from "utils/helperUtils";
import { asPathWithoutQueryParams, cleanAsPathWithLocale } from "utils/routerUtils";
import Header from "components/features/Header/MainHeader";
import { Namespaces } from "shared/namespaces";
import VPContainer from "components/features/VacationPackageProductPage/VPContainer";
import { Direction, FlightFunnelType, PageType } from "types/enums";
import VacationPackageContentQuery from "components/features/VacationPackageProductPage/queries/VacationPackageContentQuery.graphql";
import { ContactUsMobileMargin } from "components/features/ContactUs/ContactUsButton";
import QueryParamProvider from "components/ui/Filters/QueryParamProvider";
import { useTranslation } from "i18n";
import useVacationPackageContentQuery, {
  getVPContentQueryVariables,
} from "components/features/VacationPackageProductPage/hooks/useVacationPackageContentQuery";
import VPPreviewContentQuery from "components/features/VacationPackageProductPage/queries/VPPreviewContentQuery.graphql";

const { CLIENT_API_URI, CLIENT_API_PROTOCOL } = getConfig().publicRuntimeConfig;

const VacationPackagePage = ({
  title,
  queryCondition,
  isPreview,
}: {
  title: string;
  queryCondition: LandingPageTypes.LandingPageQueryCondition;
  isPreview: boolean;
}) => {
  const { t: vacationPackageNs } = useTranslation(Namespaces.vacationPackageNs);
  const { marketplaceUrl } = useSettings();
  const locale = useActiveLocale();
  const { vpContent, vpContentQueryLoading, vpContentQueryError, hreflangs, isVpDataOk, cartLink } =
    useVacationPackageContentQuery({ isPreview, queryCondition, locale });
  const vpContentResult = isVpDataOk
    ? constructVacationPackageContent(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        vpContent!,
        vacationPackageNs,
        marketplaceUrl
      )
    : undefined;

  return (
    <>
      <Header gteLocaleLinks={hreflangs} />
      <QueryParamProvider>
        <VPContainer
          title={title}
          vpContentResult={vpContentResult}
          vpContentQueryLoading={vpContentQueryLoading}
          vpContentQueryError={vpContentQueryError}
          hreflangs={hreflangs}
          cartLink={cartLink}
          isPreview={isPreview}
        />
      </QueryParamProvider>
    </>
  );
};

VacationPackagePage.getInitialProps = async (ctx: NextPageContext) => {
  const locale = getLanguageFromContext(ctx);
  const { asPath } = ctx;
  const normalizesAsPath = cleanAsPathWithLocale(asPath);
  const isPreview = asPath?.includes("preview");
  const { title, section, id } = getQueryParamsViaLayer0(ctx);
  const queryCondition = getVacationPackageQueryCondition(normalizesAsPath);
  const previewQueryCondition = { id: id || "" };
  const namespacesRequired = [
    Namespaces.vacationPackageNs,
    Namespaces.commonNs,
    Namespaces.headerNs,
    Namespaces.footerNs,
    Namespaces.commonBookingWidgetNs,
    Namespaces.tourNs,
    Namespaces.reviewsNs,
    Namespaces.carnectNs,
    Namespaces.flightSearchNs,
    Namespaces.accommodationNs,
    Namespaces.commonCarNs,
  ];

  return {
    title,
    section,
    namespacesRequired,
    queryCondition: isPreview ? previewQueryCondition : queryCondition,
    isPreview,
    queries: [
      ...(isPreview
        ? [
            {
              query: VPPreviewContentQuery,
              variables: {
                where: previewQueryCondition,
              },
              isRequiredForPageRendering: true,
            },
          ]
        : [
            {
              query: VacationPackageContentQuery,
              variables: getVPContentQueryVariables(queryCondition, locale),
              isRequiredForPageRendering: true,
              // return redirect in case VP has isDeleted flag
              onCompleted: (vpContentQueryResult: {
                data: VacationPackageTypes.QueryVacationPackage;
              }) => {
                const data = vpContentQueryResult?.data?.vacationPackagesProductPages?.[0];

                if (!ctx.res || !data || !data?.isDeleted) return;

                const {
                  originId,
                  destinationId,
                  destinationName,
                  origin,
                  driverCountryCode,
                  occupancies,
                  dateFrom,
                  dateTo,
                } = getQueryParamsViaLayer0(ctx);
                const occupanciesArray = occupancies?.split(",");
                const marketplace = getMarketplaceFromCtx(ctx);
                const vpSearchBaseUrl = getClientSideUrl(
                  "vacationPackages" as PageType,
                  locale,
                  marketplace
                );
                const marketplaceUrl = `${CLIENT_API_PROTOCOL}://${CLIENT_API_URI}`;
                const queryParams = getVPQueryParamsString({
                  ...constructQueryFromSelectedDates(
                    getVacationPackageDatesWithDefault({
                      dateFrom,
                      dateTo,
                      vacationLength: Number(data.dayData?.[0].days || 0),
                      cheapestMonth: data.cheapestMonth,
                    })
                  ),
                  originId,
                  originCountryId: driverCountryCode!,
                  originName: origin,
                  destinationId,
                  destinationName,
                  occupancies: occupanciesArray,
                });

                const redirectUrl = getVPLandingUrl(
                  vpSearchBaseUrl,
                  marketplaceUrl,
                  { asPath: ctx.asPath } as NextRouter,
                  queryParams
                );

                ctx.res.writeHead(302, {
                  Location: redirectUrl,
                  "x-0-surrogate-key": asPathWithoutQueryParams(ctx.asPath ?? "redirect"),
                });
                ctx.res.end();
              },
            },
          ]),
      ...(!isPreview
        ? [
            {
              query: LandingPageBreadcrumbsQuery,
              variables: {
                where: getVacationPackageProductBreadcrumbsQueryCondition(asPath || ""),
                locale: normalizeGraphCMSLocale(locale),
              },
              isRequiredForPageRendering: false,
            },
          ]
        : []),
      {
        query: CarSubTypesQuery,
      },
      {
        query: FlightGetLocationsQuery,
        variables: {
          input: {
            searchQuery: "",
            type: "From",
            funnel: FlightFunnelType.VACATION_PACKAGE,
          },
        },
      },
      {
        query: FlightGetLocationsQuery,
        variables: {
          input: {
            searchQuery: "",
            type: "To",
            funnel: FlightFunnelType.FLIGHT,
          },
        },
      },
      {
        query: CountryListQuery,
        variables: {
          locale,
        },
        context: {
          headers: longCacheHeaders,
        },
      },
    ],
    contactUsButtonPosition: Direction.Left,
    contactUsMobileMargin: ContactUsMobileMargin.WithoutFooter,
  };
};

export default VacationPackagePage;
