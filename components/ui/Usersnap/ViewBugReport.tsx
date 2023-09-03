import React from "react";
import Input from "@travelshift/ui/components/Inputs/Input";
import TextArea from "@travelshift/ui/components/Inputs/TextArea";

import { BugReportForm, BugReportAction, BugReportActionType } from "./usersnapTypes";
import {
  Heading,
  SubHeading,
  InputWrapper,
  ToggleButtonLabel,
  ToggleButtonWrapper,
} from "./UsersnapFormsUI";

import ToggleButton from "components/ui/Inputs/ToggleButton";

const BugReport = ({
  dispatch,
  state,
}: {
  dispatch: React.Dispatch<BugReportAction>;
  state: BugReportForm;
}) => (
  <>
    <Heading>Report a bug</Heading>
    <SubHeading>
      Something on the site is broken
      <br />
      (Some site function worked previously but does not work now)
    </SubHeading>
    <InputWrapper
      id="usersnapFieldTitle"
      label="Please write a short, clear description"
      required
      hasError={state.title === ""}
    >
      <Input
        id="usersnapFieldTitle"
        type="text"
        value={state.title ?? ""}
        onChange={event =>
          dispatch({
            type: BugReportActionType.SetTitle,
            title: event.target.value,
          })
        }
        name="title"
        placeholder="Example: Admins are unable to add tour to the cart"
      />
    </InputWrapper>
    <ToggleButtonWrapper>
      <ToggleButtonLabel>Is the issue severe?</ToggleButtonLabel>
      <ToggleButton
        id="isSevere"
        checked={state.isSevere}
        offValue="No"
        onValue="Yes"
        onChange={checked =>
          dispatch({
            type: BugReportActionType.SetIsSevere,
            isSevere: checked,
          })
        }
      />
    </ToggleButtonWrapper>
    <ToggleButtonWrapper>
      <ToggleButtonLabel>Are we losing sales or customers?</ToggleButtonLabel>
      <ToggleButton
        id="areWeLosingCustomers"
        checked={state.areWeLosingCustomers}
        offValue="No"
        onValue="Yes"
        disabled={!state.isSevere}
        onChange={checked =>
          dispatch({
            type: BugReportActionType.SetAreWeLosingCustomers,
            areWeLosingCustomers: checked,
          })
        }
      />
    </ToggleButtonWrapper>
    <InputWrapper
      id="usersnapFieldDescription"
      label="What happened?"
      required
      hasError={state.description === ""}
    >
      <TextArea
        id="usersnapFieldDescription"
        name="description"
        value={state.description ?? ""}
        onChange={event =>
          dispatch({
            type: BugReportActionType.SetDescription,
            description: event.target.value,
          })
        }
        placeholder="Example: The price for children is 0"
      />
    </InputWrapper>
    <InputWrapper label="What was supposed to happen?" id="usersnapFieldExpectedBehavior">
      <TextArea
        id="usersnapFieldExpectedBehavior"
        name="expectedBehavior"
        value={state.expectedBehavior}
        onChange={event =>
          dispatch({
            type: BugReportActionType.SetExpectedBehavior,
            expectedBehavior: event.target.value,
          })
        }
        placeholder="Example: The price for children should be 2000"
      />
    </InputWrapper>
    <InputWrapper label="Do you have more details?" id="usersnapFieldAdditionalInformation">
      <TextArea
        id="usersnapFieldAdditionalInformation"
        name="additionalInformation"
        value={state.additionalInformation}
        onChange={event =>
          dispatch({
            type: BugReportActionType.SetAdditionalInformation,
            additionalInformation: event.target.value,
          })
        }
        placeholder="Example: I was creating custom departure, maybe that didn't save the price?"
      />
    </InputWrapper>
  </>
);

export default BugReport;
