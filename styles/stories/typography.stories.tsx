/* eslint-disable import/order, import/no-unresolved */
import React from "react";
import styled from "@emotion/styled";
import { storiesOf } from "@storybook/react";

import {
  typographyH3,
  typographyH4,
  typographyH5,
  typographySubtitle1,
  typographySubtitle2,
  typographyBody1,
  typographyBody2,
  typographyCaption,
  typographyCaptionSmall,
  typographyOverline,
  typographyCaptionSemibold,
} from "../typography";

import WithContainer from "@stories/decorators/WithContainer";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  /* stylelint-disable-next-line selector-max-type */
  span + span {
    margin-top: 24px;
  }
`;

const heading = "Typography";

storiesOf(`${heading}/Typography`, module)
  .addDecorator(WithContainer)
  .add("default", () => (
    <Container>
      <span css={typographyH3}>typographyH3</span>
      <span css={typographyH4}>typographyH4</span>
      <span css={typographyH5}>typographyH5</span>
      <span css={typographySubtitle1}>typographySubtitle1</span>
      <span css={typographySubtitle2}>typographySubtitle2</span>
      <span css={typographyBody1}>typographyBody1</span>
      <span css={typographyBody2}>typographyBody2</span>
      <span css={typographyCaption}>typographyCaption</span>
      <span css={typographyCaptionSemibold}>typographyCaptionSemibold</span>
      <span css={typographyCaptionSmall}>typographyCaptionSmall</span>
      <span css={typographyOverline}>typographyOverline</span>
    </Container>
  ));
