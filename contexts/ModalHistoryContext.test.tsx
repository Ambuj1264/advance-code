import React, { useCallback } from "react";
import { fireEvent, render, screen, cleanup } from "@testing-library/react";

import { defaultState, ModalHistoryProvider, useModalHistoryContext } from "./ModalHistoryContext";

const getParsedCtxValues = (stringifiedText: string | null) => {
  if (!stringifiedText) return null;

  try {
    return JSON.parse(stringifiedText);
  } catch (e) {
    return "error while parsing the context values";
  }
};

describe("ModalHistoryProvider - context values updates", () => {
  let closeModal1: () => void;
  let closeModal2: () => void;
  let closeModal3: () => void;
  let onAfter1: () => void;
  let onAfter1Promise: Promise<void>;
  let onAfter2: () => void;
  let onAfter2Promise: Promise<void>;

  beforeEach(() => {
    closeModal1 = jest.fn();
    closeModal2 = jest.fn();
    closeModal3 = jest.fn();
    onAfter1 = jest.fn();
    onAfter2 = jest.fn();

    let resolve1: () => void;
    onAfter1Promise = new Promise(res => {
      resolve1 = res;
    });
    let resolve2: () => void;
    onAfter2Promise = new Promise(res => {
      resolve2 = res;
    });

    const ProviderTestSubject = ({
      onCloseModal1,
      onCloseModal2,
      onCloseModal3,
    }: {
      onCloseModal1: () => void;
      onCloseModal2: () => void;
      onCloseModal3: () => void;
    }) => {
      const { pushModal, prevModal, resetState, ...contextValues } = useModalHistoryContext();

      const close1 = useCallback(() => {
        pushModal({ id: "modal1", onClose: onCloseModal1 });
      }, [onCloseModal1, pushModal]);

      const close2 = useCallback(() => {
        pushModal({ id: "modal2", onClose: onCloseModal2 });
      }, [onCloseModal2, pushModal]);

      const close3 = useCallback(() => {
        pushModal({ id: "modal3", onClose: onCloseModal3 });
      }, [onCloseModal3, pushModal]);

      return (
        <>
          <button type="button" data-testid="open-modal-1" onClick={close1}>
            add modal 1
          </button>
          <button type="button" data-testid="open-modal-2" onClick={close2}>
            add modal 2
          </button>
          <button type="button" data-testid="open-modal-3" onClick={close3}>
            add modal 3
          </button>

          <button
            type="button"
            data-testid="navigate-back"
            onClick={() => {
              prevModal().then(onAfter1).then(resolve1);
            }}
          >
            navigate back
          </button>
          <button
            type="button"
            data-testid="reset-all-modals-state"
            onClick={() => {
              resetState().then(onAfter2).then(resolve2);
            }}
          >
            reset state
          </button>

          <div data-testid="current-context-values">{JSON.stringify(contextValues)}</div>
        </>
      );
    };

    render(
      <ModalHistoryProvider>
        <ProviderTestSubject
          onCloseModal1={closeModal1}
          onCloseModal2={closeModal2}
          onCloseModal3={closeModal3}
        />
      </ModalHistoryProvider>
    );
  });

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  test("provides a default state", () => {
    const ctxValues = screen.getByTestId("current-context-values");
    expect(getParsedCtxValues(ctxValues.textContent)).toEqual(defaultState);
  });

  test("updates context when 'pushModal' is executed", () => {
    fireEvent.click(screen.getByTestId("open-modal-1"));
    fireEvent.click(screen.getByTestId("open-modal-2"));
    fireEvent.click(screen.getByTestId("open-modal-3"));

    const ctxValues = screen.getByTestId("current-context-values");

    expect(getParsedCtxValues(ctxValues.textContent)).toEqual({
      modals: [{ id: "modal1" }, { id: "modal2" }, { id: "modal3" }],
      currentId: "modal3",
      currentIndex: 2,
      hasPrevious: true,
      prepareModalForRemoval: false,
      removeAllModals: false,
      renderCloseButton: false,
    });
  });

  test("resets all modals when 'resetState' is executed", async () => {
    // setting all modals to context
    fireEvent.click(screen.getByTestId("open-modal-1"));
    fireEvent.click(screen.getByTestId("open-modal-2"));
    fireEvent.click(screen.getByTestId("open-modal-3"));

    fireEvent.click(screen.getByTestId("reset-all-modals-state"));

    const ctxValues = screen.getByTestId("current-context-values");
    expect(getParsedCtxValues(ctxValues.textContent)).toEqual(defaultState);

    expect(closeModal3).toHaveBeenCalledTimes(1);
    expect(closeModal2).toHaveBeenCalledTimes(1);
    expect(closeModal1).toHaveBeenCalledTimes(1);
    await onAfter2Promise;
    expect(onAfter2).toHaveBeenCalledTimes(1);
  });

  test("clicking 'prevModal' removes modals as last-in-first-out from context except the first one", async () => {
    fireEvent.click(screen.getByTestId("open-modal-1"));
    fireEvent.click(screen.getByTestId("open-modal-2"));
    let ctxValues = screen.getByTestId("current-context-values");

    expect(getParsedCtxValues(ctxValues.textContent)).toEqual({
      modals: [{ id: "modal1" }, { id: "modal2" }],
      currentId: "modal2",
      currentIndex: 1,
      hasPrevious: true,
      prepareModalForRemoval: false,
      removeAllModals: false,
      renderCloseButton: false,
    });

    expect(closeModal1).toHaveBeenCalledTimes(0);
    expect(closeModal2).toHaveBeenCalledTimes(0);

    fireEvent.click(screen.getByTestId("navigate-back"));
    ctxValues = screen.getByTestId("current-context-values");

    expect(getParsedCtxValues(ctxValues.textContent)).toEqual({
      modals: [{ id: "modal1", toRemove: false }],
      currentId: "modal1",
      currentIndex: 0,
      hasPrevious: false,
      prepareModalForRemoval: false,
      removeAllModals: false,
      renderCloseButton: true,
    });

    // expecting modal2 to callback to be executed upon navigating back
    expect(closeModal2).toHaveBeenCalledTimes(1);
    expect(closeModal1).toHaveBeenCalledTimes(0);

    await onAfter1Promise;
    expect(onAfter1).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByTestId("navigate-back"));
    ctxValues = screen.getByTestId("current-context-values");
    expect(getParsedCtxValues(ctxValues.textContent)).toEqual(defaultState);

    expect(closeModal2).toHaveBeenCalledTimes(1);
    expect(closeModal1).toHaveBeenCalledTimes(1);
    await onAfter1Promise;
    expect(onAfter1).toHaveBeenCalledTimes(2);
  });
});
