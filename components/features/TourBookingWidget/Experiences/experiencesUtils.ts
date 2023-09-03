import { pipe } from "fp-ts/lib/pipeable";
import { findFirst, map as arrayMap } from "fp-ts/lib/Array";
import { fromNullable, getOrElse, map } from "fp-ts/lib/Option";

import { getTotalNumberOfTravelers } from "../Travelers/utils/travelersUtils";

import currencyFormatter, { getPriceSign } from "utils/currencyFormatUtils";

export const isSelectedAnswerIncluded = (
  answers: ExperiencesTypes.ExperienceAnswer[],
  selectedAnswerId: string
) =>
  pipe(
    answers,
    findFirst(({ id }) => id === selectedAnswerId),
    map(({ included, isDefault }) => ({ isIncluded: included, isDefault })),
    getOrElse(() => ({ isIncluded: false, isDefault: false }))
  );

export const filterAnswerByOptions = (
  answer: ExperiencesTypes.TourOptionAnswer,
  options: TourBookingWidgetTypes.Option[]
) =>
  pipe(
    options,
    findFirst(option => option.id === answer.id),
    map(option => !option.disabled),
    getOrElse(() => false)
  );

export const getExtraByTourOptionId = (
  extras: TourBookingWidgetTypes.Extra[],
  tourOptionId: string
) =>
  pipe(
    extras,
    findFirst(extra => extra.id === tourOptionId),
    getOrElse(
      () =>
        ({
          id: "0",
          disabled: true,
          options: [],
          price: 0,
        } as TourBookingWidgetTypes.Extra)
    )
  );

export const filterItemExtrasFromTourOptions = (
  tourOptions: ExperiencesTypes.TourOptions,
  editItem: TourBookingWidgetTypes.EditItem
) =>
  tourOptions.filter(
    (tourOption: ExperiencesTypes.TourOption) =>
      !editItem.tourDetails.options!.find(
        (option: TourBookingWidgetTypes.EditItemDetailsOption) => option.id === tourOption.id
      )
  );

export const filterDisabledTourOptionsFromExtras = (
  tourOptions: ExperiencesTypes.TourOptions,
  extras: TourBookingWidgetTypes.Extra[],
  editItem?: TourBookingWidgetTypes.EditItem
) => {
  const options = editItem ? filterItemExtrasFromTourOptions(tourOptions, editItem) : tourOptions;
  return options.reduce((filtered, tourOption) => {
    const extra = getExtraByTourOptionId(extras, tourOption.id);
    if (extra.disabled && tourOption.questions.length === 0) return filtered;
    if (!tourOption.answers) {
      return [...filtered, tourOption];
    }
    const filteredAnswers = tourOption.answers.filter(answer =>
      filterAnswerByOptions(answer, extra.options)
    );
    return [
      ...filtered,
      {
        ...tourOption,
        answers: filteredAnswers,
      },
    ];
  }, [] as ExperiencesTypes.TourOptions);
};

export const getOptionByAnswerId = (options: TourBookingWidgetTypes.Option[], answerId: string) =>
  pipe(
    options,
    findFirst(option => option.id === answerId),
    getOrElse(
      () =>
        ({
          id: "",
          disabled: false,
          prices: [{ price: 0, disabled: false }] as TourBookingWidgetTypes.OptionPrice[],
          included: false,
        } as TourBookingWidgetTypes.Option)
    )
  );

