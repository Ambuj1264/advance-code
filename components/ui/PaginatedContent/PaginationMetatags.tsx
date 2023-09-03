import React from "react";
import Head from "next/head";

const PaginationMetatags = ({
  currentPage,
  canonical,
  totalPages,
}: {
  currentPage: number;
  canonical: string;
  totalPages?: number;
}) => (
  <Head>
    {currentPage > 1 && (
      <link
        rel="prev"
        href={`${canonical}${currentPage === 2 ? "" : `?page=${currentPage - 1}`}`}
      />
    )}
    {currentPage < Number(totalPages) && (
      <link rel="next" href={`${canonical}?page=${currentPage + 1}`} />
    )}
  </Head>
);
export default PaginationMetatags;
