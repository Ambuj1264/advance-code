import React, { useCallback, useContext, useMemo } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { useOnToggleModal } from "../contexts/VPStateHooks";
import { VPActiveModalTypes } from "../contexts/VPModalStateContext";
import { VPCarStateContext } from "../contexts/VPCarStateContext";
import { VPActionCallbackContext } from "../contexts/VPActionStateContext";

import { fontSizeBody2, fontWeightRegular, gutters, guttersPx } from "styles/variables";
import useToggle from "hooks/useToggle";
import NationalityDropdown, {
  StyledDropdown,
} from "components/ui/Inputs/Dropdown/NationalityDropdown";
import CarBookingWidgetConstantContext from "components/features/Car/CarBookingWidget/contexts/CarBookingWidgetConstantContext";
import {
  BookingWidgetExtra,
  BookingWidgetExtrasRow,
} from "components/ui/BookingWidget/BookingWidgetExtras";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { driverAgeOptions } from "components/ui/CarSearchWidget/DriverInformation/driverInformationUtils";
import { Label } from "components/ui/InputWrapper";
import useCountryList from "hooks/useCountryList";
import { NativeSelect } from "components/ui/Inputs/Dropdown/BaseDropdown";
import { mqMax, mqMin } from "styles/base";
import { ContentDropdownStyled, ContentWrapper } from "components/ui/Inputs/RadioSelectionDropdown";
import {
  ArrowIcon,
  DisplayValue,
  DropdownContainer,
  DropdownContentWrapper,
} from "components/ui/Inputs/ContentDropdown";
import { typographySubtitle3 } from "styles/typography";
import { LoadingWrapper } from "components/ui/Inputs/Select";

export const NationalityInputStyled = styled(NationalityDropdown)<{}>`
  flex-basis: 100%;
  padding: 0 ${guttersPx.largeHalf};
  ${mqMax.large} {
    padding: 0;
  }
  div[data-selected="true"] {
    text-align: center;
    ${mqMin.large} {
      padding-left: 25%;
    }
  }
  ${Label} {
    display: none;
    width: 100%;
  }
  ${NativeSelect} {
    ${mqMax.large} {
      left: 0;
    }
  }

  ${mqMin.large} {
    width: 230px;
    padding: 0;
  }

  ${StyledDropdown} {
    div[class*="menu"] {
      min-width: 230px;
      max-width: 230px;
    }
  }
`;

export const StyledNationalityCountryLabel = styled.div([
  typographySubtitle3,
  css`
    max-width: 85%;
    cursor: pointer;
    font-weight: ${fontWeightRegular};
    line-height: 18px;
    overflow: hidden;
    text-overflow: ellipsis;
  `,
]);

export const StyledNationalityDropdownContainer = styled(ContentDropdownStyled)(
  ({ theme }) => css`
    margin: 0;
    padding-left: 0;

    ${mqMin.large} {
      padding: 0;
    }

    ${DisplayValue} {
      position: relative;
      margin-top: 0;
      margin-left: ${guttersPx.small};
      height: auto;
      padding: 0;
      cursor: "pointer";
      color: ${theme.colors.primary};
      white-space: nowrap;
    }
    ${ContentWrapper} {
      width: 230px;
      min-width: 230px;
      height: 186px;

      ${mqMax.medium} {
        height: auto;
      }

      ${mqMax.large} {
        padding: 0;
      }
    }

    ${DropdownContainer} {
      top: 20px;
      border-color: ${theme.colors.primary};
    }
    ${DropdownContentWrapper} {
      padding: ${guttersPx.smallHalf};
      ${mqMax.large} {
        padding: ${guttersPx.smallHalf};
      }
    }

    ${ArrowIcon} {
      margin-left: ${gutters.large / 4}px;
      width: 12px;
      height: 12px;
      transform: rotate(90deg);
      fill: ${theme.colors.primary};
    }

    ${LoadingWrapper} {
      padding-left: 60px;
      font-size: ${fontSizeBody2};
      text-align: left;
    }
  `
);

const VPBookingWidgetCarExtras = ({ className }: { className?: string }) => {
  const { t: vacationPackageT } = useTranslation(Namespaces.vacationPackageNs);
  const { driverCountryCode, driverAge } = useContext(CarBookingWidgetConstantContext);
  const { driverCountryCode: vpDriverCountryCode, selectedCarId } = useContext(VPCarStateContext);
  const { onSetVPDriverAge, onSetVPDriverCountryCode } = useContext(VPActionCallbackContext);
  const [nationalityInputShown, toggleNationalityInputShown, , closeNationalityInput] =
    useToggle(false);
  const { countries } = useCountryList();
  const [, toggleCarExtrasEditModal] = useOnToggleModal(VPActiveModalTypes.EditCar, selectedCarId);

  const nationality = useMemo(
    () =>
      countries.find(country => country?.countryCode === (vpDriverCountryCode || driverCountryCode))
        ?.name,
    [countries, vpDriverCountryCode, driverCountryCode]
  );

  const driversAgeOptions = useMemo(
    () =>
      driverAgeOptions.map(({ value, nativeLabel }) => ({
        id: value ?? "",
        name: nativeLabel ?? "",
      })),
    []
  );
  const driversAgeSelectedOption =
    driversAgeOptions.find(selected => selected.id === driverAge) || driversAgeOptions[0];

  const driversCountryTitle = vacationPackageT("I live in {country}", {
    country: nationality,
  });
  const extraOptions = useMemo(
    () => [
      {
        id: "extras",
        name: vacationPackageT("Extras"),
      },
    ],
    [vacationPackageT]
  );

  const onNationalityChange = useCallback(
    (value: string) => {
      onSetVPDriverCountryCode(value);
      toggleNationalityInputShown();
    },
    [onSetVPDriverCountryCode, toggleNationalityInputShown]
  );
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const doNothing = useCallback(() => {}, []);

  return (
    <BookingWidgetExtrasRow className={className}>
      <BookingWidgetExtra
        id="extra-drivers-age"
        selectedOptionId={driversAgeSelectedOption.id}
        selectedOptionTitle={vacationPackageT("Driver's age is {age}", {
          age: driversAgeSelectedOption.name,
        })}
        options={driversAgeOptions}
        onChange={onSetVPDriverAge}
        directionOverflow="right"
      />
      <StyledNationalityDropdownContainer
        id="extra-car-nationality-input"
        className={className}
        displayValue={
          <StyledNationalityCountryLabel>{driversCountryTitle}</StyledNationalityCountryLabel>
        }
        isContentOpen={nationalityInputShown}
        toggleContent={toggleNationalityInputShown}
        onOutsideClick={closeNationalityInput}
        directionOverflow="left"
        shouldDisplayArrowIcon
      >
        <ContentWrapper dropdownWidth={300}>
          <NationalityInputStyled
            onChange={onNationalityChange}
            nationality={driverCountryCode}
            hasError={false}
            maxHeight="140px"
            isListView
          />
        </ContentWrapper>
      </StyledNationalityDropdownContainer>
      {selectedCarId && (
        <BookingWidgetExtra
          id="extra-car-extras"
          selectedOptionId={extraOptions[0].id}
          options={extraOptions}
          onClick={toggleCarExtrasEditModal}
          onChange={doNothing}
        />
      )}
    </BookingWidgetExtrasRow>
  );
};

export default VPBookingWidgetCarExtras;