export const constructExperienceAnswers = ({
  answers,
  options,
  currentExperienceId,
  selectedExperiences,
}: {
  answers: ExperiencesTypes.TourOptionAnswers;
  options: TourBookingWidgetTypes.Option[];
  currentExperienceId: string;
  selectedExperiences: TourBookingWidgetTypes.SelectedExperiences;
}): ExperiencesTypes.ExperienceAnswers =>
  answers.map(answer => {
    const { prices, included } = pipe(
      options,
      findFirst(option => option.id === answer.id),
      getOrElse(
        () =>
          ({
            id: "",
            disabled: false,
            prices: [{ price: 0, disabled: false }] as TourBookingWidgetTypes.OptionPrice[],
            included: false,
            isDefault: false,
          } as TourBookingWidgetTypes.Option)
      )
    );
    const selectedExperience = selectedExperiences.find(
      ({ experienceId }) => experienceId === currentExperienceId
    ) as TourBookingWidgetTypes.SelectedGroupExperience;
    const selectedExperiencePrice = selectedExperience ? selectedExperience.prices[0] : 0;

    const optionPrice = prices[0];

    return {
      id: answer.id,
      name: answer.name,
      prices: arrayMap((price: TourBookingWidgetTypes.OptionPrice) => price.price)(prices),
      vpPrice: {
        selectedOptionDiff: selectedExperience ? optionPrice.price - selectedExperiencePrice : 0,
        discountValue: optionPrice.discountValue || 0,
      },
      included,
      isDefault: answer.default === "1",
    };
  });

const constructTourOption = (
  tourOption: ExperiencesTypes.QueryTourOption
): ExperiencesTypes.TourOption => {
  const { answers } = tourOption;
  let parsedAnswers = null;

  if (answers) {
    try {
      parsedAnswers = JSON.parse(answers) as ExperiencesTypes.TourOptionAnswers;
      // eslint-disable-next-line no-empty
    } catch (error) {}
  }

  return {
    id: String(tourOption.id),
    name: tourOption.name,
    answers: parsedAnswers
      ? parsedAnswers.map(answer => ({
          id: answer.id,
          name: answer.name,
          default: answer.default,
        }))
      : [],
    calculatePricePerPerson: tourOption.calculatePricePerPerson,
    externalLimitByPax: tourOption.externalLimitByPax,
    externalMaxLimit: tourOption.externalMaxLimit,
    questions: tourOption.questions,
    required: tourOption.required,
  };
};

export const constructTourOptions = (
  tourOptions: ExperiencesTypes.QueryTourOption[]
): ExperiencesTypes.TourOptions =>
  tourOptions.map((tourOption: ExperiencesTypes.QueryTourOption) =>
    constructTourOption(tourOption)
  );

export const constructGTIVpOptions = (
  vpPricesOptions?: TourBookingWidgetTypes.QueryVpOptions[]
): ExperiencesTypes.TourOptions =>
  vpPricesOptions
    ? vpPricesOptions.map(vpOptionItem => ({
        id: String(vpOptionItem.id),
        name: vpOptionItem.name,
        answers: vpOptionItem.items.map(answer => ({
          id: answer.id,
          name: answer.name,
          default: answer.isDefault ? "1" : "0",
        })),
        calculatePricePerPerson: vpOptionItem.items.length ? false : vpOptionItem.perPerson,
        questions: vpOptionItem.question
          ? [
              {
                id: vpOptionItem.id,
                name: vpOptionItem.question,
                question: vpOptionItem.question,
                externalId: null,
                answers: [],
                required: false,
                selector: false,
              },
            ]
          : [],
        required: vpOptionItem.isRequired,
      }))
    : [];

export const DEFAULT_EXTERNAL_LIMIT = 100;

export const constructExperience = (
  tourOption: ExperiencesTypes.TourOption,
  extras: TourBookingWidgetTypes.Extra[],
  selectedExperiences: TourBookingWidgetTypes.SelectedExperiences
): ExperiencesTypes.Experience => {
  const { options, price, discountValue } = pipe(
    extras,
    findFirst(extra => extra.id === tourOption.id),
    map(extra => ({
      options: extra.options,
      price: extra.price,
      discountValue: extra.discountValue || 0,
    })),
    getOrElse(() => ({
      options: [] as TourBookingWidgetTypes.Option[],
      price: 0,
      discountValue: 0,
    }))
  );

  const {
    id,
    name,
    required,
    externalMaxLimit,
    calculatePricePerPerson,
    questions,
    externalLimitByPax,
  } = tourOption;
  const hasExternalLimitEnabled = externalLimitByPax != null;
  const hasExternalExperienceLimit = !required && hasExternalLimitEnabled;
  let tourOptionExternalLimit;

  if (hasExternalExperienceLimit) {
    tourOptionExternalLimit = externalLimitByPax
      ? undefined
      : externalMaxLimit || DEFAULT_EXTERNAL_LIMIT;
  }

  const experience = {
    id,
    name,
    price,
    discountValue,
    questions,
    calculatePricePerPerson,
    required,
    hasExternalLimit: hasExternalExperienceLimit,
    externalMaxLimit: tourOptionExternalLimit,
  };

  if (!tourOption.answers) {
    return experience;
  }

  return {
    ...experience,
    answers: constructExperienceAnswers({
      answers: tourOption.answers,
      options,
      selectedExperiences,
      currentExperienceId: experience.id,
    }),
  };
};

