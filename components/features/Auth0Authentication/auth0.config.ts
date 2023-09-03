const getWebAuthConfig = (host: string) => ({
  domain: "login.guidetoeurope.com",
  clientID: "6JgRO2JMWrAF9mGGS14hhS6dkgVd3j0d",
  responseType: "token",
  redirectUri: `https://${host}`,
});

export default getWebAuthConfig;
