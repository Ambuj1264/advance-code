import rgba from "polished/lib/color/rgba";
import lighten from "polished/lib/color/lighten";

export const gutters = {
  small: 16,
  large: 24,
};

export const guttersPx = {
  small: `${gutters.small}px`,
  smallHalf: `${gutters.small / 2}px`,
  large: `${gutters.large}px`,
  largeHalf: `${gutters.large / 2}px`,
};

export const columns = {
  small: 4,
  medium: 8,
  large: 8,
  desktop: 12,
};

export const containerMaxWidth = "1440px";

export const appBarHeight = 48;

export const breakpointsMin = {
  medium: 600,
  large: 960,
  desktop: 1140,
  max: 1440,
};

export const breakpointsMax = {
  medium: breakpointsMin.medium - 1,
  large: breakpointsMin.large - 1,
  desktop: breakpointsMin.desktop - 1,
};

export const headerHeight = "50px";
export const modalHeaderHeight = "40px";

export const opacity = {
  hover: 0.8,
  disabled: 0.5,
};

export const fallbackFontFamily =
  "BlinkMacSystemFont, -apple-system, Roboto, Helvetica, Arial, sans-serif";
export const fontFamily = `Open Sans, ${fallbackFontFamily}`;

export const placeholderColor = "#ccc";
export const whiteColor = "#fff";
export const ghostWhiteColor = "#F6F9FE";
export const blackColor = "#000";
export const greyColor = "#666";
export const redColor = "#BF3D3D";
export const blueColor = "#336699";
export const lightBlueColor = "#4387D9";
export const greenColor = "#33AB63";
export const lightRedColor = "#E04747";
export const redCinnabarColor = "#FF6D6D";
export const yellowColor = "#f8e71c";
export const buttercupColor = "#f5a623";
export const textColorLight = "#828282";
export const separatorColor = "rgba(102, 102, 102, 0.2)";
export const separatorColorLight = "rgba(232, 232, 232, 0.5)";
export const separatorColorDark = "rgba(232, 232, 232, 1)";
export const lightGreyColor = "#F0F0F0";
export const lighterGreyColor = "#FCFCFC";
export const sunsetOrange = "#ff4b55";
export const bittersweetRedColor = "#ff6d6d";
export const carColor = "#944BBB";
export const hotelColor = "#6DC0D5";
export const dayTourColor = "#FF790A";
export const attractionColor = "#81C14B";
export const flightColor = "#EA86B6";
export const loadingBlue = "#C3DDF2";
export const hotPink = "#FF55BA";
export const gteSearchVacationPackagesColor = "#E47ABB";
export const gteSearchFlightColor = "#AD8E00";
export const gteSearchStaysColor = "#49BCD4";
export const gteSearchToursColor = "#E49A1E";
export const gteSearchRestaurantColor = "#43D99A";

export const borderRadiusTiny = "2px";
export const borderRadiusSmall = "4px";
export const borderRadius = "6px";
export const borderRadiusLarger = "8px";
export const borderRadiusBig = "10px";
export const borderRadius15 = "15px";
export const borderRadius20 = "20px";
export const borderRadiusCircle = "50%";

export const boxShadow = `0px 4px 8px ${rgba(greyColor, 0.15)}, 0px 2px 4px ${rgba(
  greyColor,
  0.1
)}`;

export const boxShadowStrong = `0px 12px 24px ${rgba(greyColor, 0.15)}, 0px 4px 8px ${rgba(
  greyColor,
  0.1
)}`;

export const boxShadowLight = `0px 2px 4px ${rgba(greyColor, 0.1)}, 0px -2px 4px ${rgba(
  greyColor,
  0.1
)}`;

export const boxShadowTileRegular = `0px 0px 4px rgba(0, 0, 0, 0.15)`;

export const blackOverlay = `${rgba(blackColor, 0.75)}`;

export const boxShadowTopLight = `0px 2px 4px #979797`;
export const boxShadowTop = `0px 0px 16px ${rgba(greyColor, 0.24)}`;
export const boxShadowLightTop = `0px 0px 8px ${rgba(greyColor, 0.24)}`;

export const boxShadowWhiteTop = `0px -8px 10px ${whiteColor}`;

export const boxShadowIcon = `0px 0px 4px ${rgba(blackColor, 0.25)}`;

export const greyBottomGradient =
  "linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 35%)";

export const greyTopAndBottomGradient =
  "linear-gradient(0deg, rgba(0, 0, 0, 0.125) 0%, rgba(0, 0, 0, 0) 35%, rgba(0, 0, 0, 0) 68.33%, rgba(0, 0, 0, 0.75) 100%)";

export const skeletonBlueGradient = `linear-gradient(to right, ${rgba(loadingBlue, 0)}, ${lighten(
  0.03,
  loadingBlue
)}, ${rgba(loadingBlue, 0)})`;
export const skeletonGreyGradient = `linear-gradient(to right, ${rgba(
  lightGreyColor,
  0
)}, ${lighterGreyColor}, ${rgba(lightGreyColor, 0)})`;

export const fontWeightRegular = 400;
export const fontWeightSemibold = 600;
export const fontWeightBold = 700;

export const fontSizeH2 = "40px";
export const fontSizeH3 = "32px";
export const fontSizeH4 = "24px";
export const fontSizeH5 = "20px";
export const fontSizeBody1 = "16px";
export const fontSizeBody2 = "14px";
export const fontSizeCaption = "12px";
export const fontSizeMiddleCaption = "11px";
export const fontSizeCaptionSmall = "10px";

export const zIndex = {
  z1: 100,
  z2: 200,
  z3: 300,
  z4: 400,
  z5: 500,
  z6: 600,
  z7: 700,
  z8: 800,
  z9: 900,
  z10: 1000,
  max: 999999,
};

export const webKitScrollBarHeight = 6;

export const teaserHeight = {
  large: 164,
  small: 144,
};
