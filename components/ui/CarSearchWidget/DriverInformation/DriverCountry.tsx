import React, { useCallback, useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import TranslateCountryName from "./queries/TranslateDriverCountryName.graphql";
import DefaultDriverCountryQuery from "./queries/DefaultDriverCountryQuery.graphql";
import FakeDropdown from "./FakeDropdown";

import CountryIcon from "components/icons/country-origin.svg";
import Dropdown from "components/ui/Inputs/Dropdown/Dropdown";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import useEffectOnce from "hooks/useEffectOnce";
import {
  NativeSelectPLaceholderBuilderInputType,
  Value,
} from "components/ui/Inputs/Dropdown/NativeDropdown";
import { mqMin } from "styles/base";
import { useSettings } from "contexts/SettingsContext";
import useActiveLocale from "hooks/useActiveLocale";
import useCountryList from "hooks/useCountryList";
import { normalizeGraphCMSLocale } from "utils/helperUtils";
import { DisplayType } from "types/enums";
import MediaQuery from "components/ui/MediaQuery";
import { capitalize } from "utils/globalUtils";
import useQueryClient from "hooks/useQueryClient";

const StyledCountryIcon = styled(CountryIcon)(
  ({ theme }) => css`
    width: 16px;
    height: 16px;
    fill: ${theme.colors.primary};
  `
);

const StyledDropdown = styled(Dropdown)`
  ${Value} {
    max-width: 55%;

    ${mqMin.medium} {
      max-width: initial;
    }
  }
`;

const DriverCountry = ({
  id,
  driverCountry,
  setDriverCountry,
  height,
  className,
  mobileHeight,
  nativeSelectBreakpoint,
  nativeSelectPlaceholderFn,
  extraSelectLoadingLabel,
}: {
  id: string;
  driverCountry?: string;
  setDriverCountry: (driverCountry: string) => void;
  height?: number;
  className?: string;
  mobileHeight?: number;
  nativeSelectBreakpoint?: DisplayType;
  nativeSelectPlaceholderFn?: NativeSelectPLaceholderBuilderInputType;
  extraSelectLoadingLabel?: React.ReactNode;
}) => {
  const isMobile = useIsMobile();
  const { marketplaceUrl } = useSettings();
  const locale = useActiveLocale();
  const activeLocaleAdjusted = normalizeGraphCMSLocale(locale);
  const [skipFetchCountryList, setSkipFetchCountryList] = useState(true);
  const {
    countries: countryListData,
    countryListLoading,
    countryListError,
  } = useCountryList(undefined, skipFetchCountryList, true);

  const [countryOptions, setCountryOptions] = useState<
    { value: string; label: string; nativeLabel: string }[]
  >([]);
  const { t: carSearchT } = useTranslation(Namespaces.carSearchNs);

  const { data: defaultCountryData, error: defaultCountryError } = useQuery<{
    values: {
      defaultCountry: {
        isoCode: string;
        name: {
          value: string;
        };
      };
    };
  }>(DefaultDriverCountryQuery, {
    variables: {
      url: marketplaceUrl,
      locale: activeLocaleAdjusted,
    },
  });

  const driverIsoCodeComputed =
    driverCountry || defaultCountryData?.values?.defaultCountry?.isoCode;

  const { data: nameTranslationData } = useQueryClient<{
    getCountryList: {
      name: {
        value: string;
      };
    };
  }>(TranslateCountryName, {
    variables: {
      countryCode: driverIsoCodeComputed,
      locale: activeLocaleAdjusted,
    },
  });

  const driverCountryNameComputed =
    capitalize(nameTranslationData?.getCountryList?.name.value ?? "") ||
    capitalize(defaultCountryData?.values?.defaultCountry?.name?.value ?? "");

  const handleChangeDriverCountry = useCallback(
    (selectedCountryCode: string) => {
      setDriverCountry(selectedCountryCode);
    },
    [setDriverCountry]
  );

  const fetchCountryList = useCallback(() => setSkipFetchCountryList(false), []);

  useEffectOnce(() => {
    setDriverCountry(driverIsoCodeComputed!);
  });

  useEffect(() => {
    if (isMobile) fetchCountryList();
    if (countryListData && countryListData.length && !skipFetchCountryList) {
      setCountryOptions(
        countryListData.map(country => {
          const capitalizeCountryName = capitalize(country!.name, locale);
          return {
            value: country!.countryCode,
            label: capitalizeCountryName,
            nativeLabel: capitalizeCountryName,
          };
        })
      );
    }
  }, [isMobile, countryListData.length, fetchCountryList, countryListData, skipFetchCountryList]);

  if (countryListError || defaultCountryError) return null;

  if (!countryListData || !countryListData.length) {
    const fakeDropdown = (
      <FakeDropdown
        onClick={fetchCountryList}
        maxHeight="140px"
        id={`${id}-initial`}
        text={driverCountryNameComputed || carSearchT("Search")}
        Icon={StyledCountryIcon}
        loading={countryListLoading}
        height={height}
        mobileHeight={mobileHeight}
        className={className}
        extraSelectLoadingLabel={extraSelectLoadingLabel}
      />
    );

    if (!countryListLoading && nativeSelectBreakpoint && nativeSelectPlaceholderFn) {
      return (
        <>
          <MediaQuery toDisplay={nativeSelectBreakpoint}>
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
            <div onClick={fetchCountryList}>
              {nativeSelectPlaceholderFn({
                label: driverCountryNameComputed ?? "",
              })}
            </div>
          </MediaQuery>
          <MediaQuery fromDisplay={nativeSelectBreakpoint}>{fakeDropdown}</MediaQuery>
        </>
      );
    }

    return fakeDropdown;
  }

  return (
    <StyledDropdown
      id={id}
      onChange={handleChangeDriverCountry}
      options={countryOptions}
      selectedValue={driverIsoCodeComputed}
      maxHeight="140px"
      icon={<StyledCountryIcon />}
      isSearchable
      mobileHeight={mobileHeight}
      selectHeight={height}
      shouldLoadWhenVisible
      isForceOpen={!isMobile}
      className={className}
      nativeSelectBreakpoint={nativeSelectBreakpoint}
      nativeSelectPlaceholderFn={nativeSelectPlaceholderFn}
    />
  );
};

export default DriverCountry;
