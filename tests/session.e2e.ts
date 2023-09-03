import { testLogIn, testLogOut } from "../utils/testcafe/sessionHelpers";
import { baseUrl } from "../utils/testcafe/testcafeConstants";
import { fixtureDesktop } from "../utils/testcafe/utils";

const url = `${baseUrl}/about-iceland`;

fixtureDesktop("Session", url).skip("Session");

testLogIn();

testLogOut();
