import useActiveLocale from "./useActiveLocale";

import { PageType } from "types/enums";
import { getClientSideUrl } from "utils/helperUtils";
import { useSettings } from "contexts/SettingsContext";

const useDynamicUrl = (pageType: PageType) => {
  const activeLocale = useActiveLocale();
  const { marketplace } = useSettings();

  return getClientSideUrl(pageType, activeLocale, marketplace);
};

export default useDynamicUrl;
