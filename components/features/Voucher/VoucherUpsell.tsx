import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { UpsellProductType } from "./types/VoucherEnums";
import LoadingVoucherUpsell from "./LoadingVoucherUpsell";

import { Namespaces } from "shared/namespaces";
import ImageCategoriesGrid from "components/ui/ImageCategoriesGrid";
import useCountry from "hooks/useCountry";
import { Marketplace, PageType } from "types/enums";
import { useSettings } from "contexts/SettingsContext";
import { DefaultMarginBottom, hideDuringPrint } from "styles/base";
import { useTranslation } from "i18n";
import { getImgixImageFromGraphCMS } from "utils/imageUtils";

const StyledImageCategoriesGrid = styled(ImageCategoriesGrid)([
  hideDuringPrint,
  DefaultMarginBottom,
  css`
    h2 {
      text-align: left;
    }
  `,
]);

const StyledLoadingImageCategoriesGrid = styled(LoadingVoucherUpsell)([
  hideDuringPrint,
  DefaultMarginBottom,
]);

const upsellItemsByProductType = (items: VoucherTypes.VoucherUpsellsQuery["voucherUpsellItems"]) =>
  items.reduce((acc, item) => {
    // eslint-disable-next-line functional/immutable-data
    acc[item.upsellProductType] = item;
    return acc;
  }, {} as { [key in UpsellProductType]?: VoucherTypes.VoucherUpsellItem });

