import db from "./db";
import {PaginationOptions, renderPaginationOptions, type OrderOptions, getOrderByArray} from "./types";

export const getWikiPages = async (
  searchTerm?: string,
  pageOptions?: PaginationOptions,
  orderOptions?: OrderOptions<"name" | "categoryId">,
) => {
  const page = pageOptions ? renderPaginationOptions(pageOptions) : {};
  const order = orderOptions ? getOrderByArray([orderOptions]) : {};
  const where: {
    where?: {
      title: {
        contains: string;
        mode: "insensitive";
      };
    };
  } = searchTerm ? {where: {title: {contains: searchTerm, mode: "insensitive"}}} : {};
  return await db.wikiPage.findMany({
    ...where,
    ...page,
    ...order,
  });
};

export const getWikiPagesByTagIDs = async (
  tagIDs: string[],
  searchTerm?: string,
  pageOptions?: PaginationOptions,
  orderOptions?: OrderOptions<"name" | "categoryId">,
) => {
  const page = pageOptions ? renderPaginationOptions(pageOptions) : {};
  const order = orderOptions ? getOrderByArray([orderOptions]) : {};
  const where: {
    where: {
      title?: {
        contains: string;
        mode: "insensitive";
      };
      tags: {
        some: {
          tagId:
            | {
                in: string[];
              }
            | string;
        };
      };
    };
  } = {
    where: {
      title: searchTerm ? {contains: searchTerm, mode: "insensitive"} : undefined,
      tags: {some: {tagId: tagIDs.length === 1 ? tagIDs[0] : {in: tagIDs}}},
    },
  };
  return await db.wikiPage.findMany({
    ...where,
    ...page,
    ...order,
  });
};

export const getWikiPagesByCategoryIDs = async (
  categoryIds: string[],
  searchTerm?: string,
  pageOptions?: PaginationOptions,
  orderOptions?: OrderOptions<"name" | "categoryId">,
) => {
  const page = pageOptions ? renderPaginationOptions(pageOptions) : {};
  const order = orderOptions ? getOrderByArray([orderOptions]) : {};
  const where: {
    where: {
      title?: {
        contains: string;
        mode: "insensitive";
      };
      categoryId:
        | {
            in: string[];
          }
        | string;
    };
  } = {
    where: {
      title: searchTerm
        ? {
            contains: searchTerm,
            mode: "insensitive",
          }
        : undefined,
      categoryId:
        categoryIds.length === 1
          ? categoryIds[0]
          : {
              in: categoryIds,
            },
    },
  };
  return await db.wikiPage.findMany({
    ...where,
    ...page,
    ...order,
  });
};

export const getWikiPagesByIDs = async (
  ids: string[],
  pageOptions?: PaginationOptions,
  orderOptions?: OrderOptions<"name" | "categoryId">,
) => {
  const page = pageOptions ? renderPaginationOptions(pageOptions) : {};
  const order = orderOptions ? getOrderByArray([orderOptions]) : {};

  return await db.wikiPage.findMany({
    where: {
      id: {
        in: ids,
      },
    },
    ...page,
    ...order,
  });
};

export const getWikiPageById = async (id: string) => {
  return await db.wikiPage.findFirst({
    where: {
      id,
    },
  });
};
