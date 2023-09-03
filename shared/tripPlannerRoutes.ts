import RouterClass from "./LocaleRouter/Router";
import { ROUTE_NAMES } from "./routeNames";

const addTripPlannerRoutes = (router: RouterClass) => {
  if (process.env.RUNTIME_ENV !== "prod") {
    router.add({
      name: ROUTE_NAMES.TRIPPLANNER,
      pattern: "/trip-planner",
    });
  }
};
export default addTripPlannerRoutes;
