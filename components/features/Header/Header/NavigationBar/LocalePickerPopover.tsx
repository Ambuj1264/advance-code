import React from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import { getLocaleLink } from "@travelshift/ui/utils/headerUtils";
import { getLocaleIcon } from "@travelshift/ui/utils/localeUtils";

import { getDefaultUrl } from "../utils/headerUtils";

import { StyledRow } from "./UserMenu/UserMenuActions";

import { mqMin, column } from "styles/base";
import Popover from "components/ui/Popover/Popover";
import PopoverButton from "components/ui/Popover/PopoverButton";
import TranslateIcon from "components/icons/translate.svg";
import { gutters } from "styles/variables";
import useShouldRetainQueryParams from "hooks/useShouldRetainQueryParams";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";

const Wrapper = styled.div`
  margin-top: -${gutters.large}px;
  width: 100%;
  ${mqMin.large} {
    width: 305px;
  }
`;

const iconStyles = css`
  margin-left: ${gutters.large / 2}px;
  width: 24px;
  height: auto;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const StyledColumn = styled.div(
  column({ small: 1 / 2 }),
  css`
    margin-top: ${gutters.large}px;
  `
);

export const LocaleList = ({
  locales,
  activeLocale,
  localeLinks,
  defaultUrl,
}: {
  locales: ReadonlyArray<AppLocale>;
  activeLocale: string;
  localeLinks: LocaleLink[];
  defaultUrl: string;
}) => {
  const retainQueryParams = useShouldRetainQueryParams();
  return (
    <Wrapper>
      <StyledRow>
        {locales.map(locale => {
          const isSelected = locale.code === activeLocale;
          const Icon = getLocaleIcon(locale.code);
          const localeHref =
            getLocaleLink(localeLinks, locale.code, isSelected, retainQueryParams) ||
            getDefaultUrl(defaultUrl, locale.code);
          return (
            <StyledColumn key={locale.code}>
              <PopoverButton
                id={`${locale.code}LocalePickerOption`}
                href={localeHref}
                text={locale.name}
                selected={isSelected}
                useRegularLink
              >
                <IconWrapper>
                  <Icon css={iconStyles} data-testid={locale.code} />
                </IconWrapper>
              </PopoverButton>
            </StyledColumn>
          );
        })}
      </StyledRow>
    </Wrapper>
  );
};

const LocalePickerPopover = ({
  trigger,
  locales,
  activeLocale,
  localeLinks,
  defaultUrl,
}: {
  trigger: React.ReactElement;
  locales: ReadonlyArray<AppLocale>;
  activeLocale: string;
  localeLinks: LocaleLink[];
  defaultUrl: string;
}) => {
  const { t } = useTranslation(Namespaces.headerNs);
  return (
    <Popover title={t("Languages")} trigger={trigger} Icon={TranslateIcon}>
      <LocaleList
        locales={locales}
        activeLocale={activeLocale}
        localeLinks={localeLinks}
        defaultUrl={defaultUrl}
      />
    </Popover>
  );
};

export default LocalePickerPopover;
