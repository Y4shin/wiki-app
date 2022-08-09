import db from './db';

export const getCategories = async () => {
  const categories = await db.wikiPageCategory.findMany();
  return categories;
}

export const getCategoryById = async (id: string) => {
  const category = await db.wikiPageCategory.findFirst({
    where: {
      id
    }
  });
  return category;
}

export const createNewCategory = async (name: string, id: string, description: string) => {
  const category = await db.wikiPageCategory.create({
    data: {
      name,
      id,
      description
    }
  });
  return category;
}

export const editCategory = async (id: string, name: string | undefined, description: string | undefined) => {
  const category = await db.wikiPageCategory.update({
    where: {
      id
    },
    data: {
      name,
      description
    }
  });
  return category;
}
