import { useCallback, useMemo, useRef, useState } from "react";

export const getStayDropdownType = (day?: number) => `stay${day ?? ""}`;

export const getTourDropdownType = (day?: number) => `tour${day ?? ""}`;

export const useDropdownActiveState = () => {
  const [activeDropdown, setActiveDropdown] =
    useState<VPSearchWidgetTypes.activeDropdownType>(null);
  // we use both useState and useRef for storing same value.
  // ref value is used to create consistent callback,
  // state value is used for render
  const activeDropdownRef = useRef<VPSearchWidgetTypes.activeDropdownType>(null);
  const createOpenStateChangeHandler = useCallback(
    (dropdownType: VPSearchWidgetTypes.activeDropdownType) => (isOpen: boolean) => {
      const shouldClose =
        !isOpen && activeDropdownRef.current && dropdownType === activeDropdownRef.current;
      const shouldOpen = isOpen && !activeDropdownRef.current;
      if (!shouldClose && !shouldOpen) return;

      activeDropdownRef.current = shouldOpen ? dropdownType : null;
      setActiveDropdown(shouldOpen ? dropdownType : null);
    },
    [activeDropdownRef]
  );
  const onDatesOpenStateChangeHandler = useMemo(
    () => createOpenStateChangeHandler("dates"),
    [createOpenStateChangeHandler]
  );
  const onTravelersOpenStateChangeHandler = useMemo(
    () => createOpenStateChangeHandler("travelers"),
    [createOpenStateChangeHandler]
  );
  const onFlightOpenStateChangeHandler = useMemo(
    () => createOpenStateChangeHandler("flight"),
    [createOpenStateChangeHandler]
  );
  const onCarOpenStateChangeHandler = useMemo(
    () => createOpenStateChangeHandler("car"),
    [createOpenStateChangeHandler]
  );
  const createOnStayOpenStateChangeHandler = useCallback(
    (day: number) => createOpenStateChangeHandler(getStayDropdownType(day)),
    [createOpenStateChangeHandler]
  );
  const createOnTourOpenStateChangeHandler = useCallback(
    (day: number) => createOpenStateChangeHandler(getTourDropdownType(day)),
    [createOpenStateChangeHandler]
  );

  return {
    activeDropdown,
    createOpenStateChangeHandler,
    onDatesOpenStateChangeHandler,
    onTravelersOpenStateChangeHandler,
    onFlightOpenStateChangeHandler,
    onCarOpenStateChangeHandler,
    createOnStayOpenStateChangeHandler,
    createOnTourOpenStateChangeHandler,
  };
};
