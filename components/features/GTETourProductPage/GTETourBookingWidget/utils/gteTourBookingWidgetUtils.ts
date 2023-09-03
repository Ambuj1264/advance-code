import { max, min, parse, differenceInYears, isAfter, isBefore, startOfToday } from "date-fns";
import { ApolloError } from "apollo-client";
import { range, flatten } from "fp-ts/lib/Array";

import {
  GTETourAgeBand,
  GTETourQuestionType,
  GTETourQuestionGroup,
  GTETourQuestionId,
  GTETourQuestionRequired,
  GTETourGuidedLanguageType,
} from "../types/enums";

import { capitalize } from "utils/globalUtils";
import { getFormattedDate, isoFormat } from "utils/dateUtils";

export const getPriceGroupName = (travelerType: GTETourAgeBand, t: TFunction) => {
  switch (travelerType) {
    case GTETourAgeBand.ADULT:
      return t(`Adults`);
    case GTETourAgeBand.SENIOR:
      return t(`Seniors`);
    case GTETourAgeBand.YOUTH:
      return t(`Teenagers`);
    case GTETourAgeBand.CHILD:
      return t(`Children`);
    case GTETourAgeBand.INFANT:
      return t(`Infants`);
    default:
      return t(`Travelers`);
  }
};

export const getPriceGroupAdditionalInformation = (
  defaultNumberOfTravelerType: number,
  maxNumberOfTravelerType: number
) => {
  return `Min: ${defaultNumberOfTravelerType}, Max: ${maxNumberOfTravelerType}`;
};

const getAgeBandDefaultNumber = (
  numberOfAgeBands: number,
  ageBand: GTETourAgeBand,
  minAgeBandPerBooking: number,
  minTravelersPerBooking: number
) => {
  if (numberOfAgeBands === 1 || ageBand === GTETourAgeBand.ADULT) {
    return Math.max(minAgeBandPerBooking, minTravelersPerBooking);
  }
  return minAgeBandPerBooking;
};

export const getPriceGroups = (
  ageBandsData: GTETourBookingWidgetTypes.QueryAgeBandData
): GTETourBookingWidgetTypes.PriceGroup[] => {
  const { ageBands, minTravelersPerBooking } = ageBandsData;
  return ageBands.map(
    ({
      ageBand,
      minTravelersPerBooking: minAgeBandPerBooking,
      maxTravelersPerBooking,
      startAge,
      endAge,
    }) => ({
      id: ageBand || "",
      defaultNumberOfTravelerType: getAgeBandDefaultNumber(
        ageBands.length,
        ageBand as GTETourAgeBand,
        minAgeBandPerBooking,
        minTravelersPerBooking
      ),
      minNumberOfTravelerType: minAgeBandPerBooking,
      maxNumberOfTravelerType: maxTravelersPerBooking,
      minAge: startAge,
      maxAge: endAge,
      travelerType: ageBand as GTETourAgeBand,
    })
  );
};

export const getNumberOfTravelerTypeFromQuery = (
  ageBands: GTETourBookingWidgetTypes.QueryAgeBand[],
  maxTravelersPerBooking: number,
  queryAdults?: number,
  queryChildren?: number[]
) => {
  const totalAdults = Math.min(queryAdults ?? 1, maxTravelersPerBooking);
  const totalChildren = Math.min(queryChildren?.length ?? 0, maxTravelersPerBooking - totalAdults);
  const childrenArray = queryChildren?.slice(0, totalChildren) ?? [];
  const agebandArray = ageBands.map(currentAgeBand => {
    const childrenInAgeGroup: number =
      childrenArray?.filter(
        child => child >= currentAgeBand.startAge && child <= currentAgeBand.endAge
      )?.length ?? 0;
    if (
      currentAgeBand.ageBand === GTETourAgeBand.ADULT ||
      currentAgeBand.ageBand === GTETourAgeBand.TRAVELER
    ) {
      return {
        [currentAgeBand.ageBand as GTETourAgeBand]: Math.min(
          totalAdults + childrenInAgeGroup,
          maxTravelersPerBooking
        ),
      };
    }
    return {
      [currentAgeBand.ageBand as GTETourAgeBand]: childrenInAgeGroup,
    };
  });
  return Object.assign({}, ...agebandArray);
};

