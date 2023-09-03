import React, { useCallback } from "react";
import styled from "@emotion/styled";
import { useTranslation } from "react-i18next";
import { css } from "@emotion/core";

import MenuButton from "components/features/PostBooking/MobileFooterMenu/MenuButton";
import { usePostBookingQueryParams } from "components/features/PostBooking/components/hooks/usePostBookingQueryParams";
import { POSTBOOKING_NAVIGATION } from "components/features/PostBooking/types/postBookingEnums";
import { QueryParamTypes } from "components/ui/Filters/QueryParamTypes";
import MobileStickyFooter, {
  MobileFooterContainer,
} from "components/ui/StickyFooter/MobileStickyFooter";
import FatArrowIcon from "components/icons/fat-arrow.svg";
import ThreeDotsIcon from "components/icons/three-dots.svg";
import MapIcon from "components/icons/map-point.svg";
import TravelIcon from "components/icons/pin-flag.svg";
import { gutters, zIndex } from "styles/variables";
import {
  useHeaderContext,
  useOnCloseMenu,
  useOnToggleMenu,
} from "components/features/Header/Header/HeaderContext";
import { Namespaces } from "shared/namespaces";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  align-content: center;
`;

const StyledMobileStickyFooter = styled(MobileStickyFooter)(
  ({ isVisible }: { isVisible: boolean }) => [
    css`
      z-index: ${zIndex.max + 1};
      opacity: 0;
      transform: translateY(100%);
      transition: transform 250ms ease-out, opacity 250ms ease-in;
      ${MobileFooterContainer} {
        height: 50px;
        padding-top: ${gutters.small / 2 - 1}px;
        padding-bottom: ${gutters.small / 2 - 3}px;
      }
    `,
    isVisible &&
      css`
        opacity: 1;
        transform: translateY(0);
      `,
  ]
);

const MobileFooterMenu = () => {
  const [{ nav, tripId }, setQueryParams] = usePostBookingQueryParams();
  const { menuOpen } = useHeaderContext();
  const toggleHeaderMenu = useOnToggleMenu();
  const closeHeaderMenu = useOnCloseMenu();
  const { t: postbookingT } = useTranslation(Namespaces.postBookingNs);

  const onReservationsClick = useCallback(() => {
    setQueryParams(
      {
        nav: POSTBOOKING_NAVIGATION.RESERVATIONS,
        tripId: undefined,
        day: undefined,
      },
      QueryParamTypes.PUSH_IN
    );
    closeHeaderMenu();
  }, [closeHeaderMenu, setQueryParams]);

  const onTravelplanClick = useCallback(() => {
    setQueryParams(
      {
        nav: undefined,
        tripId: undefined,
        day: undefined,
      },
      QueryParamTypes.PUSH_IN
    );
    closeHeaderMenu();
  }, [closeHeaderMenu, setQueryParams]);

  const onMapClick = useCallback(() => {
    setQueryParams({ nav: POSTBOOKING_NAVIGATION.MOBILEMAP }, QueryParamTypes.PUSH_IN);
    closeHeaderMenu();
  }, [closeHeaderMenu, setQueryParams]);

  return (
    <StyledMobileStickyFooter
      className="post-booking-mobile-footer"
      isVisible={!menuOpen}
      fullWidthContent={
        <Wrapper>
          <MenuButton
            label={postbookingT("More")}
            onClick={toggleHeaderMenu}
            Icon={ThreeDotsIcon}
            isActive={menuOpen}
          />
          <MenuButton
            label={postbookingT("Reservations")}
            Icon={FatArrowIcon}
            isActive={!menuOpen && POSTBOOKING_NAVIGATION.RESERVATIONS === nav}
            onClick={onReservationsClick}
          />
          {tripId && (
            <MenuButton
              label={postbookingT("Map")}
              Icon={MapIcon}
              isActive={!menuOpen && POSTBOOKING_NAVIGATION.MOBILEMAP === nav}
              onClick={onMapClick}
            />
          )}
          <MenuButton
            label={postbookingT("Travel plan")}
            Icon={TravelIcon}
            isActive={!menuOpen && (POSTBOOKING_NAVIGATION.TRAVELPLAN === nav || nav === undefined)}
            onClick={onTravelplanClick}
          />
        </Wrapper>
      }
    />
  );
};

export default MobileFooterMenu;
