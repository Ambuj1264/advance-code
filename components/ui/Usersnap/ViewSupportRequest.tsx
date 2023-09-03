import React from "react";
import Input from "@travelshift/ui/components/Inputs/Input";
import TextArea from "@travelshift/ui/components/Inputs/TextArea";

import {
  SupportRequestForm,
  SupportRequestAction,
  SupportRequestActionType,
} from "./usersnapTypes";
import { Heading, SubHeading, InputWrapper } from "./UsersnapFormsUI";

const SupportRequest = ({
  state,
  dispatch,
}: {
  state: SupportRequestForm;
  dispatch: React.Dispatch<SupportRequestAction>;
}) => (
  <>
    <Heading>Create a support ticket</Heading>
    <SubHeading>
      I need some help
      <br />
      (Not a bug and not a feature request)
    </SubHeading>
    <InputWrapper
      id="usersnapFieldTitle"
      label="Please write a short, clear title"
      required
      hasError={state.title === ""}
    >
      <Input
        id="usersnapFieldTitle"
        type="text"
        value={state.title ?? ""}
        onChange={event =>
          dispatch({
            type: SupportRequestActionType.SetTitle,
            title: event.target.value,
          })
        }
        name="title"
        placeholder="Example: I need help with making a change"
      />
    </InputWrapper>
    <InputWrapper
      id="usersnapFieldDescription"
      label="Please describe the task"
      required
      hasError={state.description === ""}
    >
      <TextArea
        id="usersnapFieldDescription"
        name="description"
        value={state.description ?? ""}
        onChange={event =>
          dispatch({
            type: SupportRequestActionType.SetDescription,
            description: event.target.value,
          })
        }
        placeholder="Example: I want something changed"
      />
    </InputWrapper>
  </>
);

export default SupportRequest;