export const getTravelerOptions = (
  ageBandsData: GTETourBookingWidgetTypes.QueryAgeBandData,
  queryAdults?: number,
  queryChildren?: number[]
): GTETourBookingWidgetTypes.AgeBand[] => {
  const { ageBands, minTravelersPerBooking, maxTravelersPerBooking } = ageBandsData;
  const ages = getNumberOfTravelerTypeFromQuery(
    ageBands,
    maxTravelersPerBooking,
    queryAdults,
    queryChildren
  );
  return ageBands.map(age => ({
    ageBand: age.ageBand as GTETourAgeBand,
    numberOfTravelers: Math.max(
      ages[age.ageBand as GTETourAgeBand],
      getAgeBandDefaultNumber(
        ageBands.length,
        age.ageBand as GTETourAgeBand,
        age.minTravelersPerBooking,
        minTravelersPerBooking
      )
    ),
  }));
};

export const getTotalTravelers = (ageBands: GTETourBookingWidgetTypes.AgeBand[]) =>
  ageBands.reduce(
    (totalTravelers, currentAgeBand) => totalTravelers + currentAgeBand.numberOfTravelers,
    0
  );

export const getMaxDate = (dates: string[]) => {
  if (dates.length) {
    const datesFormated = dates.map(date => new Date(date));
    return max(datesFormated);
  }
  return undefined;
};

export const getMinDate = (dates: string[]) => {
  if (dates.length) {
    const datesFormated = dates.map(date => new Date(date));
    return min(datesFormated);
  }
  return undefined;
};
export const constructGTETourDates = (
  queryTourDates?: GTETourTypes.QueryTourDates,
  error?: ApolloError
) => {
  if (error || !queryTourDates?.toursAndTicketsAvailableDays) {
    return {
      min: undefined,
      max: undefined,
      availableDates: [],
      unavailableDates: [],
    };
  }
  const currentDate = new Date();
  const { availableDates, unavailableDates } = queryTourDates!.toursAndTicketsAvailableDays;
  const maxDateOrUndefined = getMaxDate(availableDates ?? []);
  const minDateOrUndefined = getMinDate(availableDates ?? []);
  const formattedISOMin = getFormattedDate(minDateOrUndefined || currentDate, isoFormat);
  const formattedISOMax = maxDateOrUndefined
    ? getFormattedDate(maxDateOrUndefined, isoFormat)
    : maxDateOrUndefined;
  const hasAvailableDates = availableDates.length > 0;
  return {
    min: hasAvailableDates ? parse(formattedISOMin, isoFormat, currentDate) : undefined,
    max:
      formattedISOMax && hasAvailableDates
        ? parse(formattedISOMax, isoFormat, currentDate)
        : undefined,
    unavailableDates: unavailableDates.map(date => parse(date, isoFormat, currentDate)),
    availableDates: availableDates.map(date => parse(date, isoFormat, currentDate)),
  };
};

export const getIsSelectedTime = (
  available: boolean,
  startTime: string,
  prevSelectedTimes?: GTETourBookingWidgetTypes.SelectedTourOptionTime[]
) => {
  if (prevSelectedTimes && available) {
    return prevSelectedTimes.some(time => time.isSelected && time.startTime === startTime);
  }

  return available;
};

const getSelectedLanguage = (
  index: number,
  id: string,
  prevSelectedLanguages?: GTETourBookingWidgetTypes.SelectedTourOptionLanguage[]
) => {
  if (prevSelectedLanguages) {
    return prevSelectedLanguages.some(lang => lang.isSelected && lang.id === id);
  }
  return index === 0;
};

