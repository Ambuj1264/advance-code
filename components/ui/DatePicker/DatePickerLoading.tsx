import React from "react";
import { range } from "fp-ts/lib/Array";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { useMediaQuery } from "react-responsive";

import { gutters, breakpointsMax, separatorColorLight } from "styles/variables";
import { skeletonPulse, mqMin, container, mqMax } from "styles/base";

const LoadingDatePickerContainer = styled.div`
  margin-top: 24px;
  height: 69px;
`;

const DropdownLoadingContainer = styled.div(container);

const DropdownLoading = styled.div([
  skeletonPulse,
  css`
    margin-top: ${4}px;
    height: 45px;
  `,
]);

const DropdownLoadingLabel = styled.div([
  skeletonPulse,
  css`
    width: 50px;
    height: 14px;
  `,
]);

const LoadingHeader = styled.div([
  skeletonPulse,
  css`
    width: 100px;
    height: 20px;
    ${mqMax.large} {
      margin-top: ${gutters.small / 2}px;
      padding-bottom: ${gutters.small / 2}px;
    }
  `,
]);

const LoadingTableCell = styled.td`
  border: 1px solid ${separatorColorLight};
  width: 51px;
  height: 41px;
  border-collapse: collapse;
`;

const LoadingTable = styled.table`
  margin-top: ${gutters.large / 4}px;
  border-collapse: collapse;
  ${mqMin.large} {
    margin: ${gutters.large / 2}px ${gutters.large}px 0 ${gutters.large}px;
  }
`;

const MobileLoadingWrapper = styled.div`
  margin-top: ${gutters.large / 2}px;
`;

const MobileLoadingMonth = styled.div`
  &:not(:first-of-type) {
    margin-top: ${gutters.large / 2}px;
  }
`;

const MobileTables = () => {
  const tables = [];
  for (let i = 0; i < 3; i += 1) {
    // eslint-disable-next-line functional/immutable-data
    tables.push(
      <MobileLoadingMonth key={i.toString()}>
        <LoadingHeader />
        <LoadingTable>
          <tbody>
            {range(0, 4).map(row => (
              <tr key={`row${row}`}>
                {range(0, 6).map(column => (
                  <LoadingTableCell key={`cell${row}${column}`} />
                ))}
              </tr>
            ))}
          </tbody>
        </LoadingTable>
      </MobileLoadingMonth>
    );
  }
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{tables}</>;
};

const DatePickerLoading = () => {
  const isMobile = useMediaQuery({ maxWidth: breakpointsMax.large });
  if (isMobile) {
    return (
      <MobileLoadingWrapper>
        <MobileTables />
      </MobileLoadingWrapper>
    );
  }
  return (
    <LoadingDatePickerContainer>
      <DropdownLoadingContainer>
        <DropdownLoadingLabel />
        <DropdownLoading />
      </DropdownLoadingContainer>
    </LoadingDatePickerContainer>
  );
};

export default DatePickerLoading;
