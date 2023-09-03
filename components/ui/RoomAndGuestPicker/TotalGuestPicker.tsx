import React, { useCallback } from "react";

import {
  onTotalAdultsChange,
  onTotalChildrenChange,
  onTotalChildrenAgesChange,
  getTotalGuests,
} from "./utils/roomAndGuestUtils";
import {
  HeaderWrapper,
  ExpandedInputContainer,
  IncrementPicker,
  ChildIncrementPicker,
} from "./DesktopRoomAndGuestPickerContent";

import ChildrenAges from "components/ui/Inputs/TravellerPicker/ChildrenAges";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";

const TotalGuestPicker = ({
  occupancies,
  onSetOccupancies,
  namespace = Namespaces.accommodationNs,
}: {
  occupancies: StayBookingWidgetTypes.Occupancy[];
  onSetOccupancies: (occupancies: StayBookingWidgetTypes.Occupancy[]) => void;
  namespace?: Namespaces;
}) => {
  const { t } = useTranslation(namespace);
  const totalGuests = getTotalGuests(occupancies);
  const { numberOfAdults, childrenAges } = totalGuests;
  const onAdultsValueChange = useCallback(
    (value: number) => onTotalAdultsChange(occupancies, value, numberOfAdults, onSetOccupancies),
    [occupancies, onSetOccupancies, numberOfAdults]
  );
  const onChildrenValueChange = useCallback(
    (value: number) =>
      onTotalChildrenChange(occupancies, value, childrenAges.length, onSetOccupancies),
    [occupancies, onSetOccupancies, childrenAges]
  );
  const onUpdateChildrenAgesValue = useCallback(
    (value: number, index: number) =>
      onTotalChildrenAgesChange(occupancies, value, index, onSetOccupancies),
    [occupancies, onSetOccupancies]
  );
  return (
    <ExpandedInputContainer>
      <HeaderWrapper>{t("Travelers")}</HeaderWrapper>
      <IncrementPicker
        key="TravelerAdultPicker"
        id="TravelerAdultPicker"
        canDecrement={numberOfAdults > 1}
        canIncrement
        count={numberOfAdults}
        title={t("Adults")}
        onChange={(value: number) => onAdultsValueChange(value)}
        dataTestid="traveller-adults"
      />
      <ChildIncrementPicker
        key="VPTravelerChildrenPicker"
        id="VPTravelerChildrenPicker"
        canDecrement={childrenAges.length > 0}
        canIncrement
        count={childrenAges.length}
        title={t("Children")}
        onChange={(value: number) => onChildrenValueChange(value)}
        dataTestid="traveller-children"
      />
      {childrenAges.length > 0 && (
        <ChildrenAges
          childrenAges={childrenAges}
          updateChildrenAges={onUpdateChildrenAgesValue}
          namespace={namespace}
        />
      )}
    </ExpandedInputContainer>
  );
};

export default TotalGuestPicker;
