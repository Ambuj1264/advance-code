import React, { useCallback } from "react";
import ArrowRight from "@travelshift/ui/icons/arrow-right.svg";

import VPTravelStopModal from "./VPTravelStopModal";

import CameraIcon from "components/icons/camera-1.svg";

const VPTravelStopModalManager = ({
  onToggleModal,
  clickedIcon,
  items,
  onSetClickedIcon,
  className,
}: {
  clickedIcon: TravelStopTypes.TravelStops;
  onToggleModal: () => void;
  items: TravelStopTypes.TravelStops[];
  onSetClickedIcon: (item: TravelStopTypes.TravelStops) => void;
  className?: string;
}) => {
  const isCarouselDisabled = items.length === 1;

  const onSetNextContent = useCallback(() => {
    const currentIndex = items.findIndex(attraction => attraction.info.id === clickedIcon.info.id);

    const newIndex = currentIndex !== items.length - 1 ? currentIndex + 1 : 0;

    onSetClickedIcon(items[newIndex]);
  }, [items, clickedIcon, onSetClickedIcon]);

  const onSetPreviousContent = useCallback(() => {
    const currentIndex = items.findIndex(attraction => attraction.info.id === clickedIcon.info.id);

    const newIndex = currentIndex !== 0 ? currentIndex - 1 : items.length - 1;

    onSetClickedIcon(items[newIndex]);
  }, [items, clickedIcon, onSetClickedIcon]);

  return (
    <VPTravelStopModal
      modalIcon={CameraIcon}
      modalTitle={clickedIcon.info.title}
      onToggleModal={onToggleModal}
      modalContent={clickedIcon}
      onSetNextContent={onSetNextContent}
      onSetPreviousContent={onSetPreviousContent}
      isCarouselDisabled={isCarouselDisabled}
      className={className}
      mobileBackButtonIcon={ArrowRight}
    />
  );
};

export default VPTravelStopModalManager;
