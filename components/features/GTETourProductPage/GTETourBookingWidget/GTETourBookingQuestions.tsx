import React from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";

import { useGTETourBookingWidgetContext } from "./GTETourBookingWidgetStateContext";
import GTETourQuestion from "./GTETourQuestion";
import { useOnChangeBookingQuestionAnswer } from "./gteTourHooks";
import { GTETourQuestionId, GTETourQuestionType } from "./types/enums";
import GTETourDropdownQuestion from "./GTETourDropdownQuestion";

import { MaybeColumn } from "components/ui/Grid/Column";
import { mqMin } from "styles/base";
import { gutters, guttersPx } from "styles/variables";
import { typographyBody2 } from "styles/typography";

const SectionWrapper = styled.div<{ isInModal: boolean }>(({ isInModal }) => [
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
    css`
      ${mqMin.large} {
        margin: ${guttersPx.small} ${guttersPx.small} 0 ${guttersPx.small};
      }
    `,
]);

const GTETourBookingQuestions = ({
  activeDropdown = null,
  productCode,
  onDepartureDropdownOpenStateChangeHandler,
  onArrivalDropdownOpenStateChangeHandler,
  columns = { small: 1 },
  isInModal = false,
}: {
  activeDropdown?: GTETourBookingWidgetTypes.activeDropdownType;
  productCode: string;
  onDepartureDropdownOpenStateChangeHandler?: ((isOpen: boolean) => void) | undefined;
  onArrivalDropdownOpenStateChangeHandler?: ((isOpen: boolean) => void) | undefined;
  columns?: SharedTypes.Columns;
  isInModal?: boolean;
}) => {
  const { bookingQuestions, isAvailabilityLoading } = useGTETourBookingWidgetContext();
  const onChangeBookingQuestionAnswer = useOnChangeBookingQuestionAnswer();
  if (bookingQuestions.length === 0 || isAvailabilityLoading) return null;
  return (
    <>
      {bookingQuestions.map((question, index) => {
        const isArrivalDropdown =
          question.providerBookingQuestionId === GTETourQuestionId.TRANSFER_ARRIVAL_MODE;
        const isDropdown =
          isArrivalDropdown ||
          question.providerBookingQuestionId === GTETourQuestionId.TRANSFER_DEPARTURE_MODE;
        if (isDropdown) {
          if (!question.allowedAnswers?.length) {
            return null;
          }
          return (
            <GTETourDropdownQuestion
              id={String(question.id)}
              onDepartureDropdownOpenStateChangeHandler={onDepartureDropdownOpenStateChangeHandler}
              onArrivalDropdownOpenStateChangeHandler={onArrivalDropdownOpenStateChangeHandler}
              bookingQuestion={question}
              activeDropdown={activeDropdown}
              productCode={productCode}
              isArrivalDropdown={isArrivalDropdown}
              isInModal={isInModal}
              columns={columns}
            />
          );
        }
        if (activeDropdown === null) {
          const isTextArea = question.type === GTETourQuestionType.TEXTAREA;
          return (
            <MaybeColumn
              key={String(question.id)}
              columns={isTextArea ? { small: 1 } : columns}
              skipPadding={isInModal}
              showColumn={isInModal}
            >
              <SectionWrapper key={`tourBookingQuestion${index.toString()}`} isInModal={isInModal}>
                <GTETourQuestion
                  question={question}
                  onChange={onChangeBookingQuestionAnswer}
                  productCode={productCode}
                />
              </SectionWrapper>
            </MaybeColumn>
          );
        }
        return null;
      })}
    </>
  );
};

export default GTETourBookingQuestions;
