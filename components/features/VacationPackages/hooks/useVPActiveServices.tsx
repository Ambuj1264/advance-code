import { useRouter } from "next/router";

import { PageType } from "types/enums";
import { cleanAsPathWithLocale } from "utils/routerUtils";

export const useVPSearchActiveServices = () => {
  const { asPath } = useRouter();
  const activeServices = [
    {
      isLegacy: false,
      pageType: PageType.VACATION_PACKAGES_LANDING as string,
      title: "Find a vacation",
      uri: cleanAsPathWithLocale(asPath),
    },
  ];

  return { activeServices };
};
