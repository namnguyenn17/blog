import { Client } from '@notionhq/client/build/src';
import slugify from 'slugify';
import { shuffleArray } from './shuffleArray';

const notion = new Client({
  auth: process.env.NOTION_SECRET
});

export const getPublishedArticles = async (databaseId: any) => {
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: 'Status',
      select: {
        equals: '✅ Published'
      }
    },
    sorts: [
      {
        property: 'Published',
        direction: 'descending'
      }
    ]
  });

  return response.results;
};

export const convertToArticleList = (tableData: any) => {
  let tags: string[] = [];
  const articles = tableData.map((article: any) => {
    return {
      title: article.properties.Name.title[0].plain_text,
      tags: article.properties.tags.multi_select.map((tag) => {
        if (!tags.includes(tag.name)) {
          const newList = [...tags, tag.name];
          tags = newList;
        }
        return { name: tag.name, id: tag.id };
      }),

      coverImage:
        article.properties?.coverImage?.files[0]?.file?.url ||
        article.properties?.coverImage?.files[0]?.external?.url ||
        'https://via.placeholder.com/600x400.png',
      publishedDate: article.properties.Published.date.start,
      summary: article.properties?.Summary.rich_text[0]?.plain_text
    };
  });

  return { articles, tags };
};

export const getBlocks = async (blockId: any) => {
  const response = await notion.blocks.children.list({
    block_id: blockId
  });

  return response.results;
};

export const getMoreArticlesToSuggest = async (
  databaseId: any,
  currentArticleTitle: any
) => {
  let moreArticles;

  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      and: [
        {
          property: 'Status',
          select: {
            equals: '✅ Published'
          }
        },
        {
          property: 'Name',
          text: {
            does_not_equal: currentArticleTitle
          }
        }
      ]
    }
  });

  moreArticles = response.results.map((article: any) => {
    return {
      title: article.properties.Name.title[0].plain_text,
      coverImage:
        article.properties?.coverImage?.files[0]?.file?.url ||
        article.properties.coverImage?.files[0]?.external?.url ||
        'https://via.placeholder.com/600x400.png',
      publishedDate: article.properties.Published.date.start,
      summary: article.properties?.Summary.rich_text[0]?.plain_text
    };
  });

  shuffleArray(moreArticles);

  return moreArticles.slice(0, 2);
};

export const getArticlePage = (data, slug) => {
  const response = data.find((result) => {
    if (result.object === 'page') {
      const resultSlug = slugify(
        result.properties.Name.title[0].plain_text
      ).toLowerCase();
      return resultSlug === slug;
    }

    return false;
  });

  return response;
};
