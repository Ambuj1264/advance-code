const FALLBACK_CAR_PRODUCT_ID = `DEFAULTOFFER`;

export const isFallbackCarOffer = (carOfferId: string | number = "") =>
  String(carOfferId).includes(FALLBACK_CAR_PRODUCT_ID);

export const hasCarPriceInputChanged = (
  carPriceInput: VacationPackageTypes.CarPriceInput[],
  newCarPriceInput: VacationPackageTypes.CarPriceInput[]
) => {
  const oldInput = carPriceInput?.[0];
  const newInput = newCarPriceInput?.[0];
  if (oldInput && newInput) {
    const hasSameExtras = newInput.extras.every(extra =>
      oldInput.extras.some(e => extra.id === e.id && extra.count === e.count)
    );
    const hasSameInsurances =
      oldInput.insurances.length === newInput.insurances.length &&
      newInput.insurances.every(insurance => oldInput.insurances.some(i => i === insurance));
    const isSameOffer = oldInput.offerReference === newInput.offerReference;
    return !hasSameExtras || !hasSameInsurances || !isSameOffer;
  }
  return oldInput !== newInput;
};
