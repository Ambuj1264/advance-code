import React, { Fragment, useCallback } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import {
  onRoomsChange,
  onAdultsChange,
  onChildrenChange,
  onUpdateChildrenAges,
} from "./utils/roomAndGuestUtils";

import ChildrenAges from "components/ui/Inputs/TravellerPicker/ChildrenAges";
import { gutters } from "styles/variables";
import BaseIncrementPicker from "components/ui/Inputs/IncrementPicker";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import { typographySubtitle2 } from "styles/typography";

export const HeaderWrapper = styled.div(({ theme }) => [
  typographySubtitle2,
  css`
    color: ${theme.colors.primary};
  `,
]);

export const GuestHeaderWrapper = styled.div(({ theme }) => [
  typographySubtitle2,
  css`
    margin-top: ${gutters.small}px;
    color: ${theme.colors.primary};
  `,
]);

export const ExpandedInputContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const IncrementPicker = styled(BaseIncrementPicker)`
  margin-top: ${gutters.small / 2}px;
`;

export const ChildIncrementPicker = styled(BaseIncrementPicker)`
  margin-top: ${gutters.small}px;
`;

const DesktopRoomAndGuestPickerContent = ({
  onlyGuestSelection = false,
  onlyRoomSelection = false,
  occupancies,
  onSetOccupancies,
  onSetRooms,
  roomIncrementLimit,
  namespace = Namespaces.accommodationNs,
  dataTestid,
}: {
  onlyGuestSelection?: boolean;
  onlyRoomSelection?: boolean;
  occupancies: StayBookingWidgetTypes.Occupancy[];
  onSetOccupancies: (occupancies: StayBookingWidgetTypes.Occupancy[]) => void;
  onSetRooms?: (occupancies: StayBookingWidgetTypes.Occupancy[]) => void;
  roomIncrementLimit?: number;
  namespace?: Namespaces;
  dataTestid?: string;
}) => {
  const { t } = useTranslation(namespace);
  const numberOfRooms = occupancies.length;
  const onRoomsValueChange = useCallback(
    (value: number) => onRoomsChange(occupancies, onSetRooms || onSetOccupancies, value),
    [occupancies, onSetOccupancies, onSetRooms]
  );
  const onAdultsValueChange = useCallback(
    (value: number, index: number) => onAdultsChange(occupancies, onSetOccupancies, value, index),
    [occupancies, onSetOccupancies]
  );
  const onChildrenValueChange = useCallback(
    (value: number, index: number) => onChildrenChange(occupancies, onSetOccupancies, value, index),
    [occupancies, onSetOccupancies]
  );
  const onUpdateChildrenAgesValue = useCallback(
    (value: number, childIndex: number, index: number) =>
      onUpdateChildrenAges(occupancies, onSetOccupancies, value, childIndex, index),
    [occupancies, onSetOccupancies]
  );
  return (
    <ExpandedInputContainer>
      {!onlyGuestSelection && (
        <>
          <HeaderWrapper>{t("Select number of rooms")}</HeaderWrapper>
          <IncrementPicker
            key="roomSelectionPicker"
            id="roomSelectionPicker"
            canDecrement={numberOfRooms > 1}
            canIncrement={roomIncrementLimit ? numberOfRooms < roomIncrementLimit : true}
            count={occupancies.length}
            title={t("Rooms")}
            onChange={onRoomsValueChange}
            dataTestid={dataTestid}
          />
        </>
      )}
      {!onlyRoomSelection &&
        occupancies.map(({ numberOfAdults, childrenAges }, index) => {
          return (
            <Fragment key={`Room${String(index)}MobileGuestSelection`}>
              {!onlyGuestSelection && (
                <GuestHeaderWrapper>
                  {t("Room {roomNumber}", { roomNumber: index + 1 })}
                </GuestHeaderWrapper>
              )}
              <IncrementPicker
                key={`room${String(index)}AdultPicker`}
                id={`room${String(index)}AdultPicker`}
                canDecrement={numberOfAdults > 1}
                canIncrement
                count={numberOfAdults}
                title={t("Adults")}
                onChange={(value: number) => onAdultsValueChange(value, index)}
              />
              <ChildIncrementPicker
                key={`room${String(index)}ChildrenPicker`}
                id={`room${String(index)}ChildrenPicker`}
                canDecrement={childrenAges.length > 0}
                canIncrement
                count={childrenAges.length}
                title={t("Children")}
                onChange={(value: number) => onChildrenValueChange(value, index)}
              />
              {childrenAges.length > 0 && (
                <ChildrenAges
                  childrenAges={childrenAges}
                  updateChildrenAges={(value: number, childIndex: number) =>
                    onUpdateChildrenAgesValue(value, childIndex, index)
                  }
                  namespace={namespace}
                />
              )}
            </Fragment>
          );
        })}
    </ExpandedInputContainer>
  );
};

export default DesktopRoomAndGuestPickerContent;
