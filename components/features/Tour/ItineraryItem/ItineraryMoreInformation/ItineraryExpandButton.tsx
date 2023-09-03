import React, { ReactNode } from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import ArrowIcon from "@travelshift/ui/icons/arrow.svg";

import useToggle from "hooks/useToggle";
import { useTranslation } from "i18n";
import { typographySubtitle1 } from "styles/typography";
import { mqMin } from "styles/base";
import { greyColor, borderRadius, boxShadowLight, whiteColor, gutters } from "styles/variables";
import { Namespaces } from "shared/namespaces";

export type Props = {
  id: string;
  title: string;
  children: ReactNode;
  isStatic?: boolean;
};

const Arrow = styled(ArrowIcon)`
  width: 12px;
  min-width: 12px;
  height: auto;
  fill: ${whiteColor};
`;

const IconContainer = styled.span(
  ({ theme }) =>
    css`
      position: absolute;
      top: 0;
      right: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 100%;
      background-color: ${theme.colors.primary};
    `
);

const Text = styled.span`
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: left;
  margin-left: ${gutters.small}px;
  ${mqMin.medium} {
    justify-content: center;
    margin: 0 ${gutters.small / 4}px;
  }
`;

const ShowMobile = styled.span`
  ${mqMin.large} {
    display: none;
  }
`;

const ShowDesktop = styled.span`
  display: none;
  ${mqMin.large} {
    display: initial;
  }
`;

const Button = styled.button([
  typographySubtitle1,
  css`
    position: relative;
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    box-shadow: ${boxShadowLight};
    border-radius: ${borderRadius};
    width: 100%;
    height: 48px;
    color: ${greyColor};
    overflow: hidden;
  `,
]);

const HiddenCheckbox = styled.input`
  display: none;
`;

const Content = styled.div`
  /* stylelint-disable-next-line selector-max-type */
  ${HiddenCheckbox} ~ & {
    height: 0px;
    overflow: hidden;
    transition: height 200ms;
  }
  /* stylelint-disable-next-line selector-max-type */
  ${HiddenCheckbox}:checked ~ & {
    height: auto;
    overflow: visible;
  }
`;

const ReadMoreTrigger = styled.label(
  ({ theme }) => css`
    cursor: pointer;
    color: ${theme.colors.primary};
    font-weight: 600;
  `
);

const DynamicItineraryExpandButton = ({ id, isStatic = false, title, children }: Props) => {
  const { t } = useTranslation(Namespaces.tourNs);
  const [isOpen, toggleOpen] = useToggle(false);
  return (
    <>
      {isStatic && <HiddenCheckbox type="checkbox" id={`${id}Accommodation`} />}
      <ReadMoreTrigger htmlFor={`${id}Accommodation`}>
        <Button
          id={isStatic ? `${id}AccommodationStatic` : `${id}Accommodation`}
          onClick={toggleOpen}
          {...{ as: isStatic ? "span" : undefined }}
        >
          <Text>
            <ShowMobile>{t("Accommodation")}</ShowMobile>
            <ShowDesktop>
              {t("{sectionTitle} - Accommodation", { sectionTitle: title })}
            </ShowDesktop>
          </Text>
          <IconContainer>
            <Arrow
              css={css`
                transform: rotate(${isOpen ? "270deg" : "90deg"});
                /* stylelint-disable-next-line selector-max-type */
                ${HiddenCheckbox}:checked ~ * & {
                  transform: rotate(270deg);
                }
              `}
            />
          </IconContainer>
        </Button>
      </ReadMoreTrigger>
      {(isOpen || isStatic) && <Content>{children}</Content>}
    </>
  );
};

export default DynamicItineraryExpandButton;
