/* global google */
/* eslint-disable no-param-reassign, functional/immutable-data */

/* This component has been inspired by
 * - the source code of infobox from the google maps utility library
 * - https://github.com/nmccready/google-maps-utility-library-v3-infobox/blob/master/src/infobox.js
 * and most of the code has been take from this project:
 * - https://github.com/JustFly1984/react-google-maps-api/blob/adf167d5840c6bfb8b513b780486511a0c8b8085/packages/react-google-maps-api-infobox/src/InfoBox.tsx
 * */

export interface InfoBoxOptions {
  // The geographic location at which to display the InfoBox.
  position?: google.maps.LatLng;
  // The offset (in pixels) from the top left corner of the InfoBox
  // (or the bottom left corner if the alignBottom property is true)
  // to the map pixel corresponding to position.
  pixelOffset?: google.maps.Size;
  // Place center of InfoBox above position. This override x offset of pixelOffset option.
  alignCenter?: boolean;
  // The geographic location at which to display the InfoBox.
  alignBottom?: boolean;
  // [boxClass="infoBox"] The name of the CSS class defining the styles for the InfoBox container.
  // Redraw InfoBox if position of the marker is changed.
  trackAnchorPosition?: boolean;
  boxClass?: string;
  // [boxStyle] An object literal whose properties define specific CSS
  // style values to be applied to the InfoBox. Style values defined here override those that may
  // be defined in the boxClass style sheet. If this property is changed after the
  // InfoBox has been created, all previously set styles (except those defined in the style sheet)
  // are removed from the InfoBox before the new style values are applied.
  boxStyle?: {
    [key: string]: any;
  };
  // The CSS margin style value for the close box.
  // The default is "2px" (a 2-pixel margin on all sides).
  closeBoxMargin?: string;
  // The URL of the image representing the close box.
  // Note: The default is the URL for Google's standard close box.
  closeBoxURL?: string;
  // The content of the InfoBox (plain text or an HTML DOM node).
  content?: string | Node;
  // Disable auto-pan on open().
  disableAutoPan?: boolean;
  // Propagate mousedown, mousemove, mouseover, mouseout,
  // mouseup, click, dblclick, touchstart, touchend, touchmove, and contextmenu events in the InfoBox
  // (default is false to mimic the behavior of a google.maps.InfoWindow). Set
  // this property to true if the InfoBox is being used as a map label.
  enableEventPropagation?: boolean;
  // Minimum offset (in pixels) from the InfoBox to the
  // map edge after an auto-pan.
  infoBoxClearance?: google.maps.Size;
  // [isHidden=false] Hide the InfoBox on open.
  // [Deprecated in favor of the visible property.]
  isHidden?: boolean;
  // The maximum width (in pixels) of the InfoBox. Set to 0 if no maximum.
  maxWidth?: number;
  // The pane where the InfoBox is to appear (default is "floatPane").
  // Set the pane to "mapPane" if the InfoBox is being used as a map label.
  // Valid pane names are the property names for the google.maps.MapPanes object.
  pane?: string;
  // Show the InfoBox on open.
  visible?: boolean;
  // The CSS z-index style value for the InfoBox.
  zIndex?: number;
}

class InfoBox {
  content: string | Node;

  disableAutoPan: boolean;

  maxWidth: number;

  pixelOffset: google.maps.Size;

  position: google.maps.LatLng;

  zIndex: number | undefined | null;

  boxClass: string;

  boxStyle: {
    [key: string]: any;
  };

  closeBoxMargin: string;

  closeBoxURL: string;

  infoBoxClearance: google.maps.Size;

  isHidden: boolean;

  alignBottom: boolean;

  alignCenter: boolean;

  trackAnchorPosition: boolean;

  pane: string;

  enableEventPropagation: boolean;

  div: HTMLDivElement | null;

  closeListener: google.maps.MapsEventListener | null;

  moveListener: google.maps.MapsEventListener | null;

  mapListener: google.maps.MapsEventListener | null;

  contextListener: google.maps.MapsEventListener | null;

  eventListeners: google.maps.MapsEventListener[] | null;

