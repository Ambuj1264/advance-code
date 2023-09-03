import React from "react";

import { PBError } from "../PostBooking/components/PBError";

import UserContent from "./UserContent";
import { UserProfileStatecontextProvider } from "./contexts/UserProfileStateContext";
import { filters } from "./mockUserData";
import UserLoadingSkeleton from "./UserLoadingSkeleton";
import useUserProfileQuery from "./hooks/useUserProfileQuery";
import { constructUserQueryContent } from "./utils/constructUserQueryContent";

import { DesktopContainer } from "components/ui/Grid/Container";
import BreadcrumbsWrapper from "components/ui/Breadcrumbs/BreadcrumbsWrapper";
import ProductHeader from "components/ui/ProductHeader";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import DefaultHeadTags from "lib/DefaultHeadTags";

const UserContainer = () => {
  const { t } = useTranslation(Namespaces.userProfileNs);
  const { userData, userDataLoading, userDataError } = useUserProfileQuery();

  if (userDataLoading) {
    return <UserLoadingSkeleton t={t} />;
  }

  if (userDataError) {
    return <PBError error={userDataError} />;
  }

  if (userData?.userProfile) {
    const constructedData = constructUserQueryContent(userData.userProfile);

    return (
      <>
        <DefaultHeadTags title={t("User profile")} />
        <UserProfileStatecontextProvider
          mainUserInfo={constructedData.mainUser}
          travelCompanions={constructedData.frequentTravelers}
          travelStyle={constructedData.travelStyle}
          travelInterests={constructedData.travelInterests}
          travelBudget={constructedData.travelBudget}
          originalState={constructedData}
        >
          <DesktopContainer>
            <BreadcrumbsWrapper />
            <ProductHeader title={t("My profile")} />
            <UserContent priceFilters={filters} />
          </DesktopContainer>
        </UserProfileStatecontextProvider>
      </>
    );
  }
  return null;
};

export default UserContainer;
