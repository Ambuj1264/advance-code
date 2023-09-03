import React, { memo, useCallback } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { useTheme } from "emotion-theming";

import { useGTETourBookingWidgetContext } from "./GTETourBookingWidgetStateContext";
import { useOnSelectTourOptionLanguage } from "./gteTourHooks";
import { GTETourDropdownType } from "./types/enums";
import { getGuidedLanguageName } from "./utils/gteTourBookingWidgetUtils";

import LoadingDropdown from "components/ui/Loading/LoadingDropdown";
import { MaybeColumn } from "components/ui/Grid/Column";
import Dropdown from "components/ui/Inputs/Dropdown/Dropdown";
import { Namespaces } from "shared/namespaces";
import Language from "components/icons/language.svg";
import BookingWidgetControlRow from "components/ui/BookingWidget/BookingWidgetControlRow";
import { gutters, guttersPx } from "styles/variables";
import { useTranslation } from "i18n";
import { mqMin } from "styles/base";

const StyledBookingWidgetControlRow = styled(BookingWidgetControlRow)([
  css`
    margin-bottom: ${gutters.small}px;
    padding: 0;
    ${mqMin.large} {
      margin-bottom: 0;
      padding: ${guttersPx.small} ${guttersPx.large} 0 ${guttersPx.large};
    }
  `,
]);

export const DropdownWrapper = styled.div`
  margin-top: ${gutters.small / 2}px;
  width: 100%;
`;

const StyledDropdown = styled(Dropdown)`
  position: relative;
  padding: 0;
  svg {
    width: 14px;
    height: 14px;
  }
`;

const LoadingDropdownWrapper = styled.div`
  margin: 0;
  ${mqMin.large} {
    margin: 0 ${gutters.large}px;
  }
`;

const LanguageIcon = styled(Language)(
  ({ theme }) => css`
    width: 16px;
    height: 16px;
    fill: ${theme.colors.primary};
    ${mqMin.large} {
      margin-left: -${gutters.large / 4}px;
    }
  `
);

const GTETourOptionLanguagesContainer = ({
  onOpenStateChange,
  activeDropdown,
  columns = { small: 1 },
  isInModal = false,
}: {
  activeDropdown?: GTETourBookingWidgetTypes.activeDropdownType;
  columns?: SharedTypes.Columns;
  isInModal?: boolean;
} & BookingWidgetTypes.onOpenStateChange) => {
  const { t } = useTranslation(Namespaces.tourNs);
  const theme: Theme = useTheme();
  const { selectedTourOption, isAvailabilityLoading } = useGTETourBookingWidgetContext();
  const languageList = selectedTourOption?.guidedLanguages;
  const onSelectTourOptionLanguage = useOnSelectTourOptionLanguage();
  const onClose = useCallback(() => {
    onOpenStateChange?.(false);
  }, [onOpenStateChange]);

  const onOpen = useCallback(() => {
    onOpenStateChange?.(true);
  }, [onOpenStateChange]);

  const onTourOptionLanguageSelect = useCallback(
    (tourLocale: string) => {
      onSelectTourOptionLanguage(tourLocale);
      onClose();
    },
    [onClose, onSelectTourOptionLanguage]
  );
  if (isAvailabilityLoading && isInModal) {
    return (
      <MaybeColumn columns={columns} skipPadding showColumn>
        <LoadingDropdownWrapper>
          <LoadingDropdown />
        </LoadingDropdownWrapper>
      </MaybeColumn>
    );
  }
  if (!languageList || languageList.length === 0 || isAvailabilityLoading) return null;
  const selectedLanguage = languageList.find(lang => lang.isSelected);
  return (
    <MaybeColumn columns={columns} skipPadding={isInModal} showColumn={isInModal}>
      <StyledBookingWidgetControlRow
        title={t("Guided language")}
        isOpen={activeDropdown === GTETourDropdownType.LANGUAGES}
      >
        <DropdownWrapper>
          <StyledDropdown
            id="tourOptionGuidedLanguagesDropdown"
            options={languageList.map(lang => {
              const languageName = getGuidedLanguageName(lang.localeName, t, lang.type);
              return {
                value: lang.id,
                nativeLabel: languageName,
                label: languageName,
              };
            })}
            borderColor={theme.colors.primary}
            onChange={onTourOptionLanguageSelect}
            selectedValue={selectedLanguage?.id}
            className="guidedLanguagesSelection"
            noDefaultValue
            selectHeight={45}
            useRadioOption
            onMenuOpen={onOpen}
            onMenuClose={onClose}
            maxHeight="275px"
            isDisabled={languageList.length < 1}
            icon={<LanguageIcon />}
            isArrowHidden={languageList.length <= 1}
          />
        </DropdownWrapper>
      </StyledBookingWidgetControlRow>
    </MaybeColumn>
  );
};

export default memo(GTETourOptionLanguagesContainer);
