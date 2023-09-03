declare namespace GTETourBookingWidgetTypes {
  type QueryAgeBand = {
    priceType?: string;
    unitType?: string;
    ageBand?: string;
    startAge: number;
    endAge: number;
    minTravelersPerBooking: number;
    maxTravelersPerBooking: number;
  };

  type QueryAgeBandData = {
    minTravelersPerBooking: number;
    maxTravelersPerBooking: number;
    requiresAdultForBooking: boolean;
    ageBands: QueryAgeBand[];
  };

  type AgeBand = {
    ageBand: string;
    numberOfTravelers: number;
  };
  type PriceGroup = {
    id: string;
    defaultNumberOfTravelerType: number;
    minAge: number;
    maxAge: number;
    minNumberOfTravelerType: number;
    maxNumberOfTravelerType: number;
    travelerType: import("./enums").GTETourAgeBand;
  };

  type TourOptionLanguage = {
    locale: string;
    localeName: string;
    type?: import("./enums").GTETourGuidedLanguageType;
  };

  type TourOptionTime = {
    startTime?: string;
    available: boolean;
    unavailableReason?: string;
    totalPrice?: number;
  };

  type TourOption = {
    optionCode?: string;
    name: string;
    description: string;
    times: TourOptionTime[];
    guidedLanguages: TourOptionLanguage[];
  };

  type SelectedTourOption = Omit<TourOption, "times" | "guidedLanguages"> & {
    times: SelectedTourOptionTime[];
    guidedLanguages: SelectedTourOptionLanguage[];
  };

  type TourQuestionCondition = {
    key: string;
    value: string[];
  };

  type TourQuestion = {
    id: number;
    providerBookingQuestionId: string;
    type: string;
    group: string;
    label: string;
    hint?: string;
    required: string;
    maxLength: number;
    units?: string[];
    allowedAnswers?: string[];
    conditions: TourQuestionCondition[];
  };

  type TourOptionQuestionAnswer = {
    label: string;
    value: string;
    conditionalQuestions: TourQuestionAnswer[];
  };

  type TourQuestionAnswer = {
    id: number;
    providerBookingQuestionId: import("./enums").GTETourQuestionId | string;
    type: import("./enums").GTETourQuestionType;
    group: string;
    answer: string | SharedTypes.Birthdate | SharedTypes.Time | SharedTypes.AutocompleteItem;
    label: string;
    hint?: string;
    required: boolean;
    maxLength: number;
    units?: string[];
    selectedUnit?: string;
    allowedAnswers?: TourOptionQuestionAnswer[];
  };

  type TravelerQuestions = {
    id: string;
    name: string;
    numberOfType: number;
    numberOfTraveler: number;
    ageBand?: TourQuestionAnswer;
    questions: TourQuestionAnswer[];
  };

  type SplitQuestions = {
    perBooking: TourQuestion[];
    conditionalQuestions: TourQuestion[];
    perPerson: TourQuestion[];
    ageBand?: TourQuestion;
  };

  type GTETourPickup = {
    allowCustomTravelerPickup: boolean;
  };

  type TourData = {
    internal: number;
    productCode: string;
    startingPlace?: string;
    endingPlace?: string;
    durationInMinutes?: number;
    options: TourOption[];
    pickup?: GTETourPickup;
    questions: TourQuestion[];
  };

  type SelectedTourOptionTime = TourOptionTime & {
    isSelected: boolean;
  };

  type SelectedTourOptionLanguage = TourOptionLanguage & {
    id: string;
    isSelected: boolean;
  };

  type activeDropdownType =
    | import("./enums").GTETourDropdownType.DATES
    | import("./enums").GTETourDropdownType.TRAVELERS
    | import("./enums").GTETourDropdownType.OPTIONS
    | import("./enums").GTETourDropdownType.TIMES
    | import("./enums").GTETourDropdownType.LANGUAGES
    | import("./enums").GTETourDropdownType.ARRIVAL_DROPDOWN
    | import("./enums").GTETourDropdownType.DEPARTURE_DROPDOWN
    | null;

  type MutationBookingQuestionAnswer = {
    answer: string;
    label: string;
    question: import("./enums").GTETourQuestionId | string;
    travelerNum: number | null;
    unit?: string;
  };

  type MutationAddGTETourToCartInput = {
    productCode: string;
    productOptionCode?: string;
    startTime?: string;
    paxMix: AgeBand[];
    travelDate: string;
    uri: string;
    languageGuide?: {
      language: string;
      type: string;
    };
    bookingQuestionAnswers: MutationBookingQuestionAnswer[];
  };
}
