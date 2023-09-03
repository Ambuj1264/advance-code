import React, { ElementType } from "react";
import { range } from "fp-ts/lib/Array";

import { GridItemWrapper } from "./SearchList";

import FadeIn from "components/ui/Transition/FadeIn";
import { useIsMobile } from "hooks/useMediaQueryCustom";

const SearchGridViewPartialLoading = ({
  TileCardSkeletonElement,
  allProvidersLoading,
  someProviderLoading,
  currentResultNumber,
}: {
  TileCardSkeletonElement: ElementType;
  allProvidersLoading: boolean;
  someProviderLoading: boolean;
  currentResultNumber: number;
}) => {
  const isMobile = useIsMobile();
  const gridRowCount = 3;
  const totalEmptySlots = currentResultNumber % gridRowCount;
  const numberOfGridPartialLoading =
    totalEmptySlots === 0 ? currentResultNumber : gridRowCount - totalEmptySlots;

  const shouldShowPartialLoadingState = someProviderLoading && currentResultNumber > 0;

  return (
    <>
      {!shouldShowPartialLoadingState &&
        range(1, 12).map(i => (
          <GridItemWrapper key={`allProvidersGrid${i}`}>
            <FadeIn show transitionKey={`allProvidersGrid${i}`}>
              <TileCardSkeletonElement />
            </FadeIn>
          </GridItemWrapper>
        ))}

      {someProviderLoading &&
        !allProvidersLoading &&
        range(1, isMobile ? gridRowCount : numberOfGridPartialLoading).map(i => {
          return (
            <GridItemWrapper key={`someProviderGrid${i}`}>
              <FadeIn show transitionKey={`someProviderGrid${i}`}>
                <TileCardSkeletonElement />
              </FadeIn>
            </GridItemWrapper>
          );
        })}
    </>
  );
};

export default SearchGridViewPartialLoading;
