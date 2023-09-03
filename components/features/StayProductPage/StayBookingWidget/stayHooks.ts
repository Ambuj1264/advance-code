import { useCallback, useEffect } from "react";

import { BookingWidgetView } from "./types/enums";
import { useStayBookingWidgetContext } from "./StayBookingWidgetStateContext";
import {
  getTotalPrice,
  getTotalSelectedRoomTypesCount,
  getSelectedRoomCombinationPrice,
} from "./utils/stayBookingWidgetUtils";

import { useCurrencyWithDefault } from "hooks/useCurrency";
import { setDatesInLocalStorage } from "utils/localStorageUtils";
import { useSettings } from "contexts/SettingsContext";
import { Marketplace } from "types/enums";

export const useOnDateSelection = () => {
  const { setContextState, selectedDates } = useStayBookingWidgetContext();

  return useCallback(
    (newSelectedDates: SharedTypes.SelectedDates) => {
      setDatesInLocalStorage(selectedDates);

      setContextState({
        selectedDates: newSelectedDates,
      });
    },
    [selectedDates, setContextState]
  );
};

export const useToggleIsOpen = () => {
  const { setContextState, isModalOpen } = useStayBookingWidgetContext();

  return useCallback(() => {
    setContextState({ isModalOpen: !isModalOpen });
  }, [isModalOpen, setContextState]);
};

export const useSetBookingWidgetView = () => {
  const { setContextState } = useStayBookingWidgetContext();

  return useCallback(
    (bookingWidgetView: BookingWidgetView) => {
      setContextState({ bookingWidgetView });
    },
    [setContextState]
  );
};

export const useSetGroupedRates = () => {
  const { setContextState } = useStayBookingWidgetContext();
  return useCallback(
    groupedRates => {
      setContextState({
        groupedRates,
      });
    },
    [setContextState]
  );
};

export const useSetRoomTypes = () => {
  const { setContextState } = useStayBookingWidgetContext();
  return useCallback(
    (roomTypes: StayBookingWidgetTypes.RoomType[]) => {
      const fromPrice =
        roomTypes.length > 0
          ? Math.round(
              Math.min(
                ...roomTypes.map(
                  (room: StayBookingWidgetTypes.RoomType) => room.fromPriceObject.price
                )
              )
            )
          : 0;
      const hasSelectedRoomTypes = getTotalSelectedRoomTypesCount(roomTypes) > 0;
      setContextState({
        roomTypes,
        isAvailabilityLoading: false,
        fromPrice,
        ...(hasSelectedRoomTypes
          ? {
              price: getTotalPrice(roomTypes),
            }
          : {}),
      });
    },
    [setContextState]
  );
};

export const useSetRoomCombinations = () => {
  const { setContextState } = useStayBookingWidgetContext();
  return useCallback(
    roomCombinations => {
      const selectedAvailability = getSelectedRoomCombinationPrice(roomCombinations);
      setContextState({
        roomCombinations,
        isAvailabilityLoading: false,
        ...(selectedAvailability
          ? {
              price: selectedAvailability.priceObject.price,
              totalPrice: selectedAvailability.priceObject,
            }
          : {}),
      });
    },
    [setContextState]
  );
};

export const useUpdateSelectedRooms = () => {
  const { setAllContextState } = useStayBookingWidgetContext();
  return useCallback(
    (room: StayBookingWidgetTypes.RoomOffer, roomTypeId: string, value: number) => {
      setAllContextState(prevState => {
        const { roomTypes } = prevState;
        const newRoomTypes = roomTypes.reduce((rooms, roomType) => {
          return [
            ...rooms,
            {
              ...roomType,
              roomOffers: roomType.roomOffers.map(roomOffer => {
                if (roomType.roomTypeId === roomTypeId && roomOffer === room) {
                  return {
                    ...roomOffer,
                    isSelected: value > 0,
                    numberOfSelectedRooms: value,
                  };
                }
                return roomOffer;
              }),
            },
          ];
        }, [] as StayBookingWidgetTypes.RoomType[]);

        return {
          ...prevState,
          roomTypes: newRoomTypes,
          price: getTotalPrice(newRoomTypes),
        };
      });
    },
    [setAllContextState]
  );
};

export const useSetIsAvailabilityLoading = () => {
  const { setContextState } = useStayBookingWidgetContext();
  return useCallback(
    (isAvailabilityLoading: boolean) => {
      setContextState({
        isAvailabilityLoading,
      });
    },
    [setContextState]
  );
};

export const useToggleIsFormLoading = () => {
  const { setContextState, isFormLoading } = useStayBookingWidgetContext();

  return useCallback(() => {
    setContextState({ isFormLoading: !isFormLoading });
  }, [isFormLoading, setContextState]);
};

export const useShouldOpenAcceptModal = (
  hasPriceChanged: boolean,
  isNotAvailable: boolean,
  hasAcceptedChange: boolean,
  isChangeModalOpen: boolean,
  onOpenChangeModal: (isOpen: boolean) => void
) => {
  useEffect(() => {
    if ((hasPriceChanged || isNotAvailable) && !hasAcceptedChange && !isChangeModalOpen) {
      onOpenChangeModal(true);
    }
  }, [hasAcceptedChange, hasPriceChanged, isChangeModalOpen, isNotAvailable, onOpenChangeModal]);
};

