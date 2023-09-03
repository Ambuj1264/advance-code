import React, { useCallback } from "react";
import { constructUniqueIdentifier } from "@travelshift/ui/utils/utils";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import {
  checkIfShouldShowExperiencePriceSkeleton,
  getExperiencePrice,
  getExperiencePriceInformation,
  isSelectedAnswerIncluded,
} from "./experiencesUtils";

import { SelectMenuPlacement } from "types/enums";
import BookingWidgetDropdownHeader, {
  OptionPriceSkeleton,
} from "components/ui/BookingWidget/DropdownHeader";
import DropdownOption, { ExtraInfo } from "components/ui/Inputs/Dropdown/DropdownOption";
import Dropdown from "components/ui/Inputs/Dropdown/Dropdown";
import { useTranslation } from "i18n";
import { fontWeightRegular, gutters } from "styles/variables";

type Props = {
  experience: ExperiencesTypes.MultiSelectionExperience;
  selectedExperience: TourBookingWidgetTypes.SelectedGroupExperience;
  numberOfTravelers: SharedTypes.NumberOfTravelers;
  onSetSelectedExperience: (answerId: string) => void;
  currency: string;
  convertCurrency: (value: number) => number;
  isLivePricing: boolean;
  isGTIVpDefaultOptionsLoading: boolean;
  isGTIVpLivePriceLoading: boolean;
  isSelectedNonDefaultOption: boolean;
};
const DropdownWrapper = styled.div`
  margin-top: ${gutters.small / 2}px;
`;

const StyledDropdownOption = styled(DropdownOption)<{ isSelected: boolean }>(
  ({ isSelected, theme }) => [
    css`
      ${ExtraInfo} {
        color: ${isSelected ? theme.colors.action : theme.colors.primary};
        font-weight: ${fontWeightRegular};
      }
    `,
  ]
);

const ExperienceDropdown = ({
  experience,
  selectedExperience,
  numberOfTravelers,
  onSetSelectedExperience,
  currency,
  convertCurrency,
  isLivePricing,
  isGTIVpDefaultOptionsLoading,
  isGTIVpLivePriceLoading,
  isSelectedNonDefaultOption,
}: Props) => {
  const onExperienceDropdownChange = useCallback(
    (newId: string) => {
      onSetSelectedExperience(newId);
    },
    [onSetSelectedExperience]
  );
  const { t } = useTranslation();

  if (!selectedExperience) return null;

  const selectedPrice = isLivePricing
    ? 0
    : getExperiencePrice(selectedExperience.prices, numberOfTravelers);
  const { isIncluded: isSelectedOptionIncluded, isDefault: isSelectedOptionDefault } =
    isSelectedAnswerIncluded(experience.answers, selectedExperience.answerId);

  return (
    <>
      <BookingWidgetDropdownHeader
        title={experience.name}
        price={selectedPrice}
        isLivePricing={isLivePricing}
        isGTIVpDefaultOptionsLoading={isGTIVpDefaultOptionsLoading}
        isGTIVpLivePriceLoading={isGTIVpLivePriceLoading}
        isSelectedNonDefaultOption={isSelectedNonDefaultOption}
        currency={currency}
        convertCurrency={convertCurrency}
        perPerson={selectedExperience.calculatePricePerPerson}
        isIncluded={isSelectedOptionIncluded && (isLivePricing || selectedPrice === 0)}
        isDefault={isSelectedOptionDefault}
      />
      <DropdownWrapper>
        <Dropdown
          id={`${constructUniqueIdentifier(experience.name)}Dropdown`}
          onChange={onExperienceDropdownChange}
          options={experience.answers.map(({ name, prices, vpPrice, id, included }) => {
            const isOptionSelected = selectedExperience && id === selectedExperience.answerId;
            const isIncluded = isLivePricing ? isOptionSelected : included;
            const priceInformation = getExperiencePriceInformation({
              prices,
              vpSelectedOptionDiff: vpPrice.selectedOptionDiff,
              isLivePricing,
              isIncluded,
              numberOfTravelers,
              currency,
              convertCurrency,
              tFunction: t,
            });
            const shouldShowPriceSkeleton = checkIfShouldShowExperiencePriceSkeleton({
              isIncluded,
              isGTIVpLivePriceLoading,
              isGTIVpDefaultOptionsLoading,
              isSelectedNonDefaultOption,
            });

            const extraInfo = shouldShowPriceSkeleton ? <OptionPriceSkeleton /> : priceInformation;

            return {
              value: id,
              nativeLabel: name,
              label: (
                <StyledDropdownOption
                  id={`${constructUniqueIdentifier(name)}DropdownOption`}
                  isSelected={isOptionSelected}
                  label={name}
                  extraInfo={extraInfo}
                />
              ),
            };
          })}
          selectedValue={selectedExperience.answerId.toString()}
          menuPlacement={SelectMenuPlacement.AUTO}
          isSearchable
        />
      </DropdownWrapper>
    </>
  );
};

export default ExperienceDropdown;
