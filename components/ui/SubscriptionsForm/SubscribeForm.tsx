import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { SectionWrapper } from "../Section/Section";

import SubscriptionForm from "./SubscriptionForm";

import { gutters } from "styles/variables";
import { mqMax, mqMin } from "styles/base";

const SubscriptionFormWrapper = styled.div<{ isGTE: boolean }>(({ isGTE }) => [
  css`
    display: block;
    margin-top: ${gutters.small * 4}px;
    margin-bottom: ${isGTE ? 0 : gutters.small * 4}px;
    height: auto;

    ${SectionWrapper} {
      margin-top: 0;
      ${mqMax.large} {
        overflow-clip-margin: ${gutters.large * 2}px;
      }
    }

    ${mqMin.large} {
      margin-top: ${gutters.large * 4}px;
      margin-bottom: ${isGTE ? 0 : gutters.large * 4}px;
    }
  `,
]);

const SubscribeForm = ({ isGTE }: { isGTE: boolean }) => {
  return (
    <SubscriptionFormWrapper isGTE={isGTE}>
      <SubscriptionForm />
    </SubscriptionFormWrapper>
  );
};

export default SubscribeForm;
