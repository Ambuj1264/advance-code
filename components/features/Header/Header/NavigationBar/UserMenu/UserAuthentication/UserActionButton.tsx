import React from "react";
import Button from "@travelshift/ui/components/Inputs/Button";
import { useTheme } from "emotion-theming";
import LoadingRing from "@travelshift/ui/components/Header/NavigationBar/UserMenu/UserAuthentication/LoadingRing";

import { FormButtonRow } from "./SharedUserMenuComponents";

import { ButtonSize } from "types/enums";

const UserActionButton = ({
  id,
  type,
  color,
  buttonText,
  isSubmitting,
}: {
  id: string;
  type: "submit" | "reset" | "button";
  color?: "action" | "primary" | "error" | "warning";
  buttonText: string;
  isSubmitting: boolean;
}) => {
  const theme: Theme = useTheme();
  return (
    <FormButtonRow>
      <Button id={id} type={type} buttonSize={ButtonSize.Medium} theme={theme} color={color}>
        {isSubmitting ? <LoadingRing /> : buttonText}
      </Button>
    </FormButtonRow>
  );
};

export default UserActionButton;
