import { useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { ApolloError } from "apollo-client";

import ConnectCartToPackageMutation from "./graphql/ConnectCartToPackageMutation.graphql";
import FetchPackageListQuery from "./graphql/FetchPackageListQuery.graphql";
import FetchPackageDetailsQuery from "./graphql/FetchPackageDetailsQuery.graphql";
import { constructSimilarPackagesList, createPackageDetailSections } from "./utils";

import { monolithAuthVerificationHeaders } from "utils/apiUtils";

const useConnectCartToPackage = () => {
  const [searchTerm, setSearchTerm] = useState<string>();
  const [connectToPackageError, setConnectToPackageError] = useState<ApolloError>();

  const [connectCartToPackage, { loading: isConnectToPackageLoading, data: connectToPackageData }] =
    useMutation<
      {
        connectCartToPackage: {
          success: boolean;
          refusalReason?: string;
        };
      },
      CartTypes.ConnectCartToPackageParams
    >(ConnectCartToPackageMutation, {
      context: {
        headers: monolithAuthVerificationHeaders,
      },
      onError: err => setConnectToPackageError(err),
      onCompleted: mutationData => {
        if (!mutationData?.connectCartToPackage?.success) {
          const { refusalReason } =
            mutationData?.connectCartToPackage ||
            "Mutation returned 'success: false'. No refusalReason received";
          setConnectToPackageError({
            message: refusalReason,
          } as ApolloError);
        }
      },
    });

  const [
    fetchSimilarPackages,
    {
      data: fetchSimilarPackagesData,
      loading: isFetchSimilarPackagesLoading,
      error: fetchSimilarPackagesError,
    },
  ] = useLazyQuery<{
    packageOrderTours: SharedTypes.AutocompleteItem[];
  }>(FetchPackageListQuery, {
    fetchPolicy: "no-cache",
  });

  const [
    fetchPackageDetails,
    {
      data: fetchPackageDetailsData,
      loading: isFetchPackageDetailsLoading,
      error: fetchPackageDetailsError,
    },
  ] = useLazyQuery<{ bookingInfo: CartTypes.ChosenPackageDetails }>(FetchPackageDetailsQuery, {
    fetchPolicy: "no-cache",
  });

  const fetchSimilarPackageList = (searchString: string) => {
    setSearchTerm(searchString ?? "");
    fetchSimilarPackages({
      variables: { term: searchString ?? "" },
    });
  };

  const fetchSelectedPackageDetails = (packageId: string) => {
    setSearchTerm(`T-${packageId}`);
    fetchPackageDetails({
      variables: { id: Number(packageId) },
    });
  };

  const connectToPackage = (packageId: string) => {
    if (packageId?.length) {
      connectCartToPackage({
        variables: {
          input: { packageId },
        },
      });
    }
  };

  const resetMutationError = () => {
    setConnectToPackageError(undefined);
  };

  const selectedPackageDetails = createPackageDetailSections(fetchPackageDetailsData?.bookingInfo);
  const similarPackagesList = constructSimilarPackagesList(
    fetchSimilarPackagesData?.packageOrderTours
  );

  return {
    connectToPackage,
    connectToPackageError,
    isConnectToPackageLoading,
    fetchSimilarPackageList,
    similarPackagesList,
    fetchSimilarPackagesError,
    isFetchSimilarPackagesLoading,
    fetchSelectedPackageDetails,
    selectedPackageDetails,
    fetchPackageDetailsError,
    isFetchPackageDetailsLoading,
    onDismissConnectToPackageError: resetMutationError,
    isConnectToPackageSuccessful: connectToPackageData?.connectCartToPackage?.success || false,
    searchTerm,
  };
};

export default useConnectCartToPackage;
