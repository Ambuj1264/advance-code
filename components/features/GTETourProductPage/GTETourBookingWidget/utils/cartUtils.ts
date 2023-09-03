import { flatten } from "fp-ts/lib/Array";

import { GTETourQuestionType, GTETourQuestionId } from "../types/enums";

import {
  getTotalTravelers,
  getTravelerMinAndMaxAge,
  getTravelerBirthdayError,
  isTravelDateBeforeToday,
  isTravelDateAfterTourDate,
  getIsNameError,
  getIsWeightOrHeightError,
  getTravelerPassportExpiryError,
} from "./gteTourBookingWidgetUtils";

import { getFormattedDate, yearMonthDayFormat } from "utils/dateUtils";

export const getAnswer = (
  answer: string | SharedTypes.Birthdate | SharedTypes.Time | SharedTypes.AutocompleteItem,
  type: GTETourQuestionType,
  allowCustomTravelerPickup: boolean
): string => {
  if (type === GTETourQuestionType.DROPDOWN) {
    if (answer === "HOTEL") {
      return "OTHER";
    }
    if (answer === "PORT") {
      return "SEA";
    }
    if (answer === "AIRPORT") {
      return "AIR";
    }
  }
  if (type === GTETourQuestionType.DATE) {
    const { year, month, day } = answer as SharedTypes.Birthdate;
    if (!year || !month || !day) {
      return "";
    }
    return `${year}-${month}-${day}`;
  }
  if (type === GTETourQuestionType.TIME) {
    const { hour, minute } = answer as SharedTypes.Time;
    const formattedHour = `0${hour}`.slice(-2);
    const formattedMinute = `0${minute}`.slice(-2);
    return `${formattedHour}:${formattedMinute}`;
  }
  if (type === GTETourQuestionType.LOCATION_REF_OR_FREE_TEXT) {
    const autocompleteAnswer = answer as SharedTypes.AutocompleteItem;
    if (allowCustomTravelerPickup) {
      if (autocompleteAnswer.id === "") {
        return autocompleteAnswer.name;
      }
    }
    return autocompleteAnswer.id;
  }
  return answer as string;
};

const getSelectedUnit = (
  type: GTETourQuestionType,
  answer: string | SharedTypes.Birthdate | SharedTypes.Time | SharedTypes.AutocompleteItem,
  selectedUnit?: string
) => {
  if (type === GTETourQuestionType.LOCATION_REF_OR_FREE_TEXT) {
    if ((answer as SharedTypes.AutocompleteItem).id === "") return "FREETEXT";
    return "LOCATION_REFERENCE";
  }
  return selectedUnit;
};

const constructQuestionAnswer = (
  question: GTETourBookingWidgetTypes.TourQuestionAnswer,
  allowCustomTravelerPickup: boolean,
  travelerNum: number | null
): GTETourBookingWidgetTypes.MutationBookingQuestionAnswer => ({
  answer: getAnswer(question.answer, question.type, allowCustomTravelerPickup),
  label: question.label,
  question: question.providerBookingQuestionId,
  travelerNum,
  unit: getSelectedUnit(question.type, question.answer, question.selectedUnit),
});

const constructQuestion = (
  question: GTETourBookingWidgetTypes.TourQuestionAnswer,
  allowCustomTravelerPickup: boolean,
  travelerNum: number | null
): GTETourBookingWidgetTypes.MutationBookingQuestionAnswer[] => {
  const questionAnswer = constructQuestionAnswer(question, allowCustomTravelerPickup, travelerNum);
  const selectedOptionConditionalQuestions: GTETourBookingWidgetTypes.TourQuestionAnswer[] =
    question?.allowedAnswers?.find(option => option.value === question.answer)
      ?.conditionalQuestions ?? [];
  const conditionalQuestionAnswers = selectedOptionConditionalQuestions.map(condition =>
    constructQuestionAnswer(condition, allowCustomTravelerPickup, travelerNum)
  );
  return [questionAnswer, ...conditionalQuestionAnswers];
};

