import { useMemo } from "react";

import useQueryClient from "./useQueryClient";

import activeGTEUserQuery from "components/queries/GTEActiveUserQuery.graphql";
import activeUserQuery from "components/queries/ActiveUserQuery.graphql";
import { constructGTEUser, constructUser } from "utils/globalUtils";
import { noCacheHeaders } from "utils/apiUtils";
import { useSettings } from "contexts/SettingsContext";
import { Marketplace } from "types/enums";

const useSession = (marketplaceArg?: Marketplace, skip = false) => {
  const { marketplace: marketplaceContext } = useSettings();
  const marketplace = marketplaceArg || marketplaceContext;
  const isGTE = marketplace === Marketplace.GUIDE_TO_EUROPE;

  const {
    data,
    loading,
    error,
    refetch: GTIRefetch,
  } = useQueryClient<QueryActiveUserData>(activeUserQuery, {
    skip: skip || isGTE,
    context: {
      headers: noCacheHeaders,
    },
  });

  const {
    data: GTEData,
    loading: GTEUserLoading,
    error: GTEError,
    refetch: GTEUserRefetch,
  } = useQueryClient<ActiveGTEUserQuery>(activeGTEUserQuery, {
    skip: skip || !isGTE,
    context: {
      headers: noCacheHeaders,
    },
    errorPolicy: "all",
  });
  const cart = isGTE
    ? GTEData && {
        totalItemsQuantity: GTEData.cartItemCount,
      }
    : data && {
        totalItemsQuantity: data.cartItemCount,
      };

  const queryCompleted = isGTE ? !GTEUserLoading : Boolean(!loading && !error);
  const isLoading = isGTE ? GTEUserLoading : loading;
  const monolithUser = useMemo(
    () => (!isGTE && data ? constructUser(data.activeUser) : undefined),
    [data, isGTE]
  );
  const auth0User = useMemo(
    () => (isGTE && !GTEError && GTEData?.userProfile ? constructGTEUser(GTEData) : undefined),
    [GTEData, GTEError, isGTE]
  );
  const user = isGTE ? auth0User : monolithUser;
  const refetch = isGTE ? GTEUserRefetch : GTIRefetch;

  return {
    user,
    cart,
    queryCompleted: skip ? false : queryCompleted,
    refetch,
    isLoading: skip ? false : isLoading,
  };
};

export default useSession;