export enum ExperienceType {
  Dropdown,
  Travelers,
  Toggle,
  Information,
}

export const getExperienceType = (experience: ExperiencesTypes.Experience) => {
  const hasAnswers = "answers" in experience && experience.answers.length > 0;
  const hasPrice = "price" in experience;

  const hasSingleQuestion = "questions" in experience && experience.questions.length === 1;
  const hasMultipleQuestions = "questions" in experience && experience.questions.length > 1;
  if (hasAnswers && !hasSingleQuestion && !hasMultipleQuestions) {
    return ExperienceType.Dropdown;
  }
  if (!hasAnswers && hasMultipleQuestions && experience.price === 0) {
    return ExperienceType.Information;
  }
  if (experience.calculatePricePerPerson && hasPrice) {
    return ExperienceType.Travelers;
  }

  return ExperienceType.Toggle;
};

export const sortExperiences = (experiences: ExperiencesTypes.Experiences) => {
  // TODO: maybe we should store each experience type separately instead of array.
  return experiences.reduce(
    (
      [
        accDropdownExperiences,
        accTravelersExperiences,
        accToggleExperiences,
        accInformationExperiences,
      ],
      experience
    ) => {
      const experienceType = getExperienceType(experience);
      return [
        [
          ...accDropdownExperiences,
          ...(experienceType === ExperienceType.Dropdown ? [experience] : []),
        ],
        [
          ...accTravelersExperiences,
          ...(experienceType === ExperienceType.Travelers ? [experience] : []),
        ],
        [
          ...accToggleExperiences,
          ...(experienceType === ExperienceType.Toggle ? [experience] : []),
        ],
        [
          ...accInformationExperiences,
          ...(experienceType === ExperienceType.Information ? [experience] : []),
        ],
      ];
    },
    [
      [] as ExperiencesTypes.Experience[],
      [] as ExperiencesTypes.Experience[],
      [] as ExperiencesTypes.Experience[],
      [] as ExperiencesTypes.Experience[],
    ]
  );
};

export const constructExperiences = (
  tourOptions: ExperiencesTypes.TourOptions,
  extras: TourBookingWidgetTypes.Extra[],
  selectedExperiences: TourBookingWidgetTypes.SelectedExperiences
) =>
  pipe(
    tourOptions.map(tourOption => constructExperience(tourOption, extras, selectedExperiences)),
    sortExperiences
  );

export const getGroupExperiencePrices = (
  experiences: ExperiencesTypes.MultiSelectionExperience[],
  experienceId: string,
  answerId: string
) =>
  pipe(
    experiences,
    findFirst(experience => experience.id === experienceId),
    map(experience =>
      pipe(
        experience.answers,
        findFirst(answer => answer.id === answerId),
        map(answer => answer.prices),
        getOrElse(() => [0])
      )
    ),
    getOrElse(() => [0])
  );

export const getOptionPrices = (
  extras: TourBookingWidgetTypes.Extra[],
  experienceId: string,
  answerId: string
): number[] =>
  pipe(
    extras,
    findFirst(extra => extra.id === experienceId),
    map(extra =>
      pipe(
        extra.options,
        findFirst(option => option.id === answerId),
        map(option =>
          arrayMap((price: TourBookingWidgetTypes.OptionPrice) => price.price)(option.prices)
        ),
        getOrElse(() => [0])
      )
    ),
    getOrElse(() => [0] as number[])
  );

