import React, { memo, useMemo } from "react";
import styled from "@emotion/styled";

import InputWrapper from "../../InputWrapper";
import LazyImage from "../../Lazy/LazyImage";

import { Label } from "./BaseDropdownSelectedOption";
import { OptionWrapper } from "./shared";

import { useIsMobile } from "hooks/useMediaQueryCustom";
import useCountryList from "hooks/useCountryList";
import DropdownLeft from "components/ui/Inputs/Dropdown/DropdownLeft";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { emptyArray } from "utils/constants";
import { capitalize } from "utils/globalUtils";

const FlagIcon = styled(LazyImage, {
  shouldForwardProp: prop => prop === "loading" || prop === "src",
})`
  margin-right: 6px;
  border-radius: 2px;
  width: 24px;
  height: 16px;
`;

export const StyledDropdown = styled(DropdownLeft)`
  div[class*="menu"] {
    min-width: 250px;
  }
  div[data-selected="true"] {
    width: 100%;
  }
  ${Label} {
    text-transform: capitalize;
  }
`;

const getCountryOptions = (countries: SharedTypes.Country[], useNameAsValue: boolean) =>
  countries.map(country => ({
    value: useNameAsValue ? country.name : country.countryCode,
    nativeLabel: country.name?.length ? `${capitalize(country.name)}` : country.name,
    label: (
      <OptionWrapper>
        <FlagIcon imgixParams={{ fm: "avif" }} src={country.flagSvgUrl} height={16} width={24} />
        {country.name}
      </OptionWrapper>
    ),
  }));

const NationalityDropdown = ({
  className,
  hasError,
  onChange,
  nationality,
  isListView = false,
  maxHeight,
  placeholder = "",
  isDisabled = false,
  borderColor,
  useNameAsValue = false,
  customLabel,
  required = false,
  onBlur,
}: {
  className?: string;
  maxHeight?: string;
  hasError: boolean;
  isListView?: boolean;
  onChange: (nationality: string) => void;
  nationality?: string;
  placeholder?: string;
  isDisabled?: boolean;
  borderColor?: string;
  useNameAsValue?: boolean;
  customLabel?: string;
  required?: boolean;
  onBlur?: () => void;
}) => {
  const isMobile = useIsMobile();
  const { t } = useTranslation(Namespaces.cartNs);
  const { t: commonT } = useTranslation();
  const { countries } = useCountryList();
  const countryOptions = useMemo(
    () =>
      countries.length
        ? getCountryOptions(countries as SharedTypes.Country[], useNameAsValue)
        : (emptyArray as unknown as SelectOption[]),
    [countries, useNameAsValue]
  );
  const selectedFlag =
    countries.find(country => country?.countryCode === nationality)?.flagSvgUrl ?? undefined;
  const noDefaultValue = nationality === undefined || nationality === "";
  return (
    <InputWrapper
      className={className}
      label={customLabel || t("Nationality")}
      id="nationalityDropdown"
      hasError={hasError}
      customErrorMessage={commonT("Field is required")}
      required={required}
    >
      <StyledDropdown
        id="nationalityDropdown"
        className={className}
        selectHeight={isMobile ? 40 : 45}
        options={countryOptions}
        onChange={onChange}
        selectedValue={nationality}
        isSearchable
        maxHeight={maxHeight}
        isListView={isListView}
        icon={
          selectedFlag && (
            <FlagIcon imgixParams={{ fm: "avif" }} src={selectedFlag} height={16} width={24} />
          )
        }
        error={hasError}
        placeholder={placeholder}
        shouldLoadWhenVisible
        noDefaultValue={noDefaultValue}
        isDisabled={isDisabled}
        borderColor={borderColor}
        onBlur={onBlur}
      />
    </InputWrapper>
  );
};

export default memo(NationalityDropdown);
