import React from "react";
import { useTheme } from "emotion-theming";
import { stringify } from "use-query-params";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import { useStayBookingWidgetContext } from "../StayBookingWidgetStateContext";

import { getClientSideUrl } from "utils/helperUtils";
import {
  constructQueryFromSelectedDates,
  normaliseDates,
} from "components/ui/DatePicker/utils/datePickerUtils";
import { PageType, Marketplace } from "types/enums";
import Button from "components/ui/Inputs/Button";
import { Trans } from "i18n";
import { Namespaces } from "shared/namespaces";
import ClientLink from "components/ui/ClientLink";
import useActiveLocale from "hooks/useActiveLocale";
import { useSettings } from "contexts/SettingsContext";
import CalendarWarning from "components/icons/calendar-warning.svg";
import { gutters, borderRadius } from "styles/variables";
import { typographyBody2, typographySubtitle2 } from "styles/typography";
import { getTotalGuests } from "components/ui/RoomAndGuestPicker/utils/roomAndGuestUtils";
import { encodeOccupanciesToArrayString } from "components/features/AccommodationSearchPage/utils/useAccommodationSearchQueryParams";

export const CalendarWarningIcon = styled(CalendarWarning)(
  ({ theme }) => css`
    margin-top: 4px;
    width: 24px;
    height: 24px;
    fill: ${theme.colors.primary};
  `
);

export const Wrapper = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-top: ${gutters.large}px;
    border-radius: ${borderRadius};
    padding: ${gutters.large}px;
    background-color: ${rgba(theme.colors.primary, 0.05)};
  `
);

export const InfoWrapper = styled.div`
  display: flex;
`;

export const TextWrapper = styled.div(({ theme }) => [
  typographyBody2,
  css`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: ${gutters.large / 2}px;
    color: ${theme.colors.primary};
    line-height: 14px;
  `,
]);

export const BoldText = styled.div([typographySubtitle2]);

export const Text = styled.div`
  margin-top: ${gutters.small / 2}px;
`;

export const ButtonWrapper = styled.div`
  margin-top: ${gutters.small}px;
`;

const StayNoAvailability = ({
  productTitle = "",
  productId,
}: {
  productTitle?: string;
  productId: number;
}) => {
  const theme: Theme = useTheme();
  const activeLocale = useActiveLocale();
  const { marketplace } = useSettings();
  const isGTE = marketplace === Marketplace.GUIDE_TO_EUROPE;
  const { occupancies, selectedDates, accommodationCategory } = useStayBookingWidgetContext();
  const numberOfGuests = getTotalGuests(occupancies);
  const { numberOfAdults, childrenAges } = numberOfGuests;
  const gteParams = stringify({
    occupancies: encodeOccupanciesToArrayString(occupancies),
    ...constructQueryFromSelectedDates(normaliseDates(selectedDates)),
    id: productId,
    address: productTitle,
  });
  const gteClientRoute = {
    route: `/${PageType.GTE_STAYS_SEARCH}`,
    as: `${getClientSideUrl("gteStaysSearch", activeLocale, marketplace)}?${gteParams}`,
  };
  const params = stringify({
    adults: numberOfAdults,
    children: childrenAges,
    rooms: occupancies.length,
    ...constructQueryFromSelectedDates(normaliseDates(selectedDates)),
    ...(accommodationCategory && { category_ids: accommodationCategory.id }),
  });
  const clientRoute = {
    route: `/${PageType.ACCOMMODATION_SEARCH}`,
    as: `${getClientSideUrl("accommodation", activeLocale, marketplace)}?${params}`,
  };
  const noAvailabilityText =
    "<0>There is no availability for the selected period</0><1>Please select other dates or</1>";
  return (
    <Wrapper>
      <InfoWrapper>
        <CalendarWarningIcon />
        <TextWrapper>
          <Trans
            ns={Namespaces.accommodationBookingWidgetNs}
            i18nKey={noAvailabilityText}
            defaults={noAvailabilityText}
            components={[<BoldText />, <Text />]}
          />
        </TextWrapper>
      </InfoWrapper>
      <ButtonWrapper>
        <ClientLink prefetch clientRoute={isGTE ? gteClientRoute : clientRoute}>
          <Button color="action" theme={theme}>
            {isGTE || !accommodationCategory ? (
              <Trans ns={Namespaces.accommodationBookingWidgetNs}>Search similar stays</Trans>
            ) : (
              <Trans
                ns={Namespaces.accommodationBookingWidgetNs}
                i18nKey="Search similar {accommodationType}"
                defaults="Search similar {accommodationType}"
                values={{ accommodationType: accommodationCategory.name }}
              />
            )}
          </Button>
        </ClientLink>
      </ButtonWrapper>
    </Wrapper>
  );
};

export default StayNoAvailability;
