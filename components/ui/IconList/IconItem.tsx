import React from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import CheckMarkIcon from "@travelshift/ui/icons/checkmark.svg";
import rgba from "polished/lib/color/rgba";

import ImageComponent from "../ImageComponent";

import CircleIcon from "components/icons/circle.svg";
import { typographyBody2, typographyCaption } from "styles/typography";
import { greyColor, gutters, borderRadiusSmall } from "styles/variables";
import { capitalizeFirstLetter, singleLineTruncation } from "styles/base";

export const Text = styled.span<{
  isLink: boolean;
  isSingleLine: boolean;
  capitalize?: boolean;
}>(({ isLink, isSingleLine, capitalize, theme }) => [
  typographyBody2,
  isLink && isSingleLine && singleLineTruncation,
  css`
    /* need it to avoid block size bigger then parent's */
    min-width: 0;
    color: ${isLink ? theme.colors.primary : greyColor};
    line-height: 24px;
    white-space: pre-line;
    hyphens: auto;
    word-wrap: break-word;
    &:hover {
      cursor: ${isLink ? "pointer" : "default"};
      text-decoration: ${isLink ? "underline" : "none"};
    }
  `,
  capitalize && capitalizeFirstLetter,
]);

export const IconContainer = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${gutters.small / 2}px;
  border-radius: ${borderRadiusSmall};
  min-width: 40px;
  height: 32px;
`;

export const IconItemWrapper = styled.span<{
  isClickable: boolean;
  isCircleIcon: boolean;
}>(
  ({ isClickable, isCircleIcon }) => css`
    display: flex;
    align-items: ${isCircleIcon ? "flex-start" : "center"};
    margin-top: ${gutters.small}px;
    width: 100%;
    cursor: ${isClickable ? "pointer" : "auto"};
  `
);

export const IconWrapper = styled.span<{
  isLargeIcon: boolean;
  isActionColor?: boolean;
}>(({ isLargeIcon, isActionColor = false, theme }) => [
  css`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: ${gutters.small / 2}px;
    border-radius: ${borderRadiusSmall};
    width: 40px;
    min-width: 40px;
    height: 32px;
    background-color: ${rgba(isActionColor ? theme.colors.action : theme.colors.primary, 0.05)};
  `,
  isLargeIcon
    ? css`
        width: 56px;
        min-width: 56px;
        height: 40px;
      `
    : "",
]);

const ImageWrapper = styled.span`
  align-self: flex-start;
  margin-right: ${gutters.small / 2}px;
  border-radius: ${borderRadiusSmall};
  width: 56px;
  min-width: 56px;
  height: 40px;
  overflow: hidden;
`;

const StyledCircleIcon = styled(CircleIcon)(
  ({ theme }) =>
    css`
      margin-bottom: ${gutters.small / 2}px;
      width: 5px;
      height: 5px;
      fill: ${theme.colors.primary};
    `
);

const StyledCheckMarkIcon = styled(CheckMarkIcon)(
  ({ theme }) =>
    css`
      margin-top: ${gutters.small / 4}px;
      width: 16px;
      min-width: 16px;
      height: auto;
      fill: ${theme.colors.action};
    `
);

const Link = styled.a`
  width: 100%;
`;

const Subtitle = styled.span([
  typographyCaption,
  css`
    color: ${greyColor};
  `,
]);

const TextWrapper = styled.span<{ inGrid: boolean }>(
  ({ inGrid }) => css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: ${inGrid ? "70%" : "100%"};
  `
);

const iconStyles = (theme: Theme) => css`
  min-width: 18px;
  height: 18px;
  min-height: 18px;
  fill: ${theme.colors.primary};
`;

const IconItemContent = ({
  sectionId,
  iconItem,
  onClick,
  inGrid,
  capitalize,
}: {
  sectionId: string;
  iconItem: SharedTypes.Icon;
  onClick?: (icon: SharedTypes.Icon) => void;
  inGrid: boolean;
  capitalize?: boolean;
}) => {
  const {
    id,
    title,
    subtitle,
    checkList,
    isClickable = false,
    isLargeIcon = false,
    Icon,
    image,
    url,
  } = iconItem;
  const isCircleIcon = !Icon && !image && !checkList;
  const iconNoImage = Icon && !image;
  const noIconNoImage = !Icon && !image;
  const noIconNoImageChecklist = noIconNoImage && checkList;
  const noIconNoImageNoChecklist = noIconNoImage && !checkList;

  return (
    <IconItemWrapper
      key={id}
      onClick={() => onClick && onClick(iconItem)}
      isClickable={isClickable}
      isCircleIcon={isCircleIcon}
    >
      {image && (
        <ImageWrapper>
          <ImageComponent height={40} width={56} imageUrl={image.url} imageAlt={image.name} />
        </ImageWrapper>
      )}
      {iconNoImage && (
        <IconWrapper isLargeIcon={isLargeIcon}>
          <Icon css={iconStyles} />
        </IconWrapper>
      )}
      {noIconNoImageChecklist && (
        <IconWrapper isLargeIcon={false} isActionColor>
          <StyledCheckMarkIcon />
        </IconWrapper>
      )}
      {noIconNoImageNoChecklist && (
        <IconContainer>
          <StyledCircleIcon />{" "}
        </IconContainer>
      )}
      <TextWrapper inGrid={inGrid}>
        <Text
          id={`${sectionId}${title?.replace(/\s/g, "")}${isClickable ? "Button" : "Text"}`}
          isLink={isClickable || url !== undefined}
          isSingleLine={!Icon && !image && !checkList}
          capitalize={capitalize}
        >
          {title}
        </Text>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
      </TextWrapper>
    </IconItemWrapper>
  );
};

const IconItem = ({
  sectionId,
  iconItem,
  onClick,
  inGrid = false,
  capitalize,
}: {
  sectionId: string;
  iconItem: SharedTypes.Icon;
  onClick?: (icon: SharedTypes.Icon) => void;
  inGrid?: boolean;
  capitalize?: boolean;
}) => {
  const { title, url } = iconItem;
  if (url) {
    return (
      <Link id={`${title.replace(/\s/g, "")}Page`} href={url} target="_blank" rel="noopener">
        <IconItemContent
          sectionId={sectionId}
          iconItem={iconItem}
          onClick={onClick}
          inGrid={inGrid}
          capitalize={capitalize}
        />
      </Link>
    );
  }
  return (
    <IconItemContent
      sectionId={sectionId}
      iconItem={iconItem}
      onClick={onClick}
      inGrid={inGrid}
      capitalize={capitalize}
    />
  );
};

export default IconItem;
