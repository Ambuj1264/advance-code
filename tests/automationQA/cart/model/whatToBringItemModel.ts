export type WhatToBringItemModelType = {
  id: number;
  name: string;
  included: boolean;
  __typename: string;
};

export const getWhatToBringItemModel = (): WhatToBringItemModelType => ({
  id: 2353,
  name: "Warm and waterproof clothing ",
  included: true,
  __typename: "OrderWhatToBringItem",
});