const getInitialSelectedTourOptionTime = (
  tourOptionTimes: GTETourBookingWidgetTypes.TourOptionTime[],
  prevSelectedTimes?: GTETourBookingWidgetTypes.SelectedTourOptionTime[]
) => {
  let initialTimeSelected = false;
  return tourOptionTimes.map(time => {
    const isSelected =
      initialTimeSelected || !time.startTime
        ? false
        : getIsSelectedTime(time.available, time.startTime, prevSelectedTimes);
    if (isSelected) initialTimeSelected = true;

    return {
      ...time,
      isSelected,
    };
  });
};

export const getInitialSelectedTourOptionLanguage = (
  guidedLanguages: GTETourBookingWidgetTypes.TourOptionLanguage[],
  prevGuidedLanguages?: GTETourBookingWidgetTypes.SelectedTourOptionLanguage[]
) =>
  guidedLanguages.map((language, index) => {
    const languageId = `${language.locale}-${language.type}`;
    return {
      ...language,
      id: languageId,
      isSelected: getSelectedLanguage(index, languageId, prevGuidedLanguages),
    };
  });

export const getInitialSelectedTourOption = (
  tourOption: GTETourBookingWidgetTypes.TourOption,
  prevSelectedOption?: GTETourBookingWidgetTypes.SelectedTourOption
): GTETourBookingWidgetTypes.SelectedTourOption => {
  const times = getInitialSelectedTourOptionTime(tourOption.times, prevSelectedOption?.times);

  const isNothingSelected = !times.some(({ isSelected }) => isSelected);
  if (isNothingSelected) {
    const firstAvailableTime = times.find(({ available }) => available);
    // eslint-disable-next-line functional/immutable-data
    if (firstAvailableTime) firstAvailableTime.isSelected = true;
  }

  const guidedLanguages = getInitialSelectedTourOptionLanguage(
    tourOption.guidedLanguages,
    prevSelectedOption?.guidedLanguages
  );

  return {
    ...tourOption,
    times,
    guidedLanguages,
  };
};

export const splitTourQuestions = (
  questions: GTETourBookingWidgetTypes.TourQuestion[]
): GTETourBookingWidgetTypes.SplitQuestions =>
  questions.reduce(
    ({ perBooking, conditionalQuestions, perPerson, ageBand }, currentQuestion) => {
      if (currentQuestion.providerBookingQuestionId === GTETourQuestionId.AGEBAND) {
        return {
          perBooking,
          conditionalQuestions,
          perPerson,
          ageBand: currentQuestion,
        };
      }
      if (currentQuestion.group === GTETourQuestionGroup.PER_BOOKING) {
        if (currentQuestion.required === GTETourQuestionRequired.CONDITIONAL) {
          return {
            perBooking,
            conditionalQuestions: [...conditionalQuestions, currentQuestion],
            perPerson,
            ageBand,
          };
        }
        return {
          perBooking: [...perBooking, currentQuestion],
          conditionalQuestions,
          perPerson,
          ageBand,
        };
      }
      return {
        perBooking,
        conditionalQuestions,
        perPerson: [...perPerson, currentQuestion],
        ageBand,
      };
    },
    {
      perBooking: [] as GTETourBookingWidgetTypes.TourQuestion[],
      conditionalQuestions: [] as GTETourBookingWidgetTypes.TourQuestion[],
      perPerson: [] as GTETourBookingWidgetTypes.TourQuestion[],
      ageBand: undefined as GTETourBookingWidgetTypes.TourQuestion | undefined,
    }
  );

const getQuestionType = (questionId: string, isDropdown: boolean, questionType: string) => {
  if (questionId === GTETourQuestionId.SPECIAL_REQUIREMENTS) {
    return GTETourQuestionType.TEXTAREA;
  }
  if (isDropdown) {
    return GTETourQuestionType.DROPDOWN;
  }
  return questionType as GTETourQuestionType;
};

