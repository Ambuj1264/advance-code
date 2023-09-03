import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { HeaderTypes } from "@travelshift/ui/typings/headerTypes";
import Link from "@travelshift/ui/components/Inputs/Link";

import { getLinkIcon } from "../../utils/headerUtils";

import { ItemWrapper, iconStyles, ItemContentWrapper } from "./CartComponents";

import { whiteColor, gutters } from "styles/variables";
import Arrow from "components/icons/arrow-thick-left.svg";

const ArrowIcon = styled(Arrow)`
  width: 14px;
  height: 14px;
  transform: rotate(180deg);
  fill: ${whiteColor};
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 ${gutters.small / 2}px;
`;

export const IconWrapper = styled.div(
  ({ theme }) =>
    css`
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid ${whiteColor};
      border-radius: 50%;
      width: 36px;
      min-width: 36px;
      height: 36px;
      background-color: ${theme.colors.primary};
    `
);

const ArrowIconWrapper = styled(IconWrapper)`
  width: 28px;
  min-width: 28px;
  height: 28px;
`;

const EmptyMiniCart = ({ links }: { links: ReadonlyArray<HeaderTypes.HeaderLink> }) => {
  return (
    <>
      {links
        .filter(
          link =>
            !link.linkClass.includes("about") && !link.linkClass.includes("travelguidedestination")
        )
        .map(({ text, url, linkClass }, index) => {
          const Icon = getLinkIcon(linkClass);
          return (
            <Link id={`mini-cart-${url}`} href={url}>
              <ItemWrapper key={`productLink${index.toString()}`}>
                <IconContainer>
                  <IconWrapper>
                    <Icon css={iconStyles} />
                  </IconWrapper>
                </IconContainer>
                <ItemContentWrapper>
                  {text}
                  <ArrowIconWrapper>
                    <ArrowIcon />
                  </ArrowIconWrapper>
                </ItemContentWrapper>
              </ItemWrapper>
            </Link>
          );
        })}
    </>
  );
};

export default EmptyMiniCart;
