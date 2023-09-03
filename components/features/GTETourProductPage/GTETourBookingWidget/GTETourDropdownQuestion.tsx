import React, { useCallback } from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import { useTheme } from "emotion-theming";

import GTETourQuestion, { Container, StyledInputWrapper } from "./GTETourQuestion";
import {
  useOnChangeBookingQuestionAnswer,
  useOnChangeConditionalBookingQuestionAnswer,
} from "./gteTourHooks";
import { GTETourQuestionId, GTETourDropdownType } from "./types/enums";

import { MaybeColumn } from "components/ui/Grid/Column";
import Dropdown from "components/ui/Inputs/Dropdown/Dropdown";
import { mqMin } from "styles/base";
import { gutters } from "styles/variables";
import { typographyBody2 } from "styles/typography";
import BookingWidgetControlRow from "components/ui/BookingWidget/BookingWidgetControlRow";

export const SectionWrapper = styled.div<{ isInModal?: boolean; isConditional?: boolean }>(
  ({ isInModal = false, isConditional = false }) => [
    typographyBody2,
    css`
      display: flex;
      flex-direction: column;
      align-items: baseline;
      justify-content: space-between;
      margin-top: ${gutters.small}px;
      ${mqMin.large} {
        margin: ${gutters.small}px ${gutters.large}px 0px ${gutters.large}px;
      }
    `,
    isInModal &&
      !isConditional &&
      css`
        ${StyledInputWrapper} {
          margin-top: ${gutters.small}px;
          padding: 0 ${gutters.small / 3}px;
        }
        ${mqMin.large} {
          margin: 0;
        }
      `,
    isInModal &&
      isConditional &&
      css`
        ${mqMin.large} {
          margin: ${gutters.small}px 0px 0px 0px;
        }
      `,
  ]
);

export const StyledBookingWidgetControlRow = styled(BookingWidgetControlRow)`
  padding: 0;
  ${mqMin.large} {
    margin-top: 0;
    padding-bottom: 0;
  }
`;

const StyledDropdown = styled(Dropdown)`
  svg {
    width: 14px;
    height: 14px;
  }
`;

const GTETourDropdownQuestion = ({
  id,
  activeDropdown = null,
  productCode,
  onDepartureDropdownOpenStateChangeHandler,
  onArrivalDropdownOpenStateChangeHandler,
  bookingQuestion,
  isArrivalDropdown,
  isInModal = false,
  columns = { small: 1 },
}: {
  id: string;
  activeDropdown?: GTETourBookingWidgetTypes.activeDropdownType;
  productCode: string;
  onDepartureDropdownOpenStateChangeHandler?: ((isOpen: boolean) => void) | undefined;
  onArrivalDropdownOpenStateChangeHandler?: ((isOpen: boolean) => void) | undefined;
  bookingQuestion: GTETourBookingWidgetTypes.TourQuestionAnswer;
  isArrivalDropdown: boolean;
  isInModal?: boolean;
  columns?: SharedTypes.Columns;
}) => {
  const theme: Theme = useTheme();
  const {
    id: questionId,
    answer: questionAnswer,
    label,
    hint,
    providerBookingQuestionId,
    allowedAnswers,
    required,
  } = bookingQuestion;
  const onChangeBookingQuestionAnswer = useOnChangeBookingQuestionAnswer();
  const onChangeConditionalBookingQuestionAnswer = useOnChangeConditionalBookingQuestionAnswer();
  const onOpenStateChange = useCallback(
    (isOpen: boolean) => {
      if (isArrivalDropdown) {
        onArrivalDropdownOpenStateChangeHandler?.(isOpen);
      } else {
        onDepartureDropdownOpenStateChangeHandler?.(isOpen);
      }
    },
    [
      onArrivalDropdownOpenStateChangeHandler,
      onDepartureDropdownOpenStateChangeHandler,
      isArrivalDropdown,
    ]
  );
  const onDropdownClose = useCallback(() => {
    onOpenStateChange?.(false);
  }, [onOpenStateChange]);
  const onDropdownOpen = useCallback(() => {
    onOpenStateChange?.(true);
  }, [onOpenStateChange]);
  const conditionalQuestions =
    allowedAnswers?.find(option => option.value === questionAnswer)?.conditionalQuestions ?? [];
  const dropdownType =
    providerBookingQuestionId === GTETourQuestionId.TRANSFER_ARRIVAL_MODE
      ? GTETourDropdownType.ARRIVAL_DROPDOWN
      : GTETourDropdownType.DEPARTURE_DROPDOWN;
  return (
    <>
      <MaybeColumn
        key={String(questionId)}
        columns={columns}
        skipPadding={isInModal}
        showColumn={isInModal}
      >
        <SectionWrapper key={id} isInModal={isInModal}>
          <Container>
            <StyledBookingWidgetControlRow
              title={label}
              isOpen={activeDropdown === dropdownType}
              isRequired={required}
            >
              <StyledDropdown
                id="tourOptionTimeDropdown"
                options={
                  allowedAnswers?.map(allowedAnswer => ({
                    value: allowedAnswer.value,
                    nativeLabel: allowedAnswer.label,
                    label: allowedAnswer.label,
                  })) ?? []
                }
                borderColor={theme.colors.primary}
                onChange={value => {
                  onChangeBookingQuestionAnswer(questionId, value);
                }}
                selectedValue={questionAnswer as string}
                noDefaultValue
                selectHeight={45}
                useRadioOption
                onMenuOpen={onDropdownOpen}
                onMenuClose={onDropdownClose}
                placeholder={hint}
              />
            </StyledBookingWidgetControlRow>
          </Container>
        </SectionWrapper>
      </MaybeColumn>
      {activeDropdown === null &&
        conditionalQuestions.map((condQuestion: GTETourBookingWidgetTypes.TourQuestionAnswer) => (
          <MaybeColumn key={String(condQuestion.id)} columns={columns} showColumn={isInModal}>
            <SectionWrapper key={id} isInModal={isInModal} isConditional>
              <GTETourQuestion
                question={condQuestion}
                onChange={(
                  conditionalQuestionId: number,
                  answer:
                    | string
                    | SharedTypes.Birthdate
                    | SharedTypes.Time
                    | SharedTypes.AutocompleteItem
                ) =>
                  onChangeConditionalBookingQuestionAnswer(
                    questionId,
                    conditionalQuestionId,
                    answer
                  )
                }
                productCode={productCode}
                locationType={questionAnswer as string}
              />
            </SectionWrapper>
          </MaybeColumn>
        ))}
    </>
  );
};

export default GTETourDropdownQuestion;
