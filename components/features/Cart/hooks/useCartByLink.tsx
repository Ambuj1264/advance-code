import { useMutation } from "@apollo/react-hooks";
import { useRouter } from "next/router";
import { useEffect } from "react";

import CreateCartMutation from "../queries/CreateCartMutation.graphql";

import { constructLocalizedUrl } from "utils/routerUtils";
import { PageType, SupportedLanguages } from "types/enums";

const useCartByLink = ({
  fetchSessionData,
  activeLocale,
  savedCartId,
}: {
  fetchSessionData: () => void;
  activeLocale: SupportedLanguages;
  savedCartId?: string;
}) => {
  const router = useRouter();

  const [createCart] = useMutation<
    CartTypes.CreateCartByLinkResponse,
    CartTypes.CreateCartByLinkParams
  >(CreateCartMutation, {
    onCompleted: () => {
      fetchSessionData();
      router.push({
        pathname: `${constructLocalizedUrl(window.location.host, activeLocale)}/${PageType.CART}`,
        query: {},
      });
    },
  });

  useEffect(() => {
    if (savedCartId) {
      createCart({
        variables: {
          input: {
            linkId: savedCartId,
          },
        },
      });
    }
  }, [createCart, savedCartId]);
};

export default useCartByLink;
