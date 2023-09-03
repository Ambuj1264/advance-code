import { getImgixImageFromGraphCMS } from "utils/imageUtils";
import { GRAPH_ASSETS_URL } from "utils/constants";

export const getPrevPageInfo = (limit: number, pageId?: string) => {
  const currentPage = Number(pageId) || 0;
  if (currentPage > 1 && currentPage < limit) {
    return { hasPreviousPage: true, prevPageCursor: "1" };
  }
  const prevPageCursor = currentPage - limit;
  if (prevPageCursor < 0) {
    return { hasPreviousPage: false, prevPageCursor: "1" };
  }
  return { hasPreviousPage: true, prevPageCursor: String(prevPageCursor) };
};

export const hasNextPageCheck = (nextPage: string | null, limit: number, pageId?: string) => {
  const nextPageNumber = Number(nextPage);
  const pageIdNumber = Number(pageId);
  // max results form google api is 100 results. last page will be 91
  const lastSearchResultPage = 91;
  if (nextPageNumber > lastSearchResultPage) return false;
  if (nextPageNumber - pageIdNumber !== limit) return false;
  return true;
};

export const useCursorPaginationCheck = (
  productLength: number,
  limit: number,
  isNoParams?: boolean,
  emptyResults?: boolean,
  nextPageId?: string
) => {
  const nextPageNumber = Number(nextPageId);
  if (isNoParams) return false;
  if (emptyResults) return false;
  if (nextPageNumber === 1 && productLength < limit) return false;
  return true;
};

export const handleImgixImage = (imageSrc: string | null) => {
  if (!imageSrc?.includes(GRAPH_ASSETS_URL)) return imageSrc;
  const handle = imageSrc.slice(GRAPH_ASSETS_URL.length - 1);
  const image = { id: handle, handle };
  const imgixImage = getImgixImageFromGraphCMS(image);
  return imgixImage?.url;
};

export const shouldSkipSubheader = (emptyResults?: boolean, isNoParams?: boolean) => {
  if (emptyResults) return false;
  if (isNoParams) return false;
  return true;
};