const getSelectedUnit = (type: GTETourQuestionType, units?: string[]) => {
  if (!units || units?.length === 0) return undefined;
  if (type === GTETourQuestionType.LOCATION_REF_OR_FREE_TEXT) {
    // TODO: change when we support location selection
    return "FREETEXT";
  }
  return units![0];
};

const getOptionConditionalQuestions = (
  answer: string,
  conditions: GTETourBookingWidgetTypes.TourQuestionCondition[],
  conditionalQuestions: GTETourBookingWidgetTypes.TourQuestion[],
  prevConditionalQuestions: GTETourBookingWidgetTypes.TourQuestionAnswer[]
) => {
  const answerConditions = conditions.find(condition => condition.key === answer)?.value ?? [];
  return conditionalQuestions
    .filter(question => answerConditions.includes(question.providerBookingQuestionId))
    .map(question => {
      const prevConditionalQuestion = prevConditionalQuestions.find(
        prev => prev.providerBookingQuestionId === question.providerBookingQuestionId
      );
      return {
        id: question.id,
        providerBookingQuestionId: question.providerBookingQuestionId,
        group: question.group,
        label: question.label,
        hint: question.hint,
        maxLength: question.maxLength,
        units: question.units,
        type: question.type as GTETourQuestionType,
        answer: prevConditionalQuestion ? prevConditionalQuestion.answer : "",
        allowedAnswers: [],
        required: true,
        selectedUnit: getSelectedUnit(question.type as GTETourQuestionType, question.units),
      };
    });
};

const getInitialAnswer = (type: GTETourQuestionType) => {
  if (type === GTETourQuestionType.DATE) {
    return {
      day: undefined,
      month: undefined,
      year: undefined,
    };
  }
  if (type === GTETourQuestionType.TIME) {
    return {
      hour: 0,
      minute: 0,
    };
  }
  if (type === GTETourQuestionType.LOCATION_REF_OR_FREE_TEXT) {
    return {
      id: "",
      name: "",
    };
  }
  return "";
};

const constructQuestionAllowedAnswers = (
  conditionalQuestions: GTETourBookingWidgetTypes.TourQuestion[],
  conditions: GTETourBookingWidgetTypes.TourQuestionCondition[],
  allowedAnswers?: string[],
  prevQuestion?: GTETourBookingWidgetTypes.TourQuestionAnswer
) =>
  allowedAnswers?.map((answer: string) => {
    const prevConditionalQuestions = prevQuestion
      ? prevQuestion.allowedAnswers?.find(prev => prev.value === prevQuestion.answer)
          ?.conditionalQuestions ?? []
      : [];
    return {
      label: capitalize(answer.toLowerCase()),
      value: answer,
      conditionalQuestions: getOptionConditionalQuestions(
        answer,
        conditions,
        conditionalQuestions,
        prevConditionalQuestions
      ),
    };
  });

const constructQuestions = (
  questions: GTETourBookingWidgetTypes.TourQuestion[],
  conditionalQuestions: GTETourBookingWidgetTypes.TourQuestion[],
  prevAnsweredQuestions: GTETourBookingWidgetTypes.TourQuestionAnswer[]
) =>
  questions.map(question => {
    const type = getQuestionType(
      question.providerBookingQuestionId,
      (question?.allowedAnswers?.length || 0) > 0,
      question.type
    );
    const prevQuestion = prevAnsweredQuestions.find(
      prev =>
        prev.providerBookingQuestionId === question.providerBookingQuestionId && prev.type === type
    );
    return {
      id: question.id,
      providerBookingQuestionId: question.providerBookingQuestionId,
      group: question.group,
      answer: prevQuestion ? prevQuestion.answer : getInitialAnswer(type),
      label: question.label,
      hint: question.hint,
      maxLength: question.maxLength,
      units: question.units,
      required: question.required === GTETourQuestionRequired.MANDATORY,
      selectedUnit: getSelectedUnit(type, question.units),
      allowedAnswers: constructQuestionAllowedAnswers(
        conditionalQuestions,
        question.conditions,
        question.allowedAnswers,
        prevQuestion
      ),
      type,
    };
  });

