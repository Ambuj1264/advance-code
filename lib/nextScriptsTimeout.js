/* eslint-disable functional/immutable-data, no-console, no-underscore-dangle, camelcase, no-var,vars-on-top,prefer-template */
// this file isn't transpiled

(function nextScriptsTimeout() {
  if (!window.chunkedScripts) return;

  var timeout;
  // eslint-disable-next-line no-undef
  var scriptsCount =
    window.chunkedScripts.filter(function filterNoModuleScripts(script) {
      return script.props && !script.props.noModule;
    }).length - 1;
  var scriptsLoadedCount = 0;
  var scriptsInjected = false;
  var clickEventNode;
  var loadingClassName = "chunked-scripts-loading";

  function isMobile() {
    var match = window.matchMedia || window.msMatchMedia;
    var mq;
    if (match) {
      mq = match("(pointer:coarse)");
      return mq.matches || window.innerWidth <= 900;
    }
    return false;
  }

  function injectScripts() {
    if (scriptsInjected) return;

    // chunkedScripts var gets passed from CustomNextScript
    // eslint-disable-next-line no-undef
    window.chunkedScripts.forEach(function handleScript(script) {
      if (!script || !script.props) return;
      try {
        // eslint-disable-next-line vars-on-top
        var scriptTag = document.createElement("script");

        // eslint-disable-next-line no-restricted-syntax
        for (var key in script.props) {
          if (Object.prototype.hasOwnProperty.call(script.props, key)) {
            scriptTag[key] = script.props[key];
          }
        }
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        scriptTag.onload = scriptLoadHandler;

        if (script.content) scriptTag.innerHTML = script.content;
        document.body.appendChild(scriptTag);
      } catch (err) {
        console.log(err);
      }
    });

    scriptsInjected = true;
  }

  function scriptLoadHandler() {
    if (scriptsLoadedCount !== scriptsCount) {
      scriptsLoadedCount += 1;
      return;
    }

    if (clickEventNode && document.body.contains(clickEventNode)) {
      requestAnimationFrame(() => {
        clickEventNode.dispatchEvent(new Event("click", { bubbles: true }));
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    removeListeners();
  }

  var suppressedEvents = ["keydown", "keyup", "keypress", "change"];
  var windowEvents = ["touchstart", "scroll", "keypress", "resize"];

  function suppressDefault(e) {
    e.preventDefault();
  }

  function onClickHandler(event) {
    if (event.target.offsetParent) {
      clickEventNode = event.target;
      clickEventNode.classList.add(loadingClassName);
      // disable default behavior (input typing etc)
      suppressedEvents.forEach(function addListener(e) {
        clickEventNode.addEventListener(e, suppressDefault);
      });
    }
  }

  function getDelayScriptTimeout() {
    var scriptDelay = 2300;

    // eslint-disable-next-line prefer-destructuring
    var page = window._travelshift.page;

    // Temporary fix
    if (page === "gteCarSearch") {
      scriptDelay = 3300;
    } else if (page === "flightSearch") {
      scriptDelay = 3500;
    } else if (window.location.href.indexOf("guidetoeurope") !== -1) {
      scriptDelay = 2700;
    }

    return scriptDelay;
  }

  function addListeners() {
    if (window.pageYOffset > 0) injectScripts(); // if page is scrolled down, it's a refresh
    if (!isMobile()) injectScripts(); // load everything for desktop without delays
    if (window.location.hash !== "") injectScripts(); // it's likely transition from AMP page

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    window.addEventListener("DOMContentLoaded", event => {
      timeout = setTimeout(injectScripts, getDelayScriptTimeout());
    });

    // load scripts immediately if we have more than 1 query param
    if (
      typeof window.URLSearchParams !== "undefined" &&
      Array.from(new URLSearchParams(window.location.search)).length > 1
    ) {
      injectScripts();
    }

    window.addEventListener("click", onClickHandler);
    windowEvents.forEach(function addListener(e) {
      window.addEventListener(e, injectScripts);
    });
  }

  function removeSuppressHandlers(event) {
    if (!event.target) return;

    suppressedEvents.forEach(function removeListener(e) {
      // setTimeout(function waitBeforeRemovingListeners() {
      event.target.removeEventListener(e, suppressDefault);
      // }, 1000);
    });
    event.target.removeEventListener("blur", removeSuppressHandlers);
  }

  function removeListeners() {
    clearTimeout(timeout);
    window.removeEventListener("click", onClickHandler);
    windowEvents.forEach(function removeListener(e) {
      window.removeEventListener(e, injectScripts);
    });
    Array.from(document.querySelectorAll("." + loadingClassName)).forEach(el => {
      el.classList.remove(loadingClassName);
      el.addEventListener("blur", removeSuppressHandlers);
    });
  }

  addListeners();
})();
