import React from "react";
import styled, { StyledComponent } from "@emotion/styled";
import { css } from "@emotion/core";
import { useTheme } from "emotion-theming";

import { Card, CardImage, CardContent, CardTitle, imageStyles } from "../TeaserComponents";

import { ButtonSize } from "types/enums";
import Button from "components/ui/Inputs/Button";
import ArrowRightIcon from "components/icons/arrow-right.svg";
import { mediaQuery } from "styles/base";
import { borderRadiusSmall, gutters, whiteColor } from "styles/variables";
import LazyImage from "components/ui/Lazy/LazyImage";

// those values are being used by mediaQuery
// so we can provide sizes for different responsive breakpoints
const IMAGE_WIDTH = ["69px", "140px"];
const IMAGE_HEIGHT = ["64px", "80px"];

const ButtonWrapper = styled.div([
  mediaQuery({
    flexBasis: ["70px", "172px"],
    height: ["100%", "auto"],
    "& button": {
      height: ["100% !important", "auto"],
      borderRadius: [0, `${borderRadiusSmall}`],
      paddingRight: [(gutters.small * 3) / 4, `${gutters.small + 16 + gutters.small / 4}px`],
    },
    "& svg": {
      display: ["none", "inline-block"],
    },
  }),
  css`
    flex-shrink: 1;
    & button {
      position: relative;
    }
    & svg {
      position: absolute;
      top: 50%;
      right: ${gutters.small}px;
      margin-top: -7px;
      height: 14px;
      fill: ${whiteColor};
    }
  `,
]);

const StyledCardContent = styled(CardContent)([
  css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  `,
  mediaQuery({
    marginLeft: [`${gutters.small}px`, `${gutters.small}px`],
    marginRight: [0, `${gutters.small}px`],
  }),
]);

const StyledImage = styled(CardImage)`
  border-radius: ${borderRadiusSmall} 0 0 ${borderRadiusSmall};
`;

const TeaserSideCardWithButton = ({
  url,
  title,
  image,
  action,
  LinkComponent,
}: TeaserTypes.Teaser & {
  LinkComponent: StyledComponent<{ href: string }, { href: string }, Theme>;
}) => {
  const theme: Theme = useTheme();

  return (
    <LinkComponent href={url}>
      <Card responsiveHeight={IMAGE_HEIGHT} hasShadow>
        {image && (
          <StyledImage minWidth={IMAGE_WIDTH}>
            <LazyImage src={image.url} styles={imageStyles} />
          </StyledImage>
        )}
        <StyledCardContent>
          <CardTitle>{title}</CardTitle>
          <ButtonWrapper>
            <Button buttonSize={ButtonSize.Small} theme={theme} color="action">
              <>
                {action}
                <ArrowRightIcon />
              </>
            </Button>
          </ButtonWrapper>
        </StyledCardContent>
      </Card>
    </LinkComponent>
  );
};

export default TeaserSideCardWithButton;
