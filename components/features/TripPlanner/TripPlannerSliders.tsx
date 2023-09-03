import React, { useContext } from "react";
import { range } from "fp-ts/lib/Array";

import RangeFilterSingleThumb from "./RangeFilterSingleThumb";
import TripPlannerStateContext from "./contexts/TripPlannerStateContext";

const TripPlannerSlider = ({ theme }: { theme: Theme }) => {
  const { setContextState } = useContext(TripPlannerStateContext);
  return (
    <>
      <RangeFilterSingleThumb
        isFirst
        min={3}
        max={7}
        theme={theme}
        labelText="Trip duration in days"
        step={2}
        marks={[3, 5, 7]}
        incrementMarkValue={2}
        resetMarkValue={1}
        overrideFirstMarkerValue={false}
        onChange={(value: number) => setContextState({ duration: value })}
      />
      <RangeFilterSingleThumb
        min={1}
        max={7}
        disabled
        theme={theme}
        marks={range(1, 7)}
        labelText="Nights in the same hotel"
        onChange={() => undefined}
      />
      <RangeFilterSingleThumb
        min={1}
        max={24}
        theme={theme}
        labelText="Max driving hours per day"
        marks={[1, 12, 24]}
        incrementMarkValue={12}
        resetMarkValue={-12}
        onChange={(value: number) => setContextState({ maxDrivingHours: value })}
      />
      <RangeFilterSingleThumb
        min={0}
        max={1}
        step={0.1}
        disabled
        theme={theme}
        hideMarks
        labelText="Importance of attractions"
        inputEnabled
        onChange={() => undefined}
      />
    </>
  );
};

export default TripPlannerSlider;
