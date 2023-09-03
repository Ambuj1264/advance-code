import React from "react";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import { css } from "@emotion/core";

import { constructGuestsAndRooms } from "components/features/StayProductPage/StayBookingWidget/utils/stayBookingWidgetUtils";
import ChildrenAges from "components/ui/Inputs/TravellerPicker/ChildrenAges";
import ContentDropdown, {
  ArrowIcon,
  DisplayValue,
  DropdownContentWrapper,
} from "components/ui/Inputs/ContentDropdown";
import { gutters, greyColor, borderRadiusSmall, whiteColor } from "styles/variables";
import useToggle from "hooks/useToggle";
import TravelersIcon from "components/icons/travellers.svg";
import RoomIcon from "components/icons/hotel-bedroom.svg";
import BaseIncrementPicker from "components/ui/Inputs/IncrementPicker";
import { Namespaces } from "shared/namespaces";
import { Trans, useTranslation } from "i18n";
import { singleLineTruncation, mqMin, container, skeletonPulse } from "styles/base";

export const ContentDropdownStyled = styled(ContentDropdown)`
  margin: 0;
  padding: 0;
  user-select: none;

  ${container} {
    padding: 0;
  }

  ${DropdownContentWrapper} {
    padding: ${gutters.small / 2}px;

    ${mqMin.large} {
      padding: ${gutters.small}px;
    }
  }

  ${DisplayValue} {
    position: relative;
    margin: 0;
    padding: 0;
  }

  ${ArrowIcon} {
    position: absolute;
    right: ${gutters.small}px;
  }
`;

const iconStyles = (theme: Theme) => css`
  width: 20px;
  height: 20px;
  fill: ${theme.colors.primary};
`;

export const DisplayWrapper = styled.span`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: ${borderRadiusSmall};
  width: 100%;
  height: 100%;
  background-color: ${whiteColor};
`;

const DisplayValueItem = styled.span<{ onlyGuestSelection?: boolean }>(
  ({ onlyGuestSelection = false }) => css`
    position: relative;
    display: flex;
    flex-basis: ${onlyGuestSelection ? 100 : 50}%;
    align-items: center;
    min-width: calc(50% - 0.5px);
    height: 100%;
    padding: ${gutters.small / 4}px 0 ${gutters.small / 4}px ${gutters.small}px;
    color: ${greyColor};
  `
);

const Value = styled.span<{ onlyGuestSelection?: boolean }>(
  ({ onlyGuestSelection = false }) => css`
    ${singleLineTruncation};
    display: block;
    margin-left: ${gutters.small / 2}px;
    width: ${onlyGuestSelection ? 90 : 80}%;
    padding-left: ${gutters.small / 2}px;
  `
);

export const ExpandedInputContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const IncrementPicker = styled(BaseIncrementPicker)`
  :not(:first-of-type) {
    margin-top: ${gutters.large}px;
  }
`;

const Separator = styled.span`
  display: inline-block;
  flex-shrink: 0;
  width: 1px;
  height: 24px;
  background-color: ${rgba(greyColor, 0.5)};
`;

const DropdownLoadingLabel = styled.div([
  skeletonPulse,
  css`
    width: 50px;
    height: 14px;
  `,
]);

const DropdownLoading = styled.div([
  skeletonPulse,
  css`
    height: 45px;
  `,
]);

const LoadingWrapper = styled.div`
  margin-top: 24px;
  height: 69px;
`;

