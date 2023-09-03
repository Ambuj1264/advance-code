import { useSettings } from "contexts/SettingsContext";
import useIsChinaUser from "hooks/useIsChinaUser";
import { MAP_TYPE } from "types/enums";

export const useGetCurrentMapType = () => {
  const isChina = useIsChinaUser();
  const { baiduApiKey } = useSettings();

  if (isChina) {
    return baiduApiKey ? MAP_TYPE.BAIDU : MAP_TYPE.BAIDU_FALLBACK_COVER;
  }

  return MAP_TYPE.GOOGLE;
};
