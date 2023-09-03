/* eslint-disable no-underscore-dangle */
/* eslint-disable functional/immutable-data */
// eslint-disable-next-line func-names
(function preventPwaInstall() {
  window._travelshift = window._travelshift || {};
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    window._travelshift.pwaInstallEvent = e;
  });
})();
