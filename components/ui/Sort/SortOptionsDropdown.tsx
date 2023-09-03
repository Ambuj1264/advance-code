import React, { useCallback, useRef, useState } from "react";
import styled from "@emotion/styled";
import useOnOutsideClick from "@travelshift/ui/components/Popover/useOnOutsideClick";

import { getSortParametersByIndex, SectionContainer } from "./sortUtils";

import { greyColor } from "styles/variables";
import Select from "components/ui/Inputs/Select";
import { mqMin } from "styles/base";

export const DropdownContainer = styled.div`
  display: none;
  ${mqMin.medium} {
    display: block;
    min-width: 195px;
  }
`;

const ValueContainer = ({ children }: { children: React.ReactNode }) => children;

const SingleValue = ({ data }: { data: SelectOption }) => (
  <SectionContainer isSelected>{data.label}</SectionContainer>
);

/* eslint-disable react/destructuring-assignment */
const Option = (props: any) => (
  <SectionContainer onClick={props.innerProps.onClick}>{props.data.label}</SectionContainer>
);
/* eslint-enable react/destructuring-assignment */

const SortOptionsDropdown = ({
  onChange,
  selectedIndex,
  options,
  customSortParams,
}: {
  onChange: SearchPageTypes.SortOnChangeFn;
  selectedIndex: number;
  options: JSX.Element[];
  customSortParams?: SearchPageTypes.SortParameter[];
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [shouldOpenAfterLoad, setShouldOpenAfterLoad] = useState(false);

  const wrapperMouseEnter = useCallback(() => {
    if (!shouldOpenAfterLoad) setShouldOpenAfterLoad(true);
  }, [shouldOpenAfterLoad]);

  const onLeave = useCallback(() => {
    setShouldOpenAfterLoad(false);
  }, []);

  useOnOutsideClick(wrapperRef, onLeave);

  const selectOptions = options.map((option, index) => ({
    value: index.toString(),
    label: option,
  }));

  return (
    <DropdownContainer onMouseEnter={wrapperMouseEnter}>
      <Select
        id="dropdown"
        onChange={(selectedOption: SelectOption) => {
          onChange(
            getSortParametersByIndex(parseInt(selectedOption?.value ?? "0", 10), customSortParams)
          );
        }}
        components={{ ValueContainer, SingleValue, Option }}
        options={selectOptions}
        selectHeight={40}
        defaultValue={selectOptions[0]}
        isSearchable={false}
        selectedValue={selectOptions[selectedIndex]}
        borderColor={greyColor}
        shouldOpenAfterLoad={shouldOpenAfterLoad}
      />
    </DropdownContainer>
  );
};

export default SortOptionsDropdown;
