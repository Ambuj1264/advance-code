declare namespace BaiduMapTypes {
  export type MarkerWithData = BMap.Marker & {
    pointData: SharedTypes.MapPoint;
  };
}
