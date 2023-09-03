import React from "react";
import styled from "@emotion/styled";

import LoadingHeader from "./LoadingHeader";
import LoadingButtonFilter from "./LoadingButtonFilter";
import LoadingCheckboxFilter from "./LoadingCheckboxFilter";

import { gutters } from "styles/variables";

const Separator = styled.div`
  height: ${gutters.large}px;
`;

const LoadingFilterList = () => (
  <>
    <LoadingHeader />
    <LoadingButtonFilter />
    <Separator />
    <LoadingHeader />
    <LoadingCheckboxFilter />
  </>
);

export default LoadingFilterList;