  fixedWidthSet: boolean | null;

  constructor(argumentOptions: InfoBoxOptions = {}) {
    this.extend(InfoBox, google.maps.OverlayView);

    const options = { ...argumentOptions };
    // Standard options (in common with google.maps.InfoWindow):
    this.content = options.content || "";
    this.disableAutoPan = options.disableAutoPan || false;
    this.maxWidth = options.maxWidth || 0;
    this.pixelOffset = options.pixelOffset || new google.maps.Size(0, 0);
    this.position = options.position || new google.maps.LatLng(0, 0);
    this.zIndex = options.zIndex || null;

    // Additional options (unique to InfoBox):
    this.boxClass = options.boxClass || "infoBox";
    this.boxStyle = options.boxStyle || {};
    this.closeBoxMargin = options.closeBoxMargin || "2px";
    this.closeBoxURL = options.closeBoxURL || "http://www.google.com/intl/en_us/mapfiles/close.gif";
    if (options.closeBoxURL === "") {
      this.closeBoxURL = "";
    }
    this.infoBoxClearance = options.infoBoxClearance || new google.maps.Size(1, 1);

    if (typeof options.visible === "undefined") {
      if (typeof options.isHidden === "undefined") {
        options.visible = true;
      } else {
        options.visible = !options.isHidden;
      }
    }
    this.isHidden = !options.visible;

    this.alignBottom = options.alignBottom || false;
    this.alignCenter = options.alignCenter || false;
    this.trackAnchorPosition = options.trackAnchorPosition || false;
    this.pane = options.pane || "floatPane";
    this.enableEventPropagation = options.enableEventPropagation || false;

    this.div = null;
    this.closeListener = null;
    this.moveListener = null;
    this.mapListener = null;
    this.contextListener = null;
    this.eventListeners = null;
    this.fixedWidthSet = null;
  }

  createInfoBoxDiv(): void {
    // This handler prevents an event in the InfoBox from being passed on to the map.
    function cancelHandler(event: Event) {
      event.cancelBubble = true;
      if (event.stopPropagation) {
        event.stopPropagation();
      }
    }

    // This handler ignores the current event in the InfoBox and conditionally prevents
    // the event from being passed on to the map. It is used for the contextmenu event.
    const ignoreHandler = (event: Event) => {
      event.returnValue = false;

      if (event.preventDefault) {
        event.preventDefault();
      }

      if (!this.enableEventPropagation) {
        cancelHandler(event);
      }
    };

    if (!this.div) {
      this.div = document.createElement("div");
      this.setBoxStyle();

      if (typeof this.content === "string") {
        this.div.innerHTML = this.getCloseBoxImg() + this.content;
      } else {
        this.div.innerHTML = this.getCloseBoxImg();
        this.div.appendChild(this.content);
      }

      // @ts-ignore getPanes doesn't exists in the class InfoBox
      const panes = this.getPanes();
      panes[this.pane].appendChild(this.div); // Add the InfoBox div to the DOM

      this.addClickHandler();

      if (this.div.style.width) {
        this.fixedWidthSet = true;
      } else if (this.maxWidth !== 0 && this.div.offsetWidth > this.maxWidth) {
        this.div.style.width = `${this.maxWidth}px`;
        this.fixedWidthSet = true;
      } else {
        // The following code is needed to overcome problems with MSIE
        const bw = this.getBoxWidths();
        this.div.style.width = `${this.div.offsetWidth - bw.left - bw.right}px`;
        this.fixedWidthSet = false;
      }

      this.panBox(this.disableAutoPan);

      if (!this.enableEventPropagation) {
        this.eventListeners = [];

        // Cancel event propagation.
        // Note: mousemove not included (to resolve Issue 152)
        const events = [
          "mousedown",
          "mouseover",
          "mouseout",
          "mouseup",
          "click",
          "dblclick",
          "touchstart",
          "touchend",
          "touchmove",
        ];

        for (let i = 0; i < events.length; i += 1) {
          this.eventListeners.push(
            google.maps.event.addDomListener(this.div, events[i], cancelHandler)
          );
        }

        // Workaround for Google bug that causes the cursor to change to a pointer
        // when the mouse moves over a marker underneath InfoBox.
        this.eventListeners.push(
          google.maps.event.addDomListener(this.div, "mouseover", () => {
            if (this.div) {
              this.div.style.cursor = "default";
            }
          })
        );
      }

      this.contextListener = google.maps.event.addDomListener(
        this.div,
        "contextmenu",
        ignoreHandler
      );

      /**
       * This event is fired when the DIV containing the InfoBox's content is attached to the DOM.
       * @name InfoBox#domready
       * @event
       */
      google.maps.event.trigger(this, "domready");
    }
  }

