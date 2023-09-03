import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";
import { useMediaQuery } from "react-responsive";

import SectionBanner from "components/ui/BookingWidget/BookingWidgetSectionHeading";
import { createDateCaption } from "components/ui/BookingWidget/utils/bookingWidgetUtils";
import { breakpointsMax, gutters } from "styles/variables";
import { typographySubtitle2, typographyBody2 } from "styles/typography";
import { mqMin, mqMax } from "styles/base";
import { Trans } from "i18n";
import { Namespaces } from "shared/namespaces";

type Props = {
  hasNoAvailableDates?: boolean;
  startDate?: string;
  endDate?: string;
};

const Header = styled.div([
  typographySubtitle2,
  css`
    display: flex;
    justify-content: center;
    height: 24px;
    ${mqMin.large} {
      margin-top: ${gutters.large}px;
      margin-bottom: ${gutters.large}px;
    }
  `,
]);

const Caption = styled.span(
  ({ theme }) =>
    css`
      position: relative;
      display: flex;
      width: 100%;
      height: 24px;
      line-height: 24px;
      text-align: center;
      ${mqMin.large} {
        background-color: ${rgba(theme.colors.primary, 0.1)};
      }
    `
);

const DatesSelected = styled(Caption)(
  ({ theme }) =>
    css`
      color: ${theme.colors.action};
      ${mqMin.large} {
        background-color: ${rgba(theme.colors.action, 0.1)};
      }
    `
);

const Text = styled.div([
  typographySubtitle2,
  css`
    position: absolute;
    right: 0;
    left: 0;
    line-height: 24px;
    ${mqMax.large} {
      ${typographyBody2};
    }
  `,
]);

const Content = ({ hasNoAvailableDates = false, startDate, endDate }: Props) => {
  const isMobile = useMediaQuery({ maxWidth: breakpointsMax.large });
  const hasSelectedDates = startDate && endDate;
  if (hasNoAvailableDates) {
    return (
      <SectionBanner color="error">
        <Trans ns={Namespaces.commonBookingWidgetNs}>No dates available</Trans>
      </SectionBanner>
    );
  }
  if (!hasSelectedDates) {
    return !isMobile ? (
      <SectionBanner color="primary">
        <Trans>Select dates</Trans>
      </SectionBanner>
    ) : (
      <Caption>
        <Text>
          <Trans>Select dates</Trans>
        </Text>
      </Caption>
    );
  }

  return !isMobile ? (
    <SectionBanner>{createDateCaption(startDate, endDate)}</SectionBanner>
  ) : (
    <DatesSelected>
      <Text>{createDateCaption(startDate, endDate)}</Text>
    </DatesSelected>
  );
};

const DatePickerHeader = (props: Props) => (
  <Header>
    <Content {...props} />
  </Header>
);

export default DatePickerHeader;