export const getPriceIndex = (numberOfTravelerType: number, lengthOfPrices: number) => {
  if (numberOfTravelerType >= lengthOfPrices) {
    return lengthOfPrices - 1;
  }
  if (numberOfTravelerType === 0) {
    return 0;
  }
  return numberOfTravelerType - 1;
};

export const getExperiencePrice = (
  prices: number[],
  numberOfTravelers: SharedTypes.NumberOfTravelers
) => prices[getPriceIndex(getTotalNumberOfTravelers(numberOfTravelers), prices.length)];

export const getExtraBasePrice = (optionId: string, extras: TourBookingWidgetTypes.Extra[]) =>
  pipe(
    extras,
    findFirst(extra => extra.id === optionId),
    map(extra => extra.price),
    getOrElse(() => 0)
  );

export const getExtraDiscountValue = (optionId: string, extras: TourBookingWidgetTypes.Extra[]) =>
  pipe(
    extras,
    findFirst(extra => extra.id === optionId),
    map(extra => extra.discountValue || 0),
    getOrElse(() => 0)
  );

export const getItemExperiencePrice = (
  extras: TourBookingWidgetTypes.Extra[],
  option: TourBookingWidgetTypes.EditItemDetailsOption
) =>
  pipe(
    extras,
    findFirst(extra => extra.id === option.id),
    map(extra =>
      pipe(
        extra.options,
        findFirst(itemOption => itemOption.id === option.selectedValue),
        map(itemOption =>
          arrayMap((price: TourBookingWidgetTypes.OptionPrice) => price.price)(itemOption.prices)
        ),
        getOrElse(() => [0])
      )
    ),
    getOrElse(() => [0] as number[])
  );

export const getItemPricePerPerson = (
  tourOptions: ExperiencesTypes.TourOptions,
  optionId: string
) =>
  pipe(
    tourOptions,
    findFirst(tourOption => tourOption.id === optionId),
    map(tourOption => tourOption.calculatePricePerPerson),
    getOrElse(() => true)
  );

export const constructPrefilledSelectedExperiences = (
  extras: TourBookingWidgetTypes.Extra[],
  tourOptions: ExperiencesTypes.TourOptions,
  editItem?: TourBookingWidgetTypes.EditItem
): TourBookingWidgetTypes.SelectedExperiences => {
  if (editItem && tourOptions.length > 0) {
    return editItem.tourDetails.options!.map(
      (option: TourBookingWidgetTypes.EditItemDetailsOption) => {
        const pricePerPerson = getItemPricePerPerson(tourOptions, option.id);
        const normalizedSelectedValue = option.selectedValue.split("-");
        const isCounterOption =
          normalizedSelectedValue.length > 1 &&
          (Number(normalizedSelectedValue[1]) <= editItem.persons ||
            option.id === normalizedSelectedValue[0]);
        if (
          Number(option.selectedValue) <= editItem.persons ||
          option.id === option.selectedValue ||
          isCounterOption
        ) {
          return {
            experienceId: option.id,
            count: isCounterOption
              ? Number(normalizedSelectedValue[1])
              : Number(option.selectedValue),
            price: getExtraBasePrice(option.id, extras),
            discountValue: getExtraDiscountValue(option.id, extras),
            calculatePricePerPerson: pricePerPerson,
          };
        }
        return {
          experienceId: option.id,
          answerId: option.selectedValue,
          prices: getItemExperiencePrice(extras, option),
          vpPrice: {
            selectedOptionDiff: 0,
            discountValue: 0,
          },
          calculatePricePerPerson: pricePerPerson,
        };
      }
    );
  }
  return [];
};

export const checkIsTravelerExperience = (
  experience: TourBookingWidgetTypes.SelectedExperience
): experience is TourBookingWidgetTypes.SelectedTravelerExperience => {
  return "count" in experience;
};

