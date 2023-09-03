import useActiveLocale from "hooks/useActiveLocale";
import { Marketplace } from "types/enums";
import { useSettings } from "contexts/SettingsContext";
import { vpEnabledForLocale } from "components/features/VacationPackageProductPage/utils/vpEnabledForLocale";

// TODO: Remove when all VP will be released
const useVpPackages = () => {
  const { marketplace } = useSettings();
  const isGTE = marketplace === Marketplace.GUIDE_TO_EUROPE;
  const activeLocale = useActiveLocale();

  return isGTE && vpEnabledForLocale(activeLocale);
};

export default useVpPackages;
