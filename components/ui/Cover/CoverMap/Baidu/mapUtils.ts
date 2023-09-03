export const getBaiduMapDirectionPageUrl = (point: Partial<SharedTypes.MapPoint>) => {
  const mapCoordinates = `${point.latitude},${point.longitude}`;
  // this URL replaces the old one that have stopped working :(

  // it's constructed in experimental way, likely to stop working sooner or later :(
  // I called official BAIDU webmap API and noticed the undergoing network redirects, so I apply this strategy here

  // official docs don't work with non-Chinese coords by some reason
  // https://lbsyun.baidu.com/index.php?title=uri/api/web
  // http://api.map.baidu.com/marker?location=40.047669,116.313082&title=My Location&content=Baidu Kuike Building&output=html&src=webapp.baidu.openAPIdemo
  // responds with 302 Redirect
  // http://map.baidu.com/?latlng=40.047669,116.313082&title=My+Location&content=Baidu+Kuike+Building&autoOpen=true&l

  return `http://map.baidu.com/?latlng=${mapCoordinates}&title=${point.title}&content=${point.title}&autoOpen=true&l`;
};