const VoucherUpsell = ({
  items,
  voucherData,
  flightSearchBaseUrl,
  tourSearchBaseUrl,
  accommodationSearchBaseUrl,
  carSearchBaseUrl,
  vacationPackagesSlug,
  isVoucherUpsellLoading,
  isVoucherUpsellError,
}: {
  items?: VoucherTypes.VoucherUpsellsQuery["voucherUpsellItems"];
  voucherData: VoucherTypes.VoucherQuery["voucher"] | VoucherTypes.GTEVoucherQuery["voucher"];
  flightSearchBaseUrl: string;
  tourSearchBaseUrl: string;
  accommodationSearchBaseUrl: string;
  carSearchBaseUrl?: string;
  vacationPackagesSlug?: string;
  isVoucherUpsellLoading?: boolean;
  isVoucherUpsellError: boolean;
}) => {
  const { t } = useTranslation(Namespaces.voucherNs);
  const { country: countryName, countryCode } = useCountry();
  const { marketplace } = useSettings();
  const isGTE = marketplace === Marketplace.GUIDE_TO_EUROPE;
  const isGTTP = marketplace === Marketplace.GUIDE_TO_THE_PHILIPPINES;
  const columnSizes = { small: 1 / 4, large: 1 / 4, desktop: 1 / 4 };
  const cardHeight = 144;

  if (isGTE || isVoucherUpsellError) return null;

  if (isVoucherUpsellLoading) {
    return <StyledLoadingImageCategoriesGrid cardHeight={cardHeight} columnSizes={columnSizes} />;
  }

  const marketplaceImageKey = isGTTP ? "gttpUpsellImage" : "upsellImage";
  const country = countryCode === "PH" ? `the ${countryName}` : countryName;

  const upsellItemsByType = items ? upsellItemsByProductType(items) : undefined;
  const categories: SharedTypes.PageCategoryItemType[] = upsellItemsByType
    ? [
        ...(!(voucherData as VoucherTypes.VoucherData).stays.length && upsellItemsByType.stay
          ? [
              {
                id: 0,
                title: t(upsellItemsByType.stay.title.value, { country }),
                uri: `/${accommodationSearchBaseUrl}`,
                isLegacy: false,
                pageType: PageType.ACCOMMODATION_SEARCH,
                image: {
                  id: upsellItemsByType.stay[marketplaceImageKey].id,
                  url:
                    getImgixImageFromGraphCMS({
                      id: upsellItemsByType.stay[marketplaceImageKey].id,
                      handle: upsellItemsByType.stay[marketplaceImageKey].handle,
                    })?.url ?? upsellItemsByType.stay[marketplaceImageKey].url,
                },
                clientRoute: {
                  route: `/${PageType.ACCOMMODATION_SEARCH}`,
                  as: `/${accommodationSearchBaseUrl}`,
                },
              },
            ]
          : []),
        ...(!(voucherData as VoucherTypes.VoucherData)?.tours?.length &&
        upsellItemsByType.tour &&
        upsellItemsByType.vacationPackage
          ? [
              {
                id: 1,
                title: t(upsellItemsByType.tour.title.value, { country }),
                uri: `/${tourSearchBaseUrl}`,
                isLegacy: false,
                pageType: PageType.TOURSEARCH,
                image: {
                  id: upsellItemsByType.tour[marketplaceImageKey].id,
                  url:
                    getImgixImageFromGraphCMS({
                      id: upsellItemsByType.tour[marketplaceImageKey].id,
                      handle: upsellItemsByType.tour[marketplaceImageKey].handle,
                    })?.url ?? upsellItemsByType.tour[marketplaceImageKey].url,
                },
                clientRoute: {
                  route: `/${PageType.TOURSEARCH}`,
                  as: `/${tourSearchBaseUrl}`,
                },
              },
              {
                id: 2,
                title: t(upsellItemsByType.vacationPackage.title.value, {
                  country,
                }),
                uri: `/${tourSearchBaseUrl}/${vacationPackagesSlug}`,
                isLegacy: false,
                pageType: PageType.TOURCATEGORY,
                image: {
                  id: upsellItemsByType.vacationPackage[marketplaceImageKey].id,
                  url:
                    getImgixImageFromGraphCMS({
                      id: upsellItemsByType.vacationPackage[marketplaceImageKey].id,
                      handle: upsellItemsByType.vacationPackage[marketplaceImageKey].handle,
                    })?.url ?? upsellItemsByType.vacationPackage[marketplaceImageKey].url,
                },
                clientRoute: {
                  route: `/${PageType.TOURCATEGORY}`,
                  as: `/${tourSearchBaseUrl}/${vacationPackagesSlug}`,
                },
              },
            ]
          : []),
        ...(!voucherData.flights.length && upsellItemsByType.flight
          ? [
              {
                id: 3,
                title: t(upsellItemsByType.flight.title.value, { country }),
                uri: `/${flightSearchBaseUrl}`,
                isLegacy: false,
                pageType: PageType.FLIGHTSEARCH,
                image: {
                  id: upsellItemsByType.flight.upsellImage.id,
                  url:
                    getImgixImageFromGraphCMS({
                      id: upsellItemsByType.flight.upsellImage.id,
                      handle: upsellItemsByType.flight.upsellImage.handle,
                    })?.url ?? upsellItemsByType.flight.upsellImage.url,
                },
                clientRoute: {
                  route: `/${PageType.FLIGHTSEARCH}`,
                  as: `/${flightSearchBaseUrl}`,
                },
              },
            ]
          : []),
        ...(!voucherData.cars.length && upsellItemsByType.car && carSearchBaseUrl
          ? [
              {
                id: 3,
                title: t(upsellItemsByType.car.title.value, { country }),
                uri: `/${carSearchBaseUrl}`,
                isLegacy: false,
                pageType: PageType.CARSEARCH,
                image: {
                  id: upsellItemsByType.car[marketplaceImageKey].id,
                  url:
                    getImgixImageFromGraphCMS({
                      id: upsellItemsByType.car[marketplaceImageKey].id,
                      handle: upsellItemsByType.car[marketplaceImageKey].handle,
                    })?.url ?? upsellItemsByType.car[marketplaceImageKey].url,
                },
                clientRoute: {
                  route: `/${PageType.CARSEARCH}`,
                  as: `/${carSearchBaseUrl}`,
                },
              },
            ]
          : []),
      ]
    : [];

  if (categories.length > 0) {
    return (
      <StyledImageCategoriesGrid
        metadata={{ title: t("Complete your visit"), subtitle: "" }}
        categories={categories}
        cardHeight={cardHeight}
        columnSizes={columnSizes}
        imgixParams={{
          fit: "clip",
          q: 100,
        }}
      />
    );
  }

  return null;
};

export default VoucherUpsell;