export const useStayPrice = () => {
  const { marketplace } = useSettings();
  const isGTE = marketplace === Marketplace.GUIDE_TO_EUROPE;
  const { price, fromPrice } = useStayBookingWidgetContext();
  const { convertCurrency } = useCurrencyWithDefault();
  const gtePriceOrFromPrice = price > 0 ? price : convertCurrency(fromPrice);
  return isGTE ? gtePriceOrFromPrice : convertCurrency(price > 0 ? price : fromPrice);
};

export const useOnSelectRoomType = () => {
  const { setAllContextState } = useStayBookingWidgetContext();
  return useCallback(
    (roomTypeId: string, isRemoving: boolean) => {
      setAllContextState(prevState => {
        const { roomTypes, occupancies } = prevState;
        const totalSelectedRooms = getTotalSelectedRoomTypesCount(roomTypes);
        const newRoomTypes: StayBookingWidgetTypes.RoomType[] = roomTypes.map(roomType => {
          if (roomType.roomTypeId === roomTypeId) {
            let totalRoomsToSelect = occupancies.length;
            return {
              ...roomType,
              roomOffers: roomType.roomOffers.map((roomOffer, index) => {
                const numberOfSelectedRooms =
                  totalSelectedRooms > 0
                    ? 1
                    : Math.min(totalRoomsToSelect, roomOffer.availableRooms);
                totalRoomsToSelect = Math.max(totalRoomsToSelect - numberOfSelectedRooms, 0);
                return {
                  ...roomOffer,
                  isSelected: isRemoving ? false : index === 0,
                  numberOfSelectedRooms: !isRemoving && index === 0 ? numberOfSelectedRooms : 0,
                };
              }),
            };
          }
          return roomType;
        });

        return {
          ...prevState,
          roomTypes: newRoomTypes,
          price: getTotalPrice(newRoomTypes),
        };
      });
    },
    [setAllContextState]
  );
};

export const useOnSelectRoomCombination = () => {
  const { setAllContextState } = useStayBookingWidgetContext();
  return useCallback(
    (roomCombinationId: string) => {
      setAllContextState(prevState => {
        const { roomCombinations } = prevState;
        const newRoomCombinations = roomCombinations.map(roomCombination => {
          if (roomCombination.roomCombinationId === roomCombinationId) {
            return {
              ...roomCombination,
              isSelected: true,
              availabilities: roomCombination.availabilities.map((availability, index) => ({
                ...availability,
                isSelected: index === 0,
              })),
            };
          }
          return {
            ...roomCombination,
            isSelected: false,
            availabilities: roomCombination.availabilities.map(availability => ({
              ...availability,
              isSelected: false,
            })),
          };
        });
        const selectedAvailability = getSelectedRoomCombinationPrice(newRoomCombinations);

        return {
          ...prevState,
          roomCombinations: newRoomCombinations,
          ...(selectedAvailability
            ? {
                price: selectedAvailability.priceObject.price,
                totalPrice: selectedAvailability.priceObject,
              }
            : {}),
        };
      });
    },
    [setAllContextState]
  );
};

export const useOnSelectRoomCombinationAvailability = () => {
  const { setAllContextState } = useStayBookingWidgetContext();
  return useCallback(
    (roomCombinationId: string, availabilityId: string) => {
      setAllContextState(prevState => {
        const { roomCombinations } = prevState;
        const newRoomCombinations = roomCombinations.map(roomCombination => {
          if (roomCombination.roomCombinationId === roomCombinationId) {
            return {
              ...roomCombination,
              isSelected: true,
              availabilities: roomCombination.availabilities.map(availability => ({
                ...availability,
                isSelected: availabilityId === availability.availabilityId,
              })),
            };
          }
          return {
            ...roomCombination,
            isSelected: false,
            availabilities: roomCombination.availabilities.map(availability => ({
              ...availability,
              isSelected: false,
            })),
          };
        });
        const selectedAvailability = getSelectedRoomCombinationPrice(newRoomCombinations);
        return {
          ...prevState,
          roomCombinations: newRoomCombinations,
          ...(selectedAvailability
            ? {
                price: selectedAvailability.priceObject.price,
                totalPrice: selectedAvailability.priceObject,
              }
            : {}),
        };
      });
    },
    [setAllContextState]
  );
};

export const useOnUpdateStayPrices = () => {
  const { roomTypes, setContextState } = useStayBookingWidgetContext();
  return useCallback(
    (
      roomTypePrices: StayBookingWidgetTypes.CalculatePricesRoomType[],
      totalPrice: StayBookingWidgetTypes.StayPriceObject
    ) => {
      const newRoomTypes = roomTypes.map(roomType => {
        const roomTypePrice = roomTypePrices.find(room => room.roomName === roomType.roomTypeName);
        if (roomTypePrice) {
          return {
            ...roomType,
            totalPriceObject: roomTypePrice.price,
          };
        }
        return roomType;
      });
      setContextState({
        roomTypes: newRoomTypes,
        totalPrice,
      });
    },
    [roomTypes, setContextState]
  );
};

export const useOnSetOccupancies = () => {
  const { setContextState } = useStayBookingWidgetContext();
  return useCallback(
    (occupancies: StayBookingWidgetTypes.Occupancy[]) => {
      setContextState({
        occupancies,
      });
    },
    [setContextState]
  );
};
