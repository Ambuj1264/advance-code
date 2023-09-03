import { redColor } from "styles/variables";

export const constructRibbon = (banner: RibbonTypes.Banner): RibbonTypes.Ribbon => {
  let type: RibbonTypes.RibbonType = "custom";
  if (banner.type === "product-ribbon-fullybooked") {
    type = "fullyBooked";
  } else if (banner.type === "product-ribbon-discount") {
    type = "discount";
  }
  return {
    text: banner.text,
    type,
  };
};

export const getColor = (type: string, theme: Theme) => {
  switch (type) {
    case "fullyBooked":
      return redColor;
    case "discount":
      return theme.colors.action;
    default:
      return theme.colors.primary;
  }
};
