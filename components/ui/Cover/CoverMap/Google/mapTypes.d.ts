declare namespace GoogleMapTypes {
  export interface MarkerWithData extends google.maps.Marker {
    pointData: SharedTypes.MapPoint;
  }
}
