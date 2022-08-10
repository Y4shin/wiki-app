import db from "./db";
import {type PaginationOptions, renderPaginationOptions, type OrderOptions, getOrderByArray} from "./types";

export const getTags = async (searchTerm?: string, pageOptions?: PaginationOptions, orderOptions?: OrderOptions<"id" | "name">) => {
  const page = pageOptions ? renderPaginationOptions(pageOptions) : {};
  const order = orderOptions ? getOrderByArray([orderOptions]) : {};
  const where: {
    where?: {
      name: {
        contains: string;
        mode: "insensitive";
      };
    };
  } = searchTerm ? {where: {name: {contains: searchTerm, mode: "insensitive"}}} : {};
  return await db.wikiPageTag.findMany({
    ...where,
    ...page,
    ...order,
  });
};

export const getTagsByIDs = async (
  ids: string[],
  pageOptions?: PaginationOptions,
  orderOptions?: OrderOptions<"id" | "name">,
) => {
  const page = pageOptions ? renderPaginationOptions(pageOptions) : {};
  const order = orderOptions ? getOrderByArray([orderOptions]) : {};

  return await db.wikiPageTag.findMany({
    where: {
      id: {
        in: ids,
      },
    },
    ...page,
    ...order,
  });
};

export const getTagById = async (id: string) => {
  return await db.wikiPageTag.findFirst({
    where: {
      id,
    },
  });
};

export const createNewTag = async (name: string, id: string) => {
  return await db.wikiPageTag.create({
    data: {
      name,
      id,
    },
  });
};

export const renameTag = async (id: string, name: string) => {
  return await db.wikiPageTag.update({
    where: {
      id,
    },
    data: {
      name,
    },
  });
};

export const deleteTag = async (id: string) => {
  return await db.wikiPageTag.delete({
    where: {
      id,
    },
  });
};
