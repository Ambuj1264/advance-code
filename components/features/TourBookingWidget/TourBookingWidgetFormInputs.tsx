import React from "react";

const TourBookingWidgetFormInputs = ({
  formData,
  isLivePricing,
}: {
  formData: TourBookingWidgetTypes.FormData;
  isLivePricing: boolean;
}) => {
  return (
    <>
      <input type="hidden" name="tour_id" value={formData.tourId} />
      <input type="hidden" name="tour_pickup" value={formData.tourPickup} />
      <input type="hidden" name="pickup_type" value={formData.pickupType} />
      <input type="hidden" name="date" value={formData.date} />
      <input type="hidden" name="time" value={formData.time} />
      <input type="hidden" name="departure_flex" value={formData.departureFlex} />
      <input type="hidden" name="adults" value={formData.adults} />
      {isLivePricing ? (
        <>
          <input type="hidden" name="is_live_pricing" value="1" />
          <input type="hidden" name="lp_uuid_default" value={formData.livePricingUuid} />
          <input
            type="hidden"
            name="lp_uuid_non_default"
            value={formData.livePricingNonDefaultUuid}
          />
          {formData.childrenAges.map((childrenAgeItem, index) => (
            <input
              // eslint-disable-next-line react/no-array-index-key
              key={`childrenAges${index}`}
              type="hidden"
              name="children_ages[]"
              value={childrenAgeItem}
            />
          ))}
        </>
      ) : (
        <>
          <input type="hidden" name="teenagers" value={formData.teenagers} />
          <input type="hidden" name="children" value={formData.children} />
        </>
      )}
      {formData.privateOptionsIds?.length
        ? formData.privateOptionsIds.map((optionId, index) => (
            <input
              // optionId is not unique, could be two similar ids
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              type="hidden"
              name="private_option[]"
              value={optionId}
            />
          ))
        : null}
    </>
  );
};
export default TourBookingWidgetFormInputs;
