import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { TourType } from "types/enums";

const useBookingButtonCTA = (tourType: string) => {
  const { t } = useTranslation(Namespaces.commonBookingWidgetNs);
  const { t: tourT } = useTranslation(Namespaces.tourBookingWidgetNs);
  if (tourType === TourType.Day) return tourT("Book Now");
  return t("Continue to book");
};

export default useBookingButtonCTA;
