declare namespace CarBookingWidgetTypes {
  export type SelectedExtraQuestionAnswer = {
    key: string;
    answer: string;
    identifier: string;
  };

  export type SelectedExtra = {
    id: string | number;
    count: number;
    questionAnswers: SelectedExtraQuestionAnswer[];
  };

  export type SelectedInsurance = {
    id: string;
    selected: boolean;
    code: string;
  };

  export type OnSelectedInsuranceInput = {
    id: string;
    selected: boolean;
  };

  export type OnSetSelectedExtra = (selectedExtra: SelectedExtra) => void;

  export type OnSetSelectedExtraQuestionAnswers = (
    selectedExtraId: string,
    answer: SelectedExtraQuestionAnswer
  ) => void;

  export type OnSetSelectedInsurance = (selectedInsurance: OnSelectedInsuranceInput) => void;

  export type PriceBreakdownItem = {
    id: string;
    name: string;
    totalPrice: number;
    translationKeys: CarTypes.TranslationKeys;
  };
}
