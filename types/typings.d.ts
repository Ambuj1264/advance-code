declare module "*.svg";
declare module "*.graphql";
declare module "*.css";

declare module "react-imgix";
declare module "isomorphic-style-loader/withStyles";
declare module "isomorphic-style-loader/useStyles";
declare module "isomorphic-style-loader/StyleContext";
declare module "react-select";
type classnamesFnType = string | { [className: string]: boolean };
declare module "*.scss" {
  const content: {
    (...args: classnamesFnType[]): string;
    [className: string]: string;
  };
  export default content;
}

declare module "react-facebook";

declare module "react-day-picker";

declare module "@types/react-slider";

declare module "facepaint";

declare module "react-structured-data";

declare module "react-responsive";

declare module "@storybook/addon-knobs";

declare module "react-lazy-hydration";

declare module "lodash.deburr";

declare module "jest-next-dynamic";

declare module "sha384";

declare module "nano-memoize";

// Declare OverlappingMarkerSpiderfier class separately because we
// are importing this class dynamically and want to use it's types
// out of dynamic import scope
declare module "overlapping-marker-spiderfier";
declare namespace OverlappingMarkerSpiderfierLib {
  type Options = {
    [key: string]: string | number | boolean;
  };
  export declare class OverlappingMarkerSpiderfier<MarkerType> {
    constructor(map: google.maps.Map, options: Options): void;

    addMarker: (marker: google.maps.Marker) => void;

    addListener: (eventName: "click", handler: (marker: MarkerType) => void) => void;

    removeListener: (eventName: "click", handler: (marker: MarkerType) => void) => void;
  }
}

declare module "use-reducer-with-side-effects" {
  import { useReducer } from "react";

  declare function Dispatch(type: any): void;

  export type SideEffectFn = (state: R, dispatch: Dispatch) => void;

  export function UpdateWithSideEffect<R>(state: R, sideEffects: SideEffectFn | SideEffectFn[]): R;

  export function SideEffect<R>(sideEffects: SideEffectFn | SideEffectFn[]): R;

  export function Update<R>(state: R): R;

  export default useReducer;

  export function NoUpdate<R>(): R;
}

declare module "*?ssrOnly" {
  const value: any;
  export = value;
}

declare module "*?onDemand" {
  const value: any;
  export = value;
}

declare module "next-offline/runtime" {
  export const register: (swPath: string) => void;
  export const unregister: () => void;
}

declare module "@moxy/keyboard-only-outlines";

declare module "smoothscroll-polyfill";

declare module "find-my-way/lib/strategies/accept-host" {
  // eslint-disable-next-line import/no-extraneous-dependencies
  import { ConstraintStrategy } from "find-my-way";
  // eslint-disable-next-line import/no-extraneous-dependencies
  import hostStrategy from "find-my-way/lib/strategies/accept-host";

  export = hostStrategy as ConstraintStrategy;
}

declare namespace React {
  interface HTMLAttributes<T> extends DOMAttributes<T> {
    target?: string;
    on?: string;
    styleName?: string;
  }
}

interface TFunction {
  <
    TResult extends string | object | Array<string | object> | undefined | null = string,
    TKeys extends string | TemplateStringsArray = string,
    TInterpolationMap extends object = StringMap
  >(
    key: TKeys | TKeys[],
    options?: TOptions<TInterpolationMap> | string
  ): TResult;
}

declare namespace TagListTypes {
  export type LinkRel = "apple-touch-icon" | "icon" | "manifest" | "mask-icon";
  export type Link = {
    rel: LinkRel;
    type?: string;
    sizes?: string;
    color?: string;
    media?: string;
    href: string;
  };
  export type Meta = {
    name: string;
    content: string;
  };
  export type TagName = "link" | "meta";
  export type Tag = (Link | Meta) & {
    tagName: TagName;
  };
  export type TagRaw = Tag & {
    __typename: string;
  };
}
