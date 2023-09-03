import React from "react";
import { useTheme } from "emotion-theming";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";
import { stringify } from "use-query-params";

import { getSearchTravelers } from "../utils/gteTourUtils";

import { useGTETourBookingWidgetContext } from "./GTETourBookingWidgetStateContext";

import {
  constructQueryFromSelectedDates,
  normaliseDates,
} from "components/ui/DatePicker/utils/datePickerUtils";
import { PageType } from "types/enums";
import CalendarWarning from "components/icons/calendar-warning.svg";
import { gutters, borderRadius } from "styles/variables";
import Button from "components/ui/Inputs/Button";
import { typographyBody2, typographySubtitle2 } from "styles/typography";
import { Trans } from "i18n";
import { Namespaces } from "shared/namespaces";
import ClientLink from "components/ui/ClientLink";
import useActiveLocale from "hooks/useActiveLocale";
import { useSettings } from "contexts/SettingsContext";
import { getClientSideUrl } from "utils/helperUtils";
import { mqMin } from "styles/base";

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
    ${mqMin.large} {
      margin: ${gutters.large}px;
    }
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

const NoTourAvailability = ({ isInModal = false }: { isInModal?: boolean }) => {
  const theme: Theme = useTheme();
  const activeLocale = useActiveLocale();
  const { marketplace } = useSettings();
  const { numberOfTravelers, selectedDates, priceGroups, tourDestinationId, tourDestinationName } =
    useGTETourBookingWidgetContext();
  const { adults, children, childrenAges } = getSearchTravelers(numberOfTravelers, priceGroups);
  const params = stringify({
    adults,
    children,
    childrenAges,
    ...constructQueryFromSelectedDates(normaliseDates(selectedDates)),
    startingLocationId: tourDestinationId,
    startingLocationName: tourDestinationName,
  });
  const infoTextFirstLine = "<0>There is no availability for the selected period<0>";
  const infoTextSecondLine = "<0>Please select other dates or<0>";
  return (
    <Wrapper>
      <InfoWrapper>
        <CalendarWarningIcon />
        <TextWrapper>
          <Trans
            ns={Namespaces.tourNs}
            i18nKey={infoTextFirstLine}
            defaults={infoTextFirstLine}
            components={[<BoldText />]}
          />
          {!isInModal && (
            <Trans
              ns={Namespaces.tourNs}
              i18nKey={infoTextSecondLine}
              defaults={infoTextSecondLine}
              components={[<Text />]}
            />
          )}
        </TextWrapper>
      </InfoWrapper>
      {!isInModal && (
        <ButtonWrapper>
          <ClientLink
            prefetch
            clientRoute={{
              route: `/${PageType.GTE_TOUR_SEARCH}`,
              as: `${getClientSideUrl(
                PageType.GTE_TOUR_SEARCH,
                activeLocale,
                marketplace
              )}?${params}`,
            }}
          >
            <Button color="action" theme={theme}>
              <Trans ns={Namespaces.tourBookingWidgetNs}>Search similar tours</Trans>
            </Button>
          </ClientLink>
        </ButtonWrapper>
      )}
    </Wrapper>
  );
};

export default NoTourAvailability;
