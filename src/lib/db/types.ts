export type PaginationOptions = {
  pageSize: number;
  page: number;
};

export type OrderOptions<T extends string> = {
  key: T;
  order: "asc" | "desc";
};

export type FilterOptions = {
  nameSearchTerm?: string;
  idLimit?: string[];
}

export type IncludeOptions<T extends string> = {
  key: T,
  include: boolean,
}

export const renderPaginationOptions = (pageOptions: PaginationOptions) => {
  const {pageSize, page} = pageOptions;
  return {
    take: pageSize,
    skip: pageSize * page,
  };
};

const transformOrderOption = <T extends string>(orderOption: OrderOptions<T>) => {
  return {[orderOption.key]: orderOption.order};
};

export const getOrderByArray = <T extends string>(orderOptions: OrderOptions<T>[]) => {
  if (orderOptions.length === 0) {
    return undefined;
  } else {
    return {
      orderBy: orderOptions.map(transformOrderOption),
    };
  }
};

export const renderIncludeOption = <T extends string>(includeOption: IncludeOptions<T>) => {
  return {
    [includeOption.key]: includeOption.include,
  };
}

export const getIncludeArray = <T extends string>(includeOptions: IncludeOptions<T>[]) => {
  if (includeOptions.length === 0) {
    return undefined;
  } else {
    return {
      include: includeOptions.map(renderIncludeOption),
    };
  }
}