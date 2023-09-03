declare namespace RibbonTypes {
  export type RibbonType = "fullyBooked" | "discount" | "custom";

  export type Ribbon = Readonly<{
    text: string;
    type: RibbonType;
  }>;

  export type Banner = Readonly<{
    text: string;
    type: string;
  }>;
}
