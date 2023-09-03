import { HeaderTypes } from "@travelshift/ui/typings/headerTypes";

import CustomNextDynamic from "lib/CustomNextDynamic";
import IconLoading from "components/ui/utils/IconLoading";

const CarIcon = CustomNextDynamic(() => import("components/icons/car.svg"), {
  loading: IconLoading,
});
const TourIcon = CustomNextDynamic(() => import("components/icons/traveler.svg"), {
  loading: IconLoading,
});
const HotelIcon = CustomNextDynamic(() => import("components/icons/house-heart.svg"), {
  loading: IconLoading,
});
const PackagesIcon = CustomNextDynamic(() => import("components/icons/distance.svg"), {
  loading: IconLoading,
});
const FlightIcon = CustomNextDynamic(() => import("components/icons/plane-1.svg"), {
  loading: IconLoading,
});
const PinIcon = CustomNextDynamic(() => import("components/icons/pin.svg"), {
  loading: IconLoading,
});
const BookIcon = CustomNextDynamic(() => import("components/icons/book-open.svg"), {
  loading: IconLoading,
});

export const getAuthenticationStatus = (
  loading: boolean,
  status: boolean,
  data?: HeaderTypes.MutationSignInData | HeaderTypes.MutationSignUpData
): MutationStatus => {
  if (loading) {
    return "loading";
  }
  if (data) {
    if (!status) {
      return "error";
    }
    return "success";
  }
  return "none";
};

export default {};

export const getDefaultUrl = (url: string, locale: string) =>
  url.includes("guidetoiceland") && locale === "zh_CN"
    ? "https://cn.guidetoiceland.is"
    : `${url}/${locale === "en" ? "" : locale}`;

export const getLinkIcon = (linkClass: string) => {
  if (linkClass.includes("transport") || linkClass === "cars") {
    return CarIcon;
  }
  if (linkClass.includes("tour")) {
    return TourIcon;
  }
  if (linkClass.includes("accommodation") || linkClass.includes("stays")) {
    return HotelIcon;
  }
  if (linkClass.includes("package")) {
    return PackagesIcon;
  }
  if (linkClass.includes("flight")) {
    return FlightIcon;
  }
  if (linkClass.includes("travelguidedestination")) {
    return PinIcon;
  }
  return BookIcon;
};

export const getLinkTitle = (linkClass: string, t: TFunction) => {
  if (linkClass.includes("transport") || linkClass === "cars") {
    return t("Car rentals");
  }
  if (linkClass.includes("tour")) {
    return t("Trips");
  }
  if (linkClass.includes("accommodation")) {
    return t("Stays");
  }
  if (linkClass.includes("flight")) {
    return t("Flights");
  }
  if (linkClass.includes("package")) {
    return t("Vacation packages");
  }
  return undefined;
};

export const constructNewHeader = (headerConfig?: HeaderTypes.QueryNewHeaderData) =>
  headerConfig
    ? ({
        links:
          headerConfig.links?.map((link: HeaderTypes.NewHeaderLink) => ({
            ...link,
            linkClass: link.pageType?.toLowerCase(),
            visible: "both",
          })) ?? [],
        currencies:
          headerConfig.currencies?.map((currency: Currency) => ({
            ...currency,
            rate: 0,
          })) ?? [],
        locales: headerConfig.locales,
        searchLink: "",
        forgotPasswordLink: "/login/forgot",
        cartLink: "/cart",
      } as HeaderTypes.QueryHeaderData)
    : undefined;

export const getLogoutUrl = () => {
  let returnTo = "";

  if (typeof window !== "undefined") {
    returnTo = encodeURIComponent(`${window.location.pathname}${window.location.search}`);
  }

  return `/auth/logout${returnTo ? `?returnTo=${returnTo}` : ""}`;
};
