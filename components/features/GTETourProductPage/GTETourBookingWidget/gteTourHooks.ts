import { useCallback, useMemo, useRef, useState } from "react";

import { useGTETourBookingWidgetContext } from "./GTETourBookingWidgetStateContext";
import {
  getInitialSelectedTourOption,
  getTotalPrice,
  updateTourOptionTimes,
  updateTourOptionLanguages,
  updateBookingQuestionAnswer,
  updateConditionalBookingQuestionAnswer,
  updateTravelerQuestionAnswer,
  updateTravelerQuestionUnit,
} from "./utils/gteTourBookingWidgetUtils";
import { GTETourAgeBand, GTETourDropdownType } from "./types/enums";

import BookingWidgetView from "components/features/TourBookingWidget/types/enums";
import { setDatesInLocalStorage } from "utils/localStorageUtils";

export const useSetNumberOfTravelers = () => {
  const { setContextState, numberOfTravelers } = useGTETourBookingWidgetContext();

  return useCallback(
    (travelerType: GTETourAgeBand, value: number) => {
      const updatedNumberOfTravelers = numberOfTravelers.map(traveler => {
        if (traveler.ageBand === travelerType) {
          return {
            ...traveler,
            numberOfTravelers: value,
          };
        }

        return traveler;
      });
      setContextState({
        numberOfTravelers: updatedNumberOfTravelers,
      });
    },
    [numberOfTravelers, setContextState]
  );
};

export const useOnDateSelection = () => {
  const { setContextState, selectedDates } = useGTETourBookingWidgetContext();

  return useCallback(
    (newSelectedDates: SharedTypes.SelectedDates) => {
      setDatesInLocalStorage(selectedDates);

      setContextState({
        selectedDates: newSelectedDates,
      });
    },
    [selectedDates, setContextState]
  );
};

export const useDropdownActiveState = () => {
  const [activeDropdown, setActiveDropdown] =
    useState<GTETourBookingWidgetTypes.activeDropdownType>(null);
  // we use both useState and useRef for storing same value.
  // ref value is used to create consistent callback,
  // state value is used for render
  const activeDropdownRef = useRef<GTETourBookingWidgetTypes.activeDropdownType>(null);
  const createOpenStateChangeHandler = useCallback(
    (dropdownType: GTETourBookingWidgetTypes.activeDropdownType) => (isOpen: boolean) => {
      const shouldClose =
        !isOpen && activeDropdownRef.current && dropdownType === activeDropdownRef.current;
      const shouldOpen = isOpen && !activeDropdownRef.current;
      if (!shouldClose && !shouldOpen) return;

      activeDropdownRef.current = shouldOpen ? dropdownType : null;
      setActiveDropdown(shouldOpen ? dropdownType : null);
    },
    [activeDropdownRef]
  );
  const onDatesOpenStateChangeHandler = useMemo(
    () => createOpenStateChangeHandler(GTETourDropdownType.DATES),
    [createOpenStateChangeHandler]
  );
  const onTravelersOpenStateChangeHandler = useMemo(
    () => createOpenStateChangeHandler(GTETourDropdownType.TRAVELERS),
    [createOpenStateChangeHandler]
  );
  const onOptionsOpenStateChangeHandler = useMemo(
    () => createOpenStateChangeHandler(GTETourDropdownType.OPTIONS),
    [createOpenStateChangeHandler]
  );
  const onTimesOpenStateChangeHandler = useMemo(
    () => createOpenStateChangeHandler(GTETourDropdownType.TIMES),
    [createOpenStateChangeHandler]
  );
  const onGuidedLanguagesOpenStateChangeHandler = useMemo(
    () => createOpenStateChangeHandler(GTETourDropdownType.LANGUAGES),
    [createOpenStateChangeHandler]
  );
  const onArrivalDropdownOpenStateChangeHandler = useMemo(
    () => createOpenStateChangeHandler(GTETourDropdownType.ARRIVAL_DROPDOWN),
    [createOpenStateChangeHandler]
  );
  const onDepartureDropdownOpenStateChangeHandler = useMemo(
    () => createOpenStateChangeHandler(GTETourDropdownType.DEPARTURE_DROPDOWN),
    [createOpenStateChangeHandler]
  );
  return {
    activeDropdown,
    createOpenStateChangeHandler,
    onDatesOpenStateChangeHandler,
    onTravelersOpenStateChangeHandler,
    onOptionsOpenStateChangeHandler,
    onTimesOpenStateChangeHandler,
    onGuidedLanguagesOpenStateChangeHandler,
    onArrivalDropdownOpenStateChangeHandler,
    onDepartureDropdownOpenStateChangeHandler,
  };
};

