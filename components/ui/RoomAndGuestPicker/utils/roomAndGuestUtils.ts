import { range } from "fp-ts/lib/Array";

export const onRoomsChange = (
  occupancies: StayBookingWidgetTypes.Occupancy[],
  onSetOccupancies: (occupancies: StayBookingWidgetTypes.Occupancy[]) => void,
  value: number
) => {
  if (value <= occupancies.length) {
    const removedRoom = occupancies.pop();
    onSetOccupancies(
      occupancies.map((occupancy, index) => {
        if (index === 0) {
          return {
            numberOfAdults: occupancy.numberOfAdults + (removedRoom?.numberOfAdults || 0),
            childrenAges: [...occupancy.childrenAges, ...(removedRoom?.childrenAges || [])],
          };
        }
        return occupancy;
      })
    );
  } else {
    let hasChangedAdult = false;
    onSetOccupancies([
      ...occupancies.map(occupancy => {
        if (!hasChangedAdult && occupancy.numberOfAdults > 1) {
          hasChangedAdult = true;
          return {
            ...occupancy,
            numberOfAdults: occupancy.numberOfAdults - 1,
          };
        }
        return occupancy;
      }),
      {
        numberOfAdults: 1,
        childrenAges: [],
      },
    ]);
  }
};

export const onAdultsChange = (
  occupancies: StayBookingWidgetTypes.Occupancy[],
  onSetOccupancies: (occupancies: StayBookingWidgetTypes.Occupancy[]) => void,
  value: number,
  index: number
) =>
  onSetOccupancies(
    occupancies.map((occupancy, i) => {
      if (i === index) {
        return {
          ...occupancy,
          numberOfAdults: value,
        };
      }
      return occupancy;
    })
  );

export const onChildrenChange = (
  occupancies: StayBookingWidgetTypes.Occupancy[],
  onSetOccupancies: (occupancies: StayBookingWidgetTypes.Occupancy[]) => void,
  value: number,
  index: number
) =>
  onSetOccupancies(
    occupancies.map((occupancy, i) => {
      if (i === index) {
        const newChildren =
          value > occupancy.childrenAges.length
            ? [...occupancy.childrenAges, 9]
            : occupancy.childrenAges.slice(0, value);
        return {
          ...occupancy,
          childrenAges: newChildren,
        };
      }
      return occupancy;
    })
  );

export const onUpdateChildrenAges = (
  occupancies: StayBookingWidgetTypes.Occupancy[],
  onSetOccupancies: (occupancies: StayBookingWidgetTypes.Occupancy[]) => void,
  value: number,
  childIndex: number,
  index: number
) =>
  onSetOccupancies(
    occupancies.map((occupancy, i) => {
      if (i === index) {
        const newChildren = occupancy.childrenAges.map((childAge, childI) => {
          if (childIndex === childI) {
            return value;
          }
          return childAge;
        });
        return {
          ...occupancy,
          childrenAges: newChildren,
        };
      }
      return occupancy;
    })
  );

export const getTotalGuests = (occupancies: StayBookingWidgetTypes.Occupancy[]) =>
  occupancies.reduce(
    ({ numberOfAdults, childrenAges }, currentOccupancy) => {
      return {
        numberOfAdults: numberOfAdults + currentOccupancy.numberOfAdults,
        childrenAges: [...childrenAges, ...currentOccupancy.childrenAges],
      };
    },
    {
      numberOfAdults: 0,
      childrenAges: [],
    } as {
      numberOfAdults: number;
      childrenAges: number[];
    }
  );

export const getOccupanciesFromGuests = (
  numberOfRooms: number,
  numberOfAdults: number,
  childrenAges: number[]
) => {
  const nrOfAdultsInRoom = Math.ceil(numberOfAdults / numberOfRooms);
  const nrOfChildrenInRoom = Math.ceil(childrenAges.length / numberOfRooms);
  let adults = numberOfAdults;
  let childrenArray = childrenAges;
  return range(1, numberOfRooms).map(() => {
    const childrenInRoom = childrenArray.slice(0, nrOfChildrenInRoom);
    const adultsInRoom = Math.min(nrOfAdultsInRoom, adults);
    adults = Math.max(adults - nrOfAdultsInRoom, 0);
    childrenArray = childrenArray.slice(nrOfChildrenInRoom, childrenArray.length);
    return {
      numberOfAdults: Math.max(adultsInRoom, 1),
      childrenAges: childrenInRoom,
    };
  });
};