export const constructInitialSelectedExperiences = (
  tourOptions: ExperiencesTypes.TourOptions,
  extras: TourBookingWidgetTypes.Extra[],
  numberOfTravelers: SharedTypes.NumberOfTravelers,
  editItem?: TourBookingWidgetTypes.EditItem
): TourBookingWidgetTypes.SelectedExperiences => {
  const selectedExperiences: TourBookingWidgetTypes.SelectedExperiences =
    constructPrefilledSelectedExperiences(extras, tourOptions, editItem);
  return (
    selectedExperiences
      .concat(
        filterDisabledTourOptionsFromExtras(tourOptions, extras, editItem).map(tourOption => {
          const { answers } = tourOption;

          if (answers.length === 0) {
            return {
              experienceId: tourOption.id,
              count: tourOption.required ? getTotalNumberOfTravelers(numberOfTravelers) : 0,
              price: getExtraBasePrice(tourOption.id, extras),
              discountValue: getExtraDiscountValue(tourOption.id, extras),
              calculatePricePerPerson: tourOption.calculatePricePerPerson,
            };
          }

          const { id } = pipe(
            answers,
            findFirst(answer => answer.default === "1"),
            getOrElse(() => answers[0] || { id: "" })
          );
          return {
            experienceId: tourOption.id,
            answerId: id,
            prices: getOptionPrices(extras, tourOption.id, id),
            vpPrice: {
              selectedOptionDiff: 0,
              discountValue: 0,
            },
            calculatePricePerPerson: tourOption.calculatePricePerPerson,
          };
        })
      )
      // We should put dropdown experiences in the first place
      // See sortExperiences util for more details.
      .sort((currentExperiences, previousExperiences) => {
        const isCurrentExperienceIsTraveler = checkIsTravelerExperience(currentExperiences);
        const isPreviousExperienceIsTraveler = checkIsTravelerExperience(previousExperiences);

        if (isCurrentExperienceIsTraveler && !isPreviousExperienceIsTraveler) {
          return 1;
        }

        if (!isCurrentExperienceIsTraveler && isPreviousExperienceIsTraveler) {
          return -1;
        }

        return 0;
      })
  );
};

export const getExperienceItemOption = (
  experienceId: string,
  editItem?: TourBookingWidgetTypes.EditItem
) =>
  editItem &&
  editItem.tourDetails.options!.find(
    (option: TourBookingWidgetTypes.EditItemDetailsOption) => option.id === experienceId
  );

export const getExperienceOptionPrices = (
  extra: ExperiencesTypes.MultiSelectionExperience,
  answerId: string
): number[] =>
  pipe(
    extra.answers,
    findFirst(option => option.id === answerId),
    map(option => arrayMap((price: number) => price)(option.prices)),
    getOrElse(() => [0])
  );

export const shouldShowExtrasHeader = ({
  containsMultiSelectionExperience,
  containsTravelersExperience,
  containsToggleExperiences,
}: {
  containsMultiSelectionExperience: boolean;
  containsTravelersExperience: boolean;
  containsToggleExperiences: boolean;
}) =>
  containsMultiSelectionExperience && (containsTravelersExperience || containsToggleExperiences);

export const getNonOptionalFallbackAnswer = (
  possibleAnswers: ExperiencesTypes.TourOptionQuestionAnswer[],
  isOptional: boolean
) => {
  if (possibleAnswers.length > 0 && isOptional) return possibleAnswers[0].value;
  return "";
};

export const getDefaultAnswer = (
  question: ExperiencesTypes.TourOptionQuestion,
  travelerIndex: number,
  experienceId: string,
  isExperienceRequired: boolean,
  editItem?: TourBookingWidgetTypes.EditItem
) => {
  const fallbackAnswer = getNonOptionalFallbackAnswer(
    question.answers,
    !question.required || !isExperienceRequired
  );
  return pipe(
    editItem,
    fromNullable,
    map((item: TourBookingWidgetTypes.EditItem) =>
      pipe(
        item.tourDetails.options!,
        findFirst(
          (option: TourBookingWidgetTypes.EditItemDetailsOption) =>
            option.id === experienceId && option.optionAnswers.length > travelerIndex
        ),
        map(option =>
          pipe(
            option.optionAnswers[travelerIndex].answers,
            findFirst(
              (answer: TourBookingWidgetTypes.EditItemDetailsOptionAnswer) =>
                question.externalId !== null && answer.externalId === question.externalId.toString()
            ),
            map(answer => answer.answer),
            getOrElse(() =>
              // eslint-disable-next-line no-nested-ternary
              option.optionAnswers[travelerIndex].answers.length === 1
                ? option.optionAnswers[travelerIndex].answers[0].answer
                : fallbackAnswer
            )
          )
        ),
        getOrElse(() => fallbackAnswer)
      )
    ),
    getOrElse(() => fallbackAnswer)
  );
};

