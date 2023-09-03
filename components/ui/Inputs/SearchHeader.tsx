import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { gutters, borderRadiusSmall } from "styles/variables";
import { mqMin } from "styles/base";
import Input from "components/ui/Inputs/Input";
import { DesktopColumn } from "components/ui/SearchWidget/SearchWidgetShared";
import SearchWidgetButton from "components/ui/SearchWidget/SearchWidgetButton";
import { ButtonSize } from "types/enums";
import { addLeadingSlashIfNotPresent } from "utils/helperUtils";
import { typographySubtitle1 } from "styles/typography";

const Form = styled.form(
  ({ theme }) => css`
    display: block;
    margin-top: ${gutters.small}px;
    border-radius: ${borderRadiusSmall};
    width: calc(100% - ${gutters.small}px * 2);
    max-width: 548px;
    padding: ${gutters.small}px;
    background-color: ${rgba(theme.colors.primary, 0.8)};

    ${mqMin.medium} {
      display: flex;
      width: calc(100% - ${gutters.large}px * 2);
    }

    ${mqMin.large} {
      margin-top: 0;
      max-width: 920px;
      padding: ${gutters.large}px;
    }
  `
);

const StyledSearchWidgetButton = styled(SearchWidgetButton, {
  shouldForwardProp: () => true,
})``;

const StyledColumn = styled(DesktopColumn)<{}>`
  ${mqMin.medium} {
    margin-right: ${gutters.small}px;
  }

  ${mqMin.large} {
    margin-right: ${gutters.large}px;
  }

  ${StyledSearchWidgetButton} {
    height: ${ButtonSize.Small};

    ${mqMin.large} {
      height: ${ButtonSize.Medium};
      ${typographySubtitle1}
    }
  }
`;

const StyledInput = styled(Input)`
  margin-bottom: ${gutters.small}px;
  height: ${ButtonSize.Small};
  line-height: ${ButtonSize.Small};

  ${mqMin.medium} {
    margin-bottom: 0;
  }

  ${mqMin.large} {
    height: ${ButtonSize.Medium};
    line-height: ${ButtonSize.Medium};
  }
`;

const SearchHeader = ({
  searchLink,
  searchTerm,
  hiddenQueryParams,
}: {
  searchLink: string;
  searchTerm: string;
  hiddenQueryParams?: { name: string; value: string }[];
}) => {
  const { t } = useTranslation(Namespaces.commonSearchNs);
  const actionLegacyUrl = addLeadingSlashIfNotPresent(searchLink);

  return (
    <Form action={actionLegacyUrl} target="_top">
      {hiddenQueryParams &&
        hiddenQueryParams.map(param => (
          <input
            type="hidden"
            key={`${param.name}${param.value}`}
            name={param.name}
            value={param.value}
          />
        ))}
      <StyledColumn baseWidth={75}>
        <StyledInput
          type="text"
          name={searchTerm}
          placeholder={t("Search destinations, attractions or any keywords...")}
        />
      </StyledColumn>
      <StyledColumn baseWidth={25}>
        <StyledSearchWidgetButton onSearchClick={() => {}} buttonSize={ButtonSize.Inherit} />
      </StyledColumn>
    </Form>
  );
};

export default SearchHeader;
