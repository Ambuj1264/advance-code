import React, { useCallback, useState } from "react";
import styled from "@emotion/styled";
import { useTheme } from "emotion-theming";
import TextArea from "@travelshift/ui/components/Inputs/TextArea";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";
import Bubbles from "@travelshift/ui/components/Bubbles/Bubbles";

import { BubblesWrapper, ButtonStyled } from "./TripPlannerStyledComponents";

import { ModalContentWrapper, ModalFooterContainer } from "components/ui/Modal/Modal";
import { greyColor, gutters, lightGreyColor } from "styles/variables";
import { typographySubtitle1 } from "styles/typography";
import { mqMin } from "styles/base";
import { ButtonSize } from "types/enums";
import Checkbox from "components/ui/Inputs/Checkbox";

const FeedbackForm = styled.form`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: auto;
`;

const InfoText = styled.div([
  typographySubtitle1,
  css`
    margin-top: ${gutters.small}px;
    color: ${rgba(greyColor, 0.7)};
    text-align: center;
    ${mqMin.large} {
      margin-top: ${gutters.large}px;
    }
  `,
]);

const Field = styled.div<{
  maxHeight?: number;
}>(({ maxHeight }) => [
  css`
    margin-top: ${gutters.large}px;
    width: 100%;
    height: calc(100% - ${maxHeight ? maxHeight + 45 : 45}px);
  `,
]);

const textArea = css`
  height: 100%;
  background-color: ${lightGreyColor};
  resize: none;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: ${gutters.small}px;
`;

const TripPlannerModalContent = ({
  id,
  onClose,
  onSubmit,
  error,
  isSent,
  buttonText = { submitText: "Submit", closeText: "Close" },
  placeholder = "Type your answer here...",
  disableTextArea = false,
  textToDisplay,
  checkboxGroup,
  isLoading,
}: {
  id: string;
  onClose: () => void;
  onSubmit: (text: string) => void;
  error: string;
  isSent: boolean;
  buttonText?: {
    closeText?: string;
    submitText?: string;
  };
  placeholder?: string;
  disableTextArea?: boolean;
  textToDisplay?: string;
  checkboxGroup?: { id: string; label: string }[];
  isLoading: boolean;
}) => {
  const [text, setText] = useState(textToDisplay || "");
  const theme: Theme = useTheme();
  const hasError = !!error.length;
  const { closeText, submitText } = buttonText;
  const CHECKBOX_WRAPPER_HEIGHT = 41;
  const maxTextFieldHeight = checkboxGroup
    ? CHECKBOX_WRAPPER_HEIGHT * checkboxGroup.length
    : undefined;

  const [checkboxItems, setCheckedItems] = useState(
    checkboxGroup?.map(item => {
      return {
        ...item,
        selected: false,
      };
    })
  );

  const onTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.currentTarget.value),
    []
  );

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const selectedOptions = checkboxItems
      ?.map(
        (checkbox: { id: string; label: string; selected: boolean }) =>
          checkbox.selected === true && checkbox.label
      )
      .filter(Boolean);

    const message = selectedOptions?.length
      ? `Selected options: \n- ${selectedOptions.join("\n- ")}\n\n User Input: ${text}`
      : `User input: ${text}`;

    onSubmit(message);
  };

  const handleCheckboxChange = useCallback(
    (checkedValue: boolean, index: number) => {
      const checkboxes = checkboxItems?.map((item, i) => {
        if (i === index)
          return {
            ...item,
            selected: checkedValue,
          };
        return item;
      });
      setCheckedItems(checkboxes);
    },
    [checkboxItems, setCheckedItems]
  );

  return (
    <FeedbackForm onSubmit={submitHandler}>
      <ModalContentWrapper>
        <InfoText>
          {hasError && (
            <>
              <p>
                <b>ERROR</b>
              </p>
              {error}
            </>
          )}
          {isSent && !hasError && "Thank you for your feedback."}
        </InfoText>
        {!isSent && (
          <>
            {checkboxGroup?.map((checkbox, index) => {
              return (
                <CheckboxWrapper key={checkbox.id}>
                  <Checkbox
                    id={`${checkbox.id}-tripPlannerCheckbox`}
                    checked={checkboxItems![index].selected}
                    onChange={checkedValue => handleCheckboxChange(checkedValue, index)}
                    label={checkbox.label}
                    name={checkbox.id}
                  />
                </CheckboxWrapper>
              );
            })}
            <Field maxHeight={maxTextFieldHeight}>
              <TextArea
                css={textArea}
                name="text"
                placeholder={!disableTextArea ? placeholder : ""}
                value={text}
                onChange={onTextChange}
                required={!disableTextArea}
                disabled={disableTextArea}
              />
            </Field>
          </>
        )}
      </ModalContentWrapper>
      {!disableTextArea && (
        <ModalFooterContainer>
          {isSent ? (
            <ButtonStyled
              testId={`${id}-close`}
              onClick={onClose}
              theme={theme}
              buttonSize={ButtonSize.Medium}
            >
              {closeText}
            </ButtonStyled>
          ) : (
            <ButtonStyled
              testId={`${id}-submit`}
              type="submit"
              theme={theme}
              buttonSize={ButtonSize.Medium}
              color="action"
              disabled={isLoading}
            >
              {isLoading ? (
                <BubblesWrapper>
                  <Bubbles theme={theme} />
                </BubblesWrapper>
              ) : (
                submitText
              )}
            </ButtonStyled>
          )}
        </ModalFooterContainer>
      )}
    </FeedbackForm>
  );
};

export default TripPlannerModalContent;
