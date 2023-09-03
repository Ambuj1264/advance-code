import memoizeOne from "memoize-one";
import { addMinutes } from "date-fns";

import { VPTourSelectedSpecs } from "../../types/VPProductPageEnums";

import { getInitialSelectedTourOptionLanguage } from "components/features/GTETourProductPage/GTETourBookingWidget/utils/gteTourBookingWidgetUtils";
import TimeIcon from "components/icons/clock.svg";
import { emptyArray } from "utils/constants";
import { getFormattedDate, yearMonthDayFormat } from "utils/dateUtils";
import { getAnswer } from "components/features/GTETourProductPage/GTETourBookingWidget/utils/cartUtils";
import { GTETourQuestionId } from "components/features/GTETourProductPage/GTETourBookingWidget/types/enums";

export const findToursByDay = ({
  toursResult,
  dayNumber,
}: {
  toursResult?: VacationPackageTypes.ToursSearchResult;
  dayNumber: number;
}): SharedTypes.Product[] =>
  toursResult?.filter(({ dayNumber: tourDayNumber }) => tourDayNumber === dayNumber)?.[0]?.tours ??
  (emptyArray as never as SharedTypes.Product[]);

export const getUpdatedSelectedTourProducts = memoizeOne(
  (
    day: number,
    productId: string,
    selectedToursProductIds?: VacationPackageTypes.SelectedToursProductIds[]
  ) => {
    const isAlreadySelected = selectedToursProductIds?.some(
      tour => tour.day === day && tour.productId === productId
    );
    const selectedToursArray = selectedToursProductIds || [];
    if (isAlreadySelected) {
      return selectedToursArray.filter(tour => tour.day !== day || tour.productId !== productId);
    }
    return [
      ...(selectedToursProductIds || []),
      {
        day,
        productId,
        optionCode: "",
        optionName: "",
        startTime: "",
        numberOfTravelers: 0,
        durationInMinutes: 0,
      },
    ];
  }
);

export const getUpdatedSelectedTours = memoizeOne(
  (
    selectedTours: GTETourBookingWidgetTypes.MutationAddGTETourToCartInput[],
    tour: GTETourBookingWidgetTypes.MutationAddGTETourToCartInput
  ) => {
    const isAlreadySelected = selectedTours.some(
      selectedTour =>
        selectedTour.productCode === tour.productCode && selectedTour.travelDate === tour.travelDate
    );
    if (isAlreadySelected) {
      return selectedTours.map(selectedTour => {
        if (
          selectedTour.productCode === tour.productCode &&
          selectedTour.travelDate === tour.travelDate
        ) {
          return tour;
        }
        return selectedTour;
      });
    }
    return [...selectedTours, tour];
  }
);

// TODO: add tests
export const getNewTourBookingQuestions = (
  toursBookingQuestions: GTETourBookingWidgetTypes.TourQuestionAnswer[],
  newBookingQuestions: GTETourBookingWidgetTypes.TourQuestionAnswer[]
) => {
  const requiredQuestions = newBookingQuestions.filter(question => question.required);
  return requiredQuestions.reduce((bookingQuestions, currentQuestion) => {
    const containsQuestion = bookingQuestions.some(
      question => question.providerBookingQuestionId === currentQuestion.providerBookingQuestionId
    );
    if (containsQuestion) {
      const questionsWithoutCurrent = bookingQuestions.filter(
        question => question.providerBookingQuestionId !== currentQuestion.providerBookingQuestionId
      );
      return [...questionsWithoutCurrent, currentQuestion];
    }
    return [...bookingQuestions, currentQuestion];
  }, toursBookingQuestions as GTETourBookingWidgetTypes.TourQuestionAnswer[]);
};

// TODO: add tests
export const getNewTourTravelerQuestions = (
  toursTravelerQuestions: GTETourBookingWidgetTypes.TravelerQuestions[],
  newTravelerQuestions: GTETourBookingWidgetTypes.TravelerQuestions[]
) =>
  newTravelerQuestions.reduce((travelerQuestions, currentTraveler) => {
    const containsTraveler = travelerQuestions.find(traveler => traveler.id === currentTraveler.id);
    if (containsTraveler) {
      const travelersWithoutCurrent = travelerQuestions.filter(
        traveler => traveler.id !== currentTraveler.id
      );
      return [
        ...travelersWithoutCurrent,
        {
          ...currentTraveler,
          questions: getNewTourBookingQuestions(
            containsTraveler.questions,
            currentTraveler.questions
          ),
        },
      ];
    }
    return [
      ...travelerQuestions,
      {
        ...currentTraveler,
        questions: getNewTourBookingQuestions([], currentTraveler.questions),
      },
    ];
  }, toursTravelerQuestions as GTETourBookingWidgetTypes.TravelerQuestions[]);

export const doesTourTimeClashWithOtherTour = (
  tourTime: string,
  tourDuration: number,
  sameDayTourTime: string,
  sameDayTourDuration: number
) => {
  const isTourTimeValid = tourTime.match(/([01]?[0-9]|2[0-3]):[0-5][0-9]/g);
  const isSameDayTourTimeValid = sameDayTourTime.match(/([01]?[0-9]|2[0-3]):[0-5][0-9]/g);
  if (!tourTime || !sameDayTourTime || !isTourTimeValid || !isSameDayTourTimeValid) return false;
  const today = new Date();
  const todayFormatted = getFormattedDate(today, yearMonthDayFormat);
  const tourTimeFrom = new Date(`${todayFormatted} ${tourTime}`);
  const tourTimeTo = addMinutes(tourTimeFrom, tourDuration + 60);
  const sameDayTourTimeFrom = new Date(`${todayFormatted} ${sameDayTourTime}`);
  const sameDayTourTimeTo = addMinutes(sameDayTourTimeFrom, sameDayTourDuration + 60);
  const doesTourEndAfterOtherStarts =
    tourTimeTo > sameDayTourTimeFrom && tourTimeFrom < sameDayTourTimeFrom;
  const doesTourStartBeforeOtherEnds =
    tourTimeFrom >= sameDayTourTimeFrom && tourTimeFrom < sameDayTourTimeTo;
  return doesTourEndAfterOtherStarts || doesTourStartBeforeOtherEnds;
};