export const constructQuestionArray = (
  questions: ExperiencesTypes.TourOptionQuestion[],
  travelerNumber: number,
  experienceId: string,
  isExperienceRequired: boolean,
  editItem?: TourBookingWidgetTypes.EditItem
): ExperiencesTypes.TravelerAnswer[] =>
  questions.map(question => ({
    question: question.question,
    externalId: question.externalId,
    answer: getDefaultAnswer(
      question,
      travelerNumber,
      experienceId,
      isExperienceRequired,
      editItem
    ),
    required: question.required,
  }));
export const getSelectedExperience = (
  selectedExperiences: TourBookingWidgetTypes.SelectedExperiences,
  id: string
) => selectedExperiences.find(({ experienceId }) => experienceId === id);

export const getExperiencePriceInformation = ({
  prices,
  isLivePricing,
  vpSelectedOptionDiff,
  isIncluded,
  numberOfTravelers,
  currency,
  convertCurrency,
  tFunction,
}: {
  prices: number[];
  isLivePricing: boolean;
  vpSelectedOptionDiff: number;
  isIncluded: boolean;
  numberOfTravelers: SharedTypes.NumberOfTravelers;
  currency: string;
  convertCurrency: (value: number) => number;
  tFunction: TFunction;
}) => {
  const tourPrice = getExperiencePrice(prices, numberOfTravelers);
  const price = isLivePricing ? vpSelectedOptionDiff : tourPrice;
  const sign = getPriceSign(price);
  const isOptionsIncluded = isIncluded && price === 0;

  return isOptionsIncluded
    ? tFunction("Included")
    : `${sign}${currencyFormatter(convertCurrency(Math.abs(price!)))} ${currency}`;
};

export const preSelectedTravelExperienceValue = (
  experience: ExperiencesTypes.SelectedExperience
) => {
  const expId = experience?.experienceId?.replace("-", "");
  const checkMatch = experience?.answerId?.split("-");
  if (checkMatch?.[0] !== expId) return 0;
  const selectedAnswerId = experience?.answerId?.replace(expId, "");
  if (!selectedAnswerId) return 0;
  const result = selectedAnswerId.replace("-", "");
  if (!result) return 0;

  return Number(result);
};

export const checkIsSelectedNonDefaultExperience = ({
  selectedExperiences,
  multiSelectionExperiences,
}: {
  selectedExperiences: TourBookingWidgetTypes.SelectedExperiences;
  multiSelectionExperiences: ExperiencesTypes.MultiSelectionExperience[];
}) => {
  return multiSelectionExperiences.some(experience => {
    const currentSelectExperience = getSelectedExperience(
      selectedExperiences,
      experience.id
    ) as TourBookingWidgetTypes.SelectedGroupExperience;
    return (
      experience.answers.find(answer => answer.isDefault)?.id !== currentSelectExperience?.answerId
    );
  });
};

export const checkIfShouldShowExperiencePriceSkeleton = ({
  isGTIVpLivePriceLoading,
  isGTIVpDefaultOptionsLoading,
  isSelectedNonDefaultOption,
  isIncluded,
}: {
  isGTIVpLivePriceLoading: boolean;
  isGTIVpDefaultOptionsLoading: boolean;
  isSelectedNonDefaultOption: boolean;
  isIncluded: boolean;
}) =>
  isGTIVpDefaultOptionsLoading ||
  ((!isIncluded || isSelectedNonDefaultOption) && isGTIVpLivePriceLoading);
