import IconLoading from "./IconLoading";

import CustomNextDynamic from "lib/CustomNextDynamic";

export const InformationIcon = CustomNextDynamic(
  () => import("components/icons/information-circle1.svg"),
  {
    loading: IconLoading,
  }
);
