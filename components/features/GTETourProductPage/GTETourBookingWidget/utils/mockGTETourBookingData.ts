import { GTETourQuestionType, GTETourGuidedLanguageType } from "../types/enums";

export const mockBookingQuestion0: GTETourBookingWidgetTypes.TourQuestion = {
  id: 12,
  providerBookingQuestionId: "SPECIAL_REQUIREMENTS",
  type: "STRING",
  group: "PER_BOOKING",
  label: "Special requirements",
  required: "OPTIONAL",
  maxLength: 1000,
  conditions: [],
};

export const mockBookingQuestion1: GTETourBookingWidgetTypes.TourQuestion = {
  id: 15,
  providerBookingQuestionId: "TRANSFER_ARRIVAL_MODE",
  type: "STRING",
  group: "PER_BOOKING",
  label: "Arrival mode",
  required: "MANDATORY",
  maxLength: 500,
  allowedAnswers: ["AIR", "RAIL", "SEA"],
  conditions: [
    {
      key: "AIR",
      value: ["TRANSFER_AIR_ARRIVAL_AIRLINE"],
    },
    {
      key: "RAIL",
      value: ["TRANSFER_RAIL_ARRIVAL_LINE"],
    },
    {
      key: "SEA",
      value: ["TRANSFER_PORT_CRUISE_SHIP"],
    },
  ],
};

export const mockBookingQuestion2: GTETourBookingWidgetTypes.TourQuestion = {
  id: 16,
  providerBookingQuestionId: "TRANSFER_AIR_ARRIVAL_AIRLINE",
  type: "STRING",
  group: "PER_BOOKING",
  label: "Arrival Airline",
  required: "CONDITIONAL",
  maxLength: 500,
  conditions: [],
};

export const mockBookingQuestion3: GTETourBookingWidgetTypes.TourQuestion = {
  id: 17,
  providerBookingQuestionId: "TRANSFER_RAIL_ARRIVAL_LINE",
  type: "STRING",
  group: "PER_BOOKING",
  label: "Arrival Rail line",
  required: "CONDITIONAL",
  maxLength: 500,
  conditions: [],
};

export const mockBookingQuestion4: GTETourBookingWidgetTypes.TourQuestion = {
  id: 18,
  providerBookingQuestionId: "TRANSFER_PORT_CRUISE_SHIP",
  type: "STRING",
  group: "PER_BOOKING",
  label: "Transfer port cruise ship",
  required: "CONDITIONAL",
  maxLength: 500,
  conditions: [],
};

export const mockTravelerQuestion0: GTETourBookingWidgetTypes.TourQuestion = {
  id: 19,
  providerBookingQuestionId: "FULL_NAMES_FIRST",
  type: "STRING" as GTETourQuestionType,
  group: "PER_TRAVELER",
  label: "First name",
  required: "MANDATORY",
  maxLength: 500,
  conditions: [],
};

export const mockTravelerQuestion1: GTETourBookingWidgetTypes.TourQuestion = {
  id: 20,
  providerBookingQuestionId: "AGEBAND",
  type: "STRING" as GTETourQuestionType,
  group: "PER_TRAVELER",
  label: "Age band",
  required: "MANDATORY",
  maxLength: 500,
  allowedAnswers: ["ADULT", "CHILD", "YOUTH"],
  conditions: [],
};

export const mockTravelerQuestionAnswer0Question = {
  id: 19,
  providerBookingQuestionId: "FULL_NAMES_FIRST",
  type: GTETourQuestionType.STRING,
  group: "PER_TRAVELER",
  label: "First name",
  maxLength: 500,
  answer: "",
  required: true,
  allowedAnswers: undefined,
  hint: undefined,
  units: undefined,
};
export const mockTravelerQuestionAnswer0: GTETourBookingWidgetTypes.TravelerQuestions = {
  id: "ADULT-1",
  name: "Adult",
  numberOfType: 1,
  numberOfTraveler: 1,
  ageBand: {
    id: 20,
    providerBookingQuestionId: "AGEBAND",
    type: "STRING" as GTETourQuestionType,
    group: "PER_TRAVELER",
    answer: "ADULT",
    label: "Age band",
    required: true,
    maxLength: 500,
    allowedAnswers: [],
  },
  questions: [mockTravelerQuestionAnswer0Question],
};

export const mockTravelerQuestionAnswer1: GTETourBookingWidgetTypes.TravelerQuestions = {
  id: "CHILD-1",
  name: "Child",
  numberOfType: 1,
  numberOfTraveler: 2,
  ageBand: {
    id: 20,
    providerBookingQuestionId: "AGEBAND",
    type: "STRING" as GTETourQuestionType,
    group: "PER_TRAVELER",
    answer: "CHILD",
    label: "Age band",
    required: true,
    maxLength: 500,
    allowedAnswers: [],
  },
  questions: [
    {
      id: 19,
      providerBookingQuestionId: "FULL_NAMES_FIRST",
      type: GTETourQuestionType.STRING,
      group: "PER_TRAVELER",
      label: "First name",
      maxLength: 500,
      answer: "",
      required: true,
      allowedAnswers: undefined,
      hint: undefined,
      units: undefined,
    },
  ],
};