  getCloseBoxImg(): string {
    let img = "";

    if (this.closeBoxURL !== "") {
      img = "<img";
      img += ` src='${this.closeBoxURL}'`;
      img += " align=right"; // Do this because Opera chokes on style='float: right;'
      img += " style='";
      img += " position: relative;"; // Required by MSIE
      img += " cursor: pointer;";
      img += ` margin: ${this.closeBoxMargin};`;
      img += "'>";
    }

    return img;
  }

  addClickHandler(): void {
    if (this.div && this.div.firstChild && this.closeBoxURL !== "") {
      const closeBox = this.div.firstChild;
      this.closeListener = google.maps.event.addDomListener(
        closeBox,
        "click",
        this.getCloseClickHandler()
      );
    } else {
      this.closeListener = null;
    }
  }

  getCloseClickHandler() {
    return (event: Event) => {
      // 1.0.3 fix: Always prevent propagation of a close box click to the map:
      event.cancelBubble = true;

      if (event.stopPropagation) {
        event.stopPropagation();
      }

      /**
       * This event is fired when the InfoBox's close box is clicked.
       * @name InfoBox#closeclick
       * @event
       */
      google.maps.event.trigger(this, "closeclick");

      this.close();
    };
  }

  panBox(disablePan?: boolean): void {
    if (this.div && !disablePan) {
      // @ts-ignore
      const map:
        | google.maps.Map
        | google.maps.StreetViewPanorama
        | null
        // @ts-ignore
        | undefined = this.getMap();

      // Only pan if attached to map, not panorama
      if (map instanceof google.maps.Map) {
        let xOffset = 0;
        let yOffset = 0;

        const bounds = map.getBounds();
        if (bounds && !bounds.contains(this.position)) {
          // Marker not in visible area of map, so set center
          // of map to the marker position first.
          map.setCenter(this.position);
        }

        const mapDiv = map.getDiv();
        // @ts-ignore
        const mapWidth = mapDiv.offsetWidth;
        // @ts-ignore
        const mapHeight = mapDiv.offsetHeight;
        let iwOffsetX = this.pixelOffset.width;
        const iwOffsetY = this.pixelOffset.height;
        const iwWidth = this.div.offsetWidth;
        const iwHeight = this.div.offsetHeight;
        const padX = this.infoBoxClearance.width;
        const padY = this.infoBoxClearance.height;

        if (this.alignCenter) {
          iwOffsetX = -(iwWidth / 2);
        }

        // @ts-ignore
        const projection: google.maps.MapCanvasProjection = this.getProjection();
        const pixPosition = projection.fromLatLngToContainerPixel(this.position);

        if (pixPosition.x < -iwOffsetX + padX) {
          xOffset = pixPosition.x + iwOffsetX - padX;
        } else if (pixPosition.x + iwWidth + iwOffsetX + padX > mapWidth) {
          xOffset = pixPosition.x + iwWidth + iwOffsetX + padX - mapWidth;
        }
        if (this.alignBottom) {
          if (pixPosition.y < -iwOffsetY + padY + iwHeight) {
            yOffset = pixPosition.y + iwOffsetY - padY - iwHeight;
          } else if (pixPosition.y + iwOffsetY + padY > mapHeight) {
            yOffset = pixPosition.y + iwOffsetY + padY - mapHeight;
          }
        } else if (pixPosition.y < -iwOffsetY + padY) {
          yOffset = pixPosition.y + iwOffsetY - padY;
        } else if (pixPosition.y + iwHeight + iwOffsetY + padY > mapHeight) {
          yOffset = pixPosition.y + iwHeight + iwOffsetY + padY - mapHeight;
        }

        if (!(xOffset === 0 && yOffset === 0)) {
          // Move the map to the shifted center.
          map.panBy(xOffset, yOffset);
        } else {
          this.draw();
        }
      }
    }
  }

