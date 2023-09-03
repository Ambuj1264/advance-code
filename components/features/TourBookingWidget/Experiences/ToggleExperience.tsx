import React, { memo, useContext } from "react";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import { css } from "@emotion/core";

import ExperienceQuestionContainer from "./ExperienceQuestionsContainer";

import bookingWidgetStateContext from "components/features/TourBookingWidget/contexts/BookingWidgetStateContext";
import BookingWidgetExperiencesHiddenInput from "components/ui/BookingWidget/BookingWidgetHiddenInput";
import ToggleButton from "components/ui/Inputs/ToggleButton";
import useToggle from "hooks/useToggle";
import { useCurrencyWithDefault } from "hooks/useCurrency";
import currencyFormatter from "utils/currencyFormatUtils";
import { useTranslation } from "i18n";
import { blackColor, gutters } from "styles/variables";
import { mqMin, skeletonPulse } from "styles/base";
import { typographyBody2, typographySubtitle2 } from "styles/typography";

type Props = {
  experience: ExperiencesTypes.TravelerExperience;
  onSetSelectedExperience: TourBookingWidgetTypes.OnSetSelectedExperience;
  isDefaultToggled: boolean;
  totalNumberOfTravelers: number;
  editItemOption?: TourBookingWidgetTypes.EditItemDetailsOption;
};

const PriceWrapper = styled.div([
  typographyBody2,
  css`
    display: flex;
    flex-direction: column;
    color: ${rgba(blackColor, 0.7)};
  `,
]);

const Price = styled.div(({ theme }) => [
  typographySubtitle2,
  css`
    color: ${theme.colors.action};
  `,
]);

const SubContainer = styled.div`
  margin-top: ${gutters.large / 2}px;
  padding: 0 ${gutters.small}px;
  ${mqMin.large} {
    margin-top: ${gutters.large / 2}px;
    padding: 0 ${gutters.large}px;
  }
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Container = styled.div(
  ({ theme }) =>
    css`
      margin: ${gutters.small / 2}px -${gutters.small}px;
      ${mqMin.large} {
        margin: ${gutters.large / 2}px -${gutters.large}px;
      }
      /* stylelint-disable selector-max-type */
      & + &,
      div + & {
        border-top: 8px solid ${rgba(theme.colors.primary, 0.05)};
      }
    `
);

const ToggleExperienceSkeleton = styled.div([
  skeletonPulse,
  css`
    display: block;
    height: 44px;
  `,
]);

const ToggleExperience = ({
  experience: { id, price, discountValue, calculatePricePerPerson, name, questions, required },
  onSetSelectedExperience,
  isDefaultToggled,
  totalNumberOfTravelers,
  editItemOption,
}: Props) => {
  const isExperienceMandatoryWithFreePrice = price === 0 && required;
  const { currencyCode, convertCurrency } = useCurrencyWithDefault();
  const [activeExperience, toggleActiveExperience] = useToggle(
    (editItemOption && Boolean(Number(editItemOption.selectedValue))) ||
      isDefaultToggled ||
      isExperienceMandatoryWithFreePrice
  );
  const onToggle = () => {
    onSetSelectedExperience({
      experienceId: id,
      count: activeExperience === false ? 1 : 0,
      price,
      discountValue,
      calculatePricePerPerson,
    });
    toggleActiveExperience();
  };
  const { t } = useTranslation();
  const { isGTIVpDefaultOptionsLoading } = useContext(bookingWidgetStateContext);

  if (isGTIVpDefaultOptionsLoading) {
    return (
      <Container>
        <SubContainer>
          <ToggleExperienceSkeleton />
        </SubContainer>
      </Container>
    );
  }

  return (
    <Container>
      <SubContainer>
        <ToggleContainer>
          {activeExperience && (
            <BookingWidgetExperiencesHiddenInput name={`tour_options[${id}]`} value={id} />
          )}
          <PriceWrapper>
            {name}
            <Price>{`+ ${currencyFormatter(convertCurrency(price))} ${currencyCode} `}</Price>
          </PriceWrapper>
          {!isExperienceMandatoryWithFreePrice && !required && (
            <ToggleButton
              checked={activeExperience}
              onChange={onToggle}
              onValue={t("Yes")}
              offValue={t("No")}
              id={id}
            />
          )}
        </ToggleContainer>
        {questions.length > 0 && activeExperience && (
          <ExperienceQuestionContainer
            count={calculatePricePerPerson ? totalNumberOfTravelers : 1}
            questions={questions}
            experienceId={id}
          />
        )}
      </SubContainer>
    </Container>
  );
};

export default memo(ToggleExperience);
