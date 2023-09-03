import React from "react";
import { useTranslation } from "react-i18next";

import { PostBookingTypes } from "../types/postBookingTypes";
import { getTicketButtonLabel } from "../utils/pbCardLabelConstructionUtils";

import {
  StyledBookingIcon,
  StyledDirection,
  StyledDownloadIcon,
  StyledLocationUserIcon,
  StyledPhoneIcon,
} from "./PBProductCardShared";

import {
  ProductCardActionButton,
  ProductCardActionButtonsWrapper,
} from "components/ui/ProductCard/ProductCardActionButton";
import { Namespaces } from "shared/namespaces";

export const PBProductCardButtons = ({
  isTileCard,
  ticket,
  directionsUrl,
  onStreetView,
  onPhoneno,
  onBooking,
}: {
  isTileCard: boolean;
  ticket?: PostBookingTypes.PB_TICKET;
  directionsUrl?: string;
  onStreetView?: () => void;
  onPhoneno?: () => void;
  onBooking?: () => void;
}) => {
  const { t: postbookingT } = useTranslation(Namespaces.postBookingNs);
  let buttons = [];

  if (onStreetView) {
    buttons.push(
      <ProductCardActionButton
        key="streetView"
        Icon={StyledLocationUserIcon}
        title={postbookingT("See outside")}
        onClick={onStreetView}
      />
    );
  }

  if (directionsUrl) {
    buttons.push(
      <ProductCardActionButton
        key="direction"
        Icon={StyledDirection}
        displayType="primary"
        href={directionsUrl}
        title={postbookingT("Directions")}
      />
    );
  }
  if (ticket) {
    buttons.push(
      <ProductCardActionButton
        key="voucher-download-url"
        Icon={StyledDownloadIcon}
        displayType="secondary"
        href={ticket.url}
        title={getTicketButtonLabel(ticket.type, postbookingT)}
      />
    );
  } else if (onBooking) {
    buttons.push(
      <ProductCardActionButton
        key="booking"
        Icon={StyledBookingIcon}
        displayType="secondary"
        title={postbookingT("Booking")}
        onClick={onBooking}
      />
    );
  }

  if (onPhoneno) {
    buttons.push(
      <ProductCardActionButton
        key="call"
        Icon={StyledPhoneIcon}
        displayType="secondary"
        title={postbookingT("Call")}
        onClick={onPhoneno}
      />
    );
  }

  if (isTileCard) {
    buttons = buttons.length > 2 ? buttons.slice(1, 3) : buttons;
  }

  return (
    <ProductCardActionButtonsWrapper
      isTileCard={isTileCard}
      showOnlyTwoButtonsOnMobileListCard={!isTileCard && buttons.length > 2}
      isSingleButton={buttons.length === 1}
      isStreetViewAvailable={onStreetView !== undefined}
    >
      {buttons}
    </ProductCardActionButtonsWrapper>
  );
};
