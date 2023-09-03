import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import {
  Heading as ItineraryHeading,
  Wrapper as ItineraryHeadingWrapper,
} from "./ItineraryHeading";

import LazyImage from "components/ui/Lazy/LazyImage";
import { borderRadiusSmall, gutters, breakpointsMin } from "styles/variables";
import { mqMin, mqIE } from "styles/base";
import ExpandableText from "components/ui/ExpandableText/ExpandableText";

type Props = {
  dayNumber: string;
  heading: string;
  information: string;
  image: Image;
};

const imageStyles = css`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100%;
`;

const AspectRatio = styled.div`
  position: relative;
  width: 100%;
  padding-top: ${(1 / 1.5) * 100}%;
`;

const ImageWrapper = styled.div`
  border-radius: ${borderRadiusSmall};
  width: 100%;
  height: auto;
  overflow: hidden;
  ${mqMin.large} {
    float: left;
    margin-right: ${gutters.large}px;
    width: calc(50% - ${gutters.large / 2}px);
  }
`;
const StyledItineraryHeadingWrapper = styled(ItineraryHeadingWrapper)`
  margin-top: ${gutters.small}px;
  margin-bottom: ${gutters.small}px;
  ${mqMin.large} {
    margin-top: 0;
    margin-bottom: ${gutters.large / 2}px;
  }
`;

const Wrapper = styled.div`
  display: block;
  margin-top: ${gutters.small}px;
  overflow: auto;

  ${mqIE} {
    overflow: hidden;
  }

  ${mqMin.large} {
    margin-top: ${gutters.large}px;
  }
`;

const HiddenDayNumber = styled.span`
  position: absolute;
  right: 0;
  text-transform: capitalize;
  opacity: 0;
`;

const ItineraryInformation = ({ heading, information, image, dayNumber }: Props) => {
  const formattedDayNumber = `${dayNumber} - `;
  return (
    <Wrapper>
      <ImageWrapper>
        <AspectRatio>
          <LazyImage
            src={image.url}
            sizes={`(min-width: ${breakpointsMin.max}px) ${breakpointsMin.max / 2}px, (min-width: ${
              breakpointsMin.large
            }px) 50vw, 100vw`}
            styles={imageStyles}
            alt={image.name}
            width={400}
            height={265}
          />
        </AspectRatio>
      </ImageWrapper>
      <StyledItineraryHeadingWrapper hasTitle={false}>
        <ItineraryHeading>
          <HiddenDayNumber>{formattedDayNumber}</HiddenDayNumber>
          {heading}
        </ItineraryHeading>
      </StyledItineraryHeadingWrapper>
      <ExpandableText
        id={heading}
        text={information}
        lineLimit={6}
        handleParagraphs={false}
        clampedTextExtraHeight={8}
      />
    </Wrapper>
  );
};

export default ItineraryInformation;
