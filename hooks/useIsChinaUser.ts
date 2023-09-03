import { useState, useEffect } from "react";

const CHINA_TIMEZONES = [
  "Asia/Chongqing",
  "Asia/Chungking",
  "Asia/Harbin",
  "Asia/Shanghai",
  "PRC",
  "Asia/Urumqi",
  "Asia/Kashgar",
  "Asia/Hong_Kong",
  "Asia/Macau",
];

const useIsChinaUser = () => {
  const [isChina, setIsChina] = useState(false);

  useEffect(() => {
    if (typeof Intl === "object") {
      const userTimeZone = new Intl.DateTimeFormat().resolvedOptions?.().timeZone;

      const isChinaTimeZone = CHINA_TIMEZONES.includes(userTimeZone);
      setIsChina(isChinaTimeZone);
    }
  }, [setIsChina]);

  return isChina;
};

export default useIsChinaUser;