  setBoxStyle(): void {
    if (this.div) {
      // Apply style values from the style sheet defined in the boxClass parameter:
      this.div.className = this.boxClass;

      // Clear existing inline style values:
      this.div.style.cssText = "";

      // Apply style values defined in the boxStyle parameter:
      const { boxStyle } = this;
      // eslint-disable-next-line no-restricted-syntax
      for (const i in boxStyle) {
        // eslint-disable-next-line no-prototype-builtins
        if (boxStyle.hasOwnProperty(i)) {
          // @ts-ignore
          this.div.style[i] = boxStyle[i];
        }
      }

      // Fix for iOS disappearing InfoBox problem
      // See http://stackoverflow.com/questions/9229535/google-maps-markers-disappear-at-certain-zoom-level-only-on-iphone-ipad
      this.div.style.webkitTransform = "translateZ(0)";

      // Fix up opacity style for benefit of MSIE
      if (typeof this.div.style.opacity !== "undefined" && this.div.style.opacity !== "") {
        // See http://www.quirksmode.org/css/opacity.html
        const opacity = parseFloat(this.div.style.opacity || "");

        // @ts-ignore
        this.div.style.msFilter = `"progid:DXImageTransform.Microsoft.Alpha(Opacity=${
          opacity * 100
        })"`;
        this.div.style.filter = `alpha(opacity=${opacity * 100})`;
      }

      // Apply required styles
      this.div.style.position = "absolute";
      this.div.style.visibility = "hidden";
      if (this.zIndex !== null) {
        this.div.style.zIndex = `${this.zIndex}`;
      }
      if (!this.div.style.overflow) {
        this.div.style.overflow = "auto";
      }
    }
  }

  getBoxWidths(): { bottom: number; left: number; right: number; top: number } {
    const bw = { top: 0, bottom: 0, left: 0, right: 0 };

    if (!this.div) {
      return bw;
    }

    if (document.defaultView && document.defaultView.getComputedStyle) {
      const { ownerDocument } = this.div;
      const computedStyle =
        ownerDocument && ownerDocument.defaultView
          ? ownerDocument.defaultView.getComputedStyle(this.div, "")
          : null;

      if (computedStyle) {
        // The computed styles are always in pixel units (good!)
        bw.top = parseInt(computedStyle.borderTopWidth || "", 10) || 0;
        bw.bottom = parseInt(computedStyle.borderBottomWidth || "", 10) || 0;
        bw.left = parseInt(computedStyle.borderLeftWidth || "", 10) || 0;
        bw.right = parseInt(computedStyle.borderRightWidth || "", 10) || 0;
      }
    } else if (
      // @ts-ignore
      document.documentElement.currentStyle // MSIE
    ) {
      // @ts-ignore
      const { currentStyle } = this.div;

      if (currentStyle) {
        // The current styles may not be in pixel units, but assume they are (bad!)
        bw.top = parseInt(currentStyle.borderTopWidth || "", 10) || 0;
        bw.bottom = parseInt(currentStyle.borderBottomWidth || "", 10) || 0;
        bw.left = parseInt(currentStyle.borderLeftWidth || "", 10) || 0;
        bw.right = parseInt(currentStyle.borderRightWidth || "", 10) || 0;
      }
    }

    return bw;
  }

  onRemove(): void {
    if (this.div && this.div.parentNode) {
      this.div.parentNode.removeChild(this.div);
      this.div = null;
    }
  }

