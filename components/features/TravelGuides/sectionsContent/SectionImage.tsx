import styled from "@emotion/styled";
import React from "react";

import ImageComponent from "components/ui/ImageComponent";
import { borderRadius } from "styles/variables";

const IMAGE_SIZES = { max_width: 800, max_height: 500 };

export const ArticleImageWrapper = styled.div`
  position: relative;
  border-radius: ${borderRadius};
  max-height: ${IMAGE_SIZES.max_height}px;
  overflow: hidden;
`;

const SectionImage = ({ imageUrl, imageAlt }: { imageUrl?: string; imageAlt?: string }) => {
  return (
    <ArticleImageWrapper>
      <ImageComponent
        imageUrl={imageUrl}
        height={IMAGE_SIZES.max_height}
        imageAlt={imageAlt}
        imgixParams={{ fit: "crop", ar: "660:500" }}
      />
    </ArticleImageWrapper>
  );
};

export default SectionImage;
