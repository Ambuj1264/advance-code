import { useCallback, useEffect, useState } from "react";

import { useSettings } from "contexts/SettingsContext";
import { getCountryCodeFromResponseHeader } from "utils/apiUtils";

const useGetIpCountryCode = () => {
  const { marketplaceUrl } = useSettings();
  const [ipCountryCode, setIpCountryCode] = useState<string | undefined>("");

  const getIpCountryCode = useCallback(async () => {
    const responseHeaderCountryCode = await getCountryCodeFromResponseHeader(
      marketplaceUrl,
      window?.location?.host
    );
    setIpCountryCode(responseHeaderCountryCode);
  }, [marketplaceUrl]);

  useEffect(() => {
    if (ipCountryCode === "") {
      getIpCountryCode();
    }
  }, [getIpCountryCode, ipCountryCode]);

  return { ipCountryCode };
};

export default useGetIpCountryCode;
