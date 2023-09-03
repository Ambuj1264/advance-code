import { useQuery } from "@apollo/react-hooks";

import UserCardsQuery from "../queries/UserCardsQuery.graphql";
import { QuerySavedCards } from "../types/savedCardsTypes";

import { noCacheHeaders } from "utils/apiUtils";

const useSavedCardsQuery = (
  setSavedCards: React.Dispatch<React.SetStateAction<CartTypes.QuerySaltPaySavedCard[]>>
) => {
  const {
    data: cardData,
    loading: cardDataLoading,
    error: cardDataError,
  } = useQuery<QuerySavedCards>(UserCardsQuery, {
    context: {
      headers: noCacheHeaders,
    },
    onCompleted: response => {
      setSavedCards(response.userCards.savedCards ?? []);
    },
  });
  return {
    cardData,
    cardDataLoading,
    cardDataError,
  };
};

export default useSavedCardsQuery;
