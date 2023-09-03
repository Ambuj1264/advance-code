declare namespace ExperiencesTypes {
  export type ExperienceAnswers = ExperienceAnswer[];

  export type ExperienceAnswer = {
    id: string;
    name: string;
    prices: number[];
    vpPrice: TourBookingWidgetTypes.GTIVpPrice;
    included: boolean;
    isDefault: boolean;
  };

  export type TravelerExperience = Readonly<{
    id: string;
    name: string;
    calculatePricePerPerson: boolean;
    hasExternalLimit: boolean;
    externalMaxLimit?: number;
    price: number;
    discountValue?: number;
    questions: TourOptionQuestion[];
    required: boolean;
  }>;

  export type InformationExperience = TravelerExperience;

  export type ToggleExperience = TravelerExperience;

  export type MultiSelectionExperience = Readonly<{
    id: string;
    name: string;
    answers: ExperienceAnswers;
    calculatePricePerPerson: boolean;
  }>;

  export type Experience =
    | MultiSelectionExperience
    | TravelerExperience
    | ToggleExperience
    | InformationExperience;

  export type Experiences = Experience[];

  export type TourOptionAnswers = TourOptionAnswer[];

  export type TourOptionAnswer = Readonly<{
    id: string;
    default: string;
    name: string;
  }>;

  export type TourOptions = TourOption[];

  export type TourOption = {
    id: string;
    name: string;
    answers: TourOptionAnswer[];
    calculatePricePerPerson: boolean;
    externalLimitByPax?: boolean | null;
    externalMaxLimit?: number | null;
    questions: TourOptionQuestion[];
    required: boolean;
  };

  export type TourOptionQuestionAnswer = Readonly<{
    label: string;
    value: string;
  }>;

  export type TourOptionQuestion = Readonly<{
    answers: TourOptionQuestionAnswer[];
    externalId: number | null;
    id: number;
    question: string;
    required: boolean;
    selector: boolean;
  }>;

  export type QueryTourOption = {
    id: number;
    name: string;
    answers: string;
    externalLimitByPax?: boolean | null;
    externalMaxLimit?: number | null;
    questions: TourOptionQuestion[];
    calculatePricePerPerson: boolean;
    required: boolean;
  };

  export type TourOptionsData = Readonly<{
    tourOptions: QueryTourOption[];
  }>;

  export type QueryTourOptions = Readonly<{
    tour: TourOptionsData;
  }>;

  export type TravelerAnswer = {
    question: string;
    answer: string;
    externalId: number | null;
    required: boolean;
  };

  export type SelectedExperience = {
    answerId?: string;
    count?: number;
    experienceId: string;
    calculatePricePerPerson: boolean;
    prices: number[] | number;
  };
}