export const useOnSelectTourOption = () => {
  const { setContextState, tourOptions, selectedTourOption } = useGTETourBookingWidgetContext();
  return useCallback(
    (tourOptionId: string) => {
      const tourOption = tourOptions.find(option => option.optionCode === tourOptionId);
      const newSelectedTourOption = getInitialSelectedTourOption(tourOption || selectedTourOption!);
      setContextState({
        selectedTourOption: newSelectedTourOption,
        totalPrice: getTotalPrice(newSelectedTourOption),
      });
    },
    [selectedTourOption, setContextState, tourOptions]
  );
};

export const useOnSelectTourOptionTime = () => {
  const { setContextState, selectedTourOption } = useGTETourBookingWidgetContext();
  return useCallback(
    (tourTime: string) => {
      const tourOptionTimes = updateTourOptionTimes(tourTime, selectedTourOption);
      const newSelectedTourOption = {
        ...selectedTourOption!,
        times: tourOptionTimes,
      };
      setContextState({
        selectedTourOption: newSelectedTourOption,
        totalPrice: getTotalPrice(newSelectedTourOption),
      });
    },
    [setContextState, selectedTourOption]
  );
};

export const useOnSelectTourOptionLanguage = () => {
  const { setContextState, selectedTourOption } = useGTETourBookingWidgetContext();
  return useCallback(
    (tourLocale: string) => {
      const tourOptionLocales = updateTourOptionLanguages(tourLocale, selectedTourOption);
      setContextState({
        selectedTourOption: selectedTourOption
          ? {
              ...selectedTourOption,
              guidedLanguages: tourOptionLocales,
            }
          : undefined,
      });
    },
    [setContextState, selectedTourOption]
  );
};

export const useOnChangeBookingQuestionAnswer = () => {
  const { setContextState, bookingQuestions } = useGTETourBookingWidgetContext();
  return useCallback(
    (
      questionId: number,
      answer: string | SharedTypes.Birthdate | SharedTypes.Time | SharedTypes.AutocompleteItem
    ) => {
      const newBookingQuestions = updateBookingQuestionAnswer(questionId, answer, bookingQuestions);
      setContextState({
        bookingQuestions: newBookingQuestions,
      });
    },
    [setContextState, bookingQuestions]
  );
};

export const useOnChangeConditionalBookingQuestionAnswer = () => {
  const { setContextState, bookingQuestions } = useGTETourBookingWidgetContext();
  return useCallback(
    (
      questionId: number,
      conditionalQuestionId: number,
      answer: string | SharedTypes.Birthdate | SharedTypes.Time | SharedTypes.AutocompleteItem
    ) => {
      const newBookingQuestions = updateConditionalBookingQuestionAnswer(
        questionId,
        conditionalQuestionId,
        answer,
        bookingQuestions
      );
      setContextState({
        bookingQuestions: newBookingQuestions,
      });
    },
    [setContextState, bookingQuestions]
  );
};

export const useOnChangeTravelerQuestionAnswer = () => {
  const { setContextState, travelerQuestions } = useGTETourBookingWidgetContext();
  return useCallback(
    (
      travelerId: string,
      questionId: number,
      answer: string | SharedTypes.Birthdate | SharedTypes.Time | SharedTypes.AutocompleteItem
    ) => {
      const newTravelerQuestions = updateTravelerQuestionAnswer(
        travelerId,
        questionId,
        answer,
        travelerQuestions
      );
      setContextState({
        travelerQuestions: newTravelerQuestions,
      });
    },
    [setContextState, travelerQuestions]
  );
};

export const useOnChangeTravelerQuestionUnit = () => {
  const { setContextState, travelerQuestions } = useGTETourBookingWidgetContext();
  return useCallback(
    (travelerId: string, questionId: number, unit: string) => {
      const newTravelerQuestions = updateTravelerQuestionUnit(
        travelerId,
        questionId,
        unit,
        travelerQuestions
      );
      setContextState({
        travelerQuestions: newTravelerQuestions,
      });
    },
    [setContextState, travelerQuestions]
  );
};

export const useOnBookingWidgetViewChange = () => {
  const { setContextState } = useGTETourBookingWidgetContext();
  return useCallback(
    (bookingWidgetView: BookingWidgetView) => {
      setContextState({
        bookingWidgetView,
      });
    },
    [setContextState]
  );
};
