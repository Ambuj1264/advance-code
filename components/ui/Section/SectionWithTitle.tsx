import React, { ReactNode } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import { mqMin, mqPrint } from "styles/base";
import { whiteColor, borderRadiusBig, greyColor, gutters } from "styles/variables";
import { typographySubtitle2 } from "styles/typography";

export const SectionContainer = styled.div<{ noBorder: boolean }>(
  ({ noBorder }) =>
    css`
      position: relative;
      display: flex;
      flex-direction: column;
      margin-top: ${gutters.small}px;
      border: ${noBorder ? "none" : `1px solid ${rgba(greyColor, 0.4)}`};
      border-radius: ${noBorder ? 0 : borderRadiusBig};
      width: 100%;
      background: ${whiteColor};
      ${mqMin.large} {
        margin-top: ${gutters.large}px;
      }
      & + & {
        ${mqPrint} {
          page-break-before: always;
        }
      }
    `
);

export const Header = styled.div<{
  color: string;
  hasLeftContent: boolean;
  noBorder: boolean;
}>(
  typographySubtitle2,
  ({ color, hasLeftContent, noBorder }) => css`
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: ${hasLeftContent ? "space-between" : "center"};
    border-radius: ${noBorder ? "none" : `9px 9px 0 0`};
    width: 100%;
    height: 35px;
    padding-right: ${hasLeftContent ? gutters.small : 0}px;
    background: ${color};
    color: ${whiteColor};
    ${mqMin.large} {
      justify-content: center;
    }
  `
);

const HeaderRightContent = styled.div`
  position: absolute;
  top: 0;
  right: ${gutters.small}px;
`;

export const HeaderLeftContent = styled.div`
  position: absolute;
  top: 0;
  left: 36px;
  ${mqMin.large} {
    left: ${gutters.small}px;
  }
`;

const SectionWithTitle = ({
  color,
  children,
  title,
  headerRightContent,
  icon,
  headerLeftContent,
  noBorder = false,
  className,
  dataTestid,
}: {
  color: string;
  children: ReactNode;
  title?: string;
  headerRightContent?: ReactNode;
  icon?: ReactNode;
  headerLeftContent?: ReactNode;
  noBorder?: boolean;
  className?: string;
  dataTestid?: string;
}) => {
  return (
    <SectionContainer noBorder={noBorder} className={className} data-testid={dataTestid}>
      <Header color={color} hasLeftContent={headerLeftContent !== undefined} noBorder={noBorder}>
        {headerLeftContent && <HeaderLeftContent>{headerLeftContent}</HeaderLeftContent>}
        {icon}
        {title}
        {headerRightContent && <HeaderRightContent>{headerRightContent}</HeaderRightContent>}
      </Header>
      {children}
    </SectionContainer>
  );
};

export default SectionWithTitle;
