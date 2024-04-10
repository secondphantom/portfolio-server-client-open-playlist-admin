import { Fragment } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Props = {
  pagination: {
    currentPage: number;
    pageSize: number;
  };
  searchParams: any;
  routePath: string;
  renderNextPage?: boolean;
};
export const ListPagination: React.FC<Props> = ({
  pagination,
  searchParams,
  routePath,
  renderNextPage,
}) => {
  renderNextPage = renderNextPage === undefined ? true : renderNextPage;
  let navSize = 5;
  if (!renderNextPage) {
    navSize = pagination ? pagination.currentPage : navSize;
  }

  const currentPage = (pagination && pagination.currentPage) || 1;
  const navPage =
    currentPage <= navSize ? 0 : Math.floor(currentPage / navSize);

  const pageLinks = Array.from({ length: navSize }, (_, index) => {
    const newSearchParams = new URLSearchParams(searchParams);
    const page = index + navPage * navSize + 1;
    newSearchParams.set("page", page.toString());

    const href = `${routePath}?${newSearchParams.toString()}`;

    if (index === 0) {
      const newSearchParams = new URLSearchParams(searchParams);
      const prevPage = (navPage - 1) * navSize + 1;
      newSearchParams.set("page", prevPage < 0 ? "1" : prevPage.toString());
      const prevHref = `${routePath}?${newSearchParams.toString()}`;
      return (
        <Fragment key={index}>
          <PaginationItem>
            <PaginationPrevious href={prevHref} size={"sm"} />
          </PaginationItem>
          <PaginationItem key={index}>
            <PaginationLink
              isActive={currentPage === page}
              href={href}
              size={"sm"}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        </Fragment>
      );
    }

    if (index === navSize - 1) {
      const newSearchParams = new URLSearchParams(searchParams);
      const nextPage = (navPage + 1) * navSize + 1;
      newSearchParams.set("page", nextPage.toString());
      const nextHref = `${routePath}?${newSearchParams.toString()}`;

      return (
        <Fragment key={index}>
          <PaginationItem key={index}>
            <PaginationLink
              isActive={currentPage === page}
              href={href}
              size={"sm"}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
          {renderNextPage && (
            <PaginationItem>
              <PaginationNext size={"sm"} href={nextHref} />
            </PaginationItem>
          )}
        </Fragment>
      );
    }

    return (
      <PaginationItem key={index}>
        <PaginationLink isActive={currentPage === page} href={href} size={"sm"}>
          {page}
        </PaginationLink>
      </PaginationItem>
    );
  });

  return (
    <Pagination>
      <PaginationContent>{pageLinks}</PaginationContent>
    </Pagination>
  );
};
