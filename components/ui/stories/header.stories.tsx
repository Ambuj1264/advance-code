/* eslint-disable import/order, import/no-unresolved */
import React from "react";
import Logo from "@travelshift/ui/components/Header/Logo";
import Header from "@travelshift/ui/components/Header/Header";
import { HeaderTypes } from "@travelshift/ui/typings/headerTypes";

import { storiesOf } from "@storybook/react";

import WithContainer from "@stories/decorators/WithContainer";

const heading = "Header";

const headerData = {
  links: [
    {
      linkClass: "link-tour link-visible",
      url: "/book-trips-holiday",
      text: "Book your trip",
      visible: "both",
    },
    {
      linkClass: "link-transport link-visible",
      url: "/iceland-car-rentals",
      text: "Rent a car",
      visible: "both",
    },
    {
      linkClass: "link-accommodation link-visible",
      url: "/accommodation",
      text: "Find accommodation",
      visible: "mobile",
    },
    {
      linkClass: "link-package link-visible",
      url: "/book-trips-holiday/holidays-vacation-packages",
      text: "Vacation packages",
      visible: "both",
    },
    {
      linkClass: "link-visible",
      url: "/about-iceland",
      text: "Explore Iceland",
      visible: "both",
    },
  ] as ReadonlyArray<HeaderTypes.HeaderLink>,
  currencies: [
    {
      currencyCode: "CAD",
      name: "Canadian Dollar",
      rate: 1,
    },
    {
      currencyCode: "CHF",
      name: "Swiss Franc",
      rate: 1,
    },
    {
      currencyCode: "DKK",
      name: "Danish Krone",
      rate: 1,
    },
    {
      currencyCode: "EUR",
      name: "Euro",
      rate: 1,
    },
    {
      currencyCode: "GBP",
      name: "British Pound Sterling",
      rate: 1,
    },
    {
      currencyCode: "ISK",
      name: "Icelandic Króna",
      rate: 1,
    },
    {
      currencyCode: "JPY",
      name: "Japanese Yen",
      rate: 1,
    },
    {
      currencyCode: "NOK",
      name: "Norwegian Krone",
      rate: 1,
    },
    {
      currencyCode: "NZD",
      name: "New Zealand Dollar",
      rate: 1,
    },
    {
      currencyCode: "SEK",
      name: "Swedish Krona",
      rate: 1,
    },
    {
      currencyCode: "USD",
      name: "United States Dollar",
      rate: 1,
    },
  ] as ReadonlyArray<Currency>,
  localeLinks: [
    {
      uri:
        "https://guidetoiceland.is/de/island-urlaub/8-tage-mietwagen-rundreise-ringstrasse-golden-circle",
      locale: "de",
    },
    {
      uri:
        "https://guidetoiceland.is/book-holiday-trips/8-day-self-drive-tour-circle-of-iceland",
      locale: "en",
    },
    {
      uri:
        "https://guidetoiceland.is/es/reserva-vacaciones-viaje/viaje-de-8-dias-a-tu-aire-en-coche-circuito-islandia",
      locale: "es",
    },
    {
      uri:
        "https://guidetoiceland.is/fr/reserver-islande-voyage/autotour-8-jours-tour-islande",
      locale: "fr",
    },
    {
      uri:
        "https://guidetoiceland.is/it/viaggi-e-vacanze-in-islanda/8-giorni-tour-autonomo-islanda",
      locale: "it",
    },
    {
      uri:
        "https://guidetoiceland.is/ja/book-holiday-trips/8-day-self-drive-tour-circle-of-iceland",
      locale: "ja",
    },
    {
      uri:
        "https://guidetoiceland.is/ko/book-holiday-trips/8-day-self-drive-tour-circle-of-iceland",
      locale: "ko",
    },
    {
      uri:
        "https://guidetoiceland.is/pl/najlepsze-wycieczki-na-islandii/8-dni-samodzielna-podroz-po-islandii",
      locale: "pl",
    },
    {
      uri:
        "https://guidetoiceland.is/ru/zabronirovat-tur/8-dnej-avtotur-kolcevaya-doroga-i-zolotoe-kolco",
      locale: "ru",
    },
    {
      uri:
        "https://guidetoiceland.is/th/book-holiday-trips/8-day-self-drive-tour-circle-of-iceland",
      locale: "th",
    },
    {
      uri:
        "https://cn.guidetoiceland.is/book-holiday-trips/8-day-self-drive-tour-circle-of-iceland",
      locale: "zh_CN",
    },
  ],
  searchLink: "search",
  cartLink: "cart",
  forgotPasswordLink: "login/forgot",
  locales: [
    {
      code: "de",
      name: "Deutsch",
    },
    {
      code: "en",
      name: "English",
    },
    {
      code: "es",
      name: "Español",
    },
    {
      code: "fr",
      name: "Français",
    },
    {
      code: "it",
      name: "Italiano",
    },
    {
      code: "ja",
      name: "日本語",
    },
    {
      code: "ko",
      name: "한국어",
    },
    {
      code: "pl",
      name: "Polski",
    },
    {
      code: "ru",
      name: "Русский",
    },
    {
      code: "th",
      name: "ไทย",
    },
    {
      code: "zh_CN",
      name: "中文",
    },
  ] as ReadonlyArray<AppLocale>,
};

const headerTexts = {
  searchBarMobile: "Search",
  searchBar: "Search anything you want in Iceland",
  changeLanguage: "Change language",
  updateCurrency: "Change currency",
  homeLink: "",
  cart: {
    cartTitle: "Cart",
    cartEmptyText: "Your cart is currently empty",
  },
  userMenu: {
    orSignInWith: "Or log in with",
    orSignUpWith: "Or register with",
    noAccount: "Don’t have an account?",
    existingAccount: "Already have an account?",
    registerHere: "Register here",
    loginHere: "Log in here",
    email: "Email",
    password: "Password",
    signIn: "Sign in",
    forgotPassword: "Forgot password?",
    signInError: "Incorrect username or password",
    signUpError: "Please fill in the required fields",
    fullName: "Name",
    confirmPassword: "Confirm password",
    signUp: "Sign up",
    login: "Log in",
    messages: "Messages",
    bookings: "Bookings",
    packages: "Packages",
    blogs: "Blogs",
    reviews: "Reviews",
    signOut: "Sign out",
    createBlog: "Create blog",
    vouchers: "Vouchers",
    menu: "",
  },
};

storiesOf(`${heading}/Header`, module)
  .addDecorator(WithContainer)
  .add("default", () => (
    <Header
      Logo={<Logo marketplace="guidetoiceland_is" />}
      links={headerData.links}
      currencies={headerData.currencies}
      updateActiveCurrency={() => {}}
      locales={headerData.locales}
      activeLocale="en"
      activeCurrency="USD"
      theme={{
        colors: {
          primary: "#336699",
          action: "#33ab63",
        },
      }}
      localeLinks={headerData.localeLinks}
      adminUrl=""
      signUp={() => {}}
      signUpStatus="none"
      signIn={() => {}}
      signInStatus="none"
      headerTexts={headerTexts}
      signInErrorMessage=""
      searchLink={headerData.searchLink}
      cartLink=""
      forgotPasswordLink=""
    />
  ));