export const getOccupanciesFromTravelers = (
  numberOfRooms: number,
  numberOfAdults: number,
  childrenAges: number,
  infants: number
) => {
  const infantArray = infants > 0 ? range(1, infants).map(() => 1) : [];
  const childrenAgesArray = childrenAges > 0 ? range(1, childrenAges).map(() => 9) : [];
  const childrenAndInfantsArray = [...childrenAgesArray, ...infantArray];
  const adultsInRoom = Math.ceil(numberOfAdults / numberOfRooms);
  const nrOfChildrenInRoom = Math.ceil(childrenAndInfantsArray.length / numberOfRooms);
  let childrenArray = childrenAndInfantsArray;
  return range(1, numberOfRooms).map(() => {
    const childrenInRoom = childrenArray.slice(0, nrOfChildrenInRoom);
    childrenArray = childrenArray.slice(nrOfChildrenInRoom, childrenArray.length);
    return {
      numberOfAdults: adultsInRoom,
      childrenAges: childrenInRoom,
    };
  });
};

export const getTravelersFromOccupancies = (occupancies: StayBookingWidgetTypes.Occupancy[]) =>
  occupancies.reduce(
    ({ adults, children, infants }, currentOccupancy) => {
      const childrenArray = currentOccupancy.childrenAges.filter(child => child >= 2);
      const infantsArray = currentOccupancy.childrenAges.filter(child => child < 2);
      return {
        adults: adults + currentOccupancy.numberOfAdults,
        children: children + childrenArray.length,
        infants: infants + infantsArray.length,
      };
    },
    {
      adults: 0,
      children: 0,
      infants: 0,
    } as FlightSearchTypes.Passengers
  );

export const onTotalAdultsChange = (
  occupancies: StayBookingWidgetTypes.Occupancy[],
  value: number,
  totalAdults: number,
  onSetOccupancies: (occupancies: StayBookingWidgetTypes.Occupancy[]) => void
) => {
  let hasBeenChanged = false;
  const isDecreasing = value < totalAdults;
  if (isDecreasing) {
    const isDecreasingRooms = value < occupancies.length;
    if (isDecreasingRooms) {
      occupancies.pop();
      onSetOccupancies(occupancies);
    } else {
      onSetOccupancies(
        occupancies.map(occupancy => {
          if (!hasBeenChanged && occupancy.numberOfAdults > 1) {
            hasBeenChanged = true;
            return {
              ...occupancy,
              numberOfAdults: occupancy.numberOfAdults - 1,
            };
          }
          return occupancy;
        })
      );
    }
  } else {
    onSetOccupancies(
      occupancies.map((occupancy, index) => {
        if (index === 0) {
          return {
            ...occupancy,
            numberOfAdults: occupancy.numberOfAdults + 1,
          };
        }
        return occupancy;
      })
    );
  }
};

export const onTotalChildrenChange = (
  occupancies: StayBookingWidgetTypes.Occupancy[],
  value: number,
  totalChildren: number,
  onSetOccupancies: (occupancies: StayBookingWidgetTypes.Occupancy[]) => void
) => {
  let hasBeenChanged = false;
  const isDecreasing = value < totalChildren;
  if (isDecreasing) {
    onSetOccupancies(
      occupancies.map(occupancy => {
        if (!hasBeenChanged && occupancy.childrenAges.length > 0) {
          hasBeenChanged = true;
          occupancy.childrenAges.pop();
          return occupancy;
        }
        return occupancy;
      })
    );
  } else {
    onSetOccupancies(
      occupancies.map((occupancy, index) => {
        if (index === 0) {
          return {
            ...occupancy,
            childrenAges: [...occupancy.childrenAges, 9],
          };
        }
        return occupancy;
      })
    );
  }
};

export const onTotalChildrenAgesChange = (
  occupancies: StayBookingWidgetTypes.Occupancy[],
  value: number,
  index: number,
  onSetOccupancies: (occupancies: StayBookingWidgetTypes.Occupancy[]) => void
) => {
  let childIndex = 0;

  onSetOccupancies(
    occupancies.map(occupancy => {
      const newChildrenAges = occupancy.childrenAges.map(age => {
        if (index === childIndex) {
          childIndex += 1;
          return value;
        }
        childIndex += 1;
        return age;
      });
      return {
        ...occupancy,
        childrenAges: newChildrenAges,
      };
    })
  );
};

export const getTotalNumberOfGuests = (occupancies: StayBookingWidgetTypes.Occupancy[]) =>
  occupancies.reduce((numberOfGuests, currentOccupancy) => {
    const totalGuestsInRoom =
      currentOccupancy.numberOfAdults + currentOccupancy.childrenAges.length;
    return numberOfGuests + totalGuestsInRoom;
  }, 0 as number);
