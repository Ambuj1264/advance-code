import React from "react";

import ItineraryExpandButton from "./ItineraryExpandButton";
import ItineraryMoreInformationLoading from "./ItineraryMoreInformationContentLoading";

import CustomNextDynamic from "lib/CustomNextDynamic";

const ItineraryMoreInformationContent = CustomNextDynamic(
  () => import("./ItineraryMoreInformationContent"),
  {
    ssr: false,
    loading: ItineraryMoreInformationLoading,
  }
);

type Props = {
  title: string;
  itineraryItem: ItineraryItem;
  slug: string;
};

const ItineraryMoreInformationDynamic = ({ title, itineraryItem, slug }: Props) => (
  <ItineraryExpandButton id={`${itineraryItem.id}-SeeMoreInformation`} title={title}>
    <ItineraryMoreInformationContent itineraryItem={itineraryItem} slug={slug} title={title} />
  </ItineraryExpandButton>
);

export default ItineraryMoreInformationDynamic;
