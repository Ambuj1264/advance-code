import React from "react";

import DropdownOption from "components/ui/Inputs/Dropdown/DropdownOption";
import Dropdown from "components/ui/Inputs/Dropdown/Dropdown";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";

type Props = {
  id: string;
  answers: ExperiencesTypes.TourOptionQuestionAnswer[];
  selectedValue: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: boolean;
  required: boolean;
};

const constructAnswers = (
  defaultString: string,
  selectedValue: string,
  answers: ExperiencesTypes.TourOptionQuestionAnswer[],
  required: boolean
) => [
  ...(required
    ? [
        {
          value: "",
          nativeLabel: defaultString,
          label: (
            <DropdownOption
              id={`${defaultString}DropdownOption`}
              isSelected={false}
              label={defaultString}
            />
          ),
        },
      ]
    : []),
  ...answers.map(({ label, value }) => ({
    value,
    nativeLabel: label,
    label: (
      <DropdownOption
        id={`${label}DropdownOption`}
        isSelected={selectedValue === label}
        label={label}
      />
    ),
  })),
];

const ExperienceDropdownQuestion = ({
  id,
  answers,
  onChange,
  selectedValue,
  onBlur,
  error = false,
  required,
}: Props) => {
  const { t } = useTranslation(Namespaces.tourBookingWidgetNs);
  return (
    <Dropdown
      key={`${id}Dropdown`}
      id={`${id}Dropdown`}
      onChange={onChange}
      selectedValue={selectedValue}
      options={constructAnswers(t("Select option"), selectedValue, answers, required)}
      onBlur={onBlur}
      error={error}
    />
  );
};

export default ExperienceDropdownQuestion;
