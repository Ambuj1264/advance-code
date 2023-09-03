import React from "react";

import { TemplateInput } from "./useGetTemplate";

import CustomNextDynamic from "lib/CustomNextDynamic";
import useSession from "hooks/useSession";
import ErrorBoundary from "components/ui/ErrorBoundary";
import { LandingPageType, PageType } from "types/enums";

const AdminGearContainer = CustomNextDynamic(() => import("./AdminGearContainer"), {
  ssr: false,
});

const AdminGearLoader = ({
  links,
  hideCommonLinks = false,
  infoText,
  functionalItems,
  slug,
  pageType,
  landingPageType,
  customerInfo,
  refetchCartData,
  templateInput,
}: {
  links?: AdminGearTypes.AdminLink[];
  hideCommonLinks?: boolean;
  infoText?: string[];
  functionalItems?: AdminGearTypes.AdminFunctionalItem[];
  landingPageType?: LandingPageType;
  pageType?: PageType;
  slug?: string;
  customerInfo?: CartTypes.CommonCustomerInfoInput;
  refetchCartData?: () => void;
  templateInput?: TemplateInput;
}) => {
  const { user } = useSession();
  if (user?.isAdmin || user?.isTranslator) {
    return (
      <ErrorBoundary>
        <AdminGearContainer
          links={links}
          customerInfo={customerInfo}
          refetchCartData={refetchCartData}
          hideCommonLinks={hideCommonLinks}
          infoText={infoText}
          functionalItems={functionalItems}
          landingPageType={landingPageType}
          pageType={pageType}
          slug={slug}
          templateInput={templateInput}
        />
      </ErrorBoundary>
    );
  }
  return null;
};

export default AdminGearLoader;
