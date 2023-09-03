import React from "react";
import { useQuery } from "@apollo/react-hooks";
import styled from "@emotion/styled";
import { getLocaleIcon } from "@travelshift/ui/utils/localeUtils";

import BloggerLanguagesQuery from "../queries/BloggerLanguagesQuery.graphql";

import Locale from "components/features/Reviews/Locale";
import BaseDropdown from "components/ui/Inputs/Dropdown/BaseDropdown";
import { gutters } from "styles/variables";
import { mqMin } from "styles/base";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import { removeDuplicates } from "utils/helperUtils";

const LocalesWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: ${gutters.small}px;
  width: 212px;
  ${mqMin.large} {
    position: absolute;
    top: 0;
    right: 0;
  }
`;

const StyledDropdown = styled(BaseDropdown)`
  margin-left: auto;
  width: 212px;
`;

const constructLocaleOptions = (defaultString: string, locales: QueryLocale[]) => {
  return [
    {
      value: "",
      label: defaultString,
      nativeLabel: defaultString,
    },
    ...removeDuplicates(locales, "code").map(({ code, name }) => ({
      value: code,
      nativeLabel: name,
      label: getLocaleIcon(code) ? <Locale localeCode={code} name={name} /> : name,
    })),
  ];
};

const TopBloggersLanguageDropdown = ({
  selectedValue,
  onChange,
  isDisabled,
}: {
  selectedValue: string;
  onChange: (language: string) => void;
  isDisabled?: boolean;
}) => {
  const { t } = useTranslation(Namespaces.reviewsNs);
  const { error, data } = useQuery<{
    bloggerLanguages: { id: number; name: string; code: string }[];
  }>(BloggerLanguagesQuery, {
    variables: {
      type: "local",
    },
  });
  if (error || !data?.bloggerLanguages || data?.bloggerLanguages.length === 0) return null;
  const localeOptions = constructLocaleOptions(t("All languages"), data?.bloggerLanguages);
  return (
    <LocalesWrapper>
      <StyledDropdown
        id="topBloggerLanguageDropdown"
        onChange={onChange}
        options={localeOptions}
        selectedValue={selectedValue}
        selectedLabel={selectedValue}
        defaultValue={localeOptions[0]}
        maxHeight="180px"
        isDisabled={isDisabled}
      />
    </LocalesWrapper>
  );
};

export default TopBloggersLanguageDropdown;
