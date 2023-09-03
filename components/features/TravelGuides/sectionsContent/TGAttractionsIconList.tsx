import React, { useMemo } from "react";

import { useTravelStopModal } from "../../VacationPackageProductPage/VPTravelStopModal/travelStopModalHooks";
import VPTravelStopModalManager from "../../VacationPackageProductPage/VPTravelStopModal/VPTravelStopModalManager";

import { TravelStopType } from "types/enums";
import { constructAttractionsList } from "components/features/TravelGuides/utils/travelGuideUtils";
import { StyledIconList } from "components/ui/Map/AttractionsMapContainer";

const TGAttractionsIconList = ({ attractions }: { attractions: TravelStopTypes.TravelStops[] }) => {
  const {
    isModalToggled,
    travelStopItems,
    clickedIcon,
    toggleModal,
    handleItemChange,
    createHandleTravelStopModalToggle,
  } = useTravelStopModal();

  const handleAttractionModalToggle = useMemo(
    () =>
      attractions
        ? createHandleTravelStopModalToggle(attractions, TravelStopType.ATTRACTION)
        : () => {},
    [attractions, createHandleTravelStopModalToggle]
  );
  return (
    <>
      <StyledIconList
        sectionId="travelguide-attractionsection"
        iconList={constructAttractionsList(attractions)}
        iconLimit={9}
        inGrid
        columns={{ small: 2 }}
        onClick={handleAttractionModalToggle}
        shouldUseDynamicLimit={false}
      />
      {isModalToggled && clickedIcon && (
        <VPTravelStopModalManager
          clickedIcon={clickedIcon}
          onToggleModal={toggleModal}
          onSetClickedIcon={handleItemChange}
          items={travelStopItems}
        />
      )}
    </>
  );
};

export default TGAttractionsIconList;
