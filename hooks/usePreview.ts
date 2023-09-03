import { useMemo } from "react";

import useSession from "hooks/useSession";
import { useClientSideRedirect } from "hooks/useRedirect";
import { clearPreviewCookie } from "utils/cookieUtils";
import { isInPreviewMode } from "utils/helperUtils";

const usePreview = (cookie?: string) => {
  const { user, queryCompleted: sessionQueryCompleted } = useSession();

  const showPreview = useMemo(() => isInPreviewMode(cookie), [cookie]);

  const isInvalidPreview =
    typeof document !== "undefined" && showPreview && sessionQueryCompleted && !user?.isAdmin;

  const isValidatingPreview = showPreview && !user?.isAdmin;

  if (isInvalidPreview) clearPreviewCookie();

  useClientSideRedirect({ to: "/", condition: isInvalidPreview });

  return { isValidatingPreview, isInvalidPreview };
};

export default usePreview;