const constructTravelerQuestions = (
  numberOfTravelers: GTETourBookingWidgetTypes.AgeBand[],
  questions: GTETourBookingWidgetTypes.TourQuestion[],
  prevTravelerQuestions: GTETourBookingWidgetTypes.TravelerQuestions[],
  ageBand?: GTETourBookingWidgetTypes.TourQuestion
) => {
  let travelerNumber = 1;
  return flatten(
    numberOfTravelers
      .filter(traveler => traveler.numberOfTravelers > 0)
      .map(travelerType => {
        return range(1, travelerType.numberOfTravelers).map(i => {
          const isTraveler = travelerType.ageBand === "TRAVELER";
          const allPrevAreTravelers = prevTravelerQuestions.every(traveler =>
            traveler.id.includes("TRAVELER")
          );
          const prevTraveler = prevTravelerQuestions.find(traveler =>
            isTraveler || allPrevAreTravelers
              ? traveler.numberOfType === i
              : traveler.id === `${travelerType.ageBand}-${i}`
          );
          const travelerQuestion = {
            id: `${travelerType.ageBand}-${i}`,
            name: capitalize(travelerType.ageBand.toLowerCase()),
            numberOfType: i,
            numberOfTraveler: travelerNumber,
            ageBand: ageBand
              ? {
                  id: ageBand.id,
                  providerBookingQuestionId: ageBand.providerBookingQuestionId,
                  type: GTETourQuestionType.STRING,
                  group: ageBand.group,
                  label: ageBand.label,
                  maxLength: ageBand.maxLength,
                  required: true,
                  allowedAnswers: [],
                  answer: travelerType.ageBand,
                }
              : undefined,
            questions: constructQuestions(questions, [], prevTraveler?.questions ?? []),
          };
          travelerNumber += 1;
          return travelerQuestion;
        });
      })
  );
};

export const constructTourQuestions = (
  numberOfTravelers: GTETourBookingWidgetTypes.AgeBand[],
  questions: GTETourBookingWidgetTypes.TourQuestion[],
  prevBookingQuestions: GTETourBookingWidgetTypes.TourQuestionAnswer[],
  prevTravelerQuestions: GTETourBookingWidgetTypes.TravelerQuestions[]
) => {
  const { perBooking, perPerson, ageBand, conditionalQuestions } = splitTourQuestions(questions);
  return {
    perBooking: constructQuestions(perBooking, conditionalQuestions, prevBookingQuestions),
    perPerson: constructTravelerQuestions(
      numberOfTravelers,
      perPerson,
      prevTravelerQuestions,
      ageBand
    ) as GTETourBookingWidgetTypes.TravelerQuestions[],
  };
};

export const getTourLowestPrice = (times: GTETourBookingWidgetTypes.TourOptionTime[]) => {
  const availableTimes = times.filter(time => time.available);
  if (availableTimes.length > 0) {
    return Math.min(...availableTimes.map(time => time.totalPrice || 0));
  }
  return 0;
};

export const getTotalPrice = (tourOption: GTETourBookingWidgetTypes.SelectedTourOption) =>
  tourOption.times.find(time => time.isSelected)?.totalPrice ?? 0;

export const getTravelerPriceText = (
  numberOfTravelers: GTETourBookingWidgetTypes.AgeBand[],
  t: TFunction
) => {
  const totalTravelers = getTotalTravelers(numberOfTravelers);
  return t("Price for {numberOfTravelers} travelers", {
    numberOfTravelers: totalTravelers,
  });
};

export const updateTourOptionTimes = (
  tourTime: string,
  selectedTourOption?: GTETourBookingWidgetTypes.TourOption
) =>
  selectedTourOption?.times.map(time => ({
    ...time,
    isSelected: time.startTime === tourTime,
  })) ?? [];

