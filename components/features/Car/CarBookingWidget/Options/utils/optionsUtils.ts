import { range, flatten } from "fp-ts/lib/Array";
import { isEmptyString } from "@travelshift/ui/utils/validationUtils";

import { constructInsuranceInfo } from "components/features/Car/utils/carUtils";
import { getTranslationByKey } from "utils/sharedCarUtils";

export const getSelectedExtra = (
  selectedExtras: CarBookingWidgetTypes.SelectedExtra[],
  selectedId: string
): CarBookingWidgetTypes.SelectedExtra | undefined =>
  selectedExtras.find(({ id }) => id === selectedId);

export const getSelectedExtraValue = (
  selectedExtras: CarBookingWidgetTypes.SelectedExtra[],
  selectedId: string
): number => {
  const selectedExtra = getSelectedExtra(selectedExtras, selectedId);
  return selectedExtra?.count ?? 0;
};

export const getSelectedExtraQuestionAnswers = (
  selectedExtras: CarBookingWidgetTypes.SelectedExtra[],
  selectedId: string
): CarBookingWidgetTypes.SelectedExtraQuestionAnswer[] => {
  const selectedExtra = getSelectedExtra(selectedExtras, selectedId);
  return selectedExtra?.questionAnswers ?? [];
};

const constructInitialExtra = ({ id }: { id: string }): CarBookingWidgetTypes.SelectedExtra => ({
  id,
  count: 0,
  questionAnswers: [],
});

export const constructInitialSelectedExtras = (
  extras: OptionsTypes.Option[]
): CarBookingWidgetTypes.SelectedExtra[] => extras.map(extra => constructInitialExtra(extra));

export const getSelectedCheckboxInsuranceValue = (
  selectedInsurances: CarBookingWidgetTypes.SelectedInsurance[],
  selectedId: string
): boolean => {
  const selectedInsurance = selectedInsurances.find(({ id }) => id === selectedId);

  return Boolean(selectedInsurance?.selected);
};

const constructInitialInsurance = ({
  id,
  code,
}: {
  id: string;
  code: string;
}): CarBookingWidgetTypes.SelectedInsurance => ({
  id,
  selected: false,
  code,
});

export const constructInitialSelectedInsurances = (
  insurances: OptionsTypes.Option[]
): CarBookingWidgetTypes.SelectedInsurance[] =>
  insurances.map(insurance => constructInitialInsurance(insurance));

export enum OptionTypes {
  Included,
  Multiple,
  Checkbox,
}

export const getOptionType = (option: OptionsTypes.Option) => {
  if (option.included) {
    return OptionTypes.Included;
  }

  if (option.multiple) {
    return OptionTypes.Multiple;
  }

  return OptionTypes.Checkbox;
};

export const sortOptions = (options: OptionsTypes.Option[]) => {
  return options.reduce(
    ([accIncludedOptions, accCheckboxOptions, accMultipleOptions], option) => {
      const optionType = getOptionType(option);
      return [
        [...accIncludedOptions, ...(optionType === OptionTypes.Included ? [option] : [])],
        [...accCheckboxOptions, ...(optionType === OptionTypes.Checkbox ? [option] : [])],
        [...accMultipleOptions, ...(optionType === OptionTypes.Multiple ? [option] : [])],
      ];
    },
    [[] as OptionsTypes.Option[], [] as OptionsTypes.Option[], [] as OptionsTypes.Option[]]
  );
};

export const sortQuestions = (questions: CarTypes.QueryExtraQuestion[]) => {
  // eslint-disable-next-line functional/immutable-data
  return questions.sort((a, b) => (a.questionType > b.questionType ? -1 : 1));
};

export const constructOptionFromIncluded = (
  included: CarTypes.QueryIncluded
): OptionsTypes.Option => ({
  id: included.includedId,
  name: included.name,
  price: 0,
  included: true,
  multiple: false,
  code: included.code,
  pricePerDay: true,
  max: 1,
  description: included.description,
  payOnLocation: false,
  questions: [],
});

export const constructOption = (
  extra: CarTypes.QueryExtra,
  t: TFunction,
  isCarnect: boolean
): OptionsTypes.Option => {
  const carnectNameKey = extra.translationKeys.keys.find(key => key.key.includes("name"));
  return {
    id: extra.id,
    name: carnectNameKey && isCarnect ? getTranslationByKey(carnectNameKey, t) : extra.name,
    price: extra.amount,
    included: extra.amount === 0,
    multiple: extra.quantity !== 1,
    code: extra.code,
    pricePerDay: extra.periodType === "PER_DAY",
    max: extra.quantity,
    description: extra.description,
    insuranceInfo: constructInsuranceInfo(t, isCarnect, extra.insuranceInfo),
    payOnLocation: !extra.payableNow,
    questions: extra.questions ? sortQuestions(extra.questions) : [],
  };
};

const isExtra = (type: CarTypes.QueryExtraType) => type === "EXTRA";

const isInsurance = (type: CarTypes.QueryExtraType) => type === "INSURANCE";

export const constructOptions = (
  extras: CarTypes.QueryExtra[],
  included: CarTypes.QueryIncluded[],
  t: TFunction,
  isCarnect: boolean
): { extras: OptionsTypes.Option[]; insurances: OptionsTypes.Option[] } => ({
  extras: included
    .filter(({ type }) => isExtra(type))
    .map(constructOptionFromIncluded)
    .concat(
      extras.filter(({ type }) => isExtra(type)).map(extra => constructOption(extra, t, isCarnect))
    ),
  insurances: included
    .filter(({ type }) => isInsurance(type))
    .map(constructOptionFromIncluded)
    .concat(
      extras
        .filter(({ type }) => isInsurance(type))
        .map(extra => constructOption(extra, t, isCarnect))
    ),
});

export const setSelectedExtraAnswers = (
  totalSelected: number,
  questions: CarTypes.QueryExtraQuestion[],
  selectedQuestionAnswers: CarBookingWidgetTypes.SelectedExtraQuestionAnswer[]
) =>
  flatten(
    range(1, totalSelected).map(index =>
      questions.map(question => {
        const extraValue = selectedQuestionAnswers.find(
          answer => answer.identifier === String(index) && answer.key === question.key
        );
        return (
          extraValue || {
            key: question.key,
            answer: question.questionType === "NUMBER" ? "45" : "",
            identifier: String(index),
          }
        );
      })
    )
  );

export const getExtraPriceInfo = ({
  payOnLocation,
  pricePerDay,
  t,
}: {
  payOnLocation: boolean;
  pricePerDay: boolean;
  t: TFunction;
}) => {
  if (payOnLocation && pricePerDay) {
    return `${t("Per day")} - ${t("Pay on location")}`;
  }
  if (pricePerDay) {
    return t("Per day");
  }
  if (payOnLocation) {
    return t("Pay on location");
  }
  return undefined;
};

export const getSelectedExtrasWithEmptyAnswers = (
  selectedExtras: CarBookingWidgetTypes.SelectedExtra[]
): CarBookingWidgetTypes.SelectedExtra[] =>
  selectedExtras.length
    ? selectedExtras.filter(
        extra => extra.questionAnswers?.some(a => isEmptyString(a.answer)) && extra.count > 0
      )
    : [];
