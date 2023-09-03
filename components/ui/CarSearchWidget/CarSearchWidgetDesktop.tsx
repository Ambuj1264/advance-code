import React, { useContext } from "react";
import { useTheme } from "emotion-theming";
import styled from "@emotion/styled";

import SearchWidgetButton from "../SearchWidget/SearchWidgetButton";
import Label from "../SearchWidget/Label";
import { AutocompleteInputLargeHalf } from "../FrontSearchWidget/FrontTabsShared";
import { InputStyled, Separator } from "../Inputs/AutocompleteInput/AutocompleteInput";

import CarSearchWidgetCallbackContext, {
  CarSearchWidgetSharedTypes,
} from "./contexts/CarSearchWidgetCallbackContext";
import DriverInformation from "./DriverInformation/DriverInformation";
import DatePickerContainer from "./DatePicker/CarDatePickerContainer";
import { getSearchPageLink } from "./utils/carSearchWidgetUtils";
import CarnectLocationPickerContainer from "./LocationPicker/CarnectLocationPickerContainer";

import { searchWidgetAlignment } from "components/features/VacationPackagesSearchWidget/VacationPackageSearchWidget";
import { gutters } from "styles/variables";
import { Trans, useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import Button from "components/ui/Inputs/Button";
import { ButtonSize } from "types/enums";
import { mqMin } from "styles/base";

const PickupInfoWrapper = styled.div`
  margin-bottom: ${gutters.small / 2}px;
`;

const ButtonWrapper = styled.div`
  margin-top: ${gutters.large}px;
  width: 100%;
`;

const StyledDatePickerContainer = styled(DatePickerContainer)<{}>`
  flex-grow: 0;
  ${searchWidgetAlignment};
`;

const StyledCarnectLocationPickerContainer = styled(CarnectLocationPickerContainer)`
  ${AutocompleteInputLargeHalf} {
    ${mqMin.large} {
      ${InputStyled} {
        height: 40px;
        line-height: 40px;
      }
      ${searchWidgetAlignment};
    }
  }
  ${Separator} {
    top: ${gutters.small / 2}px;
  }
`;

const LocationPicker = ({
  onPickupLocationChange,
  onDropoffLocationChange,
  disableInputs,
  pickupId,
  dropoffId,
  onPickupInputClick,
  selectedPickupName,
  selectedDropoffName,
}: {
  onPickupLocationChange: CarSearchWidgetSharedTypes["onLocationChange"];
  onDropoffLocationChange: CarSearchWidgetSharedTypes["onLocationChange"];
  disableInputs: boolean;
  pickupId?: string;
  dropoffId?: string;
  onPickupInputClick?: () => void;
  selectedPickupName?: string;
  selectedDropoffName?: string;
}) => {
  return (
    <PickupInfoWrapper>
      <Label>
        <Trans ns={Namespaces.carSearchNs}>Pick-up / Drop-off location</Trans>
      </Label>
      <StyledCarnectLocationPickerContainer
        id="searchPageLocationPicker"
        onPickupChange={onPickupLocationChange}
        onDropoffChange={onDropoffLocationChange}
        selectedPickupId={pickupId}
        selectedDropoffId={dropoffId}
        selectedPickupName={selectedPickupName}
        selectedDropoffName={selectedDropoffName}
        disabled={disableInputs}
        onPickupInputClick={onPickupInputClick}
        onDropoffInputClick={onPickupInputClick}
        isWideDropdown={false}
      />
    </PickupInfoWrapper>
  );
};

const CarSearchWidgetDesktop = ({
  searchLink,
  disableInputs = false,
  onDateInputClick,
  onPickupInputClick,
  selectedDates,
  driverCountry,
  driverAge,
  dropoffLocationName,
  pickupLocationName,
  pickupId,
  dropoffId,
  editItem,
  variant,
}: {
  searchLink?: string;
  disableInputs?: boolean;
  onDateInputClick?: () => void;
  onPickupInputClick?: () => void;
  selectedDates: SharedTypes.SelectedDates;
  driverAge: number;
  driverCountry?: string;
  dropoffLocationName?: string;
  dropoffId?: string;
  pickupLocationName?: string;
  pickupId?: string;
  editItem?: number;
  variant?: "normal" | "modal";
}) => {
  const {
    onPickupLocationChange,
    onDropoffLocationChange,
    onSearchClick,
    onSetDriverCountry,
    onSetDriverAge,
  } = useContext(CarSearchWidgetCallbackContext);
  const theme: Theme = useTheme();
  const { t } = useTranslation(Namespaces.commonSearchNs);
  const isFormValid = selectedDates.from && selectedDates.to && pickupId && dropoffId;
  return (
    <>
      {variant !== "modal" && (
        <LocationPicker
          onPickupLocationChange={onPickupLocationChange}
          onDropoffLocationChange={onDropoffLocationChange}
          pickupId={pickupId}
          dropoffId={dropoffId}
          disableInputs={disableInputs}
          onPickupInputClick={onPickupInputClick}
          selectedPickupName={pickupLocationName}
          selectedDropoffName={dropoffLocationName}
        />
      )}
      <Label>
        <Trans ns={Namespaces.commonSearchNs}>Pick up details</Trans>
      </Label>
      <StyledDatePickerContainer
        selectedDates={selectedDates}
        disabled={disableInputs}
        onDateInputClick={onDateInputClick}
      />
      <DriverInformation
        driverAge={driverAge}
        setDriverAge={onSetDriverAge}
        driverCountry={driverCountry}
        setDriverCountry={onSetDriverCountry}
      />
      <ButtonWrapper>
        {searchLink ? (
          <Button
            color="action"
            theme={theme}
            buttonSize={ButtonSize.Small}
            type="button"
            target="_blank"
            href={
              pickupId && dropoffId
                ? getSearchPageLink({
                    searchLink,
                    selectedDates,
                    pickupId,
                    dropoffId,
                    driverAge,
                    driverCountry,
                    dropoffLocationName,
                    pickupLocationName,
                    editItem,
                  })
                : undefined
            }
          >
            <Trans ns={Namespaces.carSearchNs}>Search for availability</Trans>
          </Button>
        ) : (
          <SearchWidgetButton
            onSearchClick={onSearchClick}
            tooltipErrorMessage={
              !isFormValid ? t("Please fill in your search information") : undefined
            }
          />
        )}
      </ButtonWrapper>
    </>
  );
};

export default CarSearchWidgetDesktop;