export const updateTourOptionLanguages = (
  tourLocale: string,
  selectedTourOption?: GTETourBookingWidgetTypes.SelectedTourOption
) =>
  selectedTourOption?.guidedLanguages.map(lang => ({
    ...lang,
    isSelected: lang.id === tourLocale,
  })) ?? [];

export const updateBookingQuestionAnswer = (
  questionId: number,
  answer: string | SharedTypes.Birthdate | SharedTypes.Time | SharedTypes.AutocompleteItem,
  bookingQuestions: GTETourBookingWidgetTypes.TourQuestionAnswer[]
) =>
  bookingQuestions.map(question => {
    if (question.id === questionId) {
      return {
        ...question,
        answer,
      };
    }
    return question;
  });

export const updateConditionalBookingQuestionAnswer = (
  questionId: number,
  conditionalQuestionId: number,
  answer: string | SharedTypes.Birthdate | SharedTypes.Time | SharedTypes.AutocompleteItem,
  bookingQuestions: GTETourBookingWidgetTypes.TourQuestionAnswer[]
) =>
  bookingQuestions.map(question => {
    if (question.id === questionId) {
      return {
        ...question,
        allowedAnswers: question.allowedAnswers?.map(option => {
          if (option.value === question.answer) {
            return {
              ...option,
              conditionalQuestions: option.conditionalQuestions.map(cond => {
                if (cond.id === conditionalQuestionId) {
                  return {
                    ...cond,
                    answer,
                  };
                }
                return cond;
              }),
            };
          }
          return option;
        }),
      };
    }
    return question;
  });

export const updateTravelerQuestionAnswer = (
  travelerId: string,
  questionId: number,
  answer: string | SharedTypes.Birthdate | SharedTypes.Time | SharedTypes.AutocompleteItem,
  travelerQuestions: GTETourBookingWidgetTypes.TravelerQuestions[]
) =>
  travelerQuestions.map(traveler => {
    if (traveler.id === travelerId) {
      return {
        ...traveler,
        questions: traveler.questions.map(question => {
          if (question.id === questionId) {
            return {
              ...question,
              answer,
            };
          }
          return question;
        }),
      };
    }
    return traveler;
  });

export const updateTravelerQuestionUnit = (
  travelerId: string,
  questionId: number,
  unit: string,
  travelerQuestions: GTETourBookingWidgetTypes.TravelerQuestions[]
) =>
  travelerQuestions.map(traveler => {
    if (traveler.id === travelerId) {
      return {
        ...traveler,
        questions: traveler.questions.map(question => {
          if (question.id === questionId) {
            return {
              ...question,
              selectedUnit: unit,
            };
          }
          return question;
        }),
      };
    }
    return traveler;
  });

export const getTravelerMinAndMaxAge = (
  travelerAgeBand: string,
  priceGroups: GTETourBookingWidgetTypes.PriceGroup[]
) => {
  const correctPriceGroup = priceGroups.find(group => group.travelerType === travelerAgeBand);
  if (correctPriceGroup) {
    return {
      minAge: correctPriceGroup.minAge,
      maxAge: correctPriceGroup.maxAge,
    };
  }
  return undefined;
};

export const isTravelerInCorrectAgeGroup = (
  birthday: SharedTypes.Birthdate,
  travelerGroupAges?: { minAge: number; maxAge: number },
  departureDate?: Date
) => {
  const { year, month, day } = birthday;
  const isDateInvalid = !day || !month || !year;
  if (!isDateInvalid && departureDate && travelerGroupAges) {
    const { minAge, maxAge } = travelerGroupAges;
    const dateString = `${year}-${`0${month}`.slice(-2)}-${`0${day}`.slice(-2)}`;
    const yearsOld = differenceInYears(departureDate, new Date(dateString));
    if (yearsOld >= minAge && yearsOld <= maxAge) {
      return true;
    }
    return false;
  }
  return true;
};

