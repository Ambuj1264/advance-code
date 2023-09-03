import React from "react";
import { range } from "fp-ts/lib/Array";
import styled from "@emotion/styled";
import { constructUniqueIdentifier } from "@travelshift/ui/utils/utils";

import { gutters } from "styles/variables";
import Dropdown from "components/ui/Inputs/Dropdown/Dropdown";
import DropdownOption from "components/ui/Inputs/Dropdown/DropdownOption";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";

const DropdownWrapper = styled.div`
  margin-top: ${gutters.small}px;
`;

const constructOptions = ({
  selectedValue,
  t,
  minAge,
  maxAge,
}: {
  selectedValue: number;
  t: TFunction;
  minAge: number;
  maxAge: number;
}) =>
  range(minAge, maxAge).map(childAge => ({
    value: childAge.toString(),
    nativeLabel: t("{childAge} years old", { childAge }),
    label: (
      <DropdownOption
        id={`${constructUniqueIdentifier(`${childAge}`)}ChildrenAgesOption`}
        isSelected={selectedValue === childAge}
        label={t("{childAge} years old", { childAge })}
      />
    ),
  }));

const ChildrenAgesDropdown = ({
  id,
  selectedValue,
  onChange,
  minAge = 0,
  maxAge = 17,
  namespace = Namespaces.accommodationBookingWidgetNs,
}: {
  id: number;
  selectedValue: number;
  onChange: (childAge: number) => void;
  minAge?: number;
  maxAge?: number;
  namespace?: Namespaces;
}) => {
  const { t } = useTranslation(namespace);
  const isSelectionOptionAvailable = selectedValue >= minAge;
  const options = constructOptions({
    selectedValue: isSelectionOptionAvailable ? selectedValue : minAge,
    t,
    minAge,
    maxAge,
  });
  const selectedOption =
    options.find(option => option.value === selectedValue.toString()) || options[0];

  return (
    <DropdownWrapper>
      <Dropdown
        id={`ChildrenAges${id}`}
        onChange={value => {
          onChange(Number(value));
        }}
        options={options}
        selectedValue={selectedOption.value.toString()}
        selectedLabel={selectedOption.nativeLabel}
        useNativeOnDesktop
      />
    </DropdownWrapper>
  );
};

export default ChildrenAgesDropdown;
