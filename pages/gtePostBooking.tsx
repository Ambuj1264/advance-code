import React from "react";
import { useTranslation } from "react-i18next";

import useToggle from "../hooks/useToggle";
import useEffectOnce from "../hooks/useEffectOnce";
import NoIndex from "../components/features/SEO/NoIndex";
import PBVacationPackages from "../components/features/PostBooking/PBVacationPackages";

import { useIsMobile } from "hooks/useMediaQueryCustom";
import MobileFooterMenu from "components/features/PostBooking/MobileFooterMenu/MobileFooterMenu";
import QueryParamProvider from "components/ui/Filters/QueryParamProvider";
import Header from "components/features/Header/MainHeader";
import { Namespaces } from "shared/namespaces";
import { Direction } from "types/enums";
import { usePostBookingQueryParams } from "components/features/PostBooking/components/hooks/usePostBookingQueryParams";
import PBReservations from "components/features/PostBooking/PBReservations";
import PostBookingTravelPlan from "components/features/PostBooking/PBTravelPlan";
import { POSTBOOKING_NAVIGATION } from "components/features/PostBooking/types/postBookingEnums";
import { useSettings } from "contexts/SettingsContext";
import DefaultHeadTags from "lib/DefaultHeadTags";
import { zIndex } from "styles/variables";
import { getMetadataTitle } from "components/ui/utils/uiUtils";
import { HeaderContextProvider } from "components/features/Header/Header/HeaderContext";
import ErrorBoundary from "components/ui/ErrorBoundary";
import { PBErrorComponent } from "components/features/PostBooking/components/PBError";

const RenderPageByQueryParams = () => {
  const [{ nav }] = usePostBookingQueryParams();
  const [isBrowser, setIsBrowser] = useToggle(false);
  const isMobile = useIsMobile();
  const { t: postbookingT } = useTranslation(Namespaces.postBookingNs);

  const { websiteName } = useSettings();

  // THIS causes flickering of the whole UI locally when you work with post-booking
  // comment this out and set isBrowser to "true" to not get the "always loading state" upon webpack refreshes the build through EventSource event
  useEffectOnce(setIsBrowser);

  const isMobileClient = isBrowser && isMobile;

  return (
    <>
      {(POSTBOOKING_NAVIGATION.TRAVELPLAN === nav || POSTBOOKING_NAVIGATION.MOBILEMAP === nav) && (
        <PostBookingTravelPlan isMobile={isMobileClient} nav={nav} websiteName={websiteName} />
      )}
      {POSTBOOKING_NAVIGATION.RESERVATIONS === nav && (
        <>
          <DefaultHeadTags title={getMetadataTitle(postbookingT("My reservations"), websiteName)} />
          <PBReservations />
        </>
      )}
      {(POSTBOOKING_NAVIGATION.VACATION_PACKAGES === nav || !nav) && (
        <>
          <DefaultHeadTags title={getMetadataTitle(postbookingT("My bookings"), websiteName)} />
          <PBVacationPackages />
        </>
      )}
    </>
  );
};

const PostBookingPage = () => {
  return (
    <HeaderContextProvider>
      <NoIndex />
      <Header skipHeaderContextSetup />
      <QueryParamProvider>
        <ErrorBoundary ErrorComponent={PBErrorComponent} componentName="gtePostbooking" canDismiss>
          <RenderPageByQueryParams />
        </ErrorBoundary>
        <MobileFooterMenu />
      </QueryParamProvider>
    </HeaderContextProvider>
  );
};

PostBookingPage.getInitialProps = () => {
  return {
    isTopServicesHidden: true,
    isSubscriptionFormHidden: true,
    namespacesRequired: [
      Namespaces.commonNs,
      Namespaces.headerNs,
      Namespaces.footerNs,
      Namespaces.commonSearchNs,
      Namespaces.orderNs,
      Namespaces.voucherNs,
      Namespaces.postBookingNs,
    ],
    contactUsButtonPosition: Direction.Right,
    contactUsButtonZIndex: zIndex.max + 1,
    queries: [],
  };
};

export default PostBookingPage;