export const getTravelerBirthdayError = ({
  birthday,
  travelerGroupAges,
  departureDate,
  t,
}: {
  birthday: SharedTypes.Birthdate;
  travelerGroupAges?: { minAge: number; maxAge: number };
  departureDate?: Date;
  t?: TFunction;
}): string | undefined => {
  const isAgeCorrect = isTravelerInCorrectAgeGroup(birthday, travelerGroupAges, departureDate);
  if (isAgeCorrect || !travelerGroupAges) {
    return undefined;
  }
  const { minAge, maxAge } = travelerGroupAges;
  const errorMessage = t
    ? t(`Age of traveler must be between {minAge} and {maxAge}`, {
        minAge,
        maxAge,
      })
    : `Age of traveler must be between ${minAge} and ${maxAge}`;
  return errorMessage;
};

export const getTravelerPassportExpiryError = ({
  passportExpiryDate,
  travelDate,
  t,
}: {
  passportExpiryDate: SharedTypes.Birthdate;
  travelDate?: Date;
  t?: TFunction;
}) => {
  const errorMessageString = `the passport is expired`;
  const errorMessage = t ? t(errorMessageString) : errorMessageString;
  const finalTravelDate = travelDate || new Date();
  const { year, month, day } = passportExpiryDate;

  if (year && month && day) {
    const expirationDate = new Date(Number(year), Number(month) - 1, Number(day));

    return isAfter(
      new Date(finalTravelDate).setHours(0, 0, 0, 0),
      expirationDate.setHours(0, 0, 0, 0)
    )
      ? errorMessage
      : undefined;
  }

  return undefined;
};

export const getNumberOfAdults = (numberOfTravelers: GTETourBookingWidgetTypes.AgeBand[]) =>
  numberOfTravelers.reduce((totalAdults, currentAgeBand) => {
    if (
      currentAgeBand.ageBand === GTETourAgeBand.ADULT ||
      currentAgeBand.ageBand === GTETourAgeBand.SENIOR ||
      currentAgeBand.ageBand === GTETourAgeBand.TRAVELER
    ) {
      return totalAdults + currentAgeBand.numberOfTravelers;
    }
    return totalAdults;
  }, 0 as number);

export const getTravelerErrorMessage = (
  numberTravelers: number,
  missingRequiredAdults: boolean,
  priceGroups: GTETourBookingWidgetTypes.PriceGroup[],
  t: TFunction,
  hasAvailabilityData: boolean
) => {
  if (!hasAvailabilityData) return undefined;
  if (numberTravelers === 0) return t("At least one traveler is required");
  if (!missingRequiredAdults) return undefined;
  const adultPriceGroups = priceGroups
    .filter(
      group =>
        group.travelerType === GTETourAgeBand.ADULT ||
        group.travelerType === GTETourAgeBand.SENIOR ||
        group.travelerType === GTETourAgeBand.TRAVELER
    )
    .map(group => getPriceGroupName(group.travelerType, t));
  return t("This tour requires at least one of the following per booking: {adultsTravelers}", {
    adultsTravelers: adultPriceGroups.join(", "),
  });
};

export const getGuidedLanguageName = (
  localeName: string,
  t: TFunction,
  type?: GTETourGuidedLanguageType
) => {
  switch (type) {
    case GTETourGuidedLanguageType.AUDIO:
      return `${t(localeName)} ${t("audio guide")}`;
    case GTETourGuidedLanguageType.GUIDE:
      return `${t(localeName)} ${t("guide")}`;
    case GTETourGuidedLanguageType.WRITTEN:
      return `${t(localeName)} ${t("text guide")}`;
    default:
      return localeName;
  }
};

export const isTravelDateBeforeToday = (date: SharedTypes.Birthdate) => {
  const { day, month, year } = date;
  if (!day || !month || !year) return false;
  const selectedDate = new Date(Number(year), Number(month) - 1, Number(day));
  const today = startOfToday();
  return isBefore(selectedDate, today);
};

export const isTravelDateAfterTourDate = (date: SharedTypes.Birthdate, dateFrom?: Date) => {
  const { day, month, year } = date;
  if (!dateFrom || !day || !month || !year) return false;
  const selectedDate = new Date(Number(year), Number(month) - 1, Number(day));
  return isAfter(selectedDate, dateFrom);
};

