import React, { useState } from "react";

import AttractionsMapContainer from "./AttractionsMapContainer";

import useToggle from "hooks/useToggle";
import VPTravelStopModalManager from "components/features/VacationPackageProductPage/VPTravelStopModal/VPTravelStopModalManager";

const ProductAttractionsMapContainer = ({
  nearbyAttractions,
  mapData,
  sectionId = "nearbyAttractions",
  title,
  useAlternateStaticImageOnly,
}: {
  nearbyAttractions: TravelStopTypes.TravelStops[];
  mapData: SharedTypes.Map;
  sectionId?: string;
  title: string;
  useAlternateStaticImageOnly?: boolean;
}) => {
  const [isModalOpen, toggleIsModalOpen] = useToggle(false);
  const [modalContent, setModalContent] = useState(nearbyAttractions?.[0]);
  if (nearbyAttractions.length === 0) return null;
  return (
    <>
      <AttractionsMapContainer
        attractions={nearbyAttractions.reduce(
          (acc: SharedTypes.Icon[], curr) => [...acc, curr.info],
          []
        )}
        sectionId={sectionId}
        map={mapData}
        attractionsTitle={title}
        onIconClick={(icon: SharedTypes.Icon) => {
          setModalContent(
            nearbyAttractions.find(attraction => attraction.info.id === icon.id) || modalContent
          );
          toggleIsModalOpen();
        }}
        useAlternateStaticImageOnly={useAlternateStaticImageOnly}
      />
      {isModalOpen && (
        <VPTravelStopModalManager
          onToggleModal={toggleIsModalOpen}
          clickedIcon={modalContent}
          onSetClickedIcon={setModalContent}
          items={nearbyAttractions}
        />
      )}
    </>
  );
};

export default ProductAttractionsMapContainer;
