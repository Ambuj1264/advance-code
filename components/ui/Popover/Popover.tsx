import React, { useState, ReactType, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import styled from "@emotion/styled";
import useBodyScrollLock from "@travelshift/ui/components/Popover/useBodyScrollLock";

import PopoverContent from "./PopoverContent";

const PopoverContainer = styled.div`
  position: relative;
`;

const Popover = ({
  title,
  children,
  trigger,
  subtitle,
  Icon,
  noDismiss = false,
  disableXOverflow,
  className,
}: {
  title: string;
  subtitle?: string | React.ReactElement;
  trigger: React.ReactElement;
  children: React.ReactNode;
  Icon?: ReactType;
  noDismiss?: boolean;
  disableXOverflow?: boolean;
  className?: string;
}) => {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const toggleIsOpen = () => setIsOpen(!isOpen);
  const setClosed = () => setIsOpen(false);
  const isMobile = useMediaQuery({ maxWidth: 960 - 1 });
  useBodyScrollLock(isMobile && isOpen && disableXOverflow, "x");

  return (
    <PopoverContainer className={className}>
      {React.cloneElement(trigger, {
        onClick: toggleIsOpen,
        ref: triggerRef,
      })}
      {isOpen && (
        <PopoverContent
          title={title}
          onDismiss={noDismiss ? () => {} : setClosed}
          subtitle={subtitle}
          Icon={Icon}
          ref={triggerRef}
        >
          {children}
        </PopoverContent>
      )}
    </PopoverContainer>
  );
};

export default Popover;
