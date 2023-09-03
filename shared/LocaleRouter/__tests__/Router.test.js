import NextRoutes from "../Router";

const setupRoute = (...args) => {
  const routes = new NextRoutes().add(...args);
  const route = routes.routes[routes.routes.length - 1];
  return { routes, route };
};

describe("Routes", () => {
  const setup = (...args) => {
    const { routes, route } = setupRoute(...args);
    const testRoute = expected => expect(route).toMatchObject(expected);
    return { routes, route, testRoute };
  };

  test("add with object", () => {
    setup({ name: "a" }).testRoute({
      name: "a",
      pattern: "/{locale}/a",
      page: "/a",
    });
  });

  test("add with name", () => {
    setup("a").testRoute({ name: "a", pattern: "/{locale}/a", page: "/a" });
  });

  test("add with name and pattern", () => {
    setup("a", "/:a").testRoute({
      name: "a",
      pattern: "/{locale}/:a",
      page: "/a",
    });
  });

  test("add with name, pattern and page", () => {
    setup("a", "/:a", "b").testRoute({
      name: "a",
      pattern: "/{locale}/:a",
      page: "/b",
    });
  });

  test("add with pattern and page", () => {
    setup("/:a", "b").testRoute({
      name: null,
      pattern: "/{locale}/:a",
      page: "/b",
    });
  });

  test("add with only pattern throws", () => {
    expect(() => setup("/:a")).toThrow();
  });

  test("add with existing name throws", () => {
    expect(() => new NextRoutes().add("a").add("a")).toThrow();
  });

  test("add multiple unnamed routes", () => {
    expect(new NextRoutes().add("/a", "a").add("/b", "b").routes.length).toBe(2);
  });

  test("page with leading slash", () => {
    setup("a", "/", "/b").testRoute({ page: "/b" });
  });

  test("page index becomes /", () => {
    setup("index", "/").testRoute({ page: "/" });
  });
});
