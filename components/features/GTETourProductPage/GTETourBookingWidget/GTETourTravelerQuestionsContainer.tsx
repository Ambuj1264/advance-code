import React, { Fragment } from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";

import { useGTETourBookingWidgetContext } from "./GTETourBookingWidgetStateContext";
import GTETourQuestion from "./GTETourQuestion";
import { useOnChangeTravelerQuestionAnswer, useOnChangeTravelerQuestionUnit } from "./gteTourHooks";
import {
  getTravelerMinAndMaxAge,
  getTravelerBirthdayError,
  getTravelerPassportExpiryError,
} from "./utils/gteTourBookingWidgetUtils";
import { GTETourQuestionId } from "./types/enums";

import { MaybeRow } from "components/ui/Grid/Row";
import { MaybeColumn } from "components/ui/Grid/Column";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { gutters, guttersPx } from "styles/variables";
import { typographyBody2 } from "styles/typography";
import { mqMin } from "styles/base";
import MobileSectionHeading from "components/ui/BookingWidget/MobileSectionHeading";

const Wrapper = styled.div<{ isInModal: boolean }>(({ isInModal }) => [
  css`
    margin-top: ${gutters.large}px;
  `,
  isInModal &&
    css`
      margin-right: -${gutters.large}px;
      margin-left: -${gutters.large}px;
    `,
]);

const StyledMobileSectionHeading = styled(MobileSectionHeading)`
  ${mqMin.large} {
    margin: 0;
  }
`;

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

const TravelerQuestionsWrapper = styled.div`
  margin-bottom: ${gutters.large * 2}px;
`;

const GTETourTravelerQuestionsContainer = ({
  activeDropdown = null,
  productCode,
  columns = { small: 1 },
  isInModal = false,
}: {
  activeDropdown?: GTETourBookingWidgetTypes.activeDropdownType;
  productCode: string;
  columns?: SharedTypes.Columns;
  isInModal?: boolean;
}) => {
  const { t } = useTranslation(Namespaces.tourNs);
  const { travelerQuestions, priceGroups, selectedDates, isAvailabilityLoading } =
    useGTETourBookingWidgetContext();
  const onChangeTravelerQuestionAnswer = useOnChangeTravelerQuestionAnswer();
  const oOnChangeTravelerQuestionUnit = useOnChangeTravelerQuestionUnit();

  if (travelerQuestions.length === 0 || activeDropdown !== null || isAvailabilityLoading) {
    return null;
  }

  return (
    <TravelerQuestionsWrapper>
      {travelerQuestions.map(({ id, name, numberOfType, ageBand, questions }, travelerIndex) => {
        const travelerAge = ageBand
          ? getTravelerMinAndMaxAge(ageBand.answer as string, priceGroups)
          : undefined;
        const isLeadTraveler = travelerIndex === 0;

        return questions.length > 0 ? (
          <Fragment key={id}>
            <Wrapper isInModal={isInModal}>
              <StyledMobileSectionHeading>
                {`${t("{travelerType} {numberOfType} details", {
                  travelerType: t(name),
                  numberOfType,
                })} ${isLeadTraveler ? `- ${t("Lead traveler")}` : ""}`}
              </StyledMobileSectionHeading>
            </Wrapper>
            <MaybeRow showRow={isInModal}>
              {questions.map((question, index) => {
                const isBirthdayQuestion = question.providerBookingQuestionId.includes("BIRTH");
                const birthdayError = isBirthdayQuestion
                  ? getTravelerBirthdayError({
                      birthday: question!.answer as SharedTypes.Birthdate,
                      travelerGroupAges: travelerAge,
                      departureDate: selectedDates.from,
                      t,
                    })
                  : undefined;

                const passportExpirationError =
                  question.providerBookingQuestionId === GTETourQuestionId.PASSPORT_EXPIRY
                    ? getTravelerPassportExpiryError({
                        passportExpiryDate: question!.answer as SharedTypes.Birthdate,
                        travelDate: selectedDates.to || selectedDates.from,
                        t,
                      })
                    : undefined;

                return (
                  <MaybeColumn
                    key={question.id}
                    columns={columns}
                    showColumn={isInModal}
                    skipPadding={isInModal}
                  >
                    <SectionWrapper
                      key={`traveler${id}Question${index.toString()}`}
                      isInModal={isInModal}
                    >
                      <GTETourQuestion
                        question={question}
                        onChange={(questionId, value) =>
                          onChangeTravelerQuestionAnswer(id, questionId, value)
                        }
                        onUnitChange={(questionId, value) =>
                          oOnChangeTravelerQuestionUnit(id, questionId, value)
                        }
                        birthdayError={birthdayError}
                        passportExpirationError={passportExpirationError}
                        productCode={productCode}
                        isInModal={isInModal}
                      />
                    </SectionWrapper>
                  </MaybeColumn>
                );
              })}
            </MaybeRow>
          </Fragment>
        ) : null;
      })}
    </TravelerQuestionsWrapper>
  );
};

export default GTETourTravelerQuestionsContainer;
