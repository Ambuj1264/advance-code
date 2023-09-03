import { useState, useEffect } from "react";
import { loadScript } from "@travelshift/ui/hooks/useDynamicScript";

import mapStylesBaidu from "../mapStylesBaidu";

import { useSettings } from "contexts/SettingsContext";

const BAIDU_MAPS_API = (baiduApiKey: string) =>
  `//api.map.baidu.com/api?v=2.0&ak=${baiduApiKey}&callback=initMap`;

const useBaiduMapAsyncInitialization = ({
  mapId,
  callback,
  isMobile,
  map,
}: {
  mapId: string;
  options?: {};
  callback?: (baiduMap: BMap.Map) => void;
  isMobile: boolean;
  map: SharedTypes.Map;
}): BMap.Map | undefined => {
  const { baiduApiKey } = useSettings();
  const [mapInstance, setMapInstance] = useState<BMap.Map>();

  useEffect(() => {
    const mapInitialization = () => {
      const mapDOMElement = document.getElementById(mapId);

      if (!mapDOMElement) {
        return;
      }

      const baiduMap = new window.BMap.Map(mapId);

      baiduMap.addControl(
        new window.BMap.NavigationControl({
          anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
          type: BMAP_NAVIGATION_CONTROL_ZOOM,
        })
      );

      // @ts-ignore: d.ts doesn't match with baidu documentation
      // https://lbsyun.baidu.com/cms/jsapi/reference/jsapi_reference.html
      baiduMap.setMapStyle({ styleJson: mapStylesBaidu });

      setMapInstance(baiduMap);
      callback?.(baiduMap);
    };

    if (!mapInstance) {
      if (window.BMap) {
        mapInitialization();
      } else if (baiduApiKey) {
        // eslint-disable-next-line functional/immutable-data
        window.initMap = mapInitialization;
        loadScript("baiduMapAPI", BAIDU_MAPS_API(baiduApiKey));
      }
    } else {
      callback?.(mapInstance);
    }
    // eslint-disable-next-line
  }, [
    isMobile,
    map.latitude,
    map.longitude,
    map.zoom
  ]);

  return mapInstance;
};

export default useBaiduMapAsyncInitialization;