  draw(): void {
    this.createInfoBoxDiv();

    if (this.div) {
      // @ts-ignore
      const projection: google.maps.MapCanvasProjection = this.getProjection();
      const pixPosition = projection.fromLatLngToDivPixel(this.position);

      let pixelOffsetX = this.pixelOffset.width;
      if (this.alignCenter) {
        pixelOffsetX = -(this.div.offsetWidth / 2);
      }
      this.div.style.left = `${pixPosition.x + pixelOffsetX}px`;

      if (this.alignBottom) {
        this.div.style.bottom = `${-(pixPosition.y + this.pixelOffset.height)}px`;
      } else {
        this.div.style.top = `${pixPosition.y + this.pixelOffset.height}px`;
      }

      if (this.isHidden) {
        this.div.style.visibility = "hidden";
      } else {
        this.div.style.visibility = "visible";
      }
    }
  }

  setOptions(options: InfoBoxOptions = {}): void {
    if (typeof options.boxClass !== "undefined") {
      // Must be first
      this.boxClass = options.boxClass;
      this.setBoxStyle();
    }
    if (typeof options.boxStyle !== "undefined") {
      // Must be second
      this.boxStyle = options.boxStyle;
      this.setBoxStyle();
    }
    if (typeof options.content !== "undefined") {
      this.setContent(options.content);
    }
    if (typeof options.disableAutoPan !== "undefined") {
      this.disableAutoPan = options.disableAutoPan;
    }
    if (typeof options.maxWidth !== "undefined") {
      this.maxWidth = options.maxWidth;
    }
    if (typeof options.pixelOffset !== "undefined") {
      this.pixelOffset = options.pixelOffset;
    }
    if (typeof options.alignBottom !== "undefined") {
      this.alignBottom = options.alignBottom;
    }
    if (typeof options.position !== "undefined") {
      this.setPosition(options.position);
    }
    if (typeof options.zIndex !== "undefined") {
      this.setZIndex(options.zIndex);
    }
    if (typeof options.closeBoxMargin !== "undefined") {
      this.closeBoxMargin = options.closeBoxMargin;
    }
    if (typeof options.closeBoxURL !== "undefined") {
      this.closeBoxURL = options.closeBoxURL;
    }
    if (typeof options.infoBoxClearance !== "undefined") {
      this.infoBoxClearance = options.infoBoxClearance;
    }
    if (typeof options.isHidden !== "undefined") {
      this.isHidden = options.isHidden;
    }
    if (typeof options.visible !== "undefined") {
      this.isHidden = !options.visible;
    }
    if (typeof options.enableEventPropagation !== "undefined") {
      this.enableEventPropagation = options.enableEventPropagation;
    }

    if (this.div) {
      this.draw();
    }
  }

  setContent(content: string | Node): void {
    this.content = content;

    if (this.div) {
      if (this.closeListener) {
        google.maps.event.removeListener(this.closeListener);
        this.closeListener = null;
      }

      // Odd code required to make things work with MSIE.
      if (!this.fixedWidthSet) {
        this.div.style.width = "";
      }

      this.div.appendChild(content as Node);

      this.addClickHandler();
    }

    /**
     * This event is fired when the content of the InfoBox changes.
     * @name InfoBox#content_changed
     * @event
     */
    google.maps.event.trigger(this, "content_changed");
  }

  setPosition(latLng: google.maps.LatLng): void {
    this.position = latLng;

    if (this.div) {
      this.draw();
    }

    /**
     * This event is fired when the position of the InfoBox changes.
     * @name InfoBox#position_changed
     * @event
     */
    google.maps.event.trigger(this, "position_changed");
  }

  setVisible(isVisible: boolean): void {
    this.isHidden = !isVisible;
    if (this.div) {
      this.div.style.visibility = this.isHidden ? "hidden" : "visible";
    }
  }

  setZIndex(index: number): void {
    this.zIndex = index;

    if (this.div) {
      this.div.style.zIndex = `${index}`;
    }

    /**
     * This event is fired when the zIndex of the InfoBox changes.
     * @name InfoBox#zindex_changed
     * @event
     */
    google.maps.event.trigger(this, "zindex_changed");
  }

  getContent(): string | Node {
    return this.content;
  }

  getPosition(): google.maps.LatLng {
    return this.position;
  }

  getZIndex(): number | null | undefined {
    return this.zIndex;
  }

