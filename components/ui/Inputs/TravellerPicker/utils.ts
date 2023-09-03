export const getTravellersCount = (
  numberOfGuests: SharedTypes.NumberOfGuests,
  type: SharedTypes.GuestType
) => {
  const guests = numberOfGuests[type];
  return Array.isArray(guests) ? guests.length : guests;
};

export const getMinMaxChildrenAges = (priceGroups?: TravelersTypes.PriceGroup[]) => {
  if (priceGroups && priceGroups.length) {
    const childrenPriceGroup = priceGroups.find(
      priceGroup => priceGroup.travelerType === "children"
    );
    const teenagersPriceGroup = priceGroups.find(
      priceGroup => priceGroup.travelerType === "teenagers"
    );

    return {
      minAge: childrenPriceGroup?.minAge ?? teenagersPriceGroup?.minAge,
      maxAge: teenagersPriceGroup?.maxAge ?? childrenPriceGroup?.maxAge ?? undefined,
    };
  }

  return { minAge: undefined, maxAge: undefined };
};
