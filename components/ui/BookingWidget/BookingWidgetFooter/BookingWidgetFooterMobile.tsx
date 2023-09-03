import React, { useContext } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { useTheme } from "emotion-theming";
import tint from "polished/lib/color/tint";

import BookingWidgetFooterDate from "./BookingWidgetFooterDate";

import MobileStickyFooter from "components/ui/StickyFooter/MobileStickyFooter";
import InformationBanner from "components/ui/InformationBanner";
import { getShortMonthNumbericDateFormat } from "utils/dateUtils";
import { ButtonSize, Direction } from "types/enums";
import { whiteColor, gutters, borderRadiusSmall, blackColor } from "styles/variables";
import Button from "components/ui/Inputs/Button";
import { typographyCaption } from "styles/typography";
import LocaleContext from "contexts/LocaleContext";

const FormErrorWrapper = styled.div`
  position: relative;
  bottom: ${gutters.small / 2}px;
  display: flex;
  justify-content: center;
  margin: 0 ${gutters.small}px;
`;

const FormError = styled.div([
  typographyCaption,
  css`
    position: absolute;
    bottom: 0;
    border-radius: ${borderRadiusSmall};
    padding: ${gutters.large / 4}px ${gutters.large / 2}px;
    background-color: ${tint(0.3, blackColor)};
    color: ${whiteColor};
  `,
]);

const BookingWidgetFooterMobile = ({
  onButtonClick,
  formError,
  isButtonLoading,
  buttonCallToAction,
  callToActionDirection,
  showDates,
  information,
  selectedDates,
  disabled,
  href,
  footerLeftContent,
  footerTopContent,
  footerBannerContent,
  footerBannerPrimary = false,
  footerBelowContent,
  type = "button",
}: {
  onButtonClick: () => void;
  formError?: string;
  isButtonLoading: boolean;
  callToActionDirection?: Direction;
  buttonCallToAction: string;
  showDates: boolean;
  selectedDates?: SharedTypes.SelectedDates;
  information?: string;
  disabled?: boolean;
  href?: string;
  footerLeftContent: React.ReactNode;
  footerTopContent?: React.ReactNode;
  footerBannerContent?: React.ReactNode | string;
  footerBannerPrimary?: boolean;
  footerBelowContent?: React.ReactNode;
  type?: "submit" | "reset" | "button";
}) => {
  const theme: Theme = useTheme();
  const activeLocale = useContext(LocaleContext);
  const startDate =
    selectedDates?.from && getShortMonthNumbericDateFormat(selectedDates.from!, activeLocale);
  const endDate =
    selectedDates?.to && getShortMonthNumbericDateFormat(selectedDates.to!, activeLocale);

  const getLeftContent = () => {
    if (showDates) {
      return <BookingWidgetFooterDate startDate={startDate!} endDate={endDate!} />;
    }
    return footerLeftContent;
  };

  const getTopContent = () => {
    if (!information && !footerTopContent) {
      return null;
    }
    return (
      <>
        {information && <InformationBanner text={information} />}
        {footerTopContent}
      </>
    );
  };

  return (
    <MobileStickyFooter
      topContent={getTopContent()}
      leftContent={getLeftContent()}
      rightContent={
        <>
          {formError && (
            <FormErrorWrapper>
              <FormError>{formError}</FormError>
            </FormErrorWrapper>
          )}
          <Button
            onClick={() => {
              if (!isButtonLoading) {
                onButtonClick?.();
              }
            }}
            callToActionDirection={callToActionDirection}
            color="action"
            buttonSize={ButtonSize.Small}
            theme={theme}
            loading={isButtonLoading}
            disabled={disabled}
            href={href}
            type={type}
          >
            {buttonCallToAction}
          </Button>
        </>
      }
      bannerContent={footerBannerContent}
      primaryBanner={footerBannerPrimary}
      bottomContent={footerBelowContent}
    />
  );
};

export default BookingWidgetFooterMobile;