  getVisible(): boolean {
    const map:
      | google.maps.Map
      | google.maps.StreetViewPanorama
      | null
      // @ts-ignore
      | undefined = this.getMap();
    let isVisible;

    if (typeof map === "undefined" || map === null) {
      isVisible = false;
    } else {
      isVisible = !this.isHidden;
    }

    return isVisible;
  }

  show(): void {
    this.isHidden = false;
    if (this.div) {
      this.div.style.visibility = "visible";
    }
  }

  hide(): void {
    this.isHidden = true;
    if (this.div) {
      this.div.style.visibility = "hidden";
    }
  }

  open(
    map: google.maps.Map | google.maps.StreetViewPanorama,
    anchor?: google.maps.MVCObject
  ): void {
    if (anchor) {
      // @ts-ignore
      this.position = anchor.getPosition();

      if (this.trackAnchorPosition) {
        this.moveListener = google.maps.event.addListener(anchor, "position_changed", () => {
          // @ts-ignore
          const position = anchor.getPosition();
          this.setPosition(position);
        });
      }

      this.mapListener = google.maps.event.addListener(anchor, "map_changed", () => {
        // @ts-ignore
        this.setMap(anchor.map);
      });
    }

    // @ts-ignore
    this.setMap(map);

    if (this.div) {
      this.panBox();
    }
  }

  close() {
    if (this.closeListener) {
      google.maps.event.removeListener(this.closeListener);
      this.closeListener = null;
    }

    if (this.eventListeners) {
      for (let i = 0; i < this.eventListeners.length; i += 1) {
        google.maps.event.removeListener(this.eventListeners[i]);
      }
      this.eventListeners = null;
    }

    if (this.moveListener) {
      google.maps.event.removeListener(this.moveListener);
      this.moveListener = null;
    }

    if (this.mapListener) {
      google.maps.event.removeListener(this.mapListener);
      this.mapListener = null;
    }

    if (this.contextListener) {
      google.maps.event.removeListener(this.contextListener);
      this.contextListener = null;
    }

    // @ts-ignore
    this.setMap(null);
  }

  /* Use to check whether or not InfoBox bounds contains provided point */
  contains(point: google.maps.LatLng): boolean {
    if (!this.div) {
      return false;
    }

    // @ts-ignore
    const projection: google.maps.MapCanvasProjection = this.getProjection();
    const markerPosition = projection.fromLatLngToDivPixel(this.position);

    const { offsetWidth: divWidth, offsetHeight: divHeight } = this.div;

    let pixelOffsetX = this.pixelOffset.width;
    if (this.alignCenter) {
      pixelOffsetX = -(divWidth / 2);
    }
    const leftBottomDivXPosition = markerPosition.x + pixelOffsetX;
    const leftBottomDivYPosition = this.alignBottom
      ? markerPosition.y + this.pixelOffset.height
      : markerPosition.y + this.pixelOffset.height + divHeight;

    const swPointOfDiv = new google.maps.Point(leftBottomDivXPosition, leftBottomDivYPosition);
    const nePointOfDiv = new google.maps.Point(
      leftBottomDivXPosition + divWidth,
      leftBottomDivYPosition - divHeight
    );
    const swLatLng = projection.fromDivPixelToLatLng(swPointOfDiv);
    const neLatLng = projection.fromDivPixelToLatLng(nePointOfDiv);

    // get bounds of InfoBox
    const divBounds = new google.maps.LatLngBounds(swLatLng, neLatLng);
    const isDivContainsPoint = divBounds.contains(point);
    if (isDivContainsPoint) {
      return true;
    }

    return false;
  }

  // eslint-disable-next-line class-methods-use-this
  extend(obj1: any, obj2: any): any {
    return function applyExtend(object: any) {
      // eslint-disable-next-line guard-for-in, no-restricted-syntax
      for (const property in object.prototype) {
        // @ts-ignore
        // eslint-disable-next-line no-prototype-builtins
        if (!this.prototype.hasOwnProperty(property)) {
          // @ts-ignore
          this.prototype[property] = object.prototype[property];
        }
      }

      // @ts-ignore
      return this;
    }.apply(obj1, [obj2]);
  }
}

export default InfoBox;
