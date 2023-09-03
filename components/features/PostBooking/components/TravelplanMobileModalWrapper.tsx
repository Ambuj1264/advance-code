import React, { ReactElement, useCallback, useRef, useEffect, RefObject } from "react";
import styled from "@emotion/styled";
import { useRouter } from "next/router";

import { usePostBookingQueryParams } from "./hooks/usePostBookingQueryParams";

import { useIsMobile } from "hooks/useMediaQueryCustom";
import Modal, {
  ModalHeader,
  ModalContentWrapper,
  Button,
  Container,
} from "components/ui/Modal/Modal";
import ArrowIcon from "components/icons/arrows-diagrams.svg";
import { whiteColor } from "styles/variables";
import { useHeaderContext } from "components/features/Header/Header/HeaderContext";
import { PageType } from "types/enums";

const ArrowIconStyled = styled(ArrowIcon)`
  width: 12px;
  height: 12px;
  fill: ${whiteColor};
`;

const ModalStyled = styled(Modal)`
  width: 100%;
  height: 100%;

  ${Container} {
    height: calc(100% - 50px);
  }
  ${ModalContentWrapper} {
    padding: 0;
  }
`;

const TravelplanBackButton = ({ onClick }: { onClick?: () => void }) => (
  <Button data-testid="modal-back-button" onClick={onClick}>
    <ArrowIconStyled />
  </Button>
);

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

const TravelplanMobileModalWrapper = ({
  pageTitle,
  children,
}: {
  pageTitle: string;
  children: ReactElement;
}) => {
  const isMobile = useIsMobile();
  const { menuOpen } = useHeaderContext();

  const [{ tripId, day, nav }] = usePostBookingQueryParams();
  const ref = useRef() as RefObject<HTMLDivElement>;

  const router = useRouter();
  const onLeftButtonClick = useCallback(() => {
    // if the only page has been opened in browser - open homepage upon navigating back
    if (window.history.length === 1) {
      router.push(PageType.GTE_FRONT_PAGE, "/");
      return;
    }

    router.back();

    const { href: prevHref } = window.location;

    // if we are still on the same page after hitting back button
    // this might happen for e.g. Samsung Internet Browser when your page is the first in browser history.
    // you do not have a way to navigate back to the browser tabs homepage unlike in Chrome or FF
    setTimeout(() => {
      if (prevHref === window.location.href) {
        router.push(PageType.GTE_FRONT_PAGE, "/");
      }
    }, 500);
  }, [router]);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [tripId, day, nav]);

  return isMobile ? (
    <ModalStyled
      id="travelPlanModalContainer"
      onClose={noop}
      customZIndex={menuOpen === true ? -1 : undefined}
    >
      <ModalHeader
        title={pageTitle}
        leftButton={<TravelplanBackButton onClick={onLeftButtonClick} />}
      />
      <ModalContentWrapper ref={ref}>{children}</ModalContentWrapper>
    </ModalStyled>
  ) : (
    children
  );
};

export default TravelplanMobileModalWrapper;
