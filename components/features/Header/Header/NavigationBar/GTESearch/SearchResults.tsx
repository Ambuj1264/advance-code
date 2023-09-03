import React from "react";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";

import { ResultItems } from "./GTESearch";
import ResultItem, { LinkToSearchPage } from "./ResultItem";

import { styledWebkitScrollbar, mqMin } from "styles/base";
import { lightBlueColor } from "styles/variables";
import ErrorBoundary from "components/ui/ErrorBoundary";

export const lightBlueColorWithOpacity = rgba(lightBlueColor, 0.05);

const SearchResultsWrapper = styled.div`
  ${mqMin.large} {
    ${styledWebkitScrollbar};
    max-height: 468px;
    overflow-y: auto;
  }
`;

const SearchResults = ({
  searchResult,
  value,
  toggleSearch,
}: {
  searchResult?: ResultItems[];
  value: string;
  toggleSearch?: () => void;
}) => {
  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (!searchResult) return <></>;

  return (
    <ErrorBoundary componentName="SearchResults">
      <SearchResultsWrapper>
        <LinkToSearchPage value={value} toggleSearch={toggleSearch} />
        {searchResult.map((result, index) => {
          const subResults = result?.subResultItems?.map((subResult, subIndex) => {
            return <ResultItem result={subResult} index={subIndex} subResult />;
          });

          return (
            <>
              <ResultItem result={result} index={index} />
              {subResults}
            </>
          );
        })}
      </SearchResultsWrapper>
    </ErrorBoundary>
  );
};

export default SearchResults;