export const getDateQuestionError = ({
  t,
  hasDateError,
  answer,
  questionId,
  birthdayError,
  passportExpirationError,
  dateFrom,
}: {
  t: TFunction;
  hasDateError: boolean;
  answer: SharedTypes.Birthdate;
  questionId: GTETourQuestionId;
  birthdayError?: string;
  passportExpirationError?: string;
  dateFrom?: Date;
}) => {
  const isDepartureDate = questionId === GTETourQuestionId.TRANSFER_DEPARTURE_DATE;
  const isTravelDateToEarly = isTravelDateBeforeToday(answer as SharedTypes.Birthdate);
  const isTravelDateToLate = isTravelDateAfterTourDate(answer as SharedTypes.Birthdate, dateFrom);
  const hasDepartureDateError = isDepartureDate ? isTravelDateToEarly || isTravelDateToLate : false;

  if (questionId === GTETourQuestionId.PASSPORT_EXPIRY) {
    return {
      isDateError: passportExpirationError !== undefined,
      customErrorMessage: passportExpirationError,
    };
  }

  if (questionId === GTETourQuestionId.DATE_OF_BIRTH) {
    return {
      isDateError: birthdayError !== undefined,
      customErrorMessage: birthdayError,
    };
  }

  if (hasDepartureDateError) {
    const customErrorMessage = isTravelDateToEarly
      ? t("Departure date must be in the future")
      : t("Departure date cannot be later than tour date");
    return {
      isDateError: true,
      customErrorMessage,
    };
  }
  return {
    isDateError: hasDateError,
    customErrorMessage: undefined,
  };
};

export const getIsNameError = (questionId: GTETourQuestionId, answer: string, t: TFunction) => {
  if (!answer) {
    return {
      isNameError: false,
      customErrorMessage: undefined,
    };
  }
  const isFirstName = questionId === GTETourQuestionId.FULL_NAMES_FIRST;
  const isLastName = questionId === GTETourQuestionId.FULL_NAMES_LAST;
  if (isFirstName || isLastName) {
    const isInvalidName = answer.match(/[0-9!"`#.'%&,:;<>=_@{}()[\]|^~$*+/?\\]/);
    if (isInvalidName) {
      return {
        isNameError: true,
        customErrorMessage: t("Name is not valid"),
      };
    }
  }
  return {
    isNameError: false,
    customErrorMessage: undefined,
  };
};

const getWeightOrHeightError = (maxValue: number, answer: string, t: TFunction) => {
  const isValueToHigh = Number(answer) >= maxValue;
  const isValueToLow = Number(answer) <= 0;
  const isError = answer !== "" && (isValueToHigh || isValueToLow);
  const customErrorMessage = isValueToHigh
    ? t("Input value must be lower than {maxValue}", {
        maxValue,
      })
    : t("Input value must be higher than 0");
  return {
    isWeightOrHeightError: isError,
    customErrorMessage: isError ? customErrorMessage : undefined,
    maxValue,
  };
};

export const getIsWeightOrHeightError = (
  t: TFunction,
  questionId: GTETourQuestionId,
  answer: string,
  selectedUnit?: string
) => {
  const isWeightQuestion = questionId === GTETourQuestionId.WEIGHT;
  const isHeightQuestion = questionId === GTETourQuestionId.HEIGHT;
  if (!isWeightQuestion && !isHeightQuestion) {
    return {
      isWeightOrHeightError: false,
      customErrorMessage: undefined,
      maxValue: 1000,
    };
  }
  if (isHeightQuestion) {
    const maxValue = selectedUnit === "cm" ? 250 : 8;
    return getWeightOrHeightError(maxValue, answer, t);
  }
  const maxValue = selectedUnit === "kg" ? 300 : 600;
  return getWeightOrHeightError(maxValue, answer, t);
};
