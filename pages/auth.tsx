import React, { useEffect } from "react";
import { NextPageContext } from "next";
import { useRouter } from "next/router";
import { StringParam, useQueryParams } from "use-query-params";

import useSession from "../hooks/useSession";
import { getMarketplaceUrl } from "../utils/apiUtils";
import {
  PBHeading,
  StyledProductCardsRowWrapper,
  StyledReservationsTitle,
} from "../components/features/PostBooking/components/PBSharedComponents";

import routes from "shared/routes";
import Header from "components/features/Header/MainHeader";
import { Namespaces } from "shared/namespaces";
import { Direction, PageType } from "types/enums";
import NoIndex from "components/features/SEO/NoIndex";
import GTEAuthenticationPage from "components/features/GTEUserMenu/GTEAuthenticationPage";
import { useTranslation } from "i18n";
import DefaultPageLoading from "components/ui/Loading/DefaultLoadingPage";

const PBCustomAuthPage = () => {
  const { t: postbookingT } = useTranslation(Namespaces.postBookingNs);
  const [{ trip }] = useQueryParams({
    trip: StringParam,
  });

  return (
    <StyledProductCardsRowWrapper>
      {trip ? (
        <PBHeading>{postbookingT(`Congratulations, you just booked a ${trip}.`)}</PBHeading>
      ) : (
        <StyledReservationsTitle>{postbookingT("My trips")}</StyledReservationsTitle>
      )}
      <GTEAuthenticationPage headingText="Log in to see your booking" />
    </StyledProductCardsRowWrapper>
  );
};

const AuthenticationPage = ({
  originalPage,
  originalAs,
  originalQuery,
}: {
  originalPage: string;
  originalAs: string;
  originalQuery: { i18n: any };
}) => {
  const { user, queryCompleted } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    router.replace(
      {
        pathname: originalPage,
        query: originalQuery,
      },
      originalAs
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <>
      <NoIndex />
      <Header />
      {(() => {
        const isPostBooking = originalPage === `/${PageType.GTE_POST_BOOKING}`;
        if (!user && queryCompleted) {
          // special case for post-booking page, which has custom login screen
          if (isPostBooking) {
            return <PBCustomAuthPage />;
          }
          // default login screen
          return <GTEAuthenticationPage />;
        }

        return <DefaultPageLoading />;
      })()}
    </>
  );
};

AuthenticationPage.getInitialProps = (ctx: NextPageContext) => {
  let originalPage;
  let originalQuery;
  const marketplaceUrl = getMarketplaceUrl(ctx);
  const match = routes.match(ctx.asPath, marketplaceUrl, true);

  if (match) {
    originalPage = match.route.page;
    originalQuery = match.query;
  }

  return {
    originalAs: ctx.asPath,
    originalPage,
    originalQuery,
    isTopServicesHidden: true,
    isSubscriptionFormHidden: true,
    namespacesRequired: [
      Namespaces.commonNs,
      Namespaces.headerNs,
      Namespaces.footerNs,
      Namespaces.userProfileNs,
    ],
    contactUsButtonPosition: Direction.Right,
  };
};

export default AuthenticationPage;
