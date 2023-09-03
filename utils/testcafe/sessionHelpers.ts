import { Selector } from "testcafe";

const defaultLogin = "artur.alexeev+@moovweb.com";
const defaultPassword = "wcMFu!7L94F9JRY";

const userNameSelector = Selector("#userMenuHome");

const performLogin = async (login, pass, t) => {
  const userMenuButton = Selector("#navBarUserMenu");

  await t.click(userMenuButton);

  const signInForm = Selector("#signInForm");
  const usernameInput = signInForm.find(`input[type="email"]`);
  const passwordInput = signInForm.find(`input[type="password"]`);
  const signInButton = signInForm.find(`#userMenuSignInSubmit`);

  await t.typeText(usernameInput, login).typeText(passwordInput, pass).click(signInButton);

  await t.expect(userNameSelector.exists).ok();
};

// TODO: skipping tests because login works only on prod
// To run the test, please provide TEST_CAFE_BASE_URI = "https://guidetoiceland.is";

const getTestFn = () =>
  process.env.TEST_CAFE_BASE_URI === "https://guidetoiceland.is" ? test : test.skip;

export const testLogIn = (login = defaultLogin, pass = defaultPassword) =>
  getTestFn()("Should allow user to log in", async t => performLogin(login, pass, t));

export const testLogOut = (login = defaultLogin, pass = defaultPassword) => {
  getTestFn()("Should allow user to log out", async t => {
    await performLogin(login, pass, t);

    const logoutButton = Selector("#userMenuLogOut");

    await t.click(logoutButton).expect(Selector("#userMenuLogOut").exists).notOk();
  });
};
