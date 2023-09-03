import React, { useCallback } from "react";
import styled from "@emotion/styled";

import { useGTETourBookingWidgetContext } from "./GTETourBookingWidgetStateContext";
import GTETourOption, { InformationTooltipContent } from "./GTETourOption";
import { useOnSelectTourOption } from "./gteTourHooks";
import { GTETourDropdownType } from "./types/enums";

import { MaybeColumn } from "components/ui/Grid/Column";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import { greyColor, gutters } from "styles/variables";
import TravelerIcon from "components/icons/traveler.svg";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import BookingWidgetControlRow, {
  BookingWidgetInfoWrapper,
} from "components/ui/BookingWidget/BookingWidgetControlRow";
import BookingWidgetDropdown, {
  DisplayWrapper,
} from "components/ui/BookingWidget/BookingWidgetDropdown";
import { DropdownContainer } from "components/ui/Inputs/ContentDropdown";
import { BookingWidgetProductSelectContainer } from "components/ui/BookingWidget/BookingWidgetProductSelectContent";
import LoadingDropdown from "components/ui/Loading/LoadingDropdown";
import { mqMin } from "styles/base";

const StyledBookingWidgetControlRow = styled(BookingWidgetControlRow)`
  ${BookingWidgetInfoWrapper} {
    height: 16px;
  }
`;

const StyledBookingWidgetOptionsDropdown = styled(BookingWidgetDropdown)(
  ({ theme }) => `
      ${DropdownContainer} {
        max-height: 350px;
        overflow-y: scroll;
        top: 50px;
        border-color: ${theme.colors.primary};
      }
      ${DisplayWrapper} {
          background-color: transparent;
          color: ${greyColor};
      }
      svg {
        fill: ${theme.colors.primary};
      }
  `
);

const LoadingDropdownWrapper = styled.div`
  margin: 0;
  ${mqMin.large} {
    margin: 0 ${gutters.large}px;
  }
`;

const MobileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${gutters.small}px;
  width: 100%;
`;

const GTETourOptionContainer = ({
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
  const isMobile = useIsMobile();

  const { tourOptions, selectedTourOption, isAvailabilityLoading } =
    useGTETourBookingWidgetContext();
  const onSelectTourOption = useOnSelectTourOption();
  const onTourOptionSelect = useCallback(
    (tourOptionId: string) => {
      onSelectTourOption(tourOptionId);
      onOpenStateChange?.(false);
    },
    [onOpenStateChange, onSelectTourOption]
  );

  if (isAvailabilityLoading)
    return (
      <MaybeColumn columns={columns} skipPadding={isInModal} showColumn={isInModal}>
        <LoadingDropdownWrapper>
          <LoadingDropdown />
        </LoadingDropdownWrapper>
      </MaybeColumn>
    );
  if (tourOptions.length < 2) return null;
  if (isMobile) {
    return (
      <MobileWrapper>
        <BookingWidgetProductSelectContainer>
          {tourOptions.map((tourOption, index) => (
            <GTETourOption
              key={`tourOption${tourOption.optionCode}${index.toString()}`}
              id={tourOption.optionCode || ""}
              tourOption={tourOption}
              isFirstItem={index === 0}
              onSelectTourOption={onSelectTourOption}
            />
          ))}
        </BookingWidgetProductSelectContainer>
      </MobileWrapper>
    );
  }
  const isOpen =
    activeDropdown !== undefined ? activeDropdown === GTETourDropdownType.OPTIONS : undefined;
  return (
    <MaybeColumn columns={columns} skipPadding={isInModal} showColumn={isInModal}>
      <StyledBookingWidgetControlRow
        title={t("Options")}
        isOpen={activeDropdown === GTETourDropdownType.OPTIONS}
        informationTooltipContent={
          selectedTourOption ? (
            <InformationTooltipContent
              title={selectedTourOption.name}
              description={selectedTourOption.description}
            />
          ) : undefined
        }
      >
        <StyledBookingWidgetOptionsDropdown
          id="optionsDropdown"
          isSelected={selectedTourOption !== undefined}
          isDisabled={!selectedTourOption}
          selectedTitle={selectedTourOption?.name ?? ""}
          onOpenStateChange={onOpenStateChange}
          Icon={TravelerIcon}
          isOpen={isOpen}
          matchesDefaultSelectedItem
          alwaysCloseOnOutsideClick
        >
          <BookingWidgetProductSelectContainer title={t("Tour options")}>
            {tourOptions.map((tourOption, index) => (
              <GTETourOption
                id={tourOption.optionCode || index.toString()}
                tourOption={tourOption}
                isFirstItem={index === 0}
                onSelectTourOption={onTourOptionSelect}
              />
            ))}
          </BookingWidgetProductSelectContainer>
        </StyledBookingWidgetOptionsDropdown>
      </StyledBookingWidgetControlRow>
    </MaybeColumn>
  );
};

export default GTETourOptionContainer;
