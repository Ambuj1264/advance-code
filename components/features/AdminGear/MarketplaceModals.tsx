import React from "react";

import ConnectPackageModal from "./ConnectPackageModal";
import useConnectCartToPackage from "./useConnectCartToPackage";

const MarketplaceModals = ({
  onRefetchCartData,
  isConnectPkgModalOpen,
  toggleConnectPkgModal,
}: {
  onRefetchCartData: () => void;
  isConnectPkgModalOpen: boolean;
  toggleConnectPkgModal: () => void;
}) => {
  const {
    connectToPackageError,
    connectToPackage,
    isConnectToPackageLoading,
    fetchSimilarPackageList,
    similarPackagesList,
    fetchSimilarPackagesError,
    searchTerm,
    selectedPackageDetails,
    fetchSelectedPackageDetails,
    isFetchPackageDetailsLoading,
    isFetchSimilarPackagesLoading,
    fetchPackageDetailsError,
    onDismissConnectToPackageError,
    isConnectToPackageSuccessful,
  } = useConnectCartToPackage();

  if (!isConnectPkgModalOpen) return null;
  return (
    <ConnectPackageModal
      onToggleModal={toggleConnectPkgModal}
      connectToPackage={connectToPackage}
      isLoading={isConnectToPackageLoading}
      connectToPackageError={connectToPackageError}
      similarPackageList={similarPackagesList}
      fetchSimilarPackageList={fetchSimilarPackageList}
      fetchSimilarPackagesError={fetchSimilarPackagesError}
      fetchSelectedPackageDetails={fetchSelectedPackageDetails}
      selectedPackageDetails={selectedPackageDetails}
      previousSearchTerm={searchTerm}
      isFetchPackageDetailsLoading={isFetchPackageDetailsLoading}
      isFetchSimilarPackagesLoading={isFetchSimilarPackagesLoading}
      fetchPackageDetailsError={fetchPackageDetailsError}
      onDismissConnectToPackageError={onDismissConnectToPackageError}
      isConnectToPackageSuccessful={isConnectToPackageSuccessful}
      onRefetchCartData={onRefetchCartData}
    />
  );
};

export default MarketplaceModals;
