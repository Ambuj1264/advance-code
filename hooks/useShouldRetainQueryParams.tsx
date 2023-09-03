import { useRouter } from "next/router";

import { PageType } from "types/enums";
import { extractPageTypeFromRoute } from "utils/routerUtils";

const useShouldRetainQueryParams = () => {
  const { route } = useRouter();
  const pageType = extractPageTypeFromRoute(route);
  return pageType === PageType.CAR || pageType === PageType.FLIGHT || pageType === PageType.VOUCHER;
};

export default useShouldRetainQueryParams;
