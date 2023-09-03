import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { useIsMobile } from "hooks/useMediaQueryCustom";
import LazyImage from "components/ui/Lazy/LazyImage";
import { whiteColor, containerMaxWidth } from "styles/variables";
import useCountry from "hooks/useCountry";
import { container, mqMax } from "styles/base";
import { isBrowser } from "utils/helperUtils";

const StyledImageContainer = styled.div([
  container,
  css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    height: 202px;
    overflow: hidden;

    ${mqMax.large} {
      padding: 0px;
    }
    img {
      max-width: ${containerMaxWidth};
      background-color: ${whiteColor};
    }
  `,
]);

const FooterImage = ({ className }: { className?: string }) => {
  const isMobile = useIsMobile();
  const { country } = useCountry();
  const imgUrl = "https://gte.imgix.net/5794119/x/0/gte-footer-image-png";
  return (
    <StyledImageContainer className={className}>
      {isBrowser && (
        <LazyImage
          src={imgUrl}
          alt={`Guide to ${country} footer image`}
          width={window.innerWidth}
          height={isMobile ? 142 : undefined}
          imgixParams={{ fit: "crop", crop: "bottom" }}
        />
      )}
    </StyledImageContainer>
  );
};

export default FooterImage;