export const doesNewTourOverlapWithOthers = (
  newSelectedToursProductIds: VacationPackageTypes.SelectedToursProductIds[],
  day: number,
  productId: string
) => {
  const sameDayTours = newSelectedToursProductIds.filter(
    selectedTour => selectedTour.day === day && selectedTour.productId !== productId
  );
  const newSelectedTour = newSelectedToursProductIds.find(
    selectedTour => selectedTour.day === day && selectedTour.productId === productId
  );
  if (newSelectedTour?.startTime) {
    return sameDayTours.some(sameDayTour => {
      if (!sameDayTour.startTime) return false;

      return doesTourTimeClashWithOtherTour(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        newSelectedTour.startTime!,
        newSelectedTour.durationInMinutes,
        sameDayTour.startTime,
        sameDayTour.durationInMinutes
      );
    });
  }
  return false;
};

export const isSomeTourQuestionsEmpty = (
  bookingQuestions: GTETourBookingWidgetTypes.MutationBookingQuestionAnswer[]
) =>
  bookingQuestions.some(
    question =>
      question.answer === "" && question.question !== GTETourQuestionId.SPECIAL_REQUIREMENTS
  );

export const isSomeBookingQuestionsEmpty = (
  bookingQuestions: GTETourBookingWidgetTypes.TourQuestionAnswer[]
) =>
  bookingQuestions.some(
    question =>
      question.required === true && getAnswer(question.answer, question.type, false) === ""
  );

export const isSomeTravelerQuestionEmpty = (
  travelerQuestions: GTETourBookingWidgetTypes.TravelerQuestions[]
) =>
  travelerQuestions.filter(traveler =>
    traveler.questions.some(
      question =>
        getAnswer(question.answer, question.type, false) === "" && question.required === true
    )
  ).length > 0;

export const constructSelectedTourProductSpecs = (
  tourSpecs: SharedTypes.ProductSpec[],
  selectedProduct: VacationPackageTypes.SelectedToursProductIds,
  t: TFunction
): SharedTypes.ProductSpec[] => {
  const starts = tourSpecs.find(spec => spec.id === VPTourSelectedSpecs.STARTS);
  const time = selectedProduct.startTime
    ? {
        id: VPTourSelectedSpecs.TIME,
        Icon: TimeIcon,
        name: t("Time"),
        value: selectedProduct.startTime,
      }
    : undefined;
  const duration = tourSpecs.find(spec => spec.id === VPTourSelectedSpecs.DURATION);
  const difficulty = tourSpecs.find(spec => spec.id === VPTourSelectedSpecs.DIFFICULTY);
  return [
    ...(starts ? [starts] : []),
    ...(time ? [time] : []),
    ...(duration ? [duration] : []),
    ...(difficulty ? [difficulty] : []),
  ];
};

export const getPreselectedTourTime = (
  selectedTours: VacationPackageTypes.SelectedToursProductIds[],
  tourOption: GTETourBookingWidgetTypes.TourOption,
  dayNumber: number,
  tourDurationInMinutes: number
) => {
  const sameDayTours = selectedTours.filter(
    tour => tour.day === dayNumber && tour.optionCode !== ""
  );
  if (sameDayTours.length === 0) return undefined;
  let hasSelectedTime = false;
  const newTimes = tourOption.times.map(time => {
    if (!hasSelectedTime && time.available && time.startTime) {
      const hasSameTimeSelected = sameDayTours.some(tour => {
        if (!tour.startTime) return false;

        return doesTourTimeClashWithOtherTour(
          time.startTime!,
          tourDurationInMinutes,
          tour.startTime,
          tour.durationInMinutes
        );
      });
      if (!hasSameTimeSelected) {
        hasSelectedTime = true;
        return {
          ...time,
          isSelected: true,
        };
      }
    }
    return {
      ...time,
      isSelected: false,
    };
  });
  if (newTimes.some(time => time.isSelected)) {
    return {
      ...tourOption,
      times: newTimes,
      guidedLanguages: getInitialSelectedTourOptionLanguage(tourOption.guidedLanguages),
    };
  }
  return undefined;
};

export const constructTourModalId = (productId: number | string, dayNumber: number) =>
  `${productId}${dayNumber}`;

export const hasTourInputChanged = (
  oldTourInput: VacationPackageTypes.ToursPriceInput[],
  newTourInput: VacationPackageTypes.ToursPriceInput[]
) => {
  const oldInput = oldTourInput?.[0];
  const newInput = newTourInput?.[0];
  if (oldInput && newInput) {
    const isSameDay = oldInput.key === newInput.key;
    const oldValues = oldInput.value;
    const newValues = newInput.value;
    const hasSameTours =
      oldValues.length === newValues.length
        ? newValues.every(tour =>
            oldValues.some(
              oldTour =>
                oldTour.productCode === tour.productCode &&
                oldTour.optionCode === tour.optionCode &&
                oldTour.startTime === tour.startTime &&
                oldTour.paxMix.every(oldPax =>
                  tour.paxMix.some(
                    pax =>
                      pax.ageBand === oldPax.ageBand &&
                      pax.numberOfTravelers === oldPax.numberOfTravelers
                  )
                )
            )
          )
        : false;
    return !isSameDay || !hasSameTours;
  }
  return oldInput !== newInput;
};