const DesktopRoomAndGuestPicker = ({
  className,
  onSetNumberOfGuests,
  numberOfGuests,
  onSetNumberOfRooms,
  numberOfRooms,
  loading,
  updateChildrenAges,
  label,
  shouldDisplayArrowIcon,
  onInputClick,
  disabled = false,
  onlyGuestSelection = false,
}: {
  className?: string;
  numberOfGuests: SharedTypes.NumberOfGuests;
  onSetNumberOfGuests: (adults: number, children: number) => void;
  numberOfRooms: number;
  onSetNumberOfRooms: (numberOfRooms: number) => void;
  loading: boolean;
  updateChildrenAges: (value: number, index: number) => void;
  label?: string;
  shouldDisplayArrowIcon?: boolean;
  onInputClick?: () => void;
  disabled?: boolean;
  onlyGuestSelection?: boolean;
}) => {
  const roomsAndGuestsGroups = constructGuestsAndRooms(numberOfGuests, onlyGuestSelection);
  const totalGuests = numberOfGuests.adults + numberOfGuests.children.length;
  const [isTravelersOpen, toggleTravelers] = useToggle(false);
  const { t } = useTranslation(Namespaces.accommodationBookingWidgetNs);
  const getPickerTitle = (type?: SharedTypes.GuestType) => {
    if (type === "adults") {
      return t("Adults");
    }
    if (type === "children") {
      return t("Children");
    }
    return t("Rooms");
  };
  if (loading)
    return (
      <LoadingWrapper>
        <DropdownLoadingLabel />
        <DropdownLoading />
      </LoadingWrapper>
    );
  return (
    <ContentDropdownStyled
      className={className}
      id="roomAndGuest"
      inputLabel={label}
      shouldDisplayArrowIcon={shouldDisplayArrowIcon}
      displayValue={
        <DisplayWrapper>
          <DisplayValueItem onlyGuestSelection={onlyGuestSelection}>
            <TravelersIcon css={iconStyles} />
            <Value onlyGuestSelection={onlyGuestSelection}>
              <Trans
                ns={Namespaces.accommodationBookingWidgetNs}
                i18nKey="{numberOfGuests} guests"
                defaults="{numberOfGuests} guests"
                values={{ numberOfGuests: totalGuests }}
              />
            </Value>
          </DisplayValueItem>
          {!onlyGuestSelection && (
            <>
              <Separator />
              <DisplayValueItem>
                <RoomIcon css={iconStyles} />
                <Value>
                  <Trans
                    ns={Namespaces.accommodationNs}
                    i18nKey="{numberOfRooms} rooms"
                    defaults="{numberOfRooms} rooms"
                    values={{ numberOfRooms }}
                  />
                </Value>
              </DisplayValueItem>
            </>
          )}
        </DisplayWrapper>
      }
      isContentOpen={isTravelersOpen}
      onOutsideClick={() => isTravelersOpen && toggleTravelers()}
      toggleContent={() => {
        onInputClick?.();
        if (disabled) return;
        toggleTravelers();
      }}
    >
      <ExpandedInputContainer>
        {roomsAndGuestsGroups.map(({ id, type, defaultNumberOfType }) => {
          const onChange = (number: number) => {
            if (type) {
              const adults = type === "adults" ? number : numberOfGuests.adults;
              const children = type === "children" ? number : numberOfGuests.children.length;
              return onSetNumberOfGuests(adults, children);
            }
            return onSetNumberOfRooms(number);
          };

          const canDecrement = (defaultValue: number) => {
            const value = type ? numberOfGuests[type] : numberOfRooms;
            if (type === "adults") return numberOfGuests.adults > 1;
            if (type === "children") {
              return numberOfGuests.children.length > defaultValue;
            }
            return value > defaultValue;
          };
          const getCount = () => {
            if (type) {
              if (type === "adults") return numberOfGuests[type];
              return numberOfGuests[type].length;
            }
            return numberOfRooms;
          };
          return (
            <IncrementPicker
              key={id}
              id={id}
              canDecrement={canDecrement(defaultNumberOfType)}
              canIncrement
              count={getCount()}
              title={getPickerTitle(type)}
              onChange={onChange}
              dataTestid={`guest-${id}`}
            />
          );
        })}
        {numberOfGuests.children.length > 0 && (
          <ChildrenAges
            childrenAges={numberOfGuests.children}
            updateChildrenAges={updateChildrenAges}
          />
        )}
      </ExpandedInputContainer>
    </ContentDropdownStyled>
  );
};

export default DesktopRoomAndGuestPicker;
