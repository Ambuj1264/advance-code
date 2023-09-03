import React from "react";
import Input from "@travelshift/ui/components/Inputs/Input";
import TextArea from "@travelshift/ui/components/Inputs/TextArea";

import {
  FeatureRequestForm,
  FeatureRequestAction,
  FeatureRequestActionType,
} from "./usersnapTypes";
import {
  Heading,
  SubHeading,
  InputWrapper,
  ToggleButtonLabel,
  ToggleButtonWrapper,
} from "./UsersnapFormsUI";

import ToggleButton from "components/ui/Inputs/ToggleButton";

const FeatureRequest = ({
  dispatch,
  state,
}: {
  dispatch: React.Dispatch<FeatureRequestAction>;
  state: FeatureRequestForm;
}) => (
  <>
    <Heading>Request a new feature</Heading>
    <SubHeading>
      I have an idea that makes working on our site easier
      <br />
      (This is not a bug)
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
            type: FeatureRequestActionType.SetTitle,
            title: event.target.value,
          })
        }
        name="title"
        placeholder="Example: Continue shopping or complete checkout popup"
      />
    </InputWrapper>
    <ToggleButtonWrapper>
      <ToggleButtonLabel width="400px">Does this feature save time and/or money?</ToggleButtonLabel>
      <ToggleButton
        id="shouldSaveTime"
        checked={state.shouldSaveTime}
        offValue="No"
        onValue="Yes"
        onChange={checked =>
          dispatch({
            type: FeatureRequestActionType.SetShouldSaveTime,
            shouldSaveTime: checked,
          })
        }
      />
    </ToggleButtonWrapper>
    <ToggleButtonWrapper>
      <ToggleButtonLabel width="400px">
        Does this feature generate more bookings and/or money?
      </ToggleButtonLabel>
      <ToggleButton
        id="shouldGenerateMoney"
        checked={state.shouldGenerateMoney}
        offValue="No"
        onValue="Yes"
        onChange={checked =>
          dispatch({
            type: FeatureRequestActionType.SetShouldGenerateMoney,
            shouldGenerateMoney: checked,
          })
        }
      />
    </ToggleButtonWrapper>
    <InputWrapper id="desiredEffect" label="What should this feature do?">
      <TextArea
        id="desiredEffect"
        name="desiredEffect"
        value={state.desiredEffect}
        onChange={event =>
          dispatch({
            type: FeatureRequestActionType.SetDesiredEffect,
            desiredEffect: event.target.value,
          })
        }
        placeholder="Example: When I click on the Add to cart button, I want to get a window that allows me to continue shopping or go directly to checkout"
      />
    </InputWrapper>
    <InputWrapper id="functionalDescription" label="How will you use the feature?">
      <TextArea
        id="functionalDescription"
        name="functionalDescription"
        value={state.functionalDescription}
        onChange={event =>
          dispatch({
            type: FeatureRequestActionType.SetFunctionalDescription,
            functionalDescription: event.target.value,
          })
        }
        placeholder="Example: I click on the add to cart button, then I choose continue shopping until I'm ready to go to pay for the product."
      />
    </InputWrapper>
    <InputWrapper id="benefits" label="What are the benefits / ROI of the feature?">
      <TextArea
        id="benefits"
        name="benefits"
        value={state.benefits}
        onChange={event =>
          dispatch({
            type: FeatureRequestActionType.SetBenefits,
            benefits: event.target.value,
          })
        }
        placeholder="Example: Customers might add more products in their carts when they are booking so we would sell more."
      />
    </InputWrapper>
    <InputWrapper id="additionalNotes" label="Do you have more details?">
      <TextArea
        id="additionalNotes"
        name="additionalNotes"
        value={state.additionalNotes}
        onChange={event =>
          dispatch({
            type: FeatureRequestActionType.SetAdditionalNotes,
            additionalNotes: event.target.value,
          })
        }
        placeholder="Example: Customers might also want to know what products are good with the product they just added to their cart"
      />
    </InputWrapper>
  </>
);

export default FeatureRequest;
