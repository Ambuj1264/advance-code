import { getLocalizedWeekDays } from "components/ui/Itinerary/itineraryUtils";
import { SupportedLanguages } from "types/enums";

export const getItineraryWeekdays = (
  vacationPackageDays: VacationPackageTypes.VacationPackageDay[],
  selectedDates: SharedTypes.SelectedDates,
  activeLocale: SupportedLanguages
) => getLocalizedWeekDays(vacationPackageDays.length, activeLocale, selectedDates.from);

export const isRoomAlreadySelected = (
  selectedHotelsRooms: VacationPackageTypes.SelectedVPStaysRoomType[],
  day: number,
  productId: number | string,
  roomCombinationId: string,
  availabilityId: string
) => {
  const selectedHotel = selectedHotelsRooms.find(
    hotel => hotel.groupedWithDays.some(date => date === day) && hotel.productId === productId
  );
  const selectedRoomCombination = selectedHotel?.roomCombinations.find(
    roomComb => roomComb.roomCombinationId === roomCombinationId && roomComb.isSelected
  );
  return (
    selectedRoomCombination?.availabilities.some(
      availability => availability.availabilityId === availabilityId && availability.isSelected
    ) ?? false
  );
};