const constructTravelerQuestions = (
  travelerQuestions: GTETourBookingWidgetTypes.TravelerQuestions[],
  allowCustomTravelerPickup: boolean
): GTETourBookingWidgetTypes.MutationBookingQuestionAnswer[] =>
  flatten(
    travelerQuestions.map(traveler => {
      const questions = flatten(
        traveler.questions.map(question => {
          const questionAnswer = constructQuestion(
            question,
            allowCustomTravelerPickup,
            traveler.numberOfTraveler
          );
          return questionAnswer;
        })
      );
      const ageBand = traveler.ageBand
        ? [
            constructQuestionAnswer(
              traveler.ageBand,
              allowCustomTravelerPickup,
              traveler.numberOfTraveler
            ),
          ]
        : [];
      return [...ageBand, ...questions];
    })
  );

export const getBookingQuestionAnswers = (
  bookingQuestions: GTETourBookingWidgetTypes.TourQuestionAnswer[],
  travelerQuestions: GTETourBookingWidgetTypes.TravelerQuestions[],
  allowCustomTravelerPickup: boolean
): GTETourBookingWidgetTypes.MutationBookingQuestionAnswer[] => {
  const travelerQuestionArray = constructTravelerQuestions(
    travelerQuestions,
    allowCustomTravelerPickup
  );
  const bookingQuestionAnswers: GTETourBookingWidgetTypes.MutationBookingQuestionAnswer[] = flatten(
    bookingQuestions.map(booking => constructQuestion(booking, allowCustomTravelerPickup, null))
  );
  return [...bookingQuestionAnswers, ...travelerQuestionArray];
};

export const constructGTETourCartInput = ({
  productCode,
  travelDate,
  numberOfTravelers,
  bookingQuestions,
  travelerQuestions,
  selectedTourOption,
  productUrl,
  allowCustomTravelerPickup,
}: {
  productCode: string;
  travelDate: Date;
  numberOfTravelers: GTETourBookingWidgetTypes.AgeBand[];
  bookingQuestions: GTETourBookingWidgetTypes.TourQuestionAnswer[];
  travelerQuestions: GTETourBookingWidgetTypes.TravelerQuestions[];
  selectedTourOption: GTETourBookingWidgetTypes.SelectedTourOption;
  productUrl: string;
  allowCustomTravelerPickup: boolean;
}): GTETourBookingWidgetTypes.MutationAddGTETourToCartInput => {
  const { optionCode, times, guidedLanguages } = selectedTourOption;
  const guidedLanguage = guidedLanguages.find(guide => guide.isSelected);
  return {
    productCode,
    ...(optionCode ? { productOptionCode: optionCode } : null),
    startTime: times.find(time => time.isSelected)?.startTime,
    paxMix: numberOfTravelers,
    travelDate: getFormattedDate(travelDate, yearMonthDayFormat),
    uri: productUrl,
    languageGuide: guidedLanguage
      ? {
          language: guidedLanguage?.locale ?? "en",
          type: guidedLanguage?.type ?? "",
        }
      : undefined,
    bookingQuestionAnswers: getBookingQuestionAnswers(
      bookingQuestions,
      travelerQuestions,
      allowCustomTravelerPickup
    ),
  };
};

