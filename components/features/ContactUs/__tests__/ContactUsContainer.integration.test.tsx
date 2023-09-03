import React, { ReactElement, SyntheticEvent } from "react";
import { render, fireEvent, act, getByPlaceholderText, waitFor } from "@testing-library/react";
import { ThemeProvider } from "emotion-theming";
import StyleContext from "isomorphic-style-loader/StyleContext";

import ContactUsContainer from "../ContactUsContainer";
import ContactUsModalContent from "../ContactUsModalContent";

import { mockTheme } from "utils/mockData/mockGlobalData";
import useSessionImport from "hooks/useSession";

jest.mock("hooks/useSession");

const useSession: jest.MockedFunction<typeof useSessionImport> = useSessionImport as any;

const renderWithTheme = (children: ReactElement) =>
  render(
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <StyleContext.Provider value={{ insertCss: () => {} }}>
      {/* eslint-disable-next-line react/jsx-no-constructed-context-values */}
      <ThemeProvider theme={mockTheme}>{children}</ThemeProvider>
    </StyleContext.Provider>
  );

describe("ContactUsContainer integration", () => {
  test("Show the modal on button click", () => {
    useSession.mockReturnValue({
      user: undefined,
      cart: undefined,
      queryCompleted: false,
      // @ts-ignore
      refetch: () => undefined,
    });

    const { getByTestId } = renderWithTheme(<ContactUsContainer productName="Foo" />);
    const notModal = document.getElementById("contact-us-modal");
    expect(notModal).not.toBeInTheDocument();
    act(() => {
      fireEvent.click(getByTestId("Contact Us"));
    });
    waitFor(() => {
      const modal = document.getElementById("contact-us-modal");
      expect(modal).toBeInTheDocument();
      expect(getByPlaceholderText(modal!, "Your name")).toHaveAttribute("type", "text");
      expect(getByPlaceholderText(modal!, "Your email")).toHaveAttribute("type", "email");
    });
  });

  test("Subject is the tour name", () => {
    const { getByTestId } = renderWithTheme(
      <ContactUsModalContent
        productName="Foo"
        isSent={false}
        hasError={false}
        onClose={() => {}}
        handleSubmit={() => {}}
        csrfToken="bar"
      />
    );
    expect((getByTestId("contact-us-subject") as HTMLInputElement).value).toBe("Foo");
  });

  test("Has a csrf field", () => {
    const { getByTestId } = renderWithTheme(
      <ContactUsModalContent
        productName="Foo"
        isSent={false}
        hasError={false}
        onClose={() => {}}
        handleSubmit={() => {}}
        csrfToken="bar"
      />
    );
    expect((getByTestId("contact-us-csrf") as HTMLInputElement).value).toBe("bar");
  });

  test("Auto fills the form with user info when logged in and hides the name and email fields", async () => {
    useSession.mockReturnValue({
      user: {
        id: 1,
        name: "Test User",
        countryCode: "IS",
        email: "test@travelshift.com",
        avatarImage: {
          id: "foo",
          url: "foo",
        },
        isAdmin: false,
        isTranslator: false,
        isAffiliate: false,
      },
      cart: undefined,
      queryCompleted: true,
      // @ts-ignore
      refetch: () => undefined,
    });
    const { getByTestId } = renderWithTheme(<ContactUsContainer productName="Foo" />);
    act(() => {
      fireEvent.click(getByTestId("Contact Us"));
    });
    waitFor(() => {
      const modal = document.getElementById("contact-us-modal");
      expect(getByPlaceholderText(modal!, "Your name")).toHaveValue("Test User");
      expect(getByPlaceholderText(modal!, "Your name")).toHaveAttribute("type", "hidden");
      expect(getByPlaceholderText(modal!, "Your email")).toHaveValue("test@travelshift.com");
      expect(getByPlaceholderText(modal!, "Your email")).toHaveAttribute("type", "hidden");
    });
  });

  test("All fields are required", () => {
    const { getByTestId } = renderWithTheme(
      <ContactUsModalContent
        productName="Foo"
        isSent={false}
        hasError={false}
        onClose={() => {}}
        handleSubmit={() => {}}
        csrfToken="bar"
      />
    );
    expect((getByTestId("contact-us-csrf") as HTMLInputElement).value).toBe("bar");
  });

  test("A valid form is successfully sent", () => {
    const handleSubmit = (event: SyntheticEvent) => {
      event.preventDefault();
    };
    const { getByTestId } = renderWithTheme(
      <ContactUsModalContent
        productName="Foo"
        isSent={false}
        hasError={false}
        onClose={() => {}}
        handleSubmit={handleSubmit}
        csrfToken="bar"
      />
    );
    waitFor(() => {
      act(() => {
        fireEvent.click(getByTestId("contact-us-send-message"));
      });
      expect(handleSubmit).toHaveBeenCalled();
    });
  });
});
