import React, { useEffect } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import { gteImgixUrl } from "utils/imageUtils";
import DownloadIcon from "components/icons/download-cloud.svg";
import {
  gutters,
  whiteColor,
  guttersPx,
  borderRadiusSmall,
  blackColor,
  greyColor,
} from "styles/variables";
import { useGlobalContext } from "contexts/GlobalContext";
import TGContentWidgetSectionHeader from "components/features/TravelGuides/sidebar/TGContentWidgetSectionHeader";
import MobileLocation from "components/icons/travel-plan.svg";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import { typographyH4, typographySubtitle1, typographySubtitle2 } from "styles/typography";
import ImageComponent from "components/ui/ImageComponent";
import { Card } from "components/ui/Teaser/TeaserComponents";
import { mqMax } from "styles/base";

const TGContentWidgetSectionHeaderStyled = styled(TGContentWidgetSectionHeader)`
  margin-bottom: ${guttersPx.small};
`;

const CardStyled = styled(Card)`
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
  height: 224px;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    display: block;
    background: ${rgba(blackColor, 0.6)};
  }
`;

const TitleWrapper = styled.div`
  z-index: 2;
  margin-bottom: 26px;
  padding: ${gutters.small / 2}px ${gutters.small - 2}px;
  color: ${whiteColor};
  text-align: center;
`;

const SubTitle = styled.div(typographySubtitle2);
const Title = styled.h3(typographyH4);

const DownloadButton = styled.button<{}>(
  typographySubtitle1,
  ({ theme }) =>
    css`
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 26px;
      border-radius: ${borderRadiusSmall};
      width: 90%;
      height: 40px;
      background: ${theme.colors.action};
      cursor: pointer;
      color: ${whiteColor};
      line-height: 40px;
      text-align: center;
      transform: translateY(-5%);
    `
);

const iconStyles = css`
  margin-right: ${guttersPx.small};
  width: 20px;
  height: 20px;
  fill: ${whiteColor};
`;

const ImageComponentStyled = styled(ImageComponent)`
  position: absolute;
  width: 100%;
  height: 100%;
  ${mqMax.large} {
    height: auto;
  }
`;

const PWAWrapper = styled.div`
  margin-bottom: ${guttersPx.small};
  border-bottom: 1px solid ${rgba(greyColor, 0.3)};
  padding-bottom: ${guttersPx.small};
`;

const TGContentPWA = () => {
  const { t: travelGuidesT } = useTranslation(Namespaces.travelGuidesNs);
  const { isPWAInstallerAvailable, setContextState: setGlobalContextState } = useGlobalContext();

  const onClick = () => {
    /* eslint-disable no-underscore-dangle */
    if (window?._travelshift?.pwaInstallEvent) {
      window?._travelshift?.pwaInstallEvent?.prompt();
    }
  };

  useEffect(() => {
    if (window?._travelshift?.pwaInstallEvent) {
      setGlobalContextState({ isPWAInstallerAvailable: true });
    }
  }, [setGlobalContextState]);

  if (!isPWAInstallerAvailable) {
    return null;
  }

  const imageUrl = `${gteImgixUrl}/GSQoHEIEQCm73haA8ANZ`;
  return (
    <PWAWrapper>
      <TGContentWidgetSectionHeaderStyled
        title={travelGuidesT("Download the best travel app")}
        Icon={MobileLocation}
      />
      <CardStyled>
        <ImageComponentStyled imageUrl={imageUrl} width={330} height={224} />
        <TitleWrapper>
          <SubTitle>{travelGuidesT("The Best App")}</SubTitle>
          <Title>{travelGuidesT("For Traveling in Iceland & in Europe!")}</Title>
        </TitleWrapper>
        <DownloadButton onClick={onClick}>
          <DownloadIcon css={iconStyles} />
          <span>{travelGuidesT("Download Now")}</span>
        </DownloadButton>
      </CardStyled>
    </PWAWrapper>
  );
};

export default TGContentPWA;