export const mockBookingQuestionAnswer0: GTETourBookingWidgetTypes.TourQuestionAnswer = {
  id: 12,
  providerBookingQuestionId: "SPECIAL_REQUIREMENTS",
  type: GTETourQuestionType.TEXTAREA,
  group: "PER_BOOKING",
  label: "Special requirements",
  required: false,
  maxLength: 1000,
  answer: "",
  units: undefined,
  hint: undefined,
  allowedAnswers: undefined,
};

export const mockBookingQuestionAnswer1AllowedAnswer0ConditionalQuestion = {
  id: 16,
  providerBookingQuestionId: "TRANSFER_AIR_ARRIVAL_AIRLINE",
  type: GTETourQuestionType.STRING,
  group: "PER_BOOKING",
  label: "Arrival Airline",
  required: true,
  maxLength: 500,
  answer: "",
  units: undefined,
  hint: undefined,
  allowedAnswers: [],
};

export const mockBookingQuestionAnswer1AllowedAnswer0 = {
  label: "Air",
  value: "AIR",
  conditionalQuestions: [mockBookingQuestionAnswer1AllowedAnswer0ConditionalQuestion],
};

export const mockBookingQuestionAnswer1AllowedAnswer1ConditionalQuestion = {
  id: 17,
  providerBookingQuestionId: "TRANSFER_RAIL_ARRIVAL_LINE",
  type: GTETourQuestionType.STRING,
  group: "PER_BOOKING",
  label: "Arrival Rail line",
  required: true,
  maxLength: 500,
  answer: "",
  units: undefined,
  hint: undefined,
  allowedAnswers: [],
};

export const mockBookingQuestionAnswer1AllowedAnswer1 = {
  label: "Rail",
  value: "RAIL",
  conditionalQuestions: [mockBookingQuestionAnswer1AllowedAnswer1ConditionalQuestion],
};

export const mockBookingQuestionAnswer1AllowedAnswer2ConditionalQuestion = {
  id: 18,
  providerBookingQuestionId: "TRANSFER_PORT_CRUISE_SHIP",
  type: GTETourQuestionType.STRING,
  group: "PER_BOOKING",
  label: "Transfer port cruise ship",
  required: true,
  maxLength: 500,
  answer: "",
  units: undefined,
  hint: undefined,
  allowedAnswers: [],
};

export const mockBookingQuestionAnswer1AllowedAnswer2 = {
  label: "Sea",
  value: "SEA",
  conditionalQuestions: [mockBookingQuestionAnswer1AllowedAnswer2ConditionalQuestion],
};
export const mockBookingQuestionAnswer1: GTETourBookingWidgetTypes.TourQuestionAnswer = {
  id: 15,
  providerBookingQuestionId: "TRANSFER_ARRIVAL_MODE",
  type: GTETourQuestionType.DROPDOWN,
  group: "PER_BOOKING",
  label: "Arrival mode",
  required: true,
  maxLength: 500,
  units: undefined,
  hint: undefined,
  allowedAnswers: [
    mockBookingQuestionAnswer1AllowedAnswer0,
    mockBookingQuestionAnswer1AllowedAnswer1,
    mockBookingQuestionAnswer1AllowedAnswer2,
  ],
  answer: "",
};

export const mockTourOptionTime0 = {
  startTime: "05:00",
  available: true,
  unavailableReason: "",
  totalPrice: 123,
  isSelected: true,
};

export const mockTourOptionTime1 = {
  startTime: "05:30",
  available: true,
  unavailableReason: "",
  totalPrice: 123,
  isSelected: false,
};

export const mockTourOptionLanguage0 = {
  id: "en-GUIDE",
  locale: "en",
  localeName: "English",
  type: GTETourGuidedLanguageType.GUIDE,
  isSelected: true,
};

export const mockTourOptionLanguage1 = {
  id: "fr-GUIDE",
  locale: "fr",
  localeName: "French",
  type: GTETourGuidedLanguageType.GUIDE,
  isSelected: false,
};

export const mockTourOption: GTETourBookingWidgetTypes.SelectedTourOption = {
  optionCode: "1234",
  name: "",
  description: "",
  times: [mockTourOptionTime0, mockTourOptionTime1],
  guidedLanguages: [mockTourOptionLanguage0, mockTourOptionLanguage1],
};

export const mockSelectedTourOptionTime0 = {
  ...mockTourOptionTime0,
  isSelected: true,
};

export const mockSelectedTourOptionTime1 = {
  ...mockTourOptionTime1,
  isSelected: false,
};

export const mockSelectedTourOptionLanguage0 = {
  ...mockTourOptionLanguage0,
  isSelected: true,
};

export const mockSelectedTourOptionLanguage1 = {
  ...mockTourOptionLanguage1,
  isSelected: false,
};

export const mockSelectedTourOption: GTETourBookingWidgetTypes.SelectedTourOption = {
  ...mockTourOption,
  times: [mockSelectedTourOptionTime0, mockSelectedTourOptionTime1],
  guidedLanguages: [mockSelectedTourOptionLanguage0, mockSelectedTourOptionLanguage1],
};
