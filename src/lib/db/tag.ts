import db from './db';

export const getTags = async () => {
  const tags = await db.wikiPageTag.findMany();
  return tags;
}

export const getTagsBySearchTerm = async (searchTerm: string) => {
  const tags = await db.wikiPageTag.findMany({
    where: {
      name: {
        contains: searchTerm
      }
    }
  });
  return tags;
}

export const getTagById = async (id: string) => {
  const tag = await db.wikiPageTag.findFirst({
    where: {
      id
    }
  });
  return tag;
}

export const createNewTag = async (name: string, id: string) => {
  const tag = await db.wikiPageTag.create({
    data: {
      name,
      id
    }
  });
  return tag;
}