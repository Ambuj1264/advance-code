import { mockQueryImage0, mockQueryImage1 } from "utils/mockData/mockGlobalData";

export const mockName0 = "Daníel Benediktsson";
export const mockName1 = "Eysteinn Gunnlaugsson";

export const mockUser0 = {
  id: 0,
  name: mockName0,
  countryCode: "IS",
  email: "test@travelshift.com",
  avatarImage: mockQueryImage0,
  roles: [],
};

export const mockUser1 = {
  id: 1,
  name: mockName1,
  countryCode: "DE",
  email: "test1@travelshift.com",
  avatarImage: mockQueryImage1,
  roles: [],
};
