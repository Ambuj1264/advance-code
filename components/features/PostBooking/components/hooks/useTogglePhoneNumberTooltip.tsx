import { useEffect } from "react";

import useToggle from "hooks/useToggle";

export const useTogglePhoneNumberTooltip = (phoneno: string) => {
  const [tooltipOpen, toggleTooltip] = useToggle(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (tooltipOpen) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(phoneno);
      }

      const phoneLink = document.createElement("a");

      phoneLink.setAttribute("href", `tel://${phoneno}`);
      phoneLink.setAttribute("class", "travelplan-phone-link");
      phoneLink.click();

      timer = setTimeout(() => {
        toggleTooltip();
      }, 5000);
    }

    return () => (timer !== undefined ? clearTimeout(timer) : undefined);
  }, [phoneno, toggleTooltip, tooltipOpen]);

  return [tooltipOpen, toggleTooltip] as const;
};
