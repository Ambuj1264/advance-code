import { UrlObject } from "url";

declare type Url = UrlObject | string;

declare namespace RedirectTypes {
  type RedirectStatus = 301 | 302 | 307 | 308;

  interface ClientSideRedirect {
    to: string;
    as?: Url;
    condition?: boolean;
  }

  interface ServerSideRedirect extends ClientSideRedirect {
    status?: RedirectStatus;
  }

  interface RedirectToPageParam {
    page: number;
    loading: boolean;
    totalPages?: number;
    status?: RedirectStatus;
    goToPage?: number;
  }

  interface GetRedirectUrlQuery {
    getRedirectUrl?: {
      url?: string;
      code?: number;
    };
  }

  interface RedirectsQuery {
    redirects?: {
      to?: string;
      code?: number;
    }[];
  }
}
