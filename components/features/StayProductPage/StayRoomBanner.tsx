import React, { useRef, useEffect, useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { useTheme } from "emotion-theming";

import { singleLineTruncation } from "styles/base";
import Tooltip from "components/ui/Tooltip/Tooltip";
import { isValueTruncated } from "components/ui/utils/uiUtils";
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
    position: absolute;
    display: flex;
    padding: 0 ${gutters.small / 4}px;
    background: ${isSelected ? theme.colors.action : theme.colors.primary};
    color: ${whiteColor};
    font-size: ${fontSizeCaption};
    font-weight: ${fontWeightSemibold};
  `,
  isTopBanner
    ? css`
        top: 0;
        width: 100%;
      `
    : css`
        bottom: 0;
        left: 0;
        border-top-right-radius: ${borderRadiusLarger};
      `,
]);

const BannerContent = styled.span`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  padding: ${gutters.small / 4}px ${gutters.small}px ${gutters.small / 4}px ${gutters.small / 4}px;
`;

const TextWrapper = styled.span([
  singleLineTruncation,
  css`
    width: 93%;
    &:first-letter {
      text-transform: capitalize;
    }
  `,
]);

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

const StyledTooltip = styled(Tooltip)`
  justify-content: flex-start;
`;

const StayRoomBanner = ({
  isSelected,
  bannerContent,
  Icon,
  isTopBanner = false,
}: {
  isSelected: boolean;
  bannerContent: string;
  Icon?: React.ElementType;
  isTopBanner?: boolean;
}) => {
  const theme: Theme = useTheme();
  const ref = useRef(null);
  const [hasTruncatedValue, setHasTruncatedValue] = useState(false);
  useEffect(() => {
    if (ref) {
      setHasTruncatedValue(isValueTruncated(ref));
    }
  }, [ref]);
  return (
    <BannerContainer theme={theme} isSelected={isSelected} isTopBanner={isTopBanner}>
      <BannerContent>
        {Icon && (
          <IconWrapper>
            <Icon css={iconStyles} />
          </IconWrapper>
        )}
        {hasTruncatedValue ? (
          <StyledTooltip title={bannerContent} tooltipWidth={200}>
            <TextWrapper ref={ref}>{bannerContent}</TextWrapper>
          </StyledTooltip>
        ) : (
          <TextWrapper ref={ref}>{bannerContent}</TextWrapper>
        )}
      </BannerContent>
    </BannerContainer>
  );
};

export default StayRoomBanner;
