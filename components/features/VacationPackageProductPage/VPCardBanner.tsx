import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { useTheme } from "emotion-theming";

import {
  borderRadiusLarger,
  fontSizeCaption,
  fontWeightSemibold,
  gutters,
  whiteColor,
} from "styles/variables";

const BannerContainer = styled.span<{
  isSelected: boolean;
  isTopBanner: boolean;
}>(({ theme, isSelected, isTopBanner }) => [
  css`
    display: inline-block;
    padding: 0 ${gutters.small / 4}px;
    background: ${isSelected ? theme.colors.action : theme.colors.primary};
    color: ${whiteColor};
    font-size: ${fontSizeCaption};
    font-weight: ${fontWeightSemibold};
  `,
  isTopBanner
    ? css`
        border-bottom-right-radius: ${borderRadiusLarger};
      `
    : css`
        border-top-right-radius: ${borderRadiusLarger};
      `,
]);

const BannerContent = styled.span`
  display: flex;
  justify-content: flex-start;
  padding: ${gutters.small / 4}px;
`;

const TextWrapper = styled.span`
  &:first-letter {
    text-transform: capitalize;
  }
`;

const IconWrapper = styled.span`
  display: flex;
  justify-content: center;
  margin-right: ${gutters.small / 2}px;
  align-content: center;
`;

const iconStyles = css`
  margin: auto;
  width: 14px;
  height: 14px;
  fill: ${whiteColor};
`;

const VPCardBanner = ({
  isSelected,
  bannerContent,
  Icon,
  isTopBanner = false,
}: {
  isSelected: boolean;
  bannerContent: string;
  Icon: React.ElementType;
  isTopBanner?: boolean;
}) => {
  const theme: Theme = useTheme();

  return (
    <BannerContainer theme={theme} isSelected={isSelected} isTopBanner={isTopBanner}>
      <BannerContent>
        <IconWrapper>{Icon && <Icon css={iconStyles} />}</IconWrapper>
        <TextWrapper
          dangerouslySetInnerHTML={{
            __html: bannerContent,
          }}
        />
      </BannerContent>
    </BannerContainer>
  );
};

export default VPCardBanner;
