import db from "./db";
import {type PaginationOptions, renderPaginationOptions, type OrderOptions, getOrderByArray} from "./types";

export const getCategories = async (
  searchTerm?: string,
  pageOptions?: PaginationOptions,
  orderOptions?: OrderOptions<"id" | "name">,
) => {
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

  return await db.wikiPageCategory.findMany({
    ...where,
    ...page,
    ...order,
  });
};

export const getCategoriesByIDs = async (
  ids: string[],
  pageOptions?: PaginationOptions,
  orderOptions?: OrderOptions<"id" | "name">,
) => {
  const page = pageOptions ? renderPaginationOptions(pageOptions) : {};
  const order = orderOptions ? getOrderByArray([orderOptions]) : {};

  return await db.wikiPageCategory.findMany({
    where: {
      id: {
        in: ids,
      },
    },
    ...page,
    ...order,
  });
};

export const getCategoryById = async (id: string) => {
  return await db.wikiPageCategory.findFirst({
    where: {
      id,
    },
  });
};

export const createNewCategory = async (name: string, id: string, description: string) => {
  return await db.wikiPageCategory.create({
    data: {
      name,
      id,
      description,
    },
  });
};

export const editCategory = async (id: string, name: string | undefined, description: string | undefined) => {
  return await db.wikiPageCategory.update({
    where: {
      id,
    },
    data: {
      name,
      description,
    },
  });
};

export const deleteCategory = async (id: string) => {
  return await db.wikiPageCategory.delete({
    where: {
      id,
    },
  });
};
