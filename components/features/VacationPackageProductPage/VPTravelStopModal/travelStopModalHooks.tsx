import { useState, useCallback, useEffect } from "react";

import useVPAttraction from "../hooks/useVPAttraction";
import useVPDestination from "../hooks/useVPDestination";

import { useTranslation } from "i18n";
import useToggle from "hooks/useToggle";
import { Namespaces } from "shared/namespaces";
import { TravelStopType } from "types/enums";
import {
  constructTravelStopAttractions,
  constructTravelStopDestinations,
} from "components/ui/TravelStop/travelStopUtils";
import useActiveLocale from "hooks/useActiveLocale";

export const useTravelStopModal = () => {
  const locale = useActiveLocale();
  const [isModalToggled, toggleModal] = useToggle();
  const [typeOftravelStop, setTravelStopType] = useState<TravelStopType>();
  const [clickedIcon, setClickedIcon] = useState<TravelStopTypes.TravelStops>();
  const [travelStopItems, setItems] = useState<TravelStopTypes.TravelStops[]>([]);
  const { t } = useTranslation(Namespaces.vacationPackageNs);

  const onError = useCallback(() => {
    setClickedIcon({
      ...clickedIcon!,
      isLoading: false,
    });
  }, [clickedIcon]);

  const setSelectedItem = useCallback(
    (selectedItem: TravelStopTypes.TravelStops) => {
      if (
        !clickedIcon ||
        // In case when user open the same modal that was previously closed
        clickedIcon.info.id !== selectedItem.info.id
      ) {
        setClickedIcon({
          ...selectedItem,
          isLoading: true,
        });
      }
    },
    [clickedIcon]
  );

  const { fetchAttraction, fetchAttractionData, fetchAttractionError } = useVPAttraction();

  const { fetchDestination, fetchDestinationData, fetchDestinationError } = useVPDestination();

  const handleTravelStopChange = useCallback(
    (travelStop: TravelStopTypes.TravelStops, travelStopType: TravelStopType) => {
      setTravelStopType(travelStopType);
      const fetchTravelStop =
        travelStopType === TravelStopType.ATTRACTION ? fetchAttraction : fetchDestination;

      fetchTravelStop({
        variables: {
          where: {
            id: travelStop.info.id,
          },
          locale,
        },
      });

      setSelectedItem(travelStop);
    },
    [fetchAttraction, fetchDestination, setSelectedItem, locale]
  );

  const createHandleTravelStopModalToggle = useCallback(
    (travelStops: TravelStopTypes.TravelStops[], travelStopType: TravelStopType) =>
      (travelStopInfo?: SharedTypes.Icon) => {
        if (travelStopInfo) {
          const currentTravelStop = travelStops.find(tStop => travelStopInfo.id === tStop.info.id);

          setItems(travelStops.filter(tStop => tStop.info.isClickable === true));

          handleTravelStopChange(currentTravelStop!, travelStopType);
        }
        toggleModal();
      },
    [handleTravelStopChange, toggleModal]
  );

  const handleItemChange = (item: TravelStopTypes.TravelStops) => {
    handleTravelStopChange(item, item.type);
  };

  // TODO: remove this effect and use lazyQuery onError/onComplete callbacks
  // when https://app.asana.com/0/1118345689058923/1201623819222373/f is done
  useEffect(() => {
    if (typeOftravelStop === TravelStopType.ATTRACTION) {
      if (fetchAttractionData && clickedIcon?.isLoading) {
        setClickedIcon(
          constructTravelStopAttractions([fetchAttractionData.attractionLandingPage], t)[0]
        );
      } else if (fetchAttractionError && !clickedIcon?.isLoading === false) {
        onError();
      }
    }

    if (typeOftravelStop === TravelStopType.DESTINATION) {
      if (fetchDestinationData && clickedIcon?.isLoading) {
        setClickedIcon(
          constructTravelStopDestinations([fetchDestinationData.destinationLandingPage], t)[0]
        );
      } else if (fetchDestinationError && !clickedIcon?.isLoading === false) {
        onError();
      }
    }
  }, [
    clickedIcon,
    fetchAttractionData,
    fetchAttractionError,
    fetchDestinationData,
    fetchDestinationError,
    onError,
    t,
    typeOftravelStop,
  ]);

  return {
    clickedIcon,
    travelStopItems,
    isModalToggled,
    toggleModal,
    createHandleTravelStopModalToggle,
    handleItemChange,
  };
};