export const getDateError = (selectedDates: SharedTypes.SelectedDates, t: TFunction) => {
  if (!selectedDates.from) {
    return t("Please select a date");
  }
  return undefined;
};
export const getFormErrorText = (
  selectedDates: SharedTypes.SelectedDates,
  numberOfTravelers: GTETourBookingWidgetTypes.AgeBand[],
  bookingQuestions: GTETourBookingWidgetTypes.TourQuestionAnswer[],
  travelerQuestions: GTETourBookingWidgetTypes.TravelerQuestions[],
  ageBands: GTETourBookingWidgetTypes.PriceGroup[],
  allowCustomTravelerPickup: boolean,
  t: TFunction,
  travelerErrorMessage?: string
): string | undefined => {
  const dateError = getDateError(selectedDates, t);
  if (dateError) {
    return dateError;
  }
  const totalTravelers = getTotalTravelers(numberOfTravelers);
  if (totalTravelers === 0) {
    return t("Please select at least one traveler");
  }
  if (travelerErrorMessage) {
    return travelerErrorMessage;
  }
  const requiredBookingQuestions = bookingQuestions.filter(question => question.required);
  const requiredTravelerQuestions = travelerQuestions.map(traveler => ({
    ...traveler,
    questions: traveler.questions.filter(question => question.required),
  }));
  const requiredQuestions = getBookingQuestionAnswers(
    requiredBookingQuestions,
    requiredTravelerQuestions,
    allowCustomTravelerPickup
  );
  const emptyQuestions = requiredQuestions.some(question => question.answer === "");
  if (emptyQuestions) {
    return t("Please answer all required questions");
  }
  const travelerAges = requiredTravelerQuestions.map(traveler => {
    const minMaxAge = getTravelerMinAndMaxAge(traveler.ageBand?.answer as string, ageBands);
    return {
      travelerGroupAges: minMaxAge,
      birthday: traveler.questions.find(question =>
        question.providerBookingQuestionId.includes("BIRTH")
      )?.answer || { year: undefined, month: undefined, day: undefined },
    };
  });

  const travelerPassportExpirationErrors = requiredTravelerQuestions
    .map(traveler => {
      const question = traveler.questions.find(
        q => q.providerBookingQuestionId === GTETourQuestionId.PASSPORT_EXPIRY
      );
      if (question) {
        return getTravelerPassportExpiryError({
          passportExpiryDate: question.answer as SharedTypes.Birthdate,
          travelDate: selectedDates.to || selectedDates.from,
        });
      }

      return undefined;
    })
    .filter(errors => errors !== undefined);

  const weightQuestions = flatten(
    requiredTravelerQuestions.map(traveler =>
      traveler.questions.filter(
        question => question.providerBookingQuestionId === GTETourQuestionId.WEIGHT
      )
    )
  );
  const departureDateQuestion = requiredBookingQuestions.find(
    question => question.providerBookingQuestionId === GTETourQuestionId.TRANSFER_DEPARTURE_DATE
  );
  const isDepartureDateToEarly = departureDateQuestion
    ? isTravelDateBeforeToday(departureDateQuestion.answer as SharedTypes.Birthdate)
    : false;
  const isDepartureDateToLate = departureDateQuestion
    ? isTravelDateAfterTourDate(
        departureDateQuestion.answer as SharedTypes.Birthdate,
        selectedDates.from
      )
    : false;
  const weightOrHeightError = weightQuestions.some(question => {
    const { isWeightOrHeightError } = getIsWeightOrHeightError(
      t,
      question.providerBookingQuestionId as GTETourQuestionId,
      question.answer as string,
      question.selectedUnit
    );
    return isWeightOrHeightError;
  });
  const nameQuestions = flatten(
    requiredTravelerQuestions.map(traveler =>
      traveler.questions.filter(
        question =>
          question.providerBookingQuestionId === GTETourQuestionId.FULL_NAMES_FIRST ||
          question.providerBookingQuestionId === GTETourQuestionId.FULL_NAMES_LAST
      )
    )
  );
  const nameError = nameQuestions.some(question => {
    const { isNameError } = getIsNameError(
      question.providerBookingQuestionId as GTETourQuestionId,
      question.answer as string,
      t
    );
    return isNameError;
  });
  const ageErrors = travelerAges
    .map(age =>
      getTravelerBirthdayError({
        birthday: age.birthday as SharedTypes.Birthdate,
        travelerGroupAges: age.travelerGroupAges,
        departureDate: selectedDates.from,
      })
    )
    .filter(age => age !== undefined);
  if (
    ageErrors.length > 0 ||
    weightOrHeightError ||
    isDepartureDateToEarly ||
    isDepartureDateToLate ||
    travelerPassportExpirationErrors.length > 0 ||
    nameError
  ) {
    return t("Please make sure all your information is correct");
  }
  return undefined;
};
