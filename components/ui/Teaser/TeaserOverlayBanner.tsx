import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { getTeaserOverlayBannerPropsById } from "./utils/TeaserUtils";

import { useTranslation } from "i18n";
import { gutters, borderRadius } from "styles/variables";
import { typographyCaption } from "styles/typography";
import { Namespaces } from "shared/namespaces";

const StyledIcon = styled.span`
  display: inline-block;
  margin-top: -2px;
  margin-right: ${gutters.small / 2}px;
  width: ${gutters.small}px;
  height: ${gutters.small}px;
  vertical-align: middle;
  fill: #fff;
`;

const StyledOverlay = styled.div<{ bgColor?: string }>(
  ({ bgColor = "#000" }) => css`
    ${typographyCaption};
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    border-radius: 0 0 ${borderRadius} 0;
    padding: ${gutters.small / 4}px ${gutters.small / 2}px;
    background: ${bgColor};
    color: #fff;
  `
);

const TeaserOverlayBanner = ({ icon }: { icon?: TeaserTypes.TeaserOverlayBannerIcon }) => {
  const { t } = useTranslation(Namespaces.articleSearchNs);
  const { Icon, bgColor, title } = getTeaserOverlayBannerPropsById(icon);

  if (!Icon || !bgColor || !title) {
    return null;
  }

  return (
    <StyledOverlay bgColor={bgColor}>
      {icon ? (
        <StyledIcon>
          <Icon />
        </StyledIcon>
      ) : null}
      {t(title)}
    </StyledOverlay>
  );
};

export default TeaserOverlayBanner;
